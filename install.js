#!/usr/bin/env node
import path from 'node:path';
import fs from 'node:fs';
import child_process from 'node:child_process';
import fetch from 'node-fetch';
import extract from 'extract-zip';
import url from "url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const binDir = path.resolve(__dirname, 'bin');

async function installNix() {
  const justInstallShScriptUrl = 'https://just.systems/install.sh';

  const res = await fetch(justInstallShScriptUrl);

  const buffer = await res.arrayBuffer();
  fs.writeFileSync('./install.sh', new DataView(buffer));
  fs.chmodSync('./install.sh', '755');

  child_process.execFileSync('./install.sh', ['-f', '--to', './bin'], {
    stdio: 'inherit',
  });

  fs.rmSync('./install.sh');
}

async function installWindows() {
  const baseDownloadUrl = 'https://github.com/casey/just/releases/latest';
  const windowsZipName = 'just-{TAG}-x86_64-pc-windows-msvc.zip';

  // Get asset url
  // Redirects to the latest release tag.
  // e.g., https://github.com/casey/just/releases/tag/1.13.0
  const assetUrlRes = await fetch(baseDownloadUrl, { redirect: 'manual' });
  const tag = assetUrlRes.headers.get('location').split('/').pop();
  const assetName = windowsZipName.replace('{TAG}', tag);
  const assetUrl = `${baseDownloadUrl}/download/${assetName}`;

  // Create ./extract directory
  const extractPath = path.resolve(__dirname, 'extract');
  fs.rmSync(extractPath, { force: true, recursive: true });
  fs.mkdirSync(extractPath);

  // Download archive to ./extract/[assetName].zip
  const archivePath = path.resolve(extractPath, path.basename(assetUrl));
  const downloadRes = await fetch(assetUrl, { maxRedirections: 5 });
  const archiveBuffer = await downloadRes.arrayBuffer();
  fs.writeFileSync(archivePath, new DataView(archiveBuffer));

  // Unpack archive into ./extract
  await extract(archivePath, { dir: extractPath });

  // Move ./extract/just.exe to ./bin/just.exe
  fs.copyFileSync(
    path.resolve(extractPath, 'just.exe'),
    path.resolve(binDir, 'just.exe')
  );

  // Delete ./extract
  fs.rmSync(extractPath, { force: true, recursive: true });
}

async function install() {
  if (process.platform === 'win32') {
    await installWindows();
  } else {
    await installNix();
  }
}

void install();
