# Development checks

Use Node.js 26:

```bash
npm ci --ignore-scripts
npm run check
npm test
```

The checks cover prompt modes, session and subagent persona selection, memory ownership, persistence, revision conflicts, import/export, consolidation, and preset loading. CI runs against both supported Harness versions.


## Harness 0.2.2-rc.2

Compatibility checks cover the independent native tool executor, policy-filtered tool descriptions, complete management catalogs, and teardown. Existing Harness releases remain in the CI matrix. Browser checks cover native settings, per-session persona selection and file downloads.
