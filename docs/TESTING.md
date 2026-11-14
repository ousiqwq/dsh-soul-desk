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
