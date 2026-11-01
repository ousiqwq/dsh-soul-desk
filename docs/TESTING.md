# Development checks

Use Node.js 26:

```bash
npm ci --ignore-scripts
npm run check
npm test
```

The checks cover prompt modes, session and subagent persona selection, memory ownership, persistence, revision conflicts, import/export, consolidation, and preset loading. CI runs against both supported Harness versions.
