# Third-party notes

Soul Desk includes adapted framework code and verbatim prompt text from [dsh-unrestricted](https://github.com/yexi-by/dsh-unrestricted), by yexi-by, version 0.2.9, commit `c7afd4e03d162cf9545f47168f29a5ec225c0bd0` (MIT). The structural base was taken from release 0.2.8, commit `1383c6c16849a0f05bb8f9d927aa1bb31d772547`; `src/rules.js` is byte-identical between the two releases.

`upstream-prompt.js` re-exports the upstream prompt text without edits: the unrestricted execution-mode block, the persona pointer and the Plan, PTC and structured-output notes, plus the four structural anchors. Each string is stored with its `sha256` in `UPSTREAM_SHA256` and checked against the vendored source by `tests/upstream-prompt.test.mjs`. The untouched upstream source file is vendored at `vendor/dsh-unrestricted/rules-0.2.9.js` so the bytes remain auditable. Soul does not paraphrase, translate, re-wrap or trim this text; `renderEnhancementPrompt()` returns the block byte-for-byte under default settings.

`enhancement-fusion.js` adapts structural section fusion and preset contracts from `src/rules.js`. `enhancement-runtime.js` adapts preset resolution, scope shadow lifecycle, diagnostics and live/standing previews from `src/node.js`. Soul-specific protection, configuration and UI are maintained separately. The upstream project is not a runtime dependency and does not endorse this integration.

See [integration notes](docs/UPSTREAM-INTEGRATION.md). The required upstream license follows and is also included at `vendor/dsh-unrestricted/LICENSE`.

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
