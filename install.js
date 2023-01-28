const https = require('https');
const fs = require('fs');
const child_process = require('child_process');

const url = 'https://just.systems/install.sh';

try {
  fs.unlinkSync('./bin/just');
} catch (err) {
  // ignore
}

const IS_YARN = process.env.npm_execpath.includes('yarn');

https.get(url, res => {
  res.setEncoding('utf8');
  let body = '';
  res.on('data', data => {
    body += data;
  });
  res.on('end', () => {
    fs.writeFileSync('./install.sh', body);
    fs.chmodSync('./install.sh', '755');

    child_process.execFileSync('./install.sh', ['--to', './bin'], {
      stdio: 'inherit',
    });

    if (IS_YARN) {
      // move bin/just to bin/justbin
      fs.renameSync('./bin/just', './bin/justbin');

      // copy just-yarn.js to /bin/just
      fs.copyFileSync('./just-yarn.js', './bin/just');

      // chmod +x bin/just
      fs.chmodSync('./bin/just', '755');
    }
  });
});
