# Development

Use Node.js 26.

```bash
npm ci --ignore-scripts
npm run check
npm test
```

Rebuild the interface dictionaries after editing `locales.js`:

```bash
npm run i18n:build
```

## Native host checks

The optional integration scripts require a **separate** native DSH 0.2.2-rc.2
test profile under `test-results/native-host/home`, with the candidate plugin
installed. Never point them at a production profile. The host uses port 14086
and synthetic fixtures; no external model is needed.

Set `DSH_TEST_RUNTIME` to a DSH installation root. Its test patch must select
`soul-fixture/fixture` as the default model, disable automatic title generation,
load `tests/native-model-fixture.mjs`, and set native subagent depth to 3 for
the nested case. The fixture requires `DSH_TEST_REPORTDIR`, supplied by the host
runner. Prepare `workspaces/alpha`, `workspaces/beta`, and `reports` first.

```bash
node tests/native-host.mjs
# In another terminal, sequentially:
node tests/native-api.mjs
# Restart the isolated host before checking cold resume:
node tests/native-resume.mjs
node tests/native-browser.mjs
node tests/browser-editor.mjs
```

For browser checks, provide a Playwright module via `DSH_TEST_PLAYWRIGHT`
(default: `playwright`), and optionally a Chromium executable path via
`DSH_TEST_CHROME`. Reports and screenshots remain in the ignored test directory.
The browser script expects the Chinese locale initially and switches back after
the English check. Native API and browser scripts change synthetic selections,
so run them sequentially.

`browser-editor.mjs` exercises native name/category/filter/import controls,
unsaved drafts across tabs, memory revisions, conflicting saves with draft
recovery, archive export and merge import. It creates synthetic personas only
in the isolated profile. Joint native-control acceptance and local deployment
details are recorded in the sibling Capability Desk project's
`docs/NATIVE-UI-MIGRATION-ACCEPTANCE.zh-CN.md`.

See [0.4.0 acceptance](./RELEASE-0.4.0.zh-CN.md) for verified behavior and limits.

## Team preset integration

The optional host bridge checks atomic application across sessions, unchanged fields, concurrent edits, deleted personas, token reuse and rule validation. Native DSH integration verifies preset overrides, unspecified defaults, creation-time child decisions, later manual changes and optional plugin removal/reinstallation. Existing persona and memory resolution use the original store and runtime.

## Optional response enhancement

`npm test` includes isolated configuration/CAS/authentication tests and a four-preset × three-persona-mode assembly matrix. Disabled enhancement returns the original Soul assembly. The tests also cover literal templates, immutable persona/memory rows, PTC protocol/SDK preservation, native Plan/reporting sections, child exclusion, duplicate-module detection and failure isolation.

With the candidate installed in the isolated host, run `node tests/native-enhancement.mjs` after `native-api.mjs`. It verifies actual model inputs for all four presets in all three persona modes, both enabled and disabled, and independently toggles child enhancement without changing its persona policy. The sibling Capability Desk native preset and PTC Skill tests additionally execute memory, Skill and MCP calls through the real executor.

`tests/browser-enhancement.mjs` tests the native Modal, frontmost hit testing after the entrance animation, Escape/focus restoration, preview without saving, draft retention, save-without-enabling, stale-write recovery, size limits, native light/dark themes, widths 320/390/1440 and live English translation. It verifies that enhancement changes leave the original library and its persona draft unchanged. Use a Chinese starting locale. Reports and screenshots stay under ignored `test-results/native-host/reports/enhancement/`.

These fixtures verify assembly, persistence and execution contracts using a synthetic model. They do not guarantee that any external model will follow every stylistic instruction.

## Upstream prompt text

`upstream-prompt.test.mjs` compares every bundled string against the vendored upstream module `vendor/dsh-unrestricted/rules-0.2.9.js`: the 10246-character execution-mode block, the 170-character persona pointer and the Plan, PTC and structured-output notes, plus the four structural anchors. Each string also matches the recorded `sha256` in `UPSTREAM_SHA256`. The tests assert that `renderEnhancementPrompt()` returns the block byte-for-byte under default settings, that the optional extras only append after it, and that no wrapper heading is introduced for any preset.

Refreshing the text after an upstream release means replacing the vendored `src/rules.js`, regenerating `upstream-prompt.js`, and updating `UPSTREAM` and `UPSTREAM_SHA256` in the same commit. The tests fail if only part of that is done.

## Upstream framework adaptation

`enhancement-fusion.test.mjs` tests structural contracts, protected Soul rows, scope shadows and custom-agent exclusion, removal on mode changes, literal templates, fallback on errors and empty configuration, standalone-module coexistence, rosterless detection, full preview and concurrent recheck scope isolation.

In the isolated host, also run `native-enhancement-framework.mjs` and `browser-enhancement-framework.mjs` sequentially. These check blank-session Minimal/Standard/PTC switching, the actual scope-shadow path, removal when off, live/standing full previews, read-only rechecking without model calls, native Plan/PTC coordination, four-mode browser previews, and 320/390/1440 widths in both themes. Native preset and PTC Skill regression scripts still execute actual memory, Skill and MCP tools. See `docs/UPSTREAM-INTEGRATION.md` for the deliberate structural differences: the prompt text is byte-identical, while Soul injects it as its own editable section instead of appending to the native persona row.

## Advanced settings layout

Run `node tests/browser-enhancement-layout.mjs` against the same isolated host to check General / Prompt / Diagnostics, fixed window dimensions, drafts across tabs and reopening, both themes and 320/390/1440 widths. Enhancement scripts create their report folders under `test-results/native-host/reports/` automatically; set `DSH_TEST_REPORTDIR` to choose another report root. A fresh checkout does not need any local `operations/` pointer files.
