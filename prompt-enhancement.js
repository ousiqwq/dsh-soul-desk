import { SoulError } from './memory-policy.js';
import { EXECUTION_MODE_BLOCK } from './upstream-prompt.js';

export const ENHANCEMENT_SECTION = 'private-soul:response-enhancement';
export const MAX_ENHANCEMENT_PROMPT = 16000;
export const DEFAULT_ENHANCEMENT_SETTINGS = Object.freeze({
  directAnswer: false,
  completeArtifacts: false,
  preserveNames: false,
  subagentGuidance: false,
  includeSubagents: true,
  prompt: EXECUTION_MODE_BLOCK,
});

export const ENHANCEMENT_EFFECTS = Object.freeze({
  directAnswer: "Lead with the requested result when possible, and keep introductions concise. Preserve the persona's tone and conversational style.",
  completeArtifacts: 'When a concrete artifact is requested and permitted, provide enough detail for it to be useful. State prerequisites or missing information rather than inventing results or claiming unperformed work.',
  preserveNames: 'Preserve names, paths and values supplied by the user. Use explicit placeholders for missing values, and honor any existing privacy or redaction requirements.',
  subagentGuidance: [
    "The user has enabled optional parallel help. When you own two independent deliverables that each take substantial work, prefer giving an unclaimed part of your own assignment to a native DSH subagent early and progressing the other yourself. This preference applies when the user describes an outcome without mentioning the tool. Use your judgment about whether the time saved is worth handing over the context.",
    "A subagent is a temporary child session within your current authorization. One helper usually suffices for one independent result. More helpers make sense when they own different deliverables or the user wants several independent opinions. The tool returns immediately. A useful description names the branch; the prompt gives its inputs, the result needed and an acceptance check. Native completion messages bring its result back for you to verify and integrate. In Standard the tool is subagent; in PTC it may be exposed as tools.subagent inside run_code.",
    "For a quick answer, a single lookup, work already assigned, or a step that needs your unfinished result, proceed directly. Respect the user's narrower instructions and the tools and permissions available in this session.",
  ].join(" "),
});

export function validateEnhancementSettings(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new SoulError('提示词增强设置格式无效。');
  const keys = Object.keys(DEFAULT_ENHANCEMENT_SETTINGS);
  if (Object.keys(value).some(key => !keys.includes(key))) throw new SoulError('含有未知的提示词增强设置。');
  const settings = { ...DEFAULT_ENHANCEMENT_SETTINGS, ...value };
  for (const key of keys.filter(key => key !== 'prompt')) if (typeof settings[key] !== 'boolean') throw new SoulError('提示词增强选项必须为开关值。');
  if (typeof settings.prompt !== 'string' || settings.prompt.length > MAX_ENHANCEMENT_PROMPT) throw new SoulError('增强提示词最多16000字符。');
  return settings;
}

export function renderEnhancementPrompt(value) {
  const settings = validateEnhancementSettings(value);
  const block = settings.prompt.trim();
  const extras = Object.entries(ENHANCEMENT_EFFECTS).filter(([key]) => settings[key]).map(([, text]) => text);
  return [block, ...extras].filter(Boolean).join('\n\n');
}

/** Adds one independent section; never rewrites existing rows. */
export function applyEnhancement(assembly, config, { isSubagent = false, report = () => {}, nativeSections = [], externalActive = false } = {}) {
  if (!config?.enabled) return assembly;
  if (!Array.isArray(assembly?.sections)) { report('unsupported'); return assembly; }
  const settings = validateEnhancementSettings(config.settings);
  if (isSubagent && !settings.includeSubagents) { report('subagent-excluded'); return assembly; }
  if (externalActive || assembly.sections.some(section => section.name === 'unrestricted:execution-mode')) {
    report('external-module'); return assembly;
  }
  const text = renderEnhancementPrompt(settings);
  if (!text) { report('empty'); return assembly; }
  const rows = assembly.sections.filter(section => section.name !== ENHANCEMENT_SECTION);
  // Complete persona replacement may omit prose-level Plan/reporting sections.
  // Restore only these native contracts, never the old persona or its body.
  for (const section of nativeSections) if (['plan:policy', 'tool:structured_output'].includes(section.name)
    && !rows.some(row => row.name === section.name)) rows.push(section);
  if (assembly.sections.length === rows.length + 1 && assembly.sections[0]?.name === ENHANCEMENT_SECTION
    && assembly.sections[0].text === text && rows.every((row, index) => row === assembly.sections[index + 1])) { report('active'); return assembly; }
  report('active');
  // Original persona/memory sections stay later in their original order, and
  // tools, contexts and variables keep their original object identity.
  return { ...assembly, sections: [{ name: ENHANCEMENT_SECTION, text, interpolate: false }, ...rows] };
}
