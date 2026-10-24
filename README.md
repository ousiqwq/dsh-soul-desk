# DSH Soul Desk

**DeepSeek Harness 的人格与个人记忆控制台。**

Manage personas, switch them per session, and keep each persona's personal memories separate in DeepSeek Harness.

插件包名为 `dsh-plugin-private-soul`，设置入口是 **设置 → 私人灵魂**。

> **有预设可以直接尝试：** 本项目内置「若娜瓦」示例。安装插件后，可下载 [示例预设 JSON](https://github.com/ousiqwq/dsh-soul-desk/releases/download/v0.2.3/ronova.json)，在设置中选择 **导入全部 → 合并导入**，检查后自行启用。示例只含角色设定，**不含个人记忆或会话记录**。详见[预设体验步骤](#若娜瓦示例预设)。

## 功能

- 管理多个人设，支持完整人格文本、全局默认人设与每会话切换。
- 子 Agent 继承所属会话的选择；已发送的请求保留当时的人设归属。
- 每个人设拥有独立的跨会话个人记忆，只记录关系、稳定喜好与共同故事。
- 提供记忆查询、新增、编辑、删除、去重与整理预览。
- 支持人格 Markdown 和整体 JSON 导入导出。
- 使用 DSH 当前会话或默认模型审核自动记忆、生成整理预览。
- 原子保存、修订冲突检查、恢复备份与数据损坏保护。
- 设置页适配 DSH 主题与窄屏，人设菜单集成在聊天界面中。

项目包含插件代码，以及经明确授权公开的 **若娜瓦示例预设**。不包含个人记忆、真实会话绑定、其他人设或运行时存档。

## 兼容性

| 组件 | 已验证版本 |
| --- | --- |
| DeepSeek Harness | `0.2.1-rc.3` |
| Node.js | `26` |
| Cordis | `4.0.5` |

其他 Harness 版本需要重新验证接口兼容性。

## 安装

下载 [v0.2.3 插件包](https://github.com/ousiqwq/dsh-soul-desk/releases/download/v0.2.3/dsh-plugin-private-soul-0.2.3.tgz)，然后执行：

```bash
dsh plugin --profile web add ./dsh-plugin-private-soul-0.2.3.tgz
```

也可以直接安装发布包：

```bash
dsh plugin --profile web add https://github.com/ousiqwq/dsh-soul-desk/releases/download/v0.2.3/dsh-plugin-private-soul-0.2.3.tgz
```

在 DSH 插件页面启用 `dsh-plugin-private-soul`，重启 DSH 并刷新页面，进入 **设置 → 私人灵魂**。没有工作区或会话时，聊天区可能不显示人设菜单；设置页始终提供管理入口。

## 若娜瓦示例预设

示例是用户提供的同人角色设定，可选导入，不会在安装时自动启用。

- [`presets/ronova.json`](presets/ronova.json)：可以直接通过插件的 **导入全部** 功能导入。
- [`presets/ronova.SOUL.md`](presets/ronova.SOUL.md)：仅设定文本，可通过 **导入 SOUL.md** 读入草稿。

推荐流程：

1. 下载 `presets/ronova.json`，在设置中点击 **导入全部**。
2. 在预览中确认只有 **若娜瓦** 一个示例、**0 条记忆**。
3. 选择 **合并导入** 并确认，保留已有的人设和绑定。
4. 检查设定内容，再自行保存并启用，或在目标会话中选择这个人设。

示例使用新的固定标识 `example-ronova`，记忆列表与会话绑定均为空，未包含原始存档 ID 或创建时间。导入不会读取或恢复任何人的历史互动。

## 使用

在设置中点击 **新建人设**，填写名称和设定文本。**仅保存** 保存草稿；**保存并启用此人设** 同时将其设为全局默认。会话菜单支持 **跟随默认**、**此会话不使用人设** 或选择具体人设。

支持两种注入方式：

- **人格优先**：将人格原文放在组装后的系统提示词前部，保留工具和其他框架说明。
- **完整替换**：替换人格相关的提示词正文，保留框架提供的工具 schema 和运行时上下文。

人格文本按字面处理，`{{...}}` 不作模板插值。设置仅控制应用组装的提示词，模型服务自身的上层规则仍由服务商控制。

### 个人记忆

每个人设分别保存以下三类个人事实：

| 类别 | 范围 |
| --- | --- |
| `relationship` | 关系、称呼、约定和边界 |
| `preference` | 稳定的个人或交流偏好 |
| `story` | 真实共同经历，去除具体工作细节 |

自动记忆提供 `soul_memory_read`、`soul_memory_remember`、`soul_memory_update`、`soul_memory_forget`、`soul_memory_consolidate` 工具。归属由服务端从实际会话与请求确定，不能由模型传入其他人设 ID 来跨库访问。

自动写入通过工作内容过滤及模型语义审核，失败时不写入。人工录入与导入执行结构、长度和内容过滤。语义过滤不能保证识别所有变体，记忆仍可在设置页修正。

每个人设最多 500 条记忆，每条最多 1600 字符；整体存档最多 8 MiB。智能整理先生成预览，确认后才写入，旧版本预览会被拒绝。

模型审核和智能整理使用已有模型连接，可能产生对应服务的 API 费用。普通聊天记录由 Harness 管理，不属于本插件的个人记忆库。

## 数据存储与隐私

运行数据保存在 `$DSH_HOME/private-soul/`，默认是 `~/.dsh/private-soul/`：

| 文件 | 内容 |
| --- | --- |
| `library.json` | 实际人设、记忆、全局设置和会话绑定 |
| `backups/*.json` | 删除、整理或整体导入前的恢复存档 |

目录权限为 `0700`，存档为 `0600`。这些运行数据不属于插件安装包。整体导出文件包含个人内容，应由使用者自行保管，不要提交到代码仓库。

全局总开关关闭后停止人格注入和自动记忆工具，保留已存内容。卸载插件不会主动删除运行时数据。网页接口沿用 Harness 的认证及 Host/Origin 检查。

## 开发与测试

```bash
git clone https://github.com/ousiqwq/dsh-soul-desk.git
cd dsh-soul-desk
npm ci --ignore-scripts
npm run check
npm test
npm pack --ignore-scripts
```

16 项测试使用临时目录中的合成角色和记忆，不读取真实用户存档，也不调用付费模型。示例预设测试只使用仓库内明确公开的示例文本，详见 [测试说明](docs/TESTING.md)。

## License

[MIT](LICENSE) © 2026 osiqwq
