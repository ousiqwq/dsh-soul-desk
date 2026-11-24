# Upstream framework and prompt migration

This document records the historical integration shipped in Soul Desk 0.5.1. See [Response enhancement](RESPONSE-ENHANCEMENT.zh-CN.md) for the current implementation.

Upstream: [dsh-unrestricted](https://github.com/yexi-by/dsh-unrestricted), MIT, copyright 2026 yexi-by. The bundled prompt text is taken from 0.2.15 (commit `c79ce9c11d49925182fa9654d76d7055d6f5b3ac`). The previously bundled 0.2.9 text (commit `c7afd4e03d162cf9545f47168f29a5ec225c0bd0`) is still vendored, because version 1 enhancement files recorded that body and the upgrade test needs its exact bytes.

## Prompt text

The text lives in `upstream-prompt.js`, stored byte-for-byte and never rewritten at runtime:

| Export | Upstream source | Length |
| --- | --- | --- |
| `EXECUTION_MODE_BLOCK` | the `unrestricted:execution-mode` section body | 9712 chars |
| `PERSONA_POINTER` | appended to the persona row | 170 chars |
| `PLAN_NOTE` | appended to `plan:policy` | 349 chars |
| `PTC_ONLY_NOTE` | appended to `tools:ptc-only` (PTC only) | 400 chars |
| `STRUCTURED_OUTPUT_NOTE` | appended to `tool:structured_output` | 138 chars |
| `ANCHORS` | identity, persona and structured-output reference texts | 4 strings |

Per-string `sha256` values are recorded in `UPSTREAM_SHA256`. The unmodified upstream `src/rules.js` ships at `vendor/dsh-unrestricted/rules-0.2.15.js`, so the bytes are auditable offline; the superseded 0.2.9 source sits next to it at `vendor/dsh-unrestricted/rules-0.2.9.js`. `DEFAULT_ENHANCEMENT_SETTINGS.prompt` is this block, so a fresh install and the Reset control both start from it, and `renderEnhancementPrompt()` returns it unchanged: no wrapper heading, summary or added boundary sentence. The optional extras (concise introductions, complete deliverables, preserved names, subagent guidance) are off by default; enabling one appends after the block without altering it.

The block scopes its effect to content and states that it changes no tool catalog, tool-call protocol, plan rule, approval prompt, sandbox limit or structured-output report. Those mechanics stay under host control.

## Structural differences from upstream

Upstream appends its text to the sections next to the persona. Soul needs independent editing, previewing and disabling, so there are two deliberate differences:

1. **Separate section.** The text sits in its own `private-soul:response-enhancement` section. The injected text is identical; the section name and position differ.
2. **Pointer anchoring.** Upstream appends the pointer to `deployment:persona-prefix`. Soul's priority and complete modes replace that row, so the pointer is anchored on whichever row currently carries the persona. Anchoring runs on every assembly pass and is idempotent, because a mode change drops the previous anchor while the block itself stays. The persona's own text is always an exact prefix; only the upstream pointer is appended, and memory rows are never touched.

## Soul-side adaptation

- Global, workspace and conversation persona rules and memory selection are unchanged. Persona and memory sections keep their original text and are never rewritten by the enhancement section. The block states that no external persona may re-narrow the scale it defines, so the two coexist rather than one overriding the other.
- The current DSH restores complete sections after the waterfall. A post-assembly guard reconciles those sections with Soul's existing persona replacement and preserves Plan, PTC SDK and structured-output contracts.
- Minimal uses the host's current preset as its base rather than a hardcoded copy. Scope shadows are disposed when disabled, switched away or disposed. Custom agent personas are not overwritten.
- Literal `{{...}}` text survives shadowing through a dedicated variable and returns to a literal section in the final output.
- State lives in the separate `prompt-enhancement.v1.json`, with revisions, backups and advanced editing. No host files or unrelated plugin configuration are changed.
- Full preview is read-only. It uses a matching recent top-level assembly when available, otherwise an isolated preset scope. It can contain persona and personal memory; draft previews do not save, enable or call a model.
- A separately installed `dsh-unrestricted` section causes injection to be skipped, avoiding duplicates. Detection is by section name only: this module carries the upstream block itself, so sniffing the text would flag its own injection as external.

## Scope

The prompt text is byte-identical to upstream; the surrounding framework is an adaptation rather than a byte-identical copy. Source parity is not by itself evidence of behavioral equivalence: how closely a response follows the text depends on the model in use. Verified on DSH Web `0.2.2-rc.2`; other hosts require separate verification.

The upstream MIT notice is included at [vendor/dsh-unrestricted/LICENSE](../vendor/dsh-unrestricted/LICENSE).
