#!/usr/bin/env node

/**
 * This file is a pass-through for the actual just binary. It exists because for two reasons:
 *
 * - Yarn does not allow references to anything other than .js files in the "bin" field in package.json.
 * - Windows does not allow executing binaries that don't end in .exe, and we need the package.json "bin" field to
 *   point to the same file on all platforms.
 */

import child_process from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import url from "url";

const ext = process.platform === 'win32' ? '.exe' : '';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

child_process.execFileSync(
  path.resolve(__dirname, 'just' + ext),
  process.argv.slice(2),
  { stdio: 'inherit' }
);
