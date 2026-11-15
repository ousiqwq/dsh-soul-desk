# Upstream framework integration

Framework base: [dsh-unrestricted](https://github.com/yexi-by/dsh-unrestricted), MIT, copyright 2026 yexi-by. Structural base release 0.2.8, commit `1383c6c16849a0f05bb8f9d927aa1bb31d772547`; prompt text taken from 0.2.9, commit `c7afd4e03d162cf9545f47168f29a5ec225c0bd0`. `src/rules.js` is byte-identical across both releases.

The structural fusion, preset resolution, Minimal scope shadow lifecycle, mode diagnostics and live/standing full previews are adapted from `src/node.js` and `src/rules.js`.

## Prompt text

The upstream prompt text is bundled verbatim in [upstream-prompt.js](../upstream-prompt.js) and never edited at runtime:

| Export | Upstream source | Length |
| --- | --- | --- |
| `EXECUTION_MODE_BLOCK` | the `unrestricted:execution-mode` section body | 10246 chars |
| `PERSONA_POINTER` | appended to `deployment:persona-prefix` | 170 chars |
| `PLAN_NOTE` | appended to `plan:policy` | 349 chars |
| `PTC_ONLY_NOTE` | appended to `tools:ptc-only` (PTC only) | 400 chars |
| `STRUCTURED_OUTPUT_NOTE` | appended to `tool:structured_output` | 138 chars |
| `ANCHORS` | identity, persona and structured-output reference texts | 4 strings |

`sha256` for every string is recorded in `UPSTREAM_SHA256` and verified against the vendored upstream module in `tests/upstream-prompt.test.mjs`. The unmodified upstream `src/rules.js` ships at `vendor/dsh-unrestricted/rules-0.2.9.js` so the bytes can be audited without the network. Under default settings `renderEnhancementPrompt()` returns `EXECUTION_MODE_BLOCK` byte-for-byte: no wrapper heading, no summary and no added boundary sentence. Optional extras (concise introductions, complete deliverables, preserved names) are off by default and, when enabled, append after the untouched block.

The block itself scopes its effect to content: it states that it changes no tool catalog, tool-call protocol, plan rule, approval prompt, sandbox limit or structured-output report. Soul keeps its own guard rails on top of that: original persona and memory sections are never rewritten, and native Plan, PTC SDK and structured-output contracts remain authoritative.

Soul-specific adaptations:

- Existing global/workspace/conversation persona and memory selection remain unchanged and take precedence. Soul identity and memory sections are never edited by fusion.
- Current DSH restores complete sections after the waterfall. A post-assembly guard reconciles those sections with Soul's existing persona replacement and preserves Plan, PTC SDK and structured-output contracts.
- Minimal uses the native current preset as its base, rather than a hardcoded copy. Scope shadows are disposed when disabled, switched away or disposed. Custom agent personas are not overwritten.
- Literal custom `{{...}}` text is preserved through a dedicated variable while shadowed and a literal section in final output.
- State remains in the existing separate `prompt-enhancement.v1.json`, with revisions, backups and advanced editing. No host files or unrelated plugin configurations are changed.
- Full preview is read-only. It uses a matching recent top-level assembly when available, otherwise an isolated preset scope. It can contain persona and personal memory. Draft previews do not save or enable the module and never call a model.

The prompt text is byte-identical to upstream; the surrounding framework is an adapted integration rather than a byte-identical copy. Whether a given model actually follows the guidance depends on that model, so no behavioral equivalence is claimed from source parity alone. Web 0.2.2-rc.2 is the local verification target; other hosts require separate verification.

One deliberate structural difference: the upstream fusion appends its notes to the native sections next to the persona, while Soul inserts a separate `private-soul:response-enhancement` section so the block can be edited, previewed and disabled independently. The injected text is identical; only the section name and its insertion position differ.

The upstream MIT notice is included at [vendor/dsh-unrestricted/LICENSE](../vendor/dsh-unrestricted/LICENSE).
