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

`npm test` runs the full suite, including:

- persona resolution across global / workspace / conversation scopes, migration, child ownership and concurrency conflicts;
- the four-preset × three-persona-mode assembly matrix, disabled-state equality, literal `{{...}}` handling and failure isolation;
- byte-for-byte comparison of the bundled upstream prompt against the vendored `vendor/dsh-unrestricted/rules-0.2.15.js`, plus per-string `sha256` checks;
- persona-pointer anchoring: with a Soul persona active the native persona row is replaced, so the pointer must follow the row that carries the persona, appear exactly once, and stay put across repeated assembly;
- configuration storage, CAS revisions, backups, malformed-file fallback and API origin checks.

## Native host checks

The optional integration scripts need a **separate** native DSH `0.2.2-rc.2` test profile with the candidate plugin installed. Never point them at a production profile. They use a synthetic model fixture; no external model is needed.

Set `DSH_TEST_RUNTIME` to a DSH installation root. Its test patch must select `soul-fixture/fixture` as the default model, disable automatic title generation, load `tests/native-model-fixture.mjs`, and set native subagent depth to 3 for the nested case. The fixture requires `DSH_TEST_REPORTDIR`. Prepare `workspaces/alpha`, `workspaces/beta` and `reports` first.

```bash
node tests/native-host.mjs
# In another terminal, sequentially:
node tests/native-api.mjs
# Restart the isolated host before checking cold resume:
node tests/native-resume.mjs
node tests/native-browser.mjs
node tests/browser-editor.mjs
```

For browser checks, provide a Playwright module via `DSH_TEST_PLAYWRIGHT` (default: `playwright`), and optionally a Chromium executable path via `DSH_TEST_CHROME`. Reports and screenshots stay in the ignored test directory. The browser scripts expect the Chinese locale initially and switch back after the English check. Native API and browser scripts change synthetic selections, so run them sequentially.

`browser-editor.mjs` exercises native name/category/filter/import controls, unsaved drafts across tabs, memory revisions, conflicting saves with draft recovery, archive export and merge import. It creates synthetic personas only in the isolated profile.

## Enhancement checks

`native-enhancement.mjs` covers actual model inputs for all four presets in all three persona modes, both enabled and disabled, and toggles child enhancement without changing its persona policy.

`browser-enhancement.mjs` covers the native Modal, frontmost hit testing after the entrance animation, Escape/focus restoration, preview without saving, draft retention, save-without-enabling, stale-write recovery, size limits, native light/dark themes, widths 320/390/1440 and live English translation. It verifies that enhancement changes leave the original library and its persona draft unchanged. Use a Chinese starting locale.

`native-enhancement-framework.mjs` and `browser-enhancement-framework.mjs` run sequentially to cover blank-session Minimal/Standard/PTC switching, the scope-shadow path, removal when off, live/standing full previews, read-only rechecking without model calls, native Plan/PTC coordination, four-mode browser previews and 320/390/1440 widths in both themes.

`browser-enhancement-layout.mjs` checks General / Prompt / Diagnostics, fixed window dimensions, drafts across tabs and reopening, both themes and 320/390/1440 widths. Enhancement scripts create report folders under `test-results/` automatically; set `DSH_TEST_REPORTDIR` to choose another root.

These fixtures verify assembly, persistence and execution contracts. They do not guarantee that any external model will follow every stylistic instruction.

## Refreshing the upstream text

Replacing the vendored `src/rules.js`, regenerating `upstream-prompt.js`, and updating `UPSTREAM` and `UPSTREAM_SHA256` must land in the same commit. The tests fail if only part of that is done. `upstream-prompt.js` is generated: `node scripts/generate-upstream-prompt.mjs .` rewrites it from the vendored source, and the generator is kept so the bytes are reproducible rather than hand-edited. See [upstream migration](UPSTREAM-INTEGRATION.md) for the deliberate structural differences.
