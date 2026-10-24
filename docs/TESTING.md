# Testing

Use Node.js 26 and npm:

```bash
npm ci --ignore-scripts
npm run check
npm test
```

Tests use real DSH registries, tools and native agent scopes with temporary data directories. Model calls are replaced by test stubs. They do not read a user's DSH profile, persona library, memory backups or exported archives.

Coverage includes literal prompt injection, priority and complete modes, unloading and disabling, legacy migration, session and subagent persona ownership, independent memories, persistence, concurrent mutations, stale writes, import/export, backup creation, work-artifact filtering, semantic-audit failures, and the public example preset.

`presets/ronova.json` is a newly constructed public example envelope. Tests verify that it contains exactly one persona, no memories and no session bindings, uses an example-only ID, and can be merged without replacing existing data. A clean install does not automatically enable the example.

Do not use a real user library as a test fixture. Keep private archives and local runtime data outside the repository and release artifacts.
