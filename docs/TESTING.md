# Development checks

Use Node.js 26:

```bash
npm ci --ignore-scripts
npm run check
npm test
```

The checks cover prompt modes, session and subagent persona selection, memory ownership, persistence, revision conflicts, import/export, consolidation, and preset loading. CI runs against all three supported Harness versions.


## Harness 0.2.2-rc.2

Compatibility checks cover the independent native tool executor, prompt assembly and teardown. Existing Harness releases remain in the CI matrix. Browser checks cover native settings and per-session persona selection.

## Append mode

20 tests cover literal persona and memory text appended after the original prompt, scoped complete presets, live mode changes, native configuration validation, restart persistence and archive round-trips. Priority and replacement retain their existing behavior. Browser checks verify short labels, hover explanations, keyboard selection, responsive menus and removal of the duplicate inline explanation.
