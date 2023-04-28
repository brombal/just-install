#!/usr/bin/env node

const os = require('node:os');
const path = require('node:path');
const fs = require('node:fs/promises');
const {existsSync} = require('node:fs');
const extract = require('extract-zip');
const tar = require('tar');
const {fetch} = require('undici');

// eslint-disable-next-line no-unused-vars
const IS_YARN =
  process.env.npm_execpath !== undefined &&
  process.env.npm_execpath.includes('yarn');
const baseDownloadUrl = 'https://github.com/casey/just/releases/latest';

const arch = `${os.machine()}-${os.platform()}`;
const binDir = path.resolve(__dirname, 'bin');

const availableBinaries = {
  'x86_64-win32': 'just-{TAG}-x86_64-pc-windows-msvc.zip',
  'aarch64-darwin': 'just-{TAG}-aarch64-apple-darwin.tar.gz',
  'aarch64-linux': 'just-{TAG}-aarch64-unknown-linux-musl.tar.gz',
  'x86_64-darwin': 'just-{TAG}-x86_64-apple-darwin.tar.gz',
  'x86_64-linux': 'just-{TAG}-x86_64-unknown-linux-musl.tar.gz',
};

async function install() {
  await clean();
  if (!(arch in availableBinaries)) throwUnsupportedError();
  const assetUrl = await getAssetUrl();
  await download(assetUrl);
  await unpackArchive(path.resolve(__dirname, path.basename(assetUrl)));
}

void install();

async function unpackArchive(archive) {
  if (path.extname(archive) === '.zip') {
    await unpackZip(archive);
  } else {
    await unpackTar(archive);
  }
  // Temporarily left just in case author wishes to
  // to provide two separate bin entries for windows and
  // non-windows. see ./index.js for more details
  // if (IS_YARN) {
  //   await supportYarn();
  // }
  await fs.rm(archive);
}

async function unpackTar(tarball) {
  await tar.extract({
    cwd: binDir,
    file: tarball,
  });
  await fs.chmod(path.join(binDir, 'just'), '755');
}

async function unpackZip(zip) {
  await extract(zip, {dir: binDir});
}

async function download(assetUrl) {
  const filename = path.resolve(__dirname, path.basename(assetUrl));
  const res = await fetch(assetUrl);
  await fs.writeFile(filename, res.body);
}

async function getAssetUrl() {
  const tag = await getTag();
  const assetName = availableBinaries[arch].replace('{TAG}', tag);
  return `${baseDownloadUrl}/download/${assetName}`;
}

async function getTag() {
  // redirects to the latest release tag.
  // e.g., https://github.com/casey/just/releases/tag/1.13.0
  const res = await fetch(baseDownloadUrl, {
    redirect: 'manual',
  });

  return res.headers.get('location').split('/').pop();
}

// Temporarily left just in case author wishes to
// to provide two separate bin entries for windows and
// non-windows. see ./index.js for more details
// eslint-disable-next-line no-unused-vars
async function supportYarn() {
  // move bin/just to bin/justbin
  let execPath = path.resolve(__dirname, './just');
  if (!existsSync(execPath)) {
    execPath = path.resolve(__dirname, './just.exe');
  }
  const ext = path.extname(execPath);
  await fs.rename(execPath, `./bin/justbin${ext}`);

  // copy just-yarn.js to /bin/just
  await fs.copyFile(
    path.resolve(__dirname, './just-yarn.js'),
    path.join(binDir, 'just')
  );

  // chmod +x bin/just
  await fs.chmod('./bin/just', '755');
}

async function clean() {
  const files = await fs.readdir(binDir);
  for (const file of files) {
    await fs.unlink(path.join(binDir, file));
  }
}

function throwUnsupportedError() {
  let msg = `Unable to download and instal for ${arch}.\n`;
  msg += 'Visit https://github.com/casey/just for other installation options.';
  throw new Error(msg);
}
