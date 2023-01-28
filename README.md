# Node.js/npm Just installer

A simple Node.js installer for the excellent Just command runner (https://just.systems).

Local usage (great for team projects):

```bash
$ npm install -D just-install
```

Or globally:

```bash
$ npm install -g just-install
```

## Purpose

Using Just is an excellent option for a more robust command runner in your Node.js projects. 
However, it requires installing Just separately from the `npm install` command, using one
of the various package managers for your system of choice. 

If you want to remove the extra setup step of installing Just before developing a Node.js 
application, this utility will install a local, standalone binary as part of the `npm install` 
command.

After installation, the `just` command will work in npm scripts:

```js
// package.json:

{
  ...
  "scripts": {
    "start": "just start"
  }
}
```

Or with `npx`:

```bash
$ npx just start
```

It's great for teams who want to make the set up process for their project as easy as possible.

# Implementation notes

- The installer script from Just is included in this repo and modified slightly because as of this 
  writing, the `--tlsv1.3` flag used for curl does not seem to work on MacOS Ventura (13.1). It
  has been replaced with `--tlsv1.2`. Hopefully this will be resolved either by Just or Apple 
  (haha).

- Yarn cannot execute non-JS scripts as binaries. The workaround is to make the binary a JS file 
  that executes the Just binary (using `child_process.execFileSync()`). There is an outstanding 
  issue on yarn's Github (https://github.com/yarnpkg/berry/issues/882); hopefully there will be some 
  resolution eventually. 

# MIT License

Copyright © 2022 Alex Brombal

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and 
associated documentation files (the "Software"), to deal in the Software without restriction, 
including without limitation the rights to use, copy, modify, merge, publish, distribute, 
sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is 
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or 
substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT 
NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT 
OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.