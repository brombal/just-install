# Node.js/npm Just installer

A simple Node.js installer for the excellent Just command runner (https://just.systems). This allows
you to install Just as part of the `npm install` command, so you don't have to worry about setting
it up separately. Great for development teams!

Local usage (great for team projects):

```bash
$ npm install -D just-install
# or
$ yarn add -D just-install
```

Or globally:

```bash
$ npm install -g just-install
# or
$ yarn global add just-install
```

> Now with Windows support!

## Purpose

Using Just is an excellent option for a more robust command runner in your Node.js projects.
However, it requires installing Just on your system as a separate installation step, using one
of the various package managers for your system of choice.

If you want to remove the extra setup step of installing Just when developing a Node.js
application, this utility will install a local, standalone binary as part of the `npm install`
command.

After installation, the `just` command will work in npm scripts:

```json
// package.json:

{
  // ...
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

This utility executes Just by spawning a child process from Node.js and passing through all stdio
from the Just executable. This is necessary due to technical reasons for Windows and Yarn users, 
so to avoid an overly-complex installation process, it works this way for Mac and Linus users too. 
I don't expect this to cause any issues, but it might be worth noting.

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
