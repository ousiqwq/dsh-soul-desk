import { readFile, mkdir, open, rename, unlink, writeFile, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { SoulError } from './memory-policy.js';
import { DEFAULT_ENHANCEMENT_SETTINGS, validateEnhancementSettings, renderEnhancementPrompt } from './prompt-enhancement.js';

const MAX_BYTES = 100000;
const defaults = () => ({ version: 1, revision: 0, enabled: false, settings: { ...DEFAULT_ENHANCEMENT_SETTINGS } });

export function validateEnhancementState(value) {
  if (!value || value.version !== 1 || !Number.isSafeInteger(value.revision) || value.revision < 0 || typeof value.enabled !== 'boolean') throw new SoulError('提示词增强配置格式或版本不受支持。');
  return { version: 1, revision: value.revision, enabled: value.enabled, settings: validateEnhancementSettings(value.settings) };
}

/** Deliberately separate from library.json, its imports and memory tools. */
export class EnhancementStore {
  constructor(file, onChange = () => {}) { this.file = file; this.onChange = onChange; this.state = defaults(); this.queue = Promise.resolve(); this.error = ''; this.closed = false; this.status = 'pending'; }
  async init() {
    try {
      const bytes = await readFile(this.file);
      if (bytes.length > MAX_BYTES) throw new Error('oversized');
      this.state = validateEnhancementState(JSON.parse(bytes.toString('utf8')));
    } catch (error) {
      if (error.code !== 'ENOENT') { this.state = defaults(); this.error = '提示词增强配置无法读取，已保持关闭。原有人设与记忆不受影响。'; }
    }
    // Merely installing or reading the plugin does not write or migrate data.
    return this;
  }
  config() { return structuredClone(this.state); }
  report(status) { this.status = status; }
  view() {
    return { ...this.config(), defaults: { ...DEFAULT_ENHANCEMENT_SETTINGS }, maxPromptLength: 16000, protection: { persona: true, memories: true, protocols: true }, available: !this.error, error: this.error, status: this.state.enabled ? this.status : 'off', preview: renderEnhancementPrompt(this.state.settings) };
  }
  async persist(value) {
    await mkdir(dirname(this.file), { recursive: true, mode: 0o700 });
    const temporary = this.file + '.' + randomUUID() + '.tmp';
    try {
      const handle = await open(temporary, 'wx', 0o600);
      try { await handle.writeFile(JSON.stringify(value, null, 2) + '\n'); await handle.sync(); } finally { await handle.close(); }
      await rename(temporary, this.file);
    } finally { await unlink(temporary).catch(error => { if (error.code !== 'ENOENT') throw error; }); }
  }
  async backup() {
    const directory = join(dirname(this.file), 'enhancement-backups');
    await mkdir(directory, { recursive: true, mode: 0o700 });
    await writeFile(join(directory, Date.now() + '-' + randomUUID() + '.json'), JSON.stringify(this.state, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
    const files = (await readdir(directory)).filter(name => name.endsWith('.json')).sort();
    for (const file of files.slice(0, Math.max(0, files.length - 10))) await unlink(join(directory, file));
  }
  action(action, data, revision) {
    const operation = this.queue.then(async () => {
      if (this.closed || this.error) throw new SoulError(this.error || '提示词增强服务正在退出。', 'unavailable', 503);
      if (!Number.isSafeInteger(revision) || revision < 0) throw new SoulError('写入需要有效的修订号。', 'revision-required');
      if (revision !== this.state.revision) throw new SoulError('增强设置已被其他页面更新，草稿仍保留。请重新读取后合并。', 'conflict', 409);
      if (!data || typeof data !== 'object' || Array.isArray(data)) throw new SoulError('提示词增强设置格式无效。');
      const next = this.config();
      if (action === 'toggle') {
        if (typeof data.enabled !== 'boolean' || Object.keys(data).some(key => key !== 'enabled')) throw new SoulError('提示词增强选项必须为开关值。');
        next.enabled = data.enabled;
      } else if (action === 'save') {
        if (!data.settings || typeof data.settings !== 'object' || Array.isArray(data.settings) || Object.keys(data).some(key => key !== 'settings')) throw new SoulError('提示词增强设置格式无效。');
        next.settings = validateEnhancementSettings({ ...next.settings, ...data.settings });
      } else throw new SoulError('提示词增强操作不存在。', 'unknown-action');
      const validated = validateEnhancementState(next);
      if (JSON.stringify(validated) === JSON.stringify(this.state)) return this.view();
      validated.revision++;
      await this.backup();
      await this.persist(validated);
      this.state = validated; this.status = 'pending'; this.onChange();
      return this.view();
    });
    this.queue = operation.catch(() => {});
    return operation;
  }
  async close() { this.closed = true; await this.queue; }
}
