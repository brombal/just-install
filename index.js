#!/usr/bin/env node

/**
 * This file exist because just may exist as either a *nix binary (just) or
 * a windows binary (just.exe). This file is the main bin entrypoint and acts as
 * a proxy to the whichever bin truly exist.
 *
 * It should be possible to dynamically change the package.json bin field to pont to either
 * ./bin/just or ./bin/just.exe using a preinstall hook but this behavior was changed in
 * npm >= 7.x to run after the installation instead of before so it no longer works for this
 * use case. View this issue for more details: https://github.com/npm/cli/issues/2660
 *
 * Since the package.json bin field cannot be changed dynamically during installation, an
 * alternative approach would be to set two bin fields, i,e,
 * {
 *  "just": "./bin/just",
 *  "just-win": "./bin/just.exe"
 * }
 */

const child_process = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');

let execPath = path.resolve(__dirname, './bin/just');
if (!fs.existsSync(execPath)) {
  execPath = path.resolve(__dirname, './bin/just.exe');
}

child_process.execFileSync(execPath, process.argv.slice(2), {stdio: 'inherit'});
