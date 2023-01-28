#!/usr/bin/env node

/**
 * This file exists because yarn does not allow executing non-js binaries. When installing via yarn, this script is
 * moved to bin/just, and the actual just binary is moved to bin/justbin. Then, yarn executes this file which
 * in turn executes the actual binary. This is a workaround for the issue described below.
 *
 * https://github.com/yarnpkg/berry/issues/882
 */

const child_process = require('node:child_process');
const path = require('path');

child_process.execFileSync(
  path.resolve(__dirname, './justbin'),
  process.argv.slice(2),
  { stdio: 'inherit' }
);
