# DSH Soul Desk

**简体中文** | [English](README.en.md)

DeepSeek Harness 的人格与个人记忆管理插件。为不同对话选择合适的人设，并为每个人设维护独立的跨会话记忆。

入口：**设置 → 私人灵魂** · 插件包：`dsh-plugin-private-soul`

## 功能

- **多个人设**：编辑完整人格文本，设置全局默认，或在聊天界面按会话切换。
- **独立记忆**：按人设管理关系、喜好与共同故事，支持查询、编辑、去重和整理预览。
- **两种提示词模式**：选择人格优先或完整替换，配合原生工具与运行上下文使用。
- **导入与导出**：支持人格 Markdown、整体 JSON，以及合并导入。
- **自动记忆**：使用当前会话或默认模型审核记忆、生成整理建议。
- **持久保存**：支持修订冲突检查、恢复备份、深浅主题与窄屏布局。

### 人设管理

新建或编辑人设，选择注入方式和默认人设。聊天页可独立选择具体人设、跟随默认或停用。

![人设管理：全局默认、注入方式与人格编辑](docs/images/personas.png)

### 个人记忆

按类别筛选和搜索记忆，手动补充内容，或先查看智能整理建议再应用。

![个人记忆：筛选、编辑与整理](docs/images/memories.png)

## 安装

兼容 DeepSeek Harness **0.2.1-rc.3 / 0.2.1-rc.5**，Node.js **26**。其他 Harness 版本需确认接口兼容性。

```bash
dsh plugin --profile web add https://github.com/ousiqwq/dsh-soul-desk/releases/download/v0.2.4/dsh-plugin-private-soul-0.2.4.tgz
```

在 DSH 插件管理中启用插件，重启 DSH 并刷新页面，然后打开 **设置 → 私人灵魂**。也可以从 [Releases](https://github.com/ousiqwq/dsh-soul-desk/releases) 下载安装包后本地安装。

## 使用

1. 点击 **新建人设**，填写名称与人格文本。
2. **仅保存** 保存当前编辑；**保存并启用此人设** 同时设为全局默认。
3. 在聊天页的人设菜单中，为当前会话选择具体人设、**跟随默认** 或 **此会话不使用人设**。
4. 进入 **个人记忆**，管理该人设的关系、喜好和故事。

子 Agent 继承所属会话的选择；已发送请求使用发送时的人设归属。切换人设时，也会切换其个人记忆。

| 注入方式 | 行为 |
| --- | --- |
| 人格优先 | 将人格文本放在系统提示词前部，保留工具和框架说明 |
| 完整替换 | 使用人格文本替换系统提示词正文，保留工具 schema 与运行时上下文 |

人格文本按字面处理，`{{...}}` 不作模板插值。全局开关控制人格注入和自动记忆工具，关闭后保留已有内容。

## 尝试若娜瓦预设

内置可选的 **若娜瓦** 角色预设，安装后可手动导入体验。

1. 下载 [ronova.json](https://github.com/ousiqwq/dsh-soul-desk/releases/download/v0.2.4/ronova.json)。
2. 在设置中选择 **导入全部 → 合并导入**。
3. 查看设定，保存并启用，或在目标会话中选择若娜瓦。

也可以下载 [ronova.SOUL.md](presets/ronova.SOUL.md)，通过 **导入 SOUL.md** 载入编辑器。

## 记忆与存储

记忆分为 `relationship`（关系）、`preference`（喜好）和 `story`（共同故事）。模型可通过 `soul_memory_read`、`soul_memory_remember`、`soul_memory_update`、`soul_memory_forget`、`soul_memory_consolidate` 管理当前人设的记忆。

自动写入经过内容过滤和模型审核；智能整理先生成预览，确认后保存。每个人设最多 500 条记忆，每条最多 1600 字符，整体存档最多 8 MiB。

运行数据位于 `$DSH_HOME/private-soul/`，默认 `~/.dsh/private-soul/`。`library.json` 保存人设、记忆与会话绑定，`backups/` 保存删除、整理或整体导入前的恢复存档。卸载插件保留数据。

## 开发

```bash
npm ci --ignore-scripts
npm run check
npm test
npm pack --ignore-scripts
```

开发检查见 [TESTING.md](docs/TESTING.md)。

## 许可证

[MIT](LICENSE) © 2026 osiqwq
