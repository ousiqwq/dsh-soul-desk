import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir, stat, writeFile, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { Readable } from 'node:stream';
import { EventEmitter } from 'node:events';
import { EnhancementStore } from '../enhancement-store.js';
import { DEFAULT_ENHANCEMENT_SETTINGS as settings, ENHANCEMENT_SECTION, applyEnhancement, renderEnhancementPrompt } from '../prompt-enhancement.js';
import { EXECUTION_MODE_BLOCK } from '../upstream-prompt.js';
import { applyPersona, attachPersonaPolicy } from '../prompt-policy.js';
import { registerSoulApi } from '../http-api.js';

async function fixture(fn) {
  const directory = await mkdtemp(join(tmpdir(), 'soul-enhancement-'));
  try { await fn(directory, join(directory, 'prompt-enhancement.v1.json')); }
  finally { await rm(directory, { recursive: true, force: true }); }
}
const config = { enabled: true, settings };

test('four preset protocols and three persona modes preserve literal identity, memories, schemas and runtime context', () => {
  for (const preset of ['standard', 'ptc', 'minimal', 'cordis']) for (const mode of ['priority', 'complete', 'append']) {
    const native = { sections: [
      { name: 'harness:identity', text: preset },
      { name: 'tools:executor', text: preset === 'ptc' ? 'Only run_code; nested tools use the generated SDK.' : 'Native tool executor contract' },
      { name: 'tools:sdk', text: 'tools.skill, tools.soul_memory_read, tools.mcp__test' },
      { name: 'plan:policy', text: 'Plan mode: no mutations without transition.' },
      { name: 'tool:structured_output', text: 'Required native final-report schema.' },
    ], tools: [{ name: 'run_code' }, { name: 'structured_output' }], contexts: [{ text: 'workspace facts' }], variables: { secret: 'must-not-interpolate' } };
    const soul = applyPersona(native, { enabled: true, mode, personaId: 'a', name: '测试', text: 'SOUL {{secret}}', memories: [{ id: 'm', kind: 'preference', content: '乌龙茶 {{secret}}', updatedAt: '2026-11-15' }] });
    const original = structuredClone(soul);
    assert.equal(applyEnhancement(soul, { enabled: false }), soul);
    const enhanced = applyEnhancement(soul, config, { nativeSections: native.sections });
    assert.deepEqual(soul, original);
    assert.equal(enhanced.sections[0].name, ENHANCEMENT_SECTION);
    assert.equal(enhanced.sections[0].interpolate, false);
    for (const row of soul.sections) assert.ok(enhanced.sections.includes(row));
    for (const name of ['tools:executor', 'tools:sdk', 'plan:policy', 'tool:structured_output']) assert.ok(enhanced.sections.some(row => row.name === name), preset + '/' + mode + '/' + name);
    // Default settings inject the vendored upstream block byte-for-byte.
    assert.equal(enhanced.sections[0].text, EXECUTION_MODE_BLOCK);
    assert.equal(enhanced.tools, native.tools); assert.equal(enhanced.contexts, native.contexts); assert.equal(enhanced.variables, native.variables);
    assert.equal(applyEnhancement(enhanced, config, { nativeSections: native.sections }), enhanced);
  }
});

test('disabled, empty, child-excluded and standalone-module paths do not inject or change persona decisions', () => {
  const native = { sections: [], tools: [] };
  for (const options of [{ isSubagent: true }, { externalActive: true }]) {
    const disabledChild = { enabled: true, settings: { ...settings, includeSubagents: false } };
    assert.equal(applyEnhancement(native, disabledChild, options), native);
  }
  assert.equal(applyEnhancement(native, { enabled: true, settings: { ...settings, directAnswer: false, completeArtifacts: false, preserveNames: false, prompt: '' } }), native);
  const upstream = { sections: [{ name: 'unrestricted:execution-mode', text: 'standalone' }] };
  assert.equal(applyEnhancement(upstream, config), upstream);
  assert.ok(applyEnhancement(native, config, { isSubagent: true }).sections.length === 1);
});

test('live wrapper isolates enhancement failures and unloads without touching original assembly', async () => {
  const native = { sections: [{ name: 'tools:sdk', text: 'native protocol' }], tools: [], contexts: [] };
  const system = { assemble: async () => native };
  const original = system.assemble;
  let active = false, broken = false;
  const undo = attachPersonaPolicy(system, () => ({ enabled: true, mode: 'append', text: 'ORIGINAL SOUL' }), () => {
    if (broken) throw Error('configuration unavailable');
    return { config: { enabled: active, settings } };
  });
  const baseline = await system.assemble(); active = true;
  assert.equal((await system.assemble()).sections[0].name, ENHANCEMENT_SECTION);
  active = false; assert.deepEqual(await system.assemble(), baseline);
  broken = true; assert.deepEqual(await system.assemble(), baseline);
  undo(); assert.equal(system.assemble, original); assert.equal(await system.assemble(), native);
});

test('fresh install and read leave files untouched, and enhancement edits never change library.json', () => fixture(async (directory, file) => {
  const library = '{"personas":["private"],"sessions":{"kept":true}}\n';
  await writeFile(join(directory, 'library.json'), library);
  const store = await new EnhancementStore(file).init();
  assert.equal(store.view().enabled, false); assert.equal(store.view().revision, 0);
  assert.deepEqual(await readdir(directory), ['library.json']);
  await store.action('save', { settings: { prompt: 'literal {{value}}' } }, 0);
  assert.equal(store.view().enabled, false); assert.equal(store.view().settings.prompt, 'literal {{value}}');
  await store.action('toggle', { enabled: true }, 1);
  await store.action('save', { settings: { directAnswer: false } }, 2);
  assert.equal(store.view().enabled, true);
  assert.equal(await readFile(join(directory, 'library.json'), 'utf8'), library);
  assert.equal((await stat(file)).mode & 0o777, 0o600);
  const restored = await new EnhancementStore(file).init();
  assert.deepEqual(restored.config(), store.config());
  for (const name of await readdir(join(directory, 'enhancement-backups'))) assert.equal((await stat(join(directory, 'enhancement-backups', name))).mode & 0o777, 0o600);
}));

test('CAS serializes concurrent writes, stale pages retain data, no-op has no write, backups are bounded', () => fixture(async (directory, file) => {
  let emitted = 0; const store = await new EnhancementStore(file, () => emitted++).init();
  const results = await Promise.allSettled([store.action('toggle', { enabled: true }, 0), store.action('save', { settings: { prompt: 'stale' } }, 0)]);
  assert.equal(results[0].status, 'fulfilled'); assert.equal(results[1].reason.status, 409);
  assert.equal(store.view().settings.prompt, settings.prompt); assert.equal(emitted, 1);
  await store.action('toggle', { enabled: true }, 1); assert.equal(store.view().revision, 1); assert.equal(emitted, 1);
  for (let i = 0; i < 13; i++) await store.action('save', { settings: { prompt: 'revision ' + i } }, store.view().revision);
  assert.equal((await readdir(join(directory, 'enhancement-backups'))).length, 10);
  await store.close(); await assert.rejects(store.action('toggle', { enabled: false }, store.view().revision), { status: 503 });
}));

test('invalid settings, unknown keys and missing revisions reject without writes', () => fixture(async (directory, file) => {
  const store = await new EnhancementStore(file).init();
  for (const [action, data, rev] of [
    ['toggle', { enabled: true }, undefined], ['toggle', { enabled: 'true' }, 0], ['toggle', { enabled: true, settings: {} }, 0],
    ['save', { settings: { unknown: true } }, 0], ['save', { settings: { prompt: 'a'.repeat(16001) } }, 0],
    ['save', { settings: { includeSubagents: 'false' } }, 0], ['other', {}, 0],
  ]) await assert.rejects(store.action(action, data, rev));
  assert.deepEqual(await readdir(directory), []);
  assert.throws(() => renderEnhancementPrompt({ prompt: null }));
}));

test('malformed or future configuration fails closed without overwriting any bytes', () => fixture(async (directory, file) => {
  for (const text of ['broken {', JSON.stringify({ version: 99, revision: 4, enabled: true, settings })]) {
    await writeFile(file, text);
    const store = await new EnhancementStore(file).init();
    assert.equal(store.view().available, false); assert.equal(store.view().enabled, false);
    await assert.rejects(store.action('toggle', { enabled: true }, 0), { status: 503 });
    assert.equal(await readFile(file, 'utf8'), text);
  }
}));

test('authenticated API checks origins, content type, revisions and preview without a model or persistence', () => fixture(async (directory, file) => {
  const store = await new EnhancementStore(file).init(); let handler;
  const ctx = { connection: { requestRejection: request => request.headers.origin === 'http://trusted' ? undefined : 403 }, effect: fn => fn(), webServer: { register: route => { handler = route.handler; return () => {}; } } };
  registerSoulApi(ctx, null, null, store);
  async function call(method, data, headers = {}) {
    const request = Readable.from(data === undefined ? [] : [Buffer.from(JSON.stringify(data))]);
    Object.assign(request, { url: '/private-soul/v2/enhancement', method, headers: { origin: 'http://trusted', 'content-type': 'application/json', ...headers } });
    const response = new EventEmitter(); response.writableEnded = false;
    response.writeHead = status => response.status = status;
    response.end = body => { response.body = JSON.parse(body); response.writableEnded = true; };
    await handler(request, response); return response;
  }
  assert.equal((await call('GET', undefined, { origin: 'http://untrusted' })).status, 403);
  assert.equal((await call('GET')).body.enabled, false);
  const preview = await call('POST', { action: 'preview', data: { settings: { prompt: 'literal {{value}}' } } });
  assert.equal(preview.status, 200); assert.match(preview.body.preview, /literal \{\{value\}\}/);
  assert.equal((await call('POST', { action: 'toggle', data: { enabled: true } })).status, 400);
  assert.equal((await call('POST', {}, { 'content-type': 'text/plain' })).status, 415);
  assert.deepEqual(await readdir(directory), []);
  assert.equal((await call('POST', { action: 'toggle', data: { enabled: true }, expectedRevision: 0 })).status, 200);
  assert.equal((await call('POST', { action: 'save', data: { settings: { prompt: 'stale' } }, expectedRevision: 0 })).status, 409);
}));
