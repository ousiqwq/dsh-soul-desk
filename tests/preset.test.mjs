import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { SoulStore, validateLibrary } from '../store.js';

const example = JSON.parse(await readFile(new URL('../presets/ronova.json', import.meta.url), 'utf8'));
const markdown = await readFile(new URL('../presets/ronova.SOUL.md', import.meta.url), 'utf8');

test('public Ronova preset contains only the requested text, an example ID and empty memory/session data', () => {
  assert.deepEqual(Object.keys(example).sort(), ['data', 'format', 'version']);
  assert.equal(example.format, 'private-soul-backup'); assert.equal(example.version, 2);
  assert.deepEqual(Object.keys(example.data).sort(), ['defaultPersonaId', 'enabled', 'mode', 'personas', 'revision', 'sessions', 'version']);
  assert.equal(example.data.personas.length, 1);
  const persona = example.data.personas[0];
  assert.deepEqual(Object.keys(persona).sort(), ['id', 'memories', 'name', 'soul']);
  assert.equal(persona.name, '若娜瓦'); assert.equal(persona.id, 'example-ronova');
  assert.equal(persona.soul, markdown); assert.ok(persona.soul.trim());
  assert.deepEqual(persona.memories, []); assert.deepEqual(example.data.sessions, {});
  assert.equal(example.data.enabled, false); assert.equal(example.data.revision, 0);
  assert.equal(validateLibrary(example.data).personas[0].id, 'example-ronova');
});

test('clean installation stays empty and disabled until the public example is explicitly imported', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'soul-example-empty-'));
  const store = await new SoulStore(join(directory, 'library.json')).init();
  try {
    assert.deepEqual(store.state.personas, []); assert.equal(store.state.enabled, false);
    await store.action('import', { archive: example, strategy: 'merge' }, store.state.revision);
    assert.equal(store.state.personas.length, 1); assert.equal(store.state.enabled, false);
    assert.deepEqual(store.state.personas[0].memories, []); assert.equal(store.resolve(), null);
  } finally { await store.close(); await rm(directory, { recursive: true, force: true }); }
});

test('merging the public example preserves an existing persona, memories, default and session binding', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'soul-example-merge-'));
  const store = await new SoulStore(join(directory, 'library.json')).init();
  try {
    const saved = await store.action('persona-save', { name: '合成测试角色', soul: '# Synthetic test persona', activate: true }, 0);
    await store.remember(saved.personaId, { kind: 'preference', content: '测试用户喜欢简洁回答。' });
    await store.action('session-select', { sessionId: 'synthetic-session', personaId: saved.personaId }, store.state.revision);
    const before = structuredClone(store.persona(saved.personaId));
    await store.action('import', { archive: example, strategy: 'merge' }, store.state.revision);
    assert.deepEqual(store.persona(saved.personaId), before);
    assert.equal(store.state.defaultPersonaId, saved.personaId);
    assert.equal(store.resolve(['synthetic-session']).id, saved.personaId);
    assert.equal(store.state.personas.length, 2);
    assert.deepEqual(store.persona('example-ronova').memories, []);
  } finally { await store.close(); await rm(directory, { recursive: true, force: true }); }
});
