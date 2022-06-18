const https = require("https");
const fs = require("fs");
const child_process = require('child_process');

const url = "https://just.systems/install.sh";

try {
  fs.unlinkSync('./bin/just');
} catch (err) {
}

https.get(url, res => {
  res.setEncoding("utf8");
  let body = "";
  res.on("data", data => {
    body += data;
  });
  res.on("end", () => {
    fs.writeFileSync('./install.sh', body);
    fs.chmodSync('./install.sh', '755');

    child_process.execFile('./install.sh', ['--to', './bin'],
      (error, stdout, stderr) => {
        console.log(stdout);
        console.error(stderr);
        if (error !== null) {
          console.log(`exec error: ${error}`);
        }
      });
  });
});