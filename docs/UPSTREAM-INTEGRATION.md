# Upstream framework integration

Framework base: [dsh-unrestricted 0.2.8](https://github.com/yexi-by/dsh-unrestricted/tree/1383c6c16849a0f05bb8f9d927aa1bb31d772547), MIT, copyright 2026 yexi-by.

The structural fusion, preset resolution, Minimal scope shadow lifecycle, mode diagnostics and live/standing full previews are adapted from `src/node.js` and `src/rules.js`. Original persona text and native operating contracts are retained. The upstream unrestricted prompt block is not included; configurable delivery guidance remains subject to original persona, memory, authorization and model constraints.

Soul-specific adaptations:

- Existing global/workspace/conversation persona and memory selection remain unchanged and take precedence. Soul identity and memory sections are never edited by fusion.
- Current DSH restores complete sections after the waterfall. A post-assembly guard reconciles those sections with Soul's existing persona replacement and preserves Plan, PTC SDK and structured-output contracts.
- Minimal uses the native current preset as its base, rather than a hardcoded copy. Scope shadows are disposed when disabled, switched away or disposed. Custom agent personas are not overwritten.
- Literal custom `{{...}}` text is preserved through a dedicated variable while shadowed and a literal section in final output.
- State remains in the existing separate `prompt-enhancement.v1.json`, with revisions, backups and advanced editing. No host files or unrelated plugin configurations are changed.
- Full preview is read-only. It uses a matching recent top-level assembly when available, otherwise an isolated preset scope. It can contain persona and personal memory. Draft previews do not save or enable the module and never call a model.

This is an adapted integration, not byte-identical behavior or a claim that the upstream model-restriction bypass behavior is reproduced. Web 0.2.2-rc.2 is the local verification target; other hosts require separate verification.

The upstream MIT notice is included at [vendor/dsh-unrestricted/LICENSE](../vendor/dsh-unrestricted/LICENSE).
