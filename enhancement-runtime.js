import { AsyncLocalStorage } from 'node:async_hooks';
import { renderPrompt } from '@deepseek-ai/dsh-system-prompt';
import { SoulError } from './memory-policy.js';
import { applyEnhancement, renderEnhancementPrompt, validateEnhancementSettings } from './prompt-enhancement.js';

const nativePresets = ['standard', 'ptc', 'cordis', 'minimal'];
const MAX_PREVIEW_BYTES = 2 * 1024 * 1024;

export function createEnhancementRuntime(ctx, store, personas, { extraPresets = [] } = {}) {
  const presets = new Set([...nativePresets, ...extraPresets]);
  const preview = new AsyncLocalStorage();
  const modes = new Map();
  let generation = 0;
  let checking;
  const registry = () => ctx.get('agentPresets');

  function finalize(personal, native, context) {
    const draft = preview.getStore();
    const agent = context.agent ?? (context.scope?.session ? context.scope : undefined);
    const catalog = registry();
    const preset = draft?.preset ?? (agent?.ctx ? catalog?.composedPreset?.(agent.ctx) : undefined)
      ?? agent?.session?.header?.agentPreset ?? (catalog ? undefined : 'standard');
    // Respect exclusive prompts and the native preset boundary independently
    // from persona resolution, which has already run in the shared waterfall.
    const exclusive = native.sections.find(row => row.complete);
    if (!presets.has(preset)) return exclusive ? { ...native, sections: [exclusive] } : personal;

    const config = draft?.config ?? store.config();
    const child = !!agent && personas.descriptor(String(agent.session.id), agent).kind === 'subagent';
    const issues = exclusive && config.enabled && renderEnhancementPrompt(config.settings)
      ? ['host-complete-prompt'] : [];
    if (draft) draft.issues = issues;
    else if (!child && config.enabled) {
      modes.set(preset, diagnostic(true, issues, 'native-assembly'));
    }

    return exclusive
      ? { ...native, sections: [exclusive] }
      : applyEnhancement(personal, config, {
        isSubagent: child,
        nativeSections: native.sections,
        report: value => { if (!draft) store.report(value); },
      });
  }

  function diagnostic(enabled, issues, path) {
    return {
      checked: true,
      issues,
      state: issues.length ? 'unsupported' : enabled ? 'active' : 'off',
      path,
    };
  }

  function changed() {
    generation++;
    modes.clear();
    checking = undefined;
  }

  function status() {
    const enabled = store.config().enabled;
    return {
      engine: 'native-assembly',
      presets: [...presets],
      modes: Object.fromEntries([...presets].map(id => [
        id, modes.get(id) ?? { checked: false, issues: [], state: enabled ? 'pending' : 'off' },
      ])),
    };
  }

  // A native preset lease creates no conversation and carries no live Agent
  // context. Match the normal assembly path while keeping the draft request-local.
  async function standingAssembly(presetId, config, signal) {
    const catalog = registry();
    if (!catalog?.acquireScope) throw new SoulError('当前宿主不支持模式预览。', 'unsupported-preview', 503);
    signal?.throwIfAborted();
    await using lease = await catalog.acquireScope(presetId);
    signal?.throwIfAborted();
    const context = { preset: presetId, config, issues: [] };
    const assembly = await preview.run(context, () => ctx.systemPrompt.assemble({ scope: lease.key, signal }));
    signal?.throwIfAborted();
    return { assembly, issues: context.issues };
  }

  async function previewFor(presetId, { settings, signal } = {}) {
    if (!presets.has(presetId)) throw new SoulError('不支持此预览模式。', 'unsupported-preset', 400);
    const draft = validateEnhancementSettings(settings ?? store.config().settings);
    try {
      const { assembly } = await standingAssembly(presetId, { enabled: true, settings: draft }, signal);
      // Standing scopes have no cwd/model binding from a live session. Preserve
      // the registered but unbound slots in the preview and retain native validation.
      const variables = Object.fromEntries(Object.entries(assembly.variables ?? {}).map(
        ([name, value]) => [name, value ?? '{{' + name + '}}'],
      ));
      const text = renderPrompt({ ...assembly, variables });
      const bytes = Buffer.byteLength(text);
      if (bytes > MAX_PREVIEW_BYTES) throw new SoulError('完整提示词预览过大。', 'preview-size', 413);
      return {
        presetId, available: true, source: 'standing',
        locked: assembly.sections.some(row => row.complete),
        text, bytes, lines: text.split('\n').length,
      };
    } catch (error) {
      signal?.throwIfAborted();
      return {
        presetId, available: false, errorCode: previewErrorCode(error),
        reason: error instanceof SoulError ? error.message : '模式预览暂不可用，原提示词未修改。',
      };
    }
  }

  function previewErrorCode(error) {
    if (error instanceof SoulError) return error.code;
    if (error?.code === 'agent-preset/not-found') return 'preset-not-found';
    return 'preview-failed';
  }

  function recheck() {
    if (checking) return checking;
    const epoch = generation;
    const config = store.config();
    const operation = (async () => {
      const results = new Map();
      for (const id of presets) {
        if (epoch !== generation) break;
        try {
          const { issues } = await standingAssembly(id, config);
          results.set(id, diagnostic(config.enabled, issues, 'standing-preview'));
        } catch (error) {
          results.set(id, {
            checked: true, issues: [previewErrorCode(error)],
            state: 'failed', path: 'standing-preview',
          });
        }
      }
      if (epoch === generation) for (const [id, result] of results) modes.set(id, result);
      return status();
    })().finally(() => { if (checking === operation) checking = undefined; });
    checking = operation;
    return operation;
  }

  return { finalize, previewFor, status, recheck, changed, dispose: changed };
}
