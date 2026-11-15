# Agent preset compatibility / Agent 预设兼容性

Soul Desk supports the four presets of DeepSeek Harness **0.2.2-rc.2** on Node.js 26. Earlier or custom versions are covered only by the `peerDependencies` range.

Soul Desk 支持 DeepSeek Harness **0.2.2-rc.2**（Node.js 26）的四种预设：标准 `standard`、PTC `ptc`、极简 `minimal`、创造 `cordis`。更早或自定义版本仅由 `peerDependencies` 范围覆盖。

## Behavior / 行为

- **All presets / 全部预设**：全局、工作区、会话三层人设规则与个人记忆正常工作，总开关独立生效。Persona rules and memories work in all three scopes, with an independent master switch.
- **Skill catalog / Skill 目录**：启用项进入目录并可加载，禁用项被隐藏且强制调用被拒绝。Enabled entries are listed and loadable; disabled ones are hidden and forced calls are rejected.
- **PTC**：模型只收到 `run_code` 的顶层 schema，嵌套工具通过生成的 SDK 调用；人设、记忆与完整 Skill 说明仍在系统上下文中。The model receives only the top-level `run_code` schema and reaches nested tools through the generated SDK, while persona, memories and full Skill instructions stay in context.
- **Minimal / 极简**：没有原生 Skill 加载器或子代理，启用 Skill 不会为该预设补装这些工具；人设与记忆可用，预设原有的工具边界保留。No native Skill loader or subagents exist, so enabling a Skill does not add them here; persona and memory support work within the preset's existing tool boundary.
- **Complete mode / 替换模式**：替换预设的提示词正文，同时保留执行器协议、SDK、工具 schema 和原生运行上下文；希望保留原有任务说明时使用优先或追加。Replaces the preset's prompt body while preserving executor protocol, SDK, tool schemas and native runtime context; use Priority or Append to keep the original task instructions.

## Limits / 范围

“兼容”保留预设自身的能力边界，不表示为极简添加标准模式的工具，也不表示自定义隔离注册表或外部 ACP 后端受支持。Compatibility keeps each preset's own capability boundary: it does not add Standard tools to Minimal, and does not cover custom isolated registries or external ACP backends.

Installing with `dsh plugin add` targets one profile and never upgrades the running host implicitly. Published archives exclude test results, local backups, persona libraries, memories, credentials and conversation data.
