window.__ModuleLoader__.load({
  id: 'dsh-plugin-private-soul',
  factory: require => {
    const React=require('react'),h=React.createElement,{createPortal}=require('react-dom');
    const {Button,Input,Switch,SegmentedTabs,Menu,MenuItemButton,Tooltip,Toast,IconWarningOutlineRegular,IconUserOutlineRegular,IconChevronDownOutlineRegular}=require('@deepseek-ai/dsh-client-ui-primitives');
    /* i18n:start */
const NS="soulDesk";
const zh={
  "人设编辑内容": "人设编辑内容",
  "会话仅在对话顶部设置，优先于工作区和全局。": "会话仅在对话顶部设置，优先于工作区和全局。",
  " · 有未保存修改": " · 有未保存修改",
  " · 默认": " · 默认",
  "# 我是谁\n\n粘贴完整的人格、语气、价值观和交流习惯……": "# 我是谁\n\n粘贴完整的人格、语气、价值观和交流习惯……",
  "{p0} 个人设 · {p1} 条个人记忆": "{p0} 个人设 · {p1} 条个人记忆",
  "{p0} 字符{p1}。{{…}} 保留原文。": "{p0} 字符{p1}。{{…}} 保留原文。",
  "{p0} 条 → {p1} 条。{p2}": "{p0} 条 → {p1} 条。{p2}",
  "{p0} 条个人记忆": "{p0} 条个人记忆",
  "{p0} 条记忆{p1}": "{p0} 条记忆{p1}",
  "“{p0}”的独立记忆库。自动记录还需通过模型语义审核。": "“{p0}”的独立记忆库。自动记录还需通过模型语义审核。",
  "一键去重": "一键去重",
  "不使用人设": "不使用人设",
  "不使用默认人设": "不使用默认人设",
  "个人记忆": "个人记忆",
  "个人记忆内容": "个人记忆内容",
  "个人记忆已保存，只属于当前人设。": "个人记忆已保存，只属于当前人设。",
  "人格": "人格",
  "人格 / SOUL.md": "人格 / SOUL.md",
  "人格文本文件过大。": "人格文本文件过大。",
  "人格文本最多262144字符。": "人格文本最多262144字符。",
  "人设": "人设",
  "人设列表": "人设列表",
  "人设名称": "人设名称",
  "人设已保存。": "人设已保存。",
  "人设已删除，服务器已保留备份。": "人设已删除，服务器已保留备份。",
  "人设：{p0}{p1}": "人设：{p0}{p1}",
  "仅保存": "仅保存",
  "优先": "优先",
  "例如：温柔的伙伴": "例如：温柔的伙伴",
  "例如：用户喜欢我叫他“小林”，这个称呼让他感觉亲切。": "例如：用户喜欢我叫他“小林”，这个称呼让他感觉亲切。",
  "保存并启用此人设": "保存并启用此人设",
  "保存记忆": "保存记忆",
  "保留原有系统提示词，在其末尾追加人格与个人记忆。": "保留原有系统提示词，在其末尾追加人格与个人记忆。",
  "先保存或选择一个人设，再管理它的个人记忆。": "先保存或选择一个人设，再管理它的个人记忆。",
  "全局默认人设": "全局默认人设",
  "全局默认人设：{p0}": "全局默认人设：{p0}",
  "全部类别": "全部类别",
  "关系": "关系",
  "关闭本会话的人格与个人记忆": "关闭本会话的人格与个人记忆",
  "切换编辑对象会替换未保存的草稿。是否继续？": "切换编辑对象会替换未保存的草稿。是否继续？",
  "删除": "删除",
  "删除“{p0}”及其 {p1} 条记忆？服务器会先备份。": "删除“{p0}”及其 {p1} 条记忆？服务器会先备份。",
  "删除此人设及其记忆": "删除此人设及其记忆",
  "包含 {p0} 个人设、{p1} 条记忆。": "包含 {p0} 个人设、{p1} 条记忆。",
  "取消导入": "取消导入",
  "取消整理": "取消整理",
  "取消编辑": "取消编辑",
  "合并导入：保留现有，冲突项作为副本": "合并导入：保留现有，冲突项作为副本",
  "启用私人灵魂": "启用私人灵魂",
  "喜好": "喜好",
  "导入 SOUL.md": "导入 SOUL.md",
  "导入人格文本文件": "导入人格文本文件",
  "导入全部": "导入全部",
  "导入整体存档文件": "导入整体存档文件",
  "导入预览": "导入预览",
  "导出全部": "导出全部",
  "导出草稿": "导出草稿",
  "将人格与个人记忆放在系统提示词前部，替换原有身份设定，保留工具和框架说明。": "将人格与个人记忆放在系统提示词前部，替换原有身份设定，保留工具和框架说明。",
  "已保存并设为全局默认人设。": "已保存并设为全局默认人设。",
  "已去除重复的个人记忆。": "已去除重复的个人记忆。",
  "已启用": "已启用",
  "已导入人格草稿，保存后生效。": "已导入人格草稿，保存后生效。",
  "已更新总开关。": "已更新总开关。",
  "已更新注入方式。": "已更新注入方式。",
  "应用整理": "应用整理",
  "建议已生成，确认后才会写入。": "建议已生成，确认后才会写入。",
  "搜索个人记忆": "搜索个人记忆",
  "故事": "故事",
  "整体存档导入预览": "整体存档导入预览",
  "整体存档已下载，包含所有人设、记忆和会话绑定。": "整体存档已下载，包含所有人设、记忆和会话绑定。",
  "整体存档已导入。": "整体存档已导入。",
  "整体存档最多8 MiB。": "整体存档最多8 MiB。",
  "整体导入方式": "整体导入方式",
  "新增个人记忆": "新增个人记忆",
  "新建人设": "新建人设",
  "新建会替换未保存草稿，是否继续？": "新建会替换未保存草稿，是否继续？",
  "无": "无",
  "智能整理": "智能整理",
  "暂无符合条件的记忆。真实互动出现关系、喜好或故事时，人设可通过记忆工具记录。": "暂无符合条件的记忆。真实互动出现关系、喜好或故事时，人设可通过记忆工具记录。",
  "替换": "替换",
  "替换、删除和整理前服务器会自动备份。验证失败不会写入。": "替换、删除和整理前服务器会自动备份。验证失败不会写入。",
  "替换全部：恢复整个存档": "替换全部：恢复整个存档",
  "未单独绑定的会话跟随默认人设。聊天页的人设菜单可单独选择人设，切换时一起切换它的记忆。": "未单独绑定的会话跟随默认人设。聊天页的人设菜单可单独选择人设，切换时一起切换它的记忆。",
  "未启用": "未启用",
  "本会话人设": "本会话人设",
  "正在处理，请稍候…": "正在处理，请稍候…",
  "此会话不使用人设": "此会话不使用人设",
  "每个人设拥有独立的跨会话记忆。只记录关系、喜好与共同故事；代码、任务进度和具体工作内容不进入长期记忆。": "每个人设拥有独立的跨会话记忆。只记录关系、喜好与共同故事；代码、任务进度和具体工作内容不进入长期记忆。",
  "注入方式": "注入方式",
  "用人格与个人记忆替换系统提示词正文，保留原生工具接口和运行时上下文。": "用人格与个人记忆替换系统提示词正文，保留原生工具接口和运行时上下文。",
  "确认导入": "确认导入",
  "私人灵魂": "私人灵魂",
  "私人灵魂-{p0}.json": "私人灵魂-{p0}.json",
  "私人灵魂人设与记忆管理": "私人灵魂人设与记忆管理",
  "筛选记忆类别": "筛选记忆类别",
  "编辑": "编辑",
  "编辑个人记忆": "编辑个人记忆",
  "记忆已删除，服务器已保留备份。": "记忆已删除，服务器已保留备份。",
  "记忆已整理，原内容已自动备份。": "记忆已整理，原内容已自动备份。",
  "记忆整理预览": "记忆整理预览",
  "记忆类别": "记忆类别",
  "请在设置 → 私人灵魂启用人设": "请在设置 → 私人灵魂启用人设",
  "请求失败（{p0}）": "请求失败（{p0}）",
  "请选择“导出全部”生成的 JSON 存档。": "请选择“导出全部”生成的 JSON 存档。",
  "跟随默认": "跟随默认",
  "跟随默认 · ": "跟随默认 · ",
  "这个人设已被其他页面编辑，草稿仍保留。请导出草稿后重新读取并合并。": "这个人设已被其他页面编辑，草稿仍保留。请导出草稿后重新读取并合并。",
  "追加": "追加",
  "重新读取人设": "重新读取人设",
  "重新读取会替换当前草稿，是否继续？": "重新读取会替换当前草稿，是否继续？",
  "默认人设已切换，下一次请求生效。": "默认人设已切换，下一次请求生效。",
  "导入文件过大，最多8 MiB。": "导入文件过大，最多8 MiB。",
  "请求不是有效的 JSON。": "请求不是有效的 JSON。",
  "请求必须使用 application/json。": "请求必须使用 application/json。",
  "写入需要有效的修订号。": "写入需要有效的修订号。",
  "长期记忆只能属于关系、喜好或故事。": "长期记忆只能属于关系、喜好或故事。",
  "记忆内容需为 1–{p0} 个字符。": "记忆内容需为 1–{p0} 个字符。",
  "这条记忆含工作细节、代码、路径、网址或凭据。请只提炼关系、个人喜好或共同故事。": "这条记忆含工作细节、代码、路径、网址或凭据。请只提炼关系、个人喜好或共同故事。",
  "记忆工具必须由真实会话智能体调用。": "记忆工具必须由真实会话智能体调用。",
  "当前会话未启用人设，请先选择人设。": "当前会话未启用人设，请先选择人设。",
  "请求的人设已变更，未写入记忆。": "请求的人设已变更，未写入记忆。",
  "查询过长。": "查询过长。",
  "分页参数无效。": "分页参数无效。",
  "当前人设中没有这条记忆。": "当前人设中没有这条记忆。",
  "一次最多整理100条记忆。": "一次最多整理100条记忆。",
  "记忆已变更，请重新读取再整理。": "记忆已变更，请重新读取再整理。",
  "整理结果未通过个人记忆审核；原记忆保持不变。": "整理结果未通过个人记忆审核；原记忆保持不变。",
  "没有可用于记忆审核或整理的模型。": "没有可用于记忆审核或整理的模型。",
  "模型服务尚未就绪。": "模型服务尚未就绪。",
  "模型整理结果过长。": "模型整理结果过长。",
  "模型未返回有效的记忆 JSON；未写入任何内容。": "模型未返回有效的记忆 JSON；未写入任何内容。",
  "智能整理预览最多处理 100 条；请先去重或导出后人工精简。不要把一页记忆当作完整库覆盖。": "智能整理预览最多处理 100 条；请先去重或导出后人工精简。不要把一页记忆当作完整库覆盖。",
  "{p0}格式不正确或过长。": "{p0}格式不正确或过长。",
  "无效的标识。": "无效的标识。",
  "不是有效的私人灵魂 v2 存档。": "不是有效的私人灵魂 v2 存档。",
  "最多保存 {p0} 个人设。": "最多保存 {p0} 个人设。",
  "存档含重复人设 ID。": "存档含重复人设 ID。",
  "每个人设最多 {p0} 条记忆。": "每个人设最多 {p0} 条记忆。",
  "同一人设内有重复记忆 ID。": "同一人设内有重复记忆 ID。",
  "会话绑定过多。": "会话绑定过多。",
  "会话绑定指向不存在的人设。": "会话绑定指向不存在的人设。",
  "默认人设不存在。": "默认人设不存在。",
  "人格开关或注入方式无效。": "人格开关或注入方式无效。",
  "整体存档超过 8 MiB，请精简后再保存。": "整体存档超过 8 MiB，请精简后再保存。",
  "现有存档过大，拒绝覆盖。": "现有存档过大，拒绝覆盖。",
  "人设已不存在，请刷新后重试。": "人设已不存在，请刷新后重试。",
  "存档服务正在退出。": "存档服务正在退出。",
  "内容已被其他页面或记忆操作更新。草稿仍保留，请重新读取后合并。": "内容已被其他页面或记忆操作更新。草稿仍保留，请重新读取后合并。",
  "先填写人格文本再启用。": "先填写人格文本再启用。",
  "开关格式错误。": "开关格式错误。",
  "请选择私人灵魂整体 JSON 存档。": "请选择私人灵魂整体 JSON 存档。",
  "导入方式无效。": "导入方式无效。",
  "不支持的操作。": "不支持的操作。",
  "记忆已不存在。": "记忆已不存在。",
  "这条记忆已更新，请重新读取。": "这条记忆已更新，请重新读取。",
  "记忆不存在。": "记忆不存在。",
  "整理结果无效。": "整理结果无效。",
  "整理只能引用当前人设已有的记忆。": "整理只能引用当前人设已有的记忆。",
  "整理结果仍有重复条目。": "整理结果仍有重复条目。",
  "请使用受信任的 Harness 页面访问设置。": "请使用受信任的 Harness 页面访问设置。",
  "操作未完成，请刷新后重试。": "操作未完成，请刷新后重试。",
  "操作未完成，请重试。": "操作未完成，请重试。",
  "翻译已取消或超时，请重试。": "翻译已取消或超时，请重试。",
  "当前模型翻译失败，请检查 DeepSeek 的模型连接后重试。": "当前模型翻译失败，请检查 DeepSeek 的模型连接后重试。",
  "策略文件无法读取，Skill 和 MCP 已暂停。请恢复 policy.json 备份后重启服务。": "策略文件无法读取，Skill 和 MCP 已暂停。请恢复 policy.json 备份后重启服务。",
  "人设规则已保存，下一次请求生效。": "人设规则已保存，下一次请求生效。",
  "人设已失效": "人设已失效",
  "人设内容为空": "人设内容为空",
  "复用当前人设": "复用当前人设",
  "会话单独设置": "会话单独设置",
  "工作区默认": "工作区默认",
  "派生时的默认选择": "派生时的默认选择",
  "全局默认": "全局默认",
  "工作区默认人设": "工作区默认人设",
  "人设使用规则": "人设使用规则",
  "会话选择优先于工作区和全局": "会话选择优先于工作区和全局",
  "规则范围": "规则范围",
  "工作区": "工作区",
  "会话": "会话",
  "搜索会话": "搜索会话",
  "选择工作区": "选择工作区",
  "选择会话": "选择会话",
  "子代理": "子代理",
  "普通会话": "普通会话",
  "派出子代理时的人设": "派出子代理时的人设",
  "子代理默认不使用人设；复用时采用派出者本轮实际使用的人设。": "子代理默认不使用人设；复用时采用派出者本轮实际使用的人设。",
  "实际生效：{p0} · {p1}": "实际生效：{p0} · {p1}",
  "此范围暂无可配置项。": "此范围暂无可配置项。",
  "本会话：{p0}": "本会话：{p0}",
  "子代理：{p0}": "子代理：{p0}",
  "本会话人设与子代理规则": "本会话人设与子代理规则",
  "本会话：{p0}；子代理：{p1}": "本会话：{p0}；子代理：{p1}",
  "无效的规则标识。": "无效的规则标识。",
  "人设规则格式无效。": "人设规则格式无效。",
  "人设规则模式无效。": "人设规则模式无效。",
  "会话规则格式无效。": "会话规则格式无效。",
  "会话标题无效。": "会话标题无效。",
  "人设来源无效。": "人设来源无效。",
  "人设规则数量或格式无效。": "人设规则数量或格式无效。",
  "规则范围无效。": "规则范围无效。",
  "不是有效的私人灵魂 v2/v3 存档。": "不是有效的私人灵魂 v2/v3 存档。",
  "工作区已不存在，请刷新。": "工作区已不存在，请刷新。",
  "会话已不存在，请刷新。": "会话已不存在，请刷新。"
};
const en={
  "人设编辑内容": "Persona editor sections",
  "会话仅在对话顶部设置，优先于工作区和全局。": "Set conversations in the chat header; they override workspace and global defaults.",
  " · 有未保存修改": " · Unsaved changes",
  " · 默认": " · Default",
  "# 我是谁\n\n粘贴完整的人格、语气、价值观和交流习惯……": "# Who I am\n\nPaste the persona, tone, values, and communication preferences…",
  "{p0} 个人设 · {p1} 条个人记忆": "{p0} personas · {p1} personal memories",
  "{p0} 字符{p1}。{{…}} 保留原文。": "{p0} characters{p1}. {{…}} is kept literally.",
  "{p0} 条 → {p1} 条。{p2}": "{p0} entries → {p1} entries. {p2}",
  "{p0} 条个人记忆": "{p0} personal memories",
  "{p0} 条记忆{p1}": "{p0} memories{p1}",
  "“{p0}”的独立记忆库。自动记录还需通过模型语义审核。": "Personal memory library for “{p0}”. Automatic entries also require model review.",
  "一键去重": "Deduplicate",
  "不使用人设": "No persona",
  "不使用默认人设": "No default persona",
  "个人记忆": "Personal memories",
  "个人记忆内容": "Personal memory content",
  "个人记忆已保存，只属于当前人设。": "Memory saved for this persona only.",
  "人格": "Persona",
  "人格 / SOUL.md": "Persona / SOUL.md",
  "人格文本文件过大。": "The persona text file is too large.",
  "人格文本最多262144字符。": "Persona text is limited to 262144 characters.",
  "人设": "Persona",
  "人设列表": "Personas",
  "人设名称": "Persona name",
  "人设已保存。": "Persona saved.",
  "人设已删除，服务器已保留备份。": "Persona deleted; a backup was retained.",
  "人设：{p0}{p1}": "Persona: {p0}{p1}",
  "仅保存": "Save only",
  "优先": "Priority",
  "例如：温柔的伙伴": "For example: a caring companion",
  "例如：用户喜欢我叫他“小林”，这个称呼让他感觉亲切。": "For example: the user likes being called Alex because it feels friendly.",
  "保存并启用此人设": "Save and enable this persona",
  "保存记忆": "Save memory",
  "保留原有系统提示词，在其末尾追加人格与个人记忆。": "Keep the original system prompt and append the persona and personal memories at the end.",
  "先保存或选择一个人设，再管理它的个人记忆。": "Save or select a persona before managing its memories.",
  "全局默认人设": "Global default persona",
  "全局默认人设：{p0}": "Global default: {p0}",
  "全部类别": "All categories",
  "关系": "Relationships",
  "关闭本会话的人格与个人记忆": "Disable persona and personal memories in this conversation",
  "切换编辑对象会替换未保存的草稿。是否继续？": "Switching will replace your unsaved draft. Continue?",
  "删除": "Delete",
  "删除“{p0}”及其 {p1} 条记忆？服务器会先备份。": "Delete “{p0}” and its {p1} memories? A backup will be saved first.",
  "删除此人设及其记忆": "Delete this persona and its memories",
  "包含 {p0} 个人设、{p1} 条记忆。": "Contains {p0} personas and {p1} memories.",
  "取消导入": "Cancel import",
  "取消整理": "Cancel organization",
  "取消编辑": "Cancel editing",
  "合并导入：保留现有，冲突项作为副本": "Merge: keep existing entries; copy conflicting ones",
  "启用私人灵魂": "Enable Private Soul",
  "喜好": "Preferences",
  "导入 SOUL.md": "Import SOUL.md",
  "导入人格文本文件": "Import persona text",
  "导入全部": "Import all",
  "导入整体存档文件": "Import full archive",
  "导入预览": "Import preview",
  "导出全部": "Export all",
  "导出草稿": "Export draft",
  "将人格与个人记忆放在系统提示词前部，替换原有身份设定，保留工具和框架说明。": "Place the persona and personal memories first, replacing the original identity while keeping tool and framework guidance.",
  "已保存并设为全局默认人设。": "Saved as the global default persona.",
  "已去除重复的个人记忆。": "Duplicate memories removed.",
  "已启用": "Enabled",
  "已导入人格草稿，保存后生效。": "Persona draft imported. Save to apply it.",
  "已更新总开关。": "Global switch updated.",
  "已更新注入方式。": "Prompt mode updated.",
  "应用整理": "Apply organization",
  "建议已生成，确认后才会写入。": "Suggestions are ready. Confirm before applying them.",
  "搜索个人记忆": "Search personal memories",
  "故事": "Stories",
  "整体存档导入预览": "Full archive import preview",
  "整体存档已下载，包含所有人设、记忆和会话绑定。": "Archive downloaded with personas, memories, and conversation bindings.",
  "整体存档已导入。": "Archive imported.",
  "整体存档最多8 MiB。": "Archives must be no larger than 8 MiB.",
  "整体导入方式": "Archive import mode",
  "新增个人记忆": "Add personal memory",
  "新建人设": "New persona",
  "新建会替换未保存草稿，是否继续？": "Creating a persona will replace your unsaved draft. Continue?",
  "无": "None",
  "智能整理": "Organize with AI",
  "暂无符合条件的记忆。真实互动出现关系、喜好或故事时，人设可通过记忆工具记录。": "No matching memories. The persona can record relationships, preferences, and shared stories from real interactions with its memory tools.",
  "替换": "Replace",
  "替换、删除和整理前服务器会自动备份。验证失败不会写入。": "A backup is saved before replacement, deletion, or organization. Invalid data is never written.",
  "替换全部：恢复整个存档": "Replace all: restore the entire archive",
  "未单独绑定的会话跟随默认人设。聊天页的人设菜单可单独选择人设，切换时一起切换它的记忆。": "Conversations without a binding follow the default. The conversation persona menu switches both the persona and its memories.",
  "未启用": "Disabled",
  "本会话人设": "Conversation persona",
  "正在处理，请稍候…": "Working…",
  "此会话不使用人设": "No persona for this conversation",
  "每个人设拥有独立的跨会话记忆。只记录关系、喜好与共同故事；代码、任务进度和具体工作内容不进入长期记忆。": "Each persona has its own cross-conversation memories. Store relationships, preferences, and shared stories; code, task progress, and work details stay outside long-term memory.",
  "注入方式": "Prompt mode",
  "用人格与个人记忆替换系统提示词正文，保留原生工具接口和运行时上下文。": "Replace the system prompt body with the persona and personal memories, keeping native tool schemas and runtime context.",
  "确认导入": "Confirm import",
  "私人灵魂": "Private Soul",
  "私人灵魂-{p0}.json": "private-soul-{p0}.json",
  "私人灵魂人设与记忆管理": "Persona and personal memory management",
  "筛选记忆类别": "Filter memory categories",
  "编辑": "Edit",
  "编辑个人记忆": "Edit personal memory",
  "记忆已删除，服务器已保留备份。": "Memory deleted; a backup was retained.",
  "记忆已整理，原内容已自动备份。": "Memories organized; the original content was backed up.",
  "记忆整理预览": "Memory organization preview",
  "记忆类别": "Memory category",
  "请在设置 → 私人灵魂启用人设": "Enable personas in Settings → Private Soul",
  "请求失败（{p0}）": "Request failed ({p0})",
  "请选择“导出全部”生成的 JSON 存档。": "Choose a JSON archive created with Export all.",
  "跟随默认": "Follow default",
  "跟随默认 · ": "Follow default · ",
  "这个人设已被其他页面编辑，草稿仍保留。请导出草稿后重新读取并合并。": "This persona was edited elsewhere. Your draft is retained; export it, reload, and merge your changes.",
  "追加": "Append",
  "重新读取人设": "Reload persona",
  "重新读取会替换当前草稿，是否继续？": "Reloading will replace your draft. Continue?",
  "默认人设已切换，下一次请求生效。": "Default persona changed; it applies to the next request.",
  "导入文件过大，最多8 MiB。": "Import exceeds 8 MiB.",
  "请求不是有效的 JSON。": "Request is not valid JSON.",
  "请求必须使用 application/json。": "Requests must use application/json.",
  "写入需要有效的修订号。": "A valid revision is required to write.",
  "长期记忆只能属于关系、喜好或故事。": "Long-term memories must be relationships, preferences, or stories.",
  "记忆内容需为 1–{p0} 个字符。": "Memory content must be 1–{p0} characters.",
  "这条记忆含工作细节、代码、路径、网址或凭据。请只提炼关系、个人喜好或共同故事。": "This memory contains work details, code, paths, URLs, or credentials. Keep only relationships, personal preferences, and shared stories.",
  "记忆工具必须由真实会话智能体调用。": "Memory tools require a real conversation agent.",
  "当前会话未启用人设，请先选择人设。": "No persona is enabled in this conversation. Select a persona first.",
  "请求的人设已变更，未写入记忆。": "The requested persona changed; no memory was written.",
  "查询过长。": "Query is too long.",
  "分页参数无效。": "Invalid pagination.",
  "当前人设中没有这条记忆。": "This persona does not contain that memory.",
  "一次最多整理100条记忆。": "Organize at most 100 memories at once.",
  "记忆已变更，请重新读取再整理。": "Memories changed; read them again before organizing.",
  "整理结果未通过个人记忆审核；原记忆保持不变。": "Organization failed personal-memory review; original memories are unchanged.",
  "没有可用于记忆审核或整理的模型。": "No model is available for memory review or organization.",
  "模型服务尚未就绪。": "Model service is not ready.",
  "模型整理结果过长。": "Model organization response is too long.",
  "模型未返回有效的记忆 JSON；未写入任何内容。": "Model did not return valid memory JSON; nothing was written.",
  "智能整理预览最多处理 100 条；请先去重或导出后人工精简。不要把一页记忆当作完整库覆盖。": "Organization previews support at most 100 entries. Deduplicate, or export and reduce them first. Do not replace a library with a single page of memories.",
  "{p0}格式不正确或过长。": "{p0} is invalid or too long.",
  "无效的标识。": "Invalid identifier.",
  "不是有效的私人灵魂 v2 存档。": "Not a valid Private Soul v2 archive.",
  "最多保存 {p0} 个人设。": "At most {p0} personas can be stored.",
  "存档含重复人设 ID。": "Archive contains duplicate persona IDs.",
  "每个人设最多 {p0} 条记忆。": "Each persona supports at most {p0} memories.",
  "同一人设内有重复记忆 ID。": "Duplicate memory IDs within a persona.",
  "会话绑定过多。": "Too many conversation bindings.",
  "会话绑定指向不存在的人设。": "A conversation binding refers to a missing persona.",
  "默认人设不存在。": "Default persona is missing.",
  "人格开关或注入方式无效。": "Invalid persona switch or prompt mode.",
  "整体存档超过 8 MiB，请精简后再保存。": "Archive exceeds 8 MiB. Reduce it before saving.",
  "现有存档过大，拒绝覆盖。": "Existing archive is too large; overwrite refused.",
  "人设已不存在，请刷新后重试。": "Persona is missing. Refresh and try again.",
  "存档服务正在退出。": "Archive service is shutting down.",
  "内容已被其他页面或记忆操作更新。草稿仍保留，请重新读取后合并。": "Content was updated elsewhere. Your draft is retained; reload and merge it.",
  "先填写人格文本再启用。": "Enter persona text before enabling.",
  "开关格式错误。": "Invalid switch format.",
  "请选择私人灵魂整体 JSON 存档。": "Choose a complete Private Soul JSON archive.",
  "导入方式无效。": "Invalid import mode.",
  "不支持的操作。": "Unsupported operation.",
  "记忆已不存在。": "Memory no longer exists.",
  "这条记忆已更新，请重新读取。": "This memory changed; read it again.",
  "记忆不存在。": "Memory does not exist.",
  "整理结果无效。": "Invalid organization result.",
  "整理只能引用当前人设已有的记忆。": "Organization may only reference existing memories of the current persona.",
  "整理结果仍有重复条目。": "Organization result still contains duplicates.",
  "请使用受信任的 Harness 页面访问设置。": "Open settings from a trusted Harness page.",
  "操作未完成，请刷新后重试。": "Operation did not complete. Refresh and retry.",
  "操作未完成，请重试。": "Operation did not complete. Retry.",
  "翻译已取消或超时，请重试。": "Translation was cancelled or timed out. Retry.",
  "当前模型翻译失败，请检查 DeepSeek 的模型连接后重试。": "Translation failed. Check the DeepSeek model connection and retry.",
  "策略文件无法读取，Skill 和 MCP 已暂停。请恢复 policy.json 备份后重启服务。": "Policy file is unreadable; Skills and MCP are paused. Restore the policy.json backup and restart.",
  "人设规则已保存，下一次请求生效。": "Persona rules saved; they apply to the next request.",
  "人设已失效": "Persona unavailable",
  "人设内容为空": "Persona text is empty",
  "复用当前人设": "Reuse dispatcher persona",
  "会话单独设置": "Conversation override",
  "工作区默认": "Workspace default",
  "派生时的默认选择": "Default captured at creation",
  "全局默认": "Global default",
  "工作区默认人设": "Workspace default persona",
  "人设使用规则": "Persona rules",
  "会话选择优先于工作区和全局": "Conversation overrides workspace and global defaults",
  "规则范围": "Rule scope",
  "工作区": "Workspace",
  "会话": "Conversation",
  "搜索会话": "Search conversations",
  "选择工作区": "Choose workspace",
  "选择会话": "Choose conversation",
  "子代理": "Subagent",
  "普通会话": "Root conversation",
  "派出子代理时的人设": "Persona for dispatched subagents",
  "子代理默认不使用人设；复用时采用派出者本轮实际使用的人设。": "Subagents use no Soul persona by default. Reuse follows the dispatcher’s actual current request.",
  "实际生效：{p0} · {p1}": "Effective: {p0} · {p1}",
  "此范围暂无可配置项。": "Nothing to configure in this scope yet.",
  "本会话：{p0}": "This conversation: {p0}",
  "子代理：{p0}": "Subagents: {p0}",
  "本会话人设与子代理规则": "Conversation persona and subagent rules",
  "本会话：{p0}；子代理：{p1}": "Conversation: {p0}; subagents: {p1}",
  "无效的规则标识。": "Invalid rule identifier.",
  "人设规则格式无效。": "Invalid persona rule.",
  "人设规则模式无效。": "Invalid persona rule mode.",
  "会话规则格式无效。": "Invalid conversation rule.",
  "会话标题无效。": "Invalid conversation title.",
  "人设来源无效。": "Invalid persona source.",
  "人设规则数量或格式无效。": "Invalid persona rule format or count.",
  "规则范围无效。": "Invalid rule scope.",
  "不是有效的私人灵魂 v2/v3 存档。": "Not a valid Private Soul v2/v3 archive.",
  "工作区已不存在，请刷新。": "The workspace no longer exists; please refresh.",
  "会话已不存在，请刷新。": "The conversation no longer exists; please refresh."
};
let nativeTranslate = null, nativeLocale = null;
function tr(key, params) { return nativeTranslate ? nativeTranslate(key, params) : params ? key.replace(/\{(\w+)\}/g, (match, name) => name in params ? String(params[name]) : match) : key; }
function localeId() { const id = nativeLocale?.getSnapshot().active ?? 'zh'; try { return new Intl.Locale(id === 'zh' ? 'zh-CN' : id === 'pt' ? 'pt-BR' : id).toString(); } catch { return 'en'; } }
const escapePattern = value => [...value].map(c => c === String.fromCharCode(92) || '^$.*+?()[]{}|'.includes(c) ? String.fromCharCode(92) + c : c).join('');
const messagePatterns = Object.entries(zh).flatMap(([key, value]) => [value, en[key]].filter(text => text && /\{p\d+\}/.test(text)).map(text => ({key, names: [...text.matchAll(/\{(p\d+)\}/g)].map(match => match[1]), pattern: new RegExp('^' + text.split(/\{p\d+\}/).map(escapePattern).join('(.*?)') + '$', 's')})));
function messageText(value) {
  if (!value) return '';
  if (value.localized) return tr(value.localized.key, value.localized.params);
  const text = typeof value === 'string' ? value : value.message ?? String(value);
  if (Object.hasOwn(zh, text)) return tr(text);
  const reverse = Object.keys(en).find(key => en[key] === text); if (reverse) return tr(reverse);
  const prefix = text.match(/^(?:Error: |[A-Z_]+: )/)?.[0] ?? '', body = text.slice(prefix.length);
  if (Object.hasOwn(zh, body)) return prefix + tr(body);
  for (const row of messagePatterns) { const match = row.pattern.exec(body); if (match) return prefix + tr(row.key, Object.fromEntries(row.names.map((name, i) => [name, match[i + 1]]))); }
  return text;
}
function installLocale(ctx) {
  const release = ctx.locale.register(NS, { zh, en }), bound = ctx.locale.bind(NS);
  nativeTranslate = bound; nativeLocale = ctx.locale;
  return () => { if (nativeTranslate === bound) { nativeTranslate = null; nativeLocale = null; } release(); };
}
/* i18n:end */
    const BASE='/private-soul/v2',labels={get relationship(){return tr("关系");},get preference(){return tr("喜好");},get story(){return tr("故事");}};
    const promptModes=[
      {id:'priority',get label(){return tr("优先");},get description(){return tr("将人格与个人记忆放在系统提示词前部，替换原有身份设定，保留工具和框架说明。");}},
      {id:'complete',get label(){return tr("替换");},get description(){return tr("用人格与个人记忆替换系统提示词正文，保留原生工具接口和运行时上下文。");}},
      {id:'append',get label(){return tr("追加");},get description(){return tr("保留原有系统提示词，在其末尾追加人格与个人记忆。");}},
    ];
    const css=`
.soul-page{box-sizing:border-box;width:100%;min-width:0;display:flex;flex-direction:column;gap:16px;padding:6px 0;color:var(--dsw-alias-label-primary);container-type:inline-size}
.soul-page *{box-sizing:border-box}
.soul-page h2,.soul-page h3{margin:0;font-weight:600}
.soul-page h2{font-size:18px;line-height:1.4}
.soul-page h3{font-size:14px;line-height:1.5}
.soul-hint{font-size:12px;line-height:1.7;color:var(--dsw-alias-label-secondary);margin:0;overflow-wrap:anywhere}
.soul-row{display:flex;align-items:center;flex-wrap:wrap;gap:8px;min-width:0}
.soul-card{min-width:0;border:1px solid var(--dsw-alias-border-l2);border-radius:var(--dsw-radius-md);padding:14px;display:flex;flex-direction:column;gap:12px}
.soul-text{min-width:0;max-width:100%;font:inherit;font-size:13px;line-height:1.5;border:.5px solid var(--dsw-alias-border-l4);border-radius:var(--dsw-radius-md);background:var(--dsw-alias-bg-layer-1);color:inherit;padding:8px 10px;margin:0}
.soul-text:focus{border-color:var(--dsw-alias-state-business-primary)}

.soul-danger{color:var(--dsw-alias-state-error-primary)}
.soul-input{width:100%;min-width:0}
.soul-text{width:100%;height:clamp(180px,28dvh,320px);min-height:180px;max-height:65dvh;resize:vertical;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;line-height:1.7;tab-size:2}
.soul-memory-text{height:110px;min-height:90px;max-height:40dvh}
.soul-badge{flex:none;font-size:11px;line-height:1.5;border-radius:20px;padding:4px 9px;background:color-mix(in srgb,var(--dsw-alias-state-business-primary) 20%,transparent)}
.soul-settings{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,210px),1fr));gap:12px;align-items:end}
.soul-field{min-width:0;display:flex;flex-direction:column;gap:7px;font-size:13px}
.soul-field select{width:100%}
.soul-mode-menu{width:100%;min-width:0}
.soul-mode-trigger{width:100%;display:flex;align-items:center;justify-content:space-between;gap:8px;text-align:left}
.soul-mode-options{min-width:140px}
.soul-mode-option{width:100%;min-width:0}
.soul-layout{min-width:0;display:flex;flex-direction:column;gap:12px}
.soul-personas{display:flex;flex-wrap:wrap;gap:8px;min-width:0;max-height:150px;overflow:auto;scrollbar-gutter:stable;padding:2px}
.soul-persona{height:auto;min-height:58px;padding:8px 10px;flex:0 1 180px;min-width:0;max-width:100%;text-align:left;display:flex;flex-direction:column;gap:4px}
.soul-persona-name{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.soul-persona[aria-pressed=true]{border-color:var(--dsw-alias-state-business-primary);background:color-mix(in srgb,var(--dsw-alias-state-business-primary) 16%,transparent)}
.soul-persona small{font-size:11px;color:var(--dsw-alias-label-secondary)}
.soul-editor{width:100%;min-width:0}
.soul-editor label{font-size:13px;font-weight:500}
.soul-editor-tabs{width:100%}.soul-editor-panel{display:flex;flex-direction:column;gap:12px;min-width:0}
.soul-actions{display:flex;align-items:center;flex-wrap:wrap;gap:8px;min-width:0}
.soul-actions-secondary{padding-top:4px}
.soul-error,.soul-success{font-size:13px;line-height:1.6;white-space:pre-wrap;margin:0;overflow-wrap:anywhere}
.soul-error{color:var(--dsw-alias-state-error-primary)}.soul-success{color:var(--dsw-alias-state-success-primary)}
.soul-memory{min-width:0;display:flex;flex-direction:column;gap:7px;padding:11px 0;border-bottom:1px solid var(--dsw-alias-border-l2)}
.soul-memory p{white-space:pre-wrap;margin:0;line-height:1.7;font-size:13px;overflow-wrap:anywhere}
.soul-preview{max-height:260px;overflow:auto}
.soul-memory-filter .soul-input{height:36px}
.soul-memory-filter{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;min-width:0}
/* Match the workspace and agent-preset chips; reuse the native Menu card. */
.soul-chip{box-sizing:border-box;min-width:0;max-width:100%;display:inline-flex;align-items:center}
.soul-chip-anchor{min-width:54px;max-width:100%;display:inline-flex}
.soul-chip-label{text-overflow:ellipsis;white-space:nowrap;min-width:0;overflow:hidden}
.soul-menu-item{display:flex;flex-direction:column;gap:2px;min-width:0;max-width:280px}
.soul-menu-name{overflow-wrap:anywhere}
.soul-menu-description{color:var(--dsw-alias-label-secondary);white-space:normal;overflow-wrap:anywhere;font-size:12px;line-height:16px}
.soul-workspace-option{display:flex;flex-direction:column;gap:3px;min-width:0;max-width:100%}
.soul-workspace-path{color:var(--dsw-alias-label-caption);font-size:11px;line-height:15px;font-weight:400;white-space:normal;overflow-wrap:anywhere}
@container(max-width:420px){.soul-card{padding:12px}.soul-actions>.soul-primary{flex:1 1 100%}.soul-actions>button{flex:1 1 auto}.soul-persona{flex:1 1 140px}.soul-memory-filter{grid-template-columns:minmax(0,1fr)}.soul-text{height:210px;min-height:160px}}
/* Layout only: controls, menus, focus and hover come from DSH primitives. */
.soul-native-select{width:100%;min-width:0}
.soul-select-trigger{width:100%;justify-content:space-between;gap:8px;text-align:left}
.soul-ellipsis{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}
.soul-rule-panel,.soul-rule-target{display:flex;flex-direction:column;gap:12px;min-width:0}
.soul-persona-trigger{max-width:min(100%,380px);min-width:0;gap:6px}
.soul-chip-secondary{font-size:12px;color:inherit;opacity:.72;padding-left:6px;border-left:1px solid var(--dsw-alias-border-l2);max-width:190px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
@media(max-width:650px){.soul-persona-trigger{max-width:250px}.soul-chip-secondary{max-width:110px}.soul-card{padding:12px}}

`;
    async function request(path,data){
      const response=await fetch(BASE+path,{method:data===undefined?'GET':'POST',cache:'no-store',credentials:'same-origin',...(data===undefined?{}:{headers:{'Content-Type':'application/json'},body:JSON.stringify(data)})});
      const value=await response.json();if(!response.ok)throw new Error(value.error||tr("请求失败（{p0}）", {p0: response.status}));if(path==='/action')window.dispatchEvent(new Event('private-soul-library-changed'));return value;
    }
    function useLibrary(sessionId,compact=false){
      const [view,setView]=React.useState(null),[error,setError]=React.useState('');
      const current=React.useRef(null),live=React.useRef(true),generation=React.useRef(0);
      async function load(force=false){
        const epoch=generation.current;
        try{
          const next=await request(`/state?compact=${compact?'1':'0'}${sessionId?'&sessionId='+encodeURIComponent(sessionId):''}${!force&&current.current?'&since='+current.current.revision:''}`);
          if(!live.current||epoch!==generation.current)return;
          if(!next.notModified&&(!current.current||next.revision>=current.current.revision)){current.current=next;setView(next);}setError('');return current.current;
        }catch(cause){if(live.current&&epoch===generation.current)setError(cause.message);}
      }
      React.useEffect(()=>{generation.current++;live.current=true;current.current=null;setView(null);load(true);const changed=()=>load(true);window.addEventListener('private-soul-library-changed',changed);const timer=setInterval(()=>{if(!document.hidden)load();},2500);return()=>{generation.current++;live.current=false;clearInterval(timer);window.removeEventListener('private-soul-library-changed',changed);};},[sessionId,compact]);
      function accept(value){if(live.current){current.current=value;setView(value);setError('');}}
      return {view,error,load,accept,current};
    }
    const button=(text,click,disabled=false,kind='')=>h(Button,{variant:kind==='primary'?'primary':'outline',className:kind==='danger'?'soul-danger':kind==='primary'?'soul-primary':undefined,onClick:click,disabled},text);
    function download(name,value,mime='application/json;charset=utf-8'){const url=URL.createObjectURL(new Blob([value],{type:mime}));const link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}

    // Keep native menu rendering/keyboard behavior; pin its portal to this exact button.
    // Numeric viewport coordinates also work when browser CSS anchors are unavailable.
    let floatingMenuSequence=0;
    function AnchoredMenu(props){
      const identity=React.useRef(null),close=React.useRef(props.onClose);close.current=props.onClose;
      if(identity.current===null)identity.current='soul-floating-menu-'+(++floatingMenuSequence);
      const className=identity.current;
      React.useLayoutEffect(()=>{
        if(!props.open)return;
        const list=document.querySelector('.'+className),anchor=props.anchorRef?.current;
        if(!list||!anchor)return;
        let frame,previousBox='';
        const position=()=>{
          if(!anchor.isConnected||!anchor.getClientRects().length){close.current();return;}
          const box=anchor.getBoundingClientRect(),margin=12,gap=4,width=window.innerWidth,height=window.innerHeight;previousBox=[box.x,box.y,box.width,box.height].join(',');
          Object.assign(list.style,{positionAnchor:'auto',positionTryFallbacks:'none',top:'12px',left:'12px',right:'auto',bottom:'auto',margin:'0'});
          if(props.minWidthFromAnchor)list.style.minWidth=Math.min(box.width,width-2*margin)+'px';
          const viewport=list.querySelector(':scope > [role="presentation"]'),natural=list.offsetHeight+Math.max(0,(viewport?.scrollHeight??0)-(viewport?.clientHeight??0));
          const below=Math.max(0,height-margin-box.bottom-gap),above=Math.max(0,box.top-gap-margin),useBelow=natural<=below||below>=above;
          const room=useBelow?below:above;list.style.maxHeight=room+'px';
          const bounds=list.getBoundingClientRect(),x=props.align==='end'?box.right-bounds.width:box.left;
          list.style.left=Math.max(margin,Math.min(x,width-margin-bounds.width))+'px';
          list.style.top=Math.max(margin,useBelow?box.bottom+gap:box.top-gap-bounds.height)+'px';
          list.dataset.menuOwner=anchor.getAttribute('aria-label')??'';
        };
        const scrolled=event=>{if(event.target instanceof Element&&event.target.closest('[role="menu"]'))return;const box=anchor.getBoundingClientRect();if([box.x,box.y,box.width,box.height].join(',')!==previousBox)close.current();};
        const resized=()=>close.current();position();
        const observer=new ResizeObserver(position);observer.observe(anchor);observer.observe(list);
        const track=()=>{if(!anchor.isConnected){close.current();return;}const box=anchor.getBoundingClientRect();if([box.x,box.y,box.width,box.height].join(',')!==previousBox)position();frame=requestAnimationFrame(track);};frame=requestAnimationFrame(track);
        document.addEventListener('scroll',scrolled,true);window.addEventListener('resize',resized);window.visualViewport?.addEventListener('resize',resized);
        return()=>{cancelAnimationFrame(frame);observer.disconnect();document.removeEventListener('scroll',scrolled,true);window.removeEventListener('resize',resized);window.visualViewport?.removeEventListener('resize',resized);};
      },[props.open,props.anchorRef,props.minWidthFromAnchor,props.align,className]);
      return h(Menu,{...props,anchorRef:undefined,listClassName:[props.listClassName,className].filter(Boolean).join(' ')});
    }
    function PromptModeSelect({value,disabled,onChange}){
      const [open,setOpen]=React.useState(false),anchorRef=React.useRef(null);
      React.useEffect(()=>{if(disabled)setOpen(false);},[disabled]);
      const selected=promptModes.find(row=>row.id===value)??promptModes[0];
      return h(AnchoredMenu,{anchorRef,open,portal:true,minWidthFromAnchor:true,className:'soul-mode-menu',listClassName:'soul-mode-options',onClose:()=>setOpen(false),
        anchor:h(Tooltip,{label:selected.description,side:'bottom',portal:true,delayMs:400,disabled:open,maxWidth:320},
          h(Button,{ref:anchorRef,id:'soul-prompt-mode',variant:'outline',className:'soul-mode-trigger',disabled,'aria-label':tr("注入方式"),'aria-haspopup':'menu','aria-expanded':open,onClick:()=>setOpen(current=>!current)},selected.label,h(IconChevronDownOutlineRegular,{size:14,'aria-hidden':true})))},
        ...promptModes.map(row=>h(Tooltip,{key:row.id,label:row.description,side:'right',portal:true,delayMs:350,focusDelayMs:350,maxWidth:320},
          h('div',{className:'soul-mode-option'},h(MenuItemButton,{current:row.id===selected.id,onSelect:()=>{setOpen(false);onChange(row.id);}},row.label)))));
    }

    function SoulEditor(){
      const library=useLibrary(),view=library.view;
      const [selected,setSelected]=React.useState(null),[draft,setDraft]=React.useState({name:'',soul:''}),[tab,setTab]=React.useState('persona');
      const baseline=React.useRef({id:null,name:'',soul:''});
      const [busy,setBusy]=React.useState(false),[error,setError]=React.useState(''),[message,setMessage]=React.useState('');
      const [filter,setFilter]=React.useState(''),[kindFilter,setKindFilter]=React.useState('');
      const [memoryDraft,setMemoryDraft]=React.useState({id:null,kind:'relationship',content:''});
      const [importPreview,setImportPreview]=React.useState(null),[strategy,setStrategy]=React.useState('merge'),[organize,setOrganize]=React.useState(null);
      const importInput=React.useRef(null),soulInput=React.useRef(null);
      const editorId=React.useId(),editorPanel='soul-editor-panel-'+editorId;
      const persona=view?.personas.find(row=>row.id===selected);
      const dirty=draft.name!==baseline.current.name||draft.soul!==baseline.current.soul;
      function choose(id,force=false){
        if(!force&&dirty&&!window.confirm(tr("切换编辑对象会替换未保存的草稿。是否继续？")))return;
        const row=library.current.current?.personas.find(item=>item.id===id),values={name:row?.name??'',soul:row?.soul??''};
        baseline.current={id:id??null,...values};setSelected(id??null);setDraft(values);setMemoryDraft({id:null,kind:'relationship',content:''});setOrganize(null);setError('');setMessage('');
      }
      React.useEffect(()=>{
        if(!view)return;
        if(selected===null&&baseline.current.id===null&&!dirty&&view.personas.length)choose(view.defaultPersonaId??view.personas[0].id,true);
        else if(selected&&!persona&&!dirty)choose(view.defaultPersonaId,true);
        else if(persona&&!dirty&&(persona.name!==baseline.current.name||persona.soul!==baseline.current.soul))choose(selected,true);
      },[view]);
      async function act(action,data,revision=library.current.current?.revision){const result=await request('/action',{action,data,expectedRevision:revision});library.accept(result.view);return result;}
      async function run(fn,success){if(busy)return;setBusy(true);setError('');setMessage('');try{await fn();if(success)setMessage(success);}catch(cause){setError(cause.message);await library.load(true);}finally{setBusy(false);}}
      async function savePersona(activate){
        const old=library.current.current?.personas.find(row=>row.id===selected);
        if(selected&&old&&(old.name!==baseline.current.name||old.soul!==baseline.current.soul))throw new Error(tr("这个人设已被其他页面编辑，草稿仍保留。请导出草稿后重新读取并合并。"));
        const result=await act('persona-save',{id:selected,...draft,activate});choose(result.personaId,true);
      }
      async function importAll(event){const file=event.target.files?.[0];event.target.value='';if(!file)return;try{if(file.size>8*1024*1024)throw new Error(tr("整体存档最多8 MiB。"));const archive=JSON.parse(await file.text());if(archive.format!=='private-soul-backup'||![2,3].includes(archive.version)||!Array.isArray(archive.data?.personas))throw new Error(tr("请选择“导出全部”生成的 JSON 存档。"));setImportPreview(archive);setStrategy('merge');setError('');}catch(cause){setError(cause.message);}}
      async function importSoul(event){const file=event.target.files?.[0];event.target.value='';if(!file)return;try{if(file.size>1024*1024)throw new Error(tr("人格文本文件过大。"));const soul=await file.text();if(soul.length>262144)throw new Error(tr("人格文本最多262144字符。"));setDraft(value=>({...value,soul}));setMessage(tr("已导入人格草稿，保存后生效。"));}catch(cause){setError(cause.message);}}
      const disabled=busy||!view,total=view?.personas.reduce((n,row)=>n+row.memories.length,0)??0;
      const rows=[...(persona?.memories??[])].filter(row=>(!kindFilter||row.kind===kindFilter)&&(!filter||row.content.toLowerCase().includes(filter.toLowerCase()))).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));
      const personaPanel=h(React.Fragment,null,
        h('label',{htmlFor:'soul-persona-name'},tr("人设名称")),h(Input,{id:'soul-persona-name',className:'soul-input',value:draft.name,maxLength:80,disabled,onChange:e=>setDraft(value=>({...value,name:e.target.value})),placeholder:tr("例如：温柔的伙伴")}),
        h('label',{htmlFor:'private-soul-text'},tr("人格 / SOUL.md")),h('textarea',{id:'private-soul-text',className:'soul-input soul-text',value:draft.soul,disabled,onChange:e=>setDraft(value=>({...value,soul:e.target.value})),placeholder:tr("# 我是谁\n\n粘贴完整的人格、语气、价值观和交流习惯……"),spellCheck:false}),
        h('p',{className:'soul-hint'},tr("{p0} 字符{p1}。{{…}} 保留原文。", {p0: draft.soul.length.toLocaleString(localeId()), p1: dirty?tr(" · 有未保存修改"):''})),
        h('div',{className:'soul-actions'},button(tr("保存并启用此人设"),()=>run(()=>savePersona(true),tr("已保存并设为全局默认人设。")),disabled||!draft.name.trim()||!draft.soul.trim(),'primary'),button(tr("仅保存"),()=>run(()=>savePersona(false),tr("人设已保存。")),disabled||!draft.name.trim())),
        h('div',{className:'soul-actions soul-actions-secondary'},button(tr("导入 SOUL.md"),()=>soulInput.current.click(),disabled),button(tr("导出草稿"),()=>download('SOUL.md',draft.soul,'text/markdown;charset=utf-8'),!draft.soul),selected?button(tr("重新读取人设"),()=>{if(!dirty||window.confirm(tr("重新读取会替换当前草稿，是否继续？")))run(async()=>{await library.load(true);choose(selected,true);});},disabled):null,h('input',{ref:soulInput,type:'file',accept:'.md,.txt,text/plain',hidden:true,onChange:importSoul,'aria-label':tr("导入人格文本文件")})),
        selected?h('div',{className:'soul-actions'},button(tr("删除此人设及其记忆"),()=>{if(window.confirm(tr("删除“{p0}”及其 {p1} 条记忆？服务器会先备份。", {p0: persona?.name, p1: persona?.memories.length??0})))run(async()=>{await act('persona-delete',{id:selected});choose(library.current.current.defaultPersonaId,true);},tr("人设已删除，服务器已保留备份。"));},disabled,'danger')):null);
      const memoryPanel=!persona?h('p',{className:'soul-hint'},tr("先保存或选择一个人设，再管理它的个人记忆。")):h(React.Fragment,null,
        h('p',{className:'soul-hint'},tr("“{p0}”的独立记忆库。自动记录还需通过模型语义审核。", {p0: persona.name})),
        h('div',{className:'soul-memory-filter'},h(Input,{className:'soul-input',value:filter,onChange:e=>setFilter(e.target.value),placeholder:tr("搜索个人记忆"),'aria-label':tr("搜索个人记忆")}),h(NativeSelect,{label:tr("筛选记忆类别"),value:kindFilter||'all',disabled:busy,options:[{id:'all',label:tr("全部类别")},...Object.entries(labels).map(([id,label])=>({id,label}))],onChange:value=>setKindFilter(value==='all'?'':value)})),
        h('div',{className:'soul-row'},button(tr("一键去重"),()=>run(()=>act('memory-dedupe',{personaId:selected}),tr("已去除重复的个人记忆。")),disabled),button(tr("智能整理"),()=>run(async()=>{setOrganize(await request('/organize-preview',{personaId:selected}));},tr("建议已生成，确认后才会写入。")),disabled||!persona.memories.length)),
        organize?h('div',{className:'soul-card',role:'dialog','aria-label':tr("记忆整理预览")},h('h3',null,tr("记忆整理预览")),h('p',{className:'soul-hint'},tr("{p0} 条 → {p1} 条。{p2}", {p0: persona.memories.length, p1: organize.memories.length, p2: organize.note})),h('div',{className:'soul-preview'},...organize.memories.map((row,index)=>h('p',{key:index,className:'soul-hint'},`${labels[row.kind]}：${row.content}`))),h('div',{className:'soul-row'},button(tr("应用整理"),()=>run(async()=>{await act('memory-organize',{personaId:selected,memories:organize.memories},organize.revision);setOrganize(null);},tr("记忆已整理，原内容已自动备份。")),busy,'primary'),button(tr("取消整理"),()=>setOrganize(null),busy))):null,
        h('div',{className:'soul-card'},h('h3',null,memoryDraft.id?tr("编辑个人记忆"):tr("新增个人记忆")),h(NativeSelect,{label:tr("记忆类别"),value:memoryDraft.kind,disabled,options:Object.entries(labels).map(([id,label])=>({id,label})),onChange:kind=>setMemoryDraft(value=>({...value,kind}))}),h('textarea',{className:'soul-input soul-text soul-memory-text',value:memoryDraft.content,onChange:e=>setMemoryDraft(value=>({...value,content:e.target.value})),placeholder:tr("例如：用户喜欢我叫他“小林”，这个称呼让他感觉亲切。"),'aria-label':tr("个人记忆内容"),disabled}),h('div',{className:'soul-row'},button(tr("保存记忆"),()=>run(async()=>{await act('memory-save',{personaId:selected,...memoryDraft});setMemoryDraft({id:null,kind:'relationship',content:''});},tr("个人记忆已保存，只属于当前人设。")),disabled||!memoryDraft.content.trim(),'primary'),memoryDraft.id?button(tr("取消编辑"),()=>setMemoryDraft({id:null,kind:'relationship',content:''}),busy):null)),
        ...rows.map(row=>h('article',{key:row.id,className:'soul-memory','data-memory-id':row.id},h('div',{className:'soul-row'},h('span',{className:'soul-badge'},labels[row.kind]),h('span',{className:'soul-hint'},new Date(row.updatedAt).toLocaleDateString(localeId()))),h('p',null,row.content),h('div',{className:'soul-row'},button(tr("编辑"),()=>setMemoryDraft({id:row.id,kind:row.kind,content:row.content,expectedVersion:row.version}),busy),button(tr("删除"),()=>run(()=>act('memory-delete',{personaId:selected,id:row.id}),tr("记忆已删除，服务器已保留备份。")),busy,'danger')))),
        !rows.length?h('p',{className:'soul-hint'},tr("暂无符合条件的记忆。真实互动出现关系、喜好或故事时，人设可通过记忆工具记录。")):null);
      return h('section',{className:'soul-page','aria-label':tr("私人灵魂人设与记忆管理")},
        h('div',{className:'soul-row'},h('h2',null,tr("私人灵魂")),h('span',{className:'soul-badge',role:'status'},view?.enabled?tr("已启用"):tr("未启用")),h('span',{className:'soul-hint'},tr("{p0} 个人设 · {p1} 条个人记忆", {p0: view?.personas.length??0, p1: total}))),
        h('p',{className:'soul-hint'},tr("每个人设拥有独立的跨会话记忆。只记录关系、喜好与共同故事；代码、任务进度和具体工作内容不进入长期记忆。")),
        h('div',{className:'soul-card'},h('div',{className:'soul-row'},h(Switch,{checked:!!view?.enabled,disabled,label:tr("启用私人灵魂"),onChange:enabled=>run(()=>act('settings',{enabled}),tr("已更新总开关。"))}),h('span',null,tr("启用私人灵魂"))),h('div',{className:'soul-field'},h('span',null,tr("注入方式")),h(PromptModeSelect,{value:view?.mode??'priority',disabled,onChange:mode=>run(()=>act('settings',{mode}),tr("已更新注入方式。"))}))),
        h(RuleEditor,{library,disabled,onWrite:data=>run(()=>act('rule-set',data),tr("人设规则已保存，下一次请求生效。"))}),
        h('div',{className:'soul-actions'},button(tr("新建人设"),()=>{if(!dirty||window.confirm(tr("新建会替换未保存草稿，是否继续？"))){baseline.current={id:'new',name:'',soul:''};setSelected(null);setDraft({name:'',soul:''});setTab('persona');}},disabled),button(tr("导出全部"),()=>run(async()=>{download(tr("私人灵魂-{p0}.json", {p0: new Date().toISOString().slice(0,10)}),JSON.stringify(await request('/export'),null,2));},tr("整体存档已下载，包含所有人设、记忆和会话绑定。")),disabled||dirty),button(tr("导入全部"),()=>importInput.current.click(),disabled||dirty),h('input',{ref:importInput,type:'file',accept:'.json,application/json',onChange:importAll,hidden:true,'aria-label':tr("导入整体存档文件")})),
        importPreview?h('div',{className:'soul-card',role:'dialog','aria-label':tr("整体存档导入预览")},h('h3',null,tr("导入预览")),h('p',{className:'soul-hint'},tr("包含 {p0} 个人设、{p1} 条记忆。", {p0: importPreview.data.personas.length, p1: importPreview.data.personas.reduce((n,row)=>n+(row.memories?.length??0),0)})),h(NativeSelect,{label:tr("整体导入方式"),value:strategy,disabled:busy,options:[{id:'merge',label:tr("合并导入：保留现有，冲突项作为副本")},{id:'replace',label:tr("替换全部：恢复整个存档")}],onChange:setStrategy}),h('p',{className:'soul-hint'},tr("替换、删除和整理前服务器会自动备份。验证失败不会写入。")),h('div',{className:'soul-row'},button(tr("确认导入"),()=>run(async()=>{await act('import',{archive:importPreview,strategy});setImportPreview(null);choose(library.current.current.defaultPersonaId,true);},tr("整体存档已导入。")),busy,'primary'),button(tr("取消导入"),()=>setImportPreview(null),busy))):null,
        h('div',{className:'soul-layout'},view?.personas.length?h('aside',{className:'soul-personas','aria-label':tr("人设列表")},...view.personas.map(row=>h(Button,{variant:'outline',key:row.id,className:'soul-persona','aria-pressed':selected===row.id,onClick:()=>choose(row.id),disabled:busy,title:row.name},h('span',{className:'soul-persona-name'},row.name),h('small',null,tr("{p0} 条记忆{p1}", {p0: row.memories.length, p1: view.defaultPersonaId===row.id?tr(" · 默认"):''}))))):null,h('div',{className:'soul-card soul-editor'},h(SegmentedTabs,{className:'soul-editor-tabs',label:tr("人设编辑内容"),value:tab,size:'sm',onChange:setTab,items:[['persona',tr("人格")],['memory',tr("个人记忆")]].map(([value,label])=>({value,label,id:editorId+'-'+value,panelId:editorPanel}))}),h('div',{id:editorPanel,role:'tabpanel','aria-labelledby':editorId+'-'+tab,className:'soul-editor-panel'},tab==='persona'?personaPanel:memoryPanel))),
        busy?h('p',{className:'soul-hint',role:'status'},tr("正在处理，请稍候…")):null,library.error?h('p',{className:'soul-error',role:'alert'},messageText(library.error)):null,error?h(Toast,{key:error,text:messageText(error),icon:h(IconWarningOutlineRegular,{size:16}),holdMs:6000,onDone:()=>setError('')}):null,message?h(Toast,{key:message,text:messageText(message),tone:'success',onDone:()=>setMessage('')}):null);
    }

    function ruleValue(rule){return rule?.mode==='persona'?'persona:'+rule.personaId:rule?.mode??'follow';}
    function ruleFromValue(value){return value.startsWith('persona:')?{mode:'persona',personaId:value.slice(8)}:{mode:value};}
    function ruleName(rule,view){
      if(rule?.mode==='persona')return view?.personas.find(row=>row.id===rule.personaId)?.name??tr("人设已失效");
      return rule?.mode==='parent'?tr("复用当前人设"):rule?.mode==='follow'?tr("跟随默认"):tr("不使用人设");
    }
    function sourceName(source,view){
      if(source?.scope==='session')return tr("会话单独设置");
      if(source?.scope==='workspace')return tr("工作区默认");
      if(source?.scope==='subagent')return tr("派生时的默认选择");
      return tr("全局默认");
    }
    function ruleChoices(view,{children=false,follow=true}={}){
      return [
        ...(follow?[{id:'follow',label:tr("跟随默认")}]:[]),
        {id:'none',label:tr("不使用人设")},
        ...(children?[{id:'parent',label:tr("复用当前人设")}]:[]),
        ...(view?.personas??[]).map(row=>({id:'persona:'+row.id,label:row.name})),
      ];
    }
    function NativeSelect({label,value,options,onChange,disabled=false}){
      const [open,setOpen]=React.useState(false),anchorRef=React.useRef(null);
      React.useEffect(()=>{if(disabled)setOpen(false);},[disabled]);
      const current=options.find(row=>row.id===value);
      const items=options.map(row=>({...row,label:row.description?h('span',{className:'soul-workspace-option'},h('span',null,row.label),h('small',{className:'soul-workspace-path'},row.description)):row.label}));
      return h(AnchoredMenu,{anchorRef,open,items,selectedId:value,onSelect:id=>{setOpen(false);onChange(id);},onClose:()=>setOpen(false),portal:true,minWidthFromAnchor:true,className:'soul-native-select',
        anchor:h(Button,{ref:anchorRef,variant:'outline',className:'soul-select-trigger',disabled,'aria-label':label,'aria-haspopup':'menu','aria-expanded':open,onClick:()=>setOpen(v=>!v)},h('span',{className:'soul-ellipsis'},current?.label??tr("人设已失效")),h(IconChevronDownOutlineRegular,{size:14,'aria-hidden':true}))});
    }
    function RuleEditor({library,disabled,onWrite}){
      const view=library.view,[scope,setScope]=React.useState('global'),[target,setTarget]=React.useState('');
      const uid=React.useId(),panel='soul-rules-'+uid;
      const spaces=view?.catalog?.workspaces??[];
      const ids=spaces.map(row=>row.id).join(',');
      React.useEffect(()=>{if(!spaces.some(row=>row.id===target))setTarget(spaces[0]?.id??'');},[ids,target]);
      const record=view?.workspaces?.[target];
      const persona=scope==='global'?(view?.defaultPersonaId?{mode:'persona',personaId:view.defaultPersonaId}:{mode:'none'}):record?.persona??{mode:'follow'};
      const children=scope==='global'?view?.subagentDefault??{mode:'none'}:record?.children??{mode:'follow'};
      const locked=disabled||(scope==='workspace'&&!spaces.some(row=>row.id===target));
      const choose=(kind,rule)=>onWrite({scope,id:scope==='global'?undefined:target,target:kind,rule});
      const selfLabel=scope==='global'?tr("全局默认人设"):tr("工作区默认人设");
      return h('section',{className:'soul-card','aria-label':tr("人设使用规则")},
        h('div',{className:'soul-row'},h('h3',null,tr("人设使用规则")),h('span',{className:'soul-hint'},tr("会话仅在对话顶部设置，优先于工作区和全局。"))),
        h(SegmentedTabs,{label:tr("规则范围"),size:'sm',value:scope,onChange:setScope,items:[['global',tr("全局默认")],['workspace',tr("工作区")]].map(([value,label])=>({value,label,id:panel+'-'+value,panelId:panel}))}),
        h('div',{id:panel,role:'tabpanel','aria-labelledby':panel+'-'+scope,className:'soul-rule-panel'},
          h('div',{className:'soul-rule-target'},
            h(NativeSelect,{label:tr("选择工作区"),value:target,disabled:disabled||scope==='global'||!spaces.length,options:spaces.map(row=>({id:row.id,label:row.title||row.id,description:row.path})),onChange:setTarget})),
          h('div',{className:'soul-settings'},
            h('div',{className:'soul-field'},h('span',null,selfLabel),h(NativeSelect,{label:selfLabel,value:ruleValue(persona),options:ruleChoices(view,{follow:scope!=='global'}),disabled:locked,onChange:value=>choose('persona',ruleFromValue(value))})),
            h('div',{className:'soul-field'},h('span',null,tr("派出子代理时的人设")),h(NativeSelect,{label:tr("派出子代理时的人设"),value:ruleValue(children),options:ruleChoices(view,{children:true,follow:scope!=='global'}),disabled:locked,onChange:value=>choose('children',ruleFromValue(value))}))),
          h('p',{className:'soul-hint'},tr("子代理默认不使用人设；复用时采用派出者本轮实际使用的人设。")),
          scope==='workspace'&&!spaces.length?h('p',{className:'soul-hint'},tr("此范围暂无可配置项。")):null));
    }

    function PersonaMenu({soulSessionId}){
      const library=useLibrary(soulSessionId,true),[busy,setBusy]=React.useState(false),[error,setError]=React.useState(''),[open,setOpen]=React.useState(false);
      const anchorRef=React.useRef(null);
      const view=library.view;
      React.useEffect(()=>{setOpen(false);setError('');},[soulSessionId,view?.enabled]);
      if(!view)return null;
      const effective=view.effective,childRule=view.children?.rule??{mode:'none'};
      const currentName=effective?.status==='missing'?tr("人设已失效"):effective?.status==='empty'?tr("人设内容为空"):ruleName(effective?.rule,view);
      const childName=ruleName(childRule,view);
      const label=(name,description)=>h('span',{className:'soul-menu-item'},h('span',{className:'soul-menu-name'},name),h('span',{className:'soul-menu-description'},description));
      const group=(target,children)=>ruleChoices(view,{children}).map(row=>({...row,id:target+':'+row.id}));
      const items=[
        {id:'persona-group',label:label(tr("本会话：{p0}",{p0:currentName}),sourceName(effective?.source,view)),submenu:group('persona',false)},
        {id:'children-group',label:label(tr("子代理：{p0}",{p0:childName}),sourceName(view.children?.source,view)),submenu:group('children',true)},
      ];
      const choose=async id=>{
        const separator=id.indexOf(':'),target=id.slice(0,separator),value=id.slice(separator+1);
        if(!['persona','children'].includes(target))return;
        setOpen(false);setBusy(true);setError('');
        try{await request('/action',{action:'rule-set',data:{scope:'session',id:soulSessionId,target,rule:ruleFromValue(value)},expectedRevision:view.revision,sessionId:soulSessionId});await library.load(true);}
        catch(cause){setError(cause.message);await library.load(true);}
        finally{setBusy(false);}
      };
      const disabled=busy||!view.enabled||!soulSessionId;
      return h('span',{className:'soul-chip'},h(AnchoredMenu,{
        anchorRef,open:open&&!disabled,items,selectedIds:['persona:'+ruleValue(view.selection),'children:'+ruleValue(view.children?.selection)],onSelect:choose,onClose:()=>setOpen(false),portal:true,align:'start',className:'soul-chip-anchor',
        anchor:h(Button,{ref:anchorRef,variant:'ghost',size:'sm',className:'soul-persona-trigger',icon:h(IconUserOutlineRegular,{size:16}),'aria-label':tr("本会话人设与子代理规则"),'aria-haspopup':'menu','aria-expanded':open&&!disabled,disabled,title:!view.enabled?tr("请在设置 → 私人灵魂启用人设"):tr("本会话：{p0}；子代理：{p1}",{p0:currentName,p1:childName}),onClick:()=>setOpen(v=>!v)},
          h('span',{className:'soul-chip-label'},currentName),
          h('span',{className:'soul-chip-secondary'},tr("子代理：{p0}",{p0:childName})),
          h(IconChevronDownOutlineRegular,{size:12,'aria-hidden':true})),
      }),error?h(Toast,{text:messageText(error),holdMs:5000,onDone:()=>setError('')}):null);
    }

    function QuickSwitch({soulSessionId}){
      const anchor=React.useRef(null),[target,setTarget]=React.useState(null);
      React.useLayoutEffect(()=>{
        const dock=anchor.current?.closest('[data-slot="conversation.input.dock"]');
        const scope=dock?.closest('[data-phase]')??dock?.closest('[data-content-phase]')??dock?.parentElement;
        if(!scope)return;
        let seat=null;
        const place=()=>{
          // Existing and read-only sessions use the native header slot below.
          // Only the hero's preset row needs this small portal adapter.
          const row=scope.querySelector('[data-slot="conversation.hero.agentPreset"]')?.parentElement;
          if(seat&&seat.parentElement===row)return;
          seat?.remove();seat=null;
          if(row){seat=document.createElement('span');seat.dataset.soulPersonaSeat='';seat.style.display='contents';row.appendChild(seat);}
          setTarget(seat);
        };
        place();
        const observer=new MutationObserver(place);observer.observe(scope,{childList:true,subtree:true});
        return()=>{observer.disconnect();seat?.remove();};
      },[soulSessionId]);
      return h(React.Fragment,null,h('span',{ref:anchor,hidden:true,'data-soul-persona-anchor':''}),target?createPortal(h(PersonaMenu,{soulSessionId}),target):null);
    }
    function apply(ctx) {
      ctx.effect(() => installLocale(ctx), 'locale: dictionaries');
      ctx.effect(()=>{const style=document.createElement('style');style.dataset.plugin='private-soul-v2';style.textContent=css;document.head.appendChild(style);return()=>style.remove();},'private-soul: styles');
      ctx.slots.inject('settings.section',()=>ctx.slots.register({name:'settings.section',locale:NS,id:'private-soul',order:15,label:()=> tr("私人灵魂")},SoulEditor));
      ctx.slots.inject('conversation.input.dock',()=>ctx.slots.register({name:'conversation.input.dock',locale:NS,id:'private-soul-quick-switch',order:20,inject:sessionId=>({soulSessionId:sessionId})},QuickSwitch));
      ctx.slots.inject('conversation.session.header.actions',()=>ctx.slots.register({name:'conversation.session.header.actions',locale:NS,id:'private-soul-persona-menu',order:20,inject:sessionId=>({soulSessionId:sessionId})},PersonaMenu));
    }
    return {name:'private-soul-client',inject:['slots','locale'],apply};
  },
});
