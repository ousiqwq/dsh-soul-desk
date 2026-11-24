# 提示词增强

在「设置 → 私人灵魂」开启增强。默认正文是随包内置的 dsh-unrestricted 0.2.15 执行模式正文，可在高级设置改写或清空。简洁开场、完整交付、保留用户命名和子代理增强各有独立选项。保存设置与启用总开关是两个操作。

增强在 DSH 原生指令来源中占独立段落。会话和工作区照常解析人设、记忆与子代理继承。优先、替换和追加三种人设方式都可以配合增强。宿主提供独占系统指令时保留独占正文，例如当前宿主的 Minimal。原生工具目录、PTC 协议、Plan 和结构化输出继续由宿主提供。

「子代理增强」引导模型在适合时分派独立工作。「应用于子代理」控制子代理自己是否收到增强段落。子代理人设仍由人设规则决定。

## 诊断与自定义预设

诊断每次借用当前的原生预设作用域生成基准预览，使用此页的增强草稿和全局人设，不缓存或读取活动会话的系统提示词、Plan 状态或对话历史。预览只读。全局人设启用时，预览可能包含它的记忆。

Standard、PTC、Cordis 和 Minimal 可在诊断中查看。要为已经在 DSH 注册的自定义预设开启增强，可在 Web profile 中为现有 `private-soul` 条目加入 `extraPresets`。值是预设 ID，例如：

```yaml
- id: private-soul
  config:
    extraPresets: [my-preset]
```

额外预设会出现在诊断选择器中，也可在实际会话中使用增强。未列入的自定义预设沿用现有的人设规则。任何预设的独占系统指令仍然优先。

## 接口与数据

增强请求由 DSH Connection 的共享 API 提供，入口为 `GET /api/private-soul/enhancement` 与 `POST /api/private-soul/enhancement`。读取、草稿预览、完整预览和重新检查使用同一套增强逻辑。保存使用现有修订号检查。旧 Web 入口 `/private-soul/v2/enhancement` 兼容现有客户端。

设置独立存放在 `$DSH_HOME/private-soul/prompt-enhancement.v1.json`，通过修订号和备份保护并发编辑。人设存档、会话绑定与记忆继续使用原有存储。

默认正文、共享接口、基准预览与额外预设适配均参考 [dsh-unrestricted 0.2.15](https://github.com/yexi-by/dsh-unrestricted/releases/tag/v0.2.15)。正文逐字保留，`sha256` 与内置源文件比对。此前发布版的正文移植记录见 [UPSTREAM-INTEGRATION.md](UPSTREAM-INTEGRATION.md)。
