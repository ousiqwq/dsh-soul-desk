# Third-party notes

Soul Desk bundles the prompt text of [dsh-unrestricted](https://github.com/yexi-by/dsh-unrestricted) by yexi-by, version 0.2.15, commit `c79ce9c11d49925182fa9654d76d7055d6f5b3ac` (MIT). `upstream-prompt.js` re-exports it without edits: the unrestricted execution-mode block, the persona pointer, the Plan, PTC and structured-output notes, plus the four structural anchors. Each string is stored with its `sha256` in `UPSTREAM_SHA256` and compared against the vendored `vendor/dsh-unrestricted/rules-0.2.15.js`, so the bytes stay auditable offline. That body is the default content of the enhancement editor. The superseded 0.2.9 text is vendored as well, because version 1 enhancement files recorded it byte-for-byte and the upgrade path recognises it there.

The upstream project is not a runtime dependency and does not endorse this integration. The required upstream license follows and is also included at `vendor/dsh-unrestricted/LICENSE`.

MIT License

Copyright (c) 2026 yexi-by

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
