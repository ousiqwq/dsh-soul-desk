window.__ModuleLoader__.load({
  id: 'dsh-plugin-private-soul',
  factory: require => {
    const React=require('react'),h=React.createElement,{createPortal}=require('react-dom');
    const {Button,Input,Switch,SegmentedTabs,Menu,MenuItemButton,Tooltip,Toast,Modal,IconSettingsOutlineRegular,IconWarningOutlineRegular,IconUserOutlineRegular,IconChevronDownOutlineRegular}=require('@deepseek-ai/dsh-client-ui-primitives');
    /* i18n:start */
const NS="soulDesk";
const zh={
  "宿主独占指令": "宿主独占指令",
  "预览使用预设基准和全局人设，不读取会话历史。": "预览使用预设基准和全局人设，不读取会话历史。",
  "增强设置请求过大。": "增强设置请求过大。",
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
  "用人格与个人记忆替换可编辑的身份段。任务说明、工具和独占系统指令由 DSH 管理。": "用人格与个人记忆替换可编辑的身份段。任务说明、工具和独占系统指令由 DSH 管理。",
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
  "会话已不存在，请刷新。": "会话已不存在，请刷新。",
  "关闭": "关闭",
  "保存设置": "保存设置",
  "提示词增强": "提示词增强",
  "高级设置": "高级设置",
  "提示词增强高级设置": "提示词增强高级设置",
  "默认关闭；启用后也不覆盖原有人设和个人记忆。": "默认关闭；启用后也不覆盖原有人设和个人记忆。",
  "增强开关已保存，下一次模型请求生效。": "增强开关已保存，下一次模型请求生效。",
  "增强设置已保存，开关状态保持不变。": "增强设置已保存，开关状态保持不变。",
  "仅调整新增模块；人设与记忆段落保持原文，原生运行规则由宿主决定。": "仅调整新增模块；人设与记忆段落保持原文，原生运行规则由宿主决定。",
  "固定保护：此编辑器不改写原有人设和个人记忆段落，也不改变工具目录与运行规则。": "固定保护：此编辑器不改写原有人设和个人记忆段落，也不改变工具目录与运行规则。",
  "减少开场套话": "减少开场套话",
  "尽量先给出所需结果，保留人设原有语气。": "尽量先给出所需结果，保留人设原有语气。",
  "完整交付": "完整交付",
  "在允许范围内交付完整成果，不编造未执行的结果。": "在允许范围内交付完整成果，不编造未执行的结果。",
  "保留用户命名": "保留用户命名",
  "保留用户提供的名称与路径，继续遵守隐私及脱敏要求。": "保留用户提供的名称与路径，继续遵守隐私及脱敏要求。",
  "应用于子代理": "应用于子代理",
  "仅沿用此增强开关，不改变子代理的人设继承规则。": "仅沿用此增强开关，不改变子代理的人设继承规则。",
  "增强提示词（仅新增部分）": "增强提示词（仅新增部分）",
  "{p0} / 16000 字符。{{…}} 保留原文；只有保存后才生效。": "{p0} / 16000 字符。{{…}} 保留原文；只有保存后才生效。",
  "恢复默认草稿": "恢复默认草稿",
  "重新读取增强设置": "重新读取增强设置",
  "预览新增提示词": "预览新增提示词",
  "新增提示词预览": "新增提示词预览",
  "已开启，将于下一次模型请求生效。": "已开启，将于下一次模型请求生效。",
  "已应用；人设与记忆段落保持原文，原生运行规则未改动。": "已应用；人设与记忆段落保持原文，原生运行规则未改动。",
  "已检测到独立增强模块，本模块未重复注入。": "已检测到独立增强模块，本模块未重复注入。",
  "已按高级设置跳过子代理。": "已按高级设置跳过子代理。",
  "未设置增强效果或提示词，原提示词保持不变。": "未设置增强效果或提示词，原提示词保持不变。",
  "当前提示词结构不受支持，已保留原有人设与记忆。": "当前提示词结构不受支持，已保留原有人设与记忆。",
  "增强模块暂不可用，已保留原有人设与记忆。": "增强模块暂不可用，已保留原有人设与记忆。",
  "提示词增强设置格式无效。": "提示词增强设置格式无效。",
  "含有未知的提示词增强设置。": "含有未知的提示词增强设置。",
  "提示词增强选项必须为开关值。": "提示词增强选项必须为开关值。",
  "增强提示词最多16000字符。": "增强提示词最多16000字符。",
  "提示词增强配置格式或版本不受支持。": "提示词增强配置格式或版本不受支持。",
  "提示词增强配置无法读取，已保持关闭。原有人设与记忆不受影响。": "提示词增强配置无法读取，已保持关闭。原有人设与记忆不受影响。",
  "提示词增强服务正在退出。": "提示词增强服务正在退出。",
  "增强设置已被其他页面更新，草稿仍保留。请重新读取后合并。": "增强设置已被其他页面更新，草稿仍保留。请重新读取后合并。",
  "提示词增强操作不存在。": "提示词增强操作不存在。",
  "模式适配与诊断": "模式适配与诊断",
  "已关闭": "已关闭",
  "待验证": "待验证",
  "已适配": "已适配",
  "需要检查": "需要检查",
  "预览模式": "预览模式",
  "此模式需要检查：{p0}": "此模式需要检查：{p0}",
  "完整预览优先显示此模式最近一次真实组装；没有记录时读取独立模式，不调用模型。": "完整预览优先显示此模式最近一次真实组装；没有记录时读取独立模式，不调用模型。",
  "模式检查完成，未修改开关或人设。": "模式检查完成，未修改开关或人设。",
  "重新检查模式": "重新检查模式",
  "预览完整系统提示词": "预览完整系统提示词",
  "完整系统提示词预览": "完整系统提示词预览",
  "完整预览暂不可用。": "完整预览暂不可用。",
  "完整预览可能包含人设和个人记忆，只读展示；不会启用增强或发送模型。": "完整预览可能包含人设和个人记忆，只读展示；不会启用增强或发送模型。",
  "{p0} · {p1} 行 · {p2} 字节": "{p0} · {p1} 行 · {p2} 字节",
  "最近会话预览": "最近会话预览",
  "独立模式预览": "独立模式预览",
  "适配基础：dsh-unrestricted {p0}；原始破限提示词未迁入。": "适配基础：dsh-unrestricted {p0}；原始破限提示词未迁入。",
  "请求必须是 JSON 对象。": "请求必须是 JSON 对象。",
  "当前宿主没有此模式。": "当前宿主没有此模式。",
  "当前宿主不支持模式预览。": "当前宿主不支持模式预览。",
  "Minimal 原生人设段缺失，已保留原提示词。": "Minimal 原生人设段缺失，已保留原提示词。",
  "不支持此预览模式。": "不支持此预览模式。",
  "缺少可融合的人设段，已保留原提示词。": "缺少可融合的人设段，已保留原提示词。",
  "完整提示词预览过大。": "完整提示词预览过大。",
  "模式预览暂不可用，原提示词未修改。": "模式预览暂不可用，原提示词未修改。",
  "常规": "常规",
  "提示词": "提示词",
  "诊断": "诊断",
  "增强设置分类": "增强设置分类",
  "先给结果，保留人设语气。": "先给结果，保留人设语气。",
  "完整交付，明确未执行的部分。": "完整交付，明确未执行的部分。",
  "保留名称、路径和参数。": "保留名称、路径和参数。",
  "沿用增强，不改变人设继承。": "沿用增强，不改变人设继承。",
  "保存设置不会自动开启增强。": "保存设置不会自动开启增强。",
  "恢复默认": "恢复默认",
  "重新读取": "重新读取",
  "返回编辑": "返回编辑",
  "预览": "预览",
  "只读预览": "只读预览",
  "{p0} / 16000 字符": "{p0} / 16000 字符",
  "只编辑新增部分，{{…}} 保留原文。": "只编辑新增部分，{{…}} 保留原文。",
  "结构检查通过": "结构检查通过",
  "尚未检查": "尚未检查",
  "选择预览模式，不切换会话。": "选择预览模式，不切换会话。",
  "查看完整提示词": "查看完整提示词",
  "检查模式，或查看完整提示词。": "检查模式，或查看完整提示词。",
  "预览只读，可能包含人设和记忆。": "预览只读，可能包含人设和记忆。",
  "关于适配": "关于适配",
  "有未保存修改": "有未保存修改",
  "人设与记忆段落保持原文。": "人设与记忆段落保持原文。",
  "子代理增强": "子代理增强",
  "识别可以独立完成的一部分工作，结合当前任务考虑原生子代理。": "识别可以独立完成的一部分工作，结合当前任务考虑原生子代理。",
  "独立工作可并行，结果回到当前会话。": "独立工作可并行，结果回到当前会话。"
};
const en={
  "宿主独占指令": "Host-exclusive instructions",
  "预览使用预设基准和全局人设，不读取会话历史。": "Preview uses the preset baseline and global persona without reading conversation history.",
  "增强设置请求过大。": "The enhancement settings request is too large.",
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
  "用人格与个人记忆替换可编辑的身份段。任务说明、工具和独占系统指令由 DSH 管理。": "Replace editable identity sections with the persona and its memories. DSH manages task instructions, tools and exclusive system prompts.",
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
  "会话已不存在，请刷新。": "The conversation no longer exists; please refresh.",
  "关闭": "Close",
  "保存设置": "Save settings",
  "提示词增强": "Response enhancement",
  "高级设置": "Advanced settings",
  "提示词增强高级设置": "Response enhancement settings",
  "默认关闭；启用后也不覆盖原有人设和个人记忆。": "Off by default. Original personas and personal memories retain priority.",
  "增强开关已保存，下一次模型请求生效。": "Enhancement switch saved. Applies to the next model request.",
  "增强设置已保存，开关状态保持不变。": "Enhancement settings saved. The switch is unchanged.",
  "仅调整新增模块；人设与记忆段落保持原文，原生运行规则由宿主决定。": "Only changes the added module. Persona and memory sections keep their original text; native operating rules stay under host control.",
  "固定保护：此编辑器不改写原有人设和个人记忆段落，也不改变工具目录与运行规则。": "Fixed protection: this editor rewrites no persona or personal-memory section and changes no tool catalog or operating rule.",
  "减少开场套话": "Concise introductions",
  "尽量先给出所需结果，保留人设原有语气。": "Lead with the requested result while retaining the persona’s tone.",
  "完整交付": "Complete deliverables",
  "在允许范围内交付完整成果，不编造未执行的结果。": "Provide complete deliverables where permitted, without inventing results or claiming unperformed work.",
  "保留用户命名": "Preserve user names",
  "保留用户提供的名称与路径，继续遵守隐私及脱敏要求。": "Preserve supplied names and paths while respecting privacy and redaction requirements.",
  "应用于子代理": "Apply to subagents",
  "仅沿用此增强开关，不改变子代理的人设继承规则。": "Applies this enhancement only; subagent persona rules stay unchanged.",
  "增强提示词（仅新增部分）": "Enhancement prompt (added section only)",
  "{p0} / 16000 字符。{{…}} 保留原文；只有保存后才生效。": "{p0} / 16000 characters. {{…}} stays literal; changes apply only after saving.",
  "恢复默认草稿": "Reset draft to defaults",
  "重新读取增强设置": "Reload enhancement settings",
  "预览新增提示词": "Preview added prompt",
  "新增提示词预览": "Added prompt preview",
  "已开启，将于下一次模型请求生效。": "Enabled. Applies to the next model request.",
  "已应用；人设与记忆段落保持原文，原生运行规则未改动。": "Applied. Persona and memory sections keep their original text; native operating rules are unchanged.",
  "已检测到独立增强模块，本模块未重复注入。": "A standalone enhancement module was detected; this module skipped injection.",
  "已按高级设置跳过子代理。": "Skipped for a subagent according to advanced settings.",
  "未设置增强效果或提示词，原提示词保持不变。": "No enhancement effects or prompt are set. The original prompt is unchanged.",
  "当前提示词结构不受支持，已保留原有人设与记忆。": "The current prompt structure is unsupported. Original personas and memories are preserved.",
  "增强模块暂不可用，已保留原有人设与记忆。": "Enhancement is unavailable. Original personas and memories are preserved.",
  "提示词增强设置格式无效。": "Invalid enhancement settings format.",
  "含有未知的提示词增强设置。": "Unknown enhancement setting.",
  "提示词增强选项必须为开关值。": "Enhancement options must be boolean values.",
  "增强提示词最多16000字符。": "The enhancement prompt is limited to 16000 characters.",
  "提示词增强配置格式或版本不受支持。": "Unsupported enhancement configuration format or version.",
  "提示词增强配置无法读取，已保持关闭。原有人设与记忆不受影响。": "Enhancement configuration could not be read and remains off. Original personas and memories are unaffected.",
  "提示词增强服务正在退出。": "Enhancement service is shutting down.",
  "增强设置已被其他页面更新，草稿仍保留。请重新读取后合并。": "Enhancement settings were updated elsewhere. Your draft is preserved; reload and merge the changes.",
  "提示词增强操作不存在。": "Unknown enhancement action.",
  "模式适配与诊断": "Mode adaptation and diagnostics",
  "已关闭": "Off",
  "待验证": "Pending validation",
  "已适配": "Adapted",
  "需要检查": "Needs review",
  "预览模式": "Preview mode",
  "此模式需要检查：{p0}": "This mode needs review: {p0}",
  "完整预览优先显示此模式最近一次真实组装；没有记录时读取独立模式，不调用模型。": "Full preview uses the latest live assembly for this mode when available; otherwise it reads a standing preset without calling a model.",
  "模式检查完成，未修改开关或人设。": "Mode checks completed. The switch and personas are unchanged.",
  "重新检查模式": "Recheck modes",
  "预览完整系统提示词": "Preview full system prompt",
  "完整系统提示词预览": "Full system prompt preview",
  "完整预览暂不可用。": "Full preview is currently unavailable.",
  "完整预览可能包含人设和个人记忆，只读展示；不会启用增强或发送模型。": "The read-only full preview may include persona and personal memory. It does not enable enhancement or send a model request.",
  "{p0} · {p1} 行 · {p2} 字节": "{p0} · {p1} lines · {p2} bytes",
  "最近会话预览": "Latest session preview",
  "独立模式预览": "Standing preset preview",
  "适配基础：dsh-unrestricted {p0}；原始破限提示词未迁入。": "Adaptation base: dsh-unrestricted {p0}. The original unrestricted prompt is not included.",
  "请求必须是 JSON 对象。": "The request must be a JSON object.",
  "当前宿主没有此模式。": "This host does not provide this preset.",
  "当前宿主不支持模式预览。": "This host does not support preset previews.",
  "Minimal 原生人设段缺失，已保留原提示词。": "The native Minimal persona section is missing. The original prompt is preserved.",
  "不支持此预览模式。": "This preview preset is unsupported.",
  "缺少可融合的人设段，已保留原提示词。": "No persona section is available for fusion. The original prompt is preserved.",
  "完整提示词预览过大。": "The full prompt preview is too large.",
  "模式预览暂不可用，原提示词未修改。": "Preset preview is unavailable. The original prompt was not modified.",
  "常规": "General",
  "提示词": "Prompt",
  "诊断": "Diagnostics",
  "增强设置分类": "Enhancement settings",
  "先给结果，保留人设语气。": "Lead with the result, keeping the persona’s voice.",
  "完整交付，明确未执行的部分。": "Complete deliverables; distinguish work not yet done.",
  "保留名称、路径和参数。": "Keep supplied names, paths and parameters.",
  "沿用增强，不改变人设继承。": "Apply enhancement without changing persona inheritance.",
  "保存设置不会自动开启增强。": "Saving settings does not enable enhancement.",
  "恢复默认": "Reset defaults",
  "重新读取": "Reload",
  "返回编辑": "Back to editing",
  "预览": "Preview",
  "只读预览": "Read-only preview",
  "{p0} / 16000 字符": "{p0} / 16000 characters",
  "只编辑新增部分，{{…}} 保留原文。": "Edit only the added section. {{…}} stays literal.",
  "结构检查通过": "Structure check passed",
  "尚未检查": "Not checked yet",
  "选择预览模式，不切换会话。": "Preview mode only; your conversation stays unchanged.",
  "查看完整提示词": "View full prompt",
  "检查模式，或查看完整提示词。": "Check a mode or view its full prompt.",
  "预览只读，可能包含人设和记忆。": "Read-only preview; may include persona and memories.",
  "关于适配": "About integration",
  "有未保存修改": "Unsaved changes",
  "人设与记忆段落保持原文。": "Persona and memory sections keep their original text.",
  "子代理增强": "Subagent enhancement",
  "识别可以独立完成的一部分工作，结合当前任务考虑原生子代理。": "Help identify independent work that a native child session could take on.",
  "独立工作可并行，结果回到当前会话。": "Independent work can run in parallel and return its result here."
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
      {id:'complete',get label(){return tr("替换");},get description(){return tr("用人格与个人记忆替换可编辑的身份段。任务说明、工具和独占系统指令由 DSH 管理。");}},
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
.soul-page .soul-select-trigger{width:100%;min-width:0;justify-content:space-between;gap:8px;text-align:left}
.soul-select-trigger>svg{flex:none}
.soul-ellipsis{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}
.soul-rule-panel,.soul-rule-target{display:flex;flex-direction:column;gap:12px;min-width:0}
.soul-persona-trigger{max-width:min(100%,380px);min-width:0;gap:6px}
.soul-chip-secondary{font-size:12px;color:inherit;opacity:.72;padding-left:6px;border-left:1px solid var(--dsw-alias-border-l2);max-width:190px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.soul-enhancement-row{display:flex;align-items:center;justify-content:space-between;gap:12px;min-width:0}.soul-enhancement-label{display:flex;align-items:center;gap:8px;min-width:0;font-size:13px}.soul-enhancement-label>button{flex:none}.soul-enhancement-hint{min-height:21px}
.soul-enhancement-dialog[role="dialog"]{width:680px;max-width:100%;height:620px;max-height:100%;min-height:0;overflow:hidden}
.soul-enhancement-content{display:flex;flex-direction:column;flex:1;gap:14px;min-width:0;min-height:0;overflow:hidden}.soul-enhancement-content>p{margin:0}.soul-enhancement-content>:has(>.soul-enhancement-panel){flex:1;min-height:0;gap:12px;overflow:hidden}
.soul-enhancement-panel{display:flex;flex-direction:column;gap:12px;flex:1;min-width:0;min-height:0;overflow:auto}.soul-enhancement-panel p{margin:0}
.soul-enhancement-options{display:flex;flex-direction:column;gap:16px}.soul-enhancement-option{display:flex;align-items:center;justify-content:space-between;gap:16px;min-height:48px}.soul-enhancement-option>button{flex:none}.soul-enhancement-option>span{display:flex;flex-direction:column;gap:4px;font-size:13px;min-width:0}
.soul-enhancement-toolbar{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;flex-shrink:0;min-width:0}.soul-enhancement-tools{display:flex;gap:2px;flex-wrap:wrap}.soul-enhancement-toolbar label{font-size:13px}.soul-enhancement-meta{font-size:12px}
.soul-enhancement-panel .soul-enhancement-editor{box-sizing:border-box;height:220px;min-height:150px;flex:1;min-width:0;resize:vertical}.soul-enhancement-diagnostics{display:flex;flex-direction:column;gap:12px;flex:1;min-width:0;min-height:0}.soul-enhancement-empty{display:grid;place-items:center;flex:1;min-height:90px;text-align:center}.soul-enhancement-note{margin-top:auto!important}
.soul-enhancement-footer{display:flex;align-items:center;justify-content:flex-end;flex-wrap:wrap;gap:8px}.soul-enhancement-draft-state{flex:1;min-width:0;font-size:12px}

@media(max-width:650px){.soul-persona-trigger{max-width:250px}.soul-chip-secondary{max-width:110px}.soul-card{padding:12px}}

`;
    async function request(path,data){
      const url=path==='/enhancement'?'/api/private-soul/enhancement':BASE+path;
      const response=await fetch(url,{method:data===undefined?'GET':'POST',cache:'no-store',credentials:'same-origin',...(data===undefined?{}:{headers:{'Content-Type':'application/json'},body:JSON.stringify(data)})});
      const value=await response.json().catch(error=>{if(response.ok)throw error;return {};});if(!response.ok)throw new Error(value.error||tr("请求失败（{p0}）", {p0: response.status}));if(path==='/action')window.dispatchEvent(new Event('private-soul-library-changed'));return value;
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
      return h(AnchoredMenu,{anchorRef,open,portal:true,minWidthFromAnchor:true,className:'soul-native-select',listClassName:'soul-mode-options',onClose:()=>setOpen(false),
        anchor:h(Tooltip,{label:selected.description,side:'bottom',portal:true,delayMs:400,disabled:open,maxWidth:320},
          h(Button,{ref:anchorRef,id:'soul-prompt-mode',variant:'outline',className:'soul-select-trigger',disabled,'aria-label':tr("注入方式"),'aria-haspopup':'menu','aria-expanded':open,onClick:()=>setOpen(current=>!current)},h('span',{className:'soul-ellipsis'},selected.label),h(IconChevronDownOutlineRegular,{size:14,'aria-hidden':true})))},
        ...promptModes.map(row=>h(Tooltip,{key:row.id,label:row.description,side:'right',portal:true,delayMs:350,focusDelayMs:350,maxWidth:320},
          h('div',{className:'soul-mode-option'},h(MenuItemButton,{current:row.id===selected.id,onSelect:()=>{setOpen(false);onChange(row.id);}},row.label)))));
    }

    function useEnhancement(){
      const [view,setView]=React.useState(null),[error,setError]=React.useState('');
      const current=React.useRef(null),alive=React.useRef(true),sequence=React.useRef(0);
      const accept=value=>{if(alive.current&&(!current.current||value.revision>=current.current.revision)){sequence.current++;current.current=value;setView(value);setError('');}};
      const load=async()=>{const id=++sequence.current;try{const next=await request('/enhancement');if(id===sequence.current)accept(next);return current.current;}catch(cause){if(alive.current&&id===sequence.current)setError(cause.message);return null;}};
      React.useEffect(()=>{alive.current=true;load();const changed=()=>load(),timer=setInterval(()=>{if(!document.hidden)load();},3000);window.addEventListener('private-soul-enhancement-changed',changed);return()=>{alive.current=false;clearInterval(timer);window.removeEventListener('private-soul-enhancement-changed',changed);};},[]);
      return {view,error,current,alive,accept,load};
    }

    function EnhancementControls(){
      const state=useEnhancement(),view=state.view;
      const [open,setOpen]=React.useState(false),[draft,setDraft]=React.useState(null),[busy,setBusy]=React.useState(false),[error,setError]=React.useState(''),[message,setMessage]=React.useState(''),[preview,setPreview]=React.useState(''),[preset,setPreset]=React.useState('standard'),[fullPreview,setFullPreview]=React.useState(null),[section,setSection]=React.useState('general');
      const baseline=React.useRef({revision:0,settings:null}),openButton=React.useRef(null),editId=React.useId();
      const dirty=!!draft&&JSON.stringify(draft)!==JSON.stringify(baseline.current.settings);
      const close=()=>{if(!busy)setOpen(false);};
      function adoptSettings(next){baseline.current={revision:next.revision,settings:structuredClone(next.settings)};setDraft(structuredClone(next.settings));setPreview('');setFullPreview(null);setError('');}
      async function advanced(){const next=await state.load();if(!state.alive.current)return;if(next&&!dirty)adoptSettings(next);setOpen(true);}
      function change(key,value){setDraft(previous=>({...previous,[key]:value}));setPreview('');setFullPreview(null);}
      async function action(fn,success){if(busy)return;setBusy(true);setError('');try{await fn();if(state.alive.current&&success)setMessage(success);}catch(cause){if(state.alive.current)setError(cause.message);}finally{if(state.alive.current)setBusy(false);}}
      async function write(action,data,revision){const next=await request('/enhancement',{action,data,expectedRevision:revision});state.accept(next);window.dispatchEvent(new Event('private-soul-enhancement-changed'));return next;}
      const statuses={pending:tr("已开启，将于下一次模型请求生效。"),active:tr("已应用；人设与记忆段落保持原文，原生运行规则未改动。"),'external-module':tr("已检测到独立增强模块，本模块未重复注入。"),'subagent-excluded':tr("已按高级设置跳过子代理。"),empty:tr("未设置增强效果或提示词，原提示词保持不变。"),unsupported:tr("当前提示词结构不受支持，已保留原有人设与记忆。"),unavailable:tr("增强模块暂不可用，已保留原有人设与记忆。")};
      const options=[['directAnswer','减少开场套话','尽量先给出所需结果，保留人设原有语气。'],['completeArtifacts','完整交付','在允许范围内交付完整成果，不编造未执行的结果。'],['preserveNames','保留用户命名','保留用户提供的名称与路径，继续遵守隐私及脱敏要求。'],['subagentGuidance','子代理增强','识别可以独立完成的一部分工作，结合当前任务考虑原生子代理。'],['includeSubagents','应用于子代理','仅沿用此增强开关，不改变子代理的人设继承规则。']];
      const presetLabels={standard:'Standard',ptc:'PTC',cordis:'Cordis',minimal:'Minimal'};
      const presetIds=view?.presets??Object.keys(presetLabels);
      const hasExtraPresets=presetIds.some(id=>!Object.hasOwn(presetLabels,id));
      const selectedPreset=presetIds.includes(preset)?preset:presetIds[0];
      const presetLabel=id=>Object.hasOwn(presetLabels,id)?presetLabels[id]:id;
      const changePreset=value=>{if(!busy){setPreset(value);setFullPreview(null);}};
      const modeStates={off:tr("已关闭"),pending:tr("待验证"),active:tr("已适配"),unsupported:tr("宿主独占指令"),failed:tr("需要检查")};
      const selectedMode=view?.modes?.[selectedPreset];
      const panelId=editId+'-settings-panel';
      const sectionItems=[['general',tr("常规")],['prompt',tr("提示词")],['diagnostics',tr("诊断")]].map(([value,label])=>({value,label,id:editId+'-section-'+value,panelId}));
      const shortHints={directAnswer:tr("先给结果，保留人设语气。"),completeArtifacts:tr("完整交付，明确未执行的部分。"),preserveNames:tr("保留名称、路径和参数。"),subagentGuidance:tr("独立工作可并行，结果回到当前会话。"),includeSubagents:tr("沿用增强，不改变人设继承。")};
      const resetDraft=()=>{setDraft(structuredClone(view.defaults));setPreview('');setFullPreview(null);setError('');};      function renderPanel(){
        if(section==='general')return h(React.Fragment,null,
          h('div',{className:'soul-enhancement-options'},...options.map(([key,label,hint])=>h(Tooltip,{key,label:tr(hint),side:'bottom',portal:true,delayMs:500},
            h('div',{className:'soul-enhancement-option'},h('span',null,h('span',null,tr(label)),h('small',{className:'soul-hint'},shortHints[key])),h(Switch,{label:tr(label),checked:!!draft[key],disabled:busy,onChange:value=>change(key,value)}))))),
          h('p',{className:'soul-hint soul-enhancement-note'},tr("保存设置不会自动开启增强。")));
        if(section==='prompt')return h(React.Fragment,null,
          h('div',{className:'soul-enhancement-toolbar'},h('label',{htmlFor:editId},preview?tr("新增提示词预览"):tr("增强提示词（仅新增部分）")),
            h('div',{className:'soul-enhancement-tools'},h(Tooltip,{label:tr("恢复默认草稿"),side:'bottom',portal:true},h(Button,{variant:'ghost',size:'sm',disabled:busy,'aria-label':tr("恢复默认草稿"),onClick:resetDraft},tr("恢复默认"))),
              h(Tooltip,{label:tr("重新读取增强设置"),side:'bottom',portal:true},h(Button,{variant:'ghost',size:'sm',disabled:busy,'aria-label':tr("重新读取增强设置"),onClick:()=>action(async()=>{const next=await state.load();if(next)adoptSettings(next);})},tr("重新读取"))))),
          h('textarea',{id:editId,className:'soul-input soul-text soul-enhancement-editor',value:preview||draft.prompt,readOnly:!!preview,maxLength:preview?undefined:view?.maxPromptLength??16000,disabled:busy,spellCheck:false,'aria-label':preview?tr("新增提示词预览"):tr("增强提示词（仅新增部分）"),onChange:event=>change('prompt',event.target.value)}),
          h('div',{className:'soul-enhancement-toolbar soul-enhancement-meta'},h('span',{className:'soul-hint'},preview?tr("只读预览"):tr("{p0} / 16000 字符",{p0:draft.prompt.length.toLocaleString(localeId())})),
            h(Button,{variant:'ghost',size:'sm',disabled:busy,'aria-label':preview?tr("返回编辑"):tr("预览新增提示词"),onClick:preview?()=>setPreview(''):()=>action(async()=>{const result=await request('/enhancement',{action:'preview',data:{settings:draft}});setPreview(result.preview||tr("未设置增强效果或提示词，原提示词保持不变。"));})},preview?tr("返回编辑"):tr("预览"))),
          h('p',{className:'soul-hint'},tr("只编辑新增部分，{{…}} 保留原文。")));
        return h(React.Fragment,null,
          hasExtraPresets
            ? h('select',{className:'soul-input','aria-label':tr("预览模式"),value:selectedPreset,disabled:busy,onChange:event=>changePreset(event.target.value)},
              presetIds.map(id=>h('option',{key:id,value:id},presetLabel(id))))
            : h(SegmentedTabs,{label:tr("预览模式"),size:'sm',value:selectedPreset,onChange:changePreset,items:presetIds.map(value=>({value,label:presetLabel(value),id:editId+'-mode-'+value,panelId:editId+'-mode-panel'}))}),
          h('div',{id:editId+'-mode-panel',...(hasExtraPresets?{role:'region','aria-label':tr("预览模式")}:{role:'tabpanel','aria-labelledby':editId+'-mode-'+selectedPreset}),className:'soul-enhancement-diagnostics'},
            h('div',{className:'soul-enhancement-toolbar','data-soul-mode-statuses':''},h('span',{className:'soul-hint',role:'status'},(modeStates[selectedMode?.state]??modeStates.pending)+' · '+(selectedMode?.checked&&!selectedMode.issues.length?tr("结构检查通过"):tr("尚未检查"))),
              h(Button,{variant:'ghost',size:'sm',disabled:busy||!view?.available,onClick:()=>action(async()=>{await request('/enhancement',{action:'recheck'});await state.load();setFullPreview(null);},tr("模式检查完成，未修改开关或人设。"))},tr("重新检查模式"))),
            selectedMode?.issues?.length?h('p',{className:'soul-error'},tr("此模式需要检查：{p0}",{p0:selectedMode.issues.join(', ')})):null,
            h('div',{className:'soul-enhancement-toolbar'},h('span',{className:'soul-hint'},tr("选择预览模式，不切换会话。")),h(Button,{variant:'outline',size:'sm',disabled:busy||!view?.available,'aria-label':tr("预览完整系统提示词"),onClick:()=>action(async()=>{const result=await request('/enhancement',{action:'preview-mode',data:{presetId:selectedPreset,settings:draft}});if(!result.available)throw new Error(messageText(result.reason)||tr("完整预览暂不可用。"));setFullPreview(result);})},tr("查看完整提示词"))),
            fullPreview?.presetId===selectedPreset?h(React.Fragment,null,
              h('textarea',{className:'soul-input soul-text soul-enhancement-editor',readOnly:true,value:fullPreview.text,'aria-label':tr("完整系统提示词预览")}),
              h(Tooltip,{label:tr("{p0} · {p1} 行 · {p2} 字节",{p0:tr("独立模式预览"),p1:fullPreview.lines,p2:fullPreview.bytes}),side:'top',portal:true},h('span',{className:'soul-hint'},fullPreview.locked?tr("宿主独占指令"):tr("独立模式预览"))))
              :h('div',{className:'soul-enhancement-empty soul-hint'},tr("检查模式，或查看完整提示词。")),
            h('div',{className:'soul-enhancement-toolbar'},h('span',{className:'soul-hint'},tr("预览使用预设基准和全局人设，不读取会话历史。")),h(Tooltip,{label:tr("选择预览模式，不切换会话。"),side:'top',portal:true,maxWidth:320},h('span',{className:'soul-hint',tabIndex:0},tr("关于适配"))))));
      }
      return h(React.Fragment,null,
        h('div',{className:'soul-enhancement-row','data-soul-enhancement-controls':''},h('span',{className:'soul-enhancement-label'},h(Switch,{label:tr("提示词增强"),checked:!!view?.enabled,disabled:busy||!view?.available,onChange:enabled=>action(()=>write('toggle',{enabled},state.current.current.revision),tr("增强开关已保存，下一次模型请求生效。"))}),h('span',null,tr("提示词增强"))),h(Button,{ref:openButton,variant:'ghost',size:'sm',disabled:busy||!view,'aria-label':tr("提示词增强高级设置"),onClick:advanced,icon:IconSettingsOutlineRegular?h(IconSettingsOutlineRegular,{size:16}):undefined},tr("高级设置"))),
        h('p',{className:'soul-hint soul-enhancement-hint',role:'status'},messageText(view?.error||state.error)||(view?.enabled?statuses[view.status]??statuses.pending:tr("默认关闭；启用后也不覆盖原有人设和个人记忆。"))),
        open&&draft?h(Modal,{open:true,title:tr("提示词增强高级设置"),closeLabel:tr("关闭"),onClose:close,className:'soul-enhancement-dialog',contentClassName:'soul-enhancement-content',footer:h('div',{className:'soul-enhancement-footer'},
          h('span',{className:'soul-hint soul-enhancement-draft-state',role:'status'},dirty?tr("有未保存修改"):''),h(Button,{variant:'outline',onClick:close,disabled:busy},tr("关闭")),h(Button,{variant:'primary',disabled:busy||!view?.available||!dirty,onClick:()=>action(async()=>{const next=await write('save',{settings:draft},baseline.current.revision);adoptSettings(next);setOpen(false);},tr("增强设置已保存，开关状态保持不变。"))},tr("保存设置")))},
          h(Tooltip,{label:tr("固定保护：此编辑器不改写原有人设和个人记忆段落，也不改变工具目录与运行规则。"),side:'bottom',portal:true,maxWidth:380},h('p',{className:'soul-hint','data-soul-enhancement-protection':''},tr("人设与记忆段落保持原文。"))),
          h(SegmentedTabs,{label:tr("增强设置分类"),size:'sm',value:section,onChange:value=>{if(!busy)setSection(value);},items:sectionItems}),
          h('div',{id:panelId,role:'tabpanel','aria-labelledby':editId+'-section-'+section,'data-soul-enhancement-panel':section,className:'soul-enhancement-panel'},renderPanel()),
          error?h('p',{className:'soul-error',role:'alert'},messageText(error)):null):null,
        !open&&error?h(Toast,{key:error,text:messageText(error),icon:h(IconWarningOutlineRegular,{size:16}),holdMs:6000,onDone:()=>setError('')}):null,
        message?h(Toast,{key:message,text:messageText(message),tone:'success',onDone:()=>setMessage('')}):null);
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
        h('div',{className:'soul-card'},h('div',{className:'soul-row'},h(Switch,{checked:!!view?.enabled,disabled,label:tr("启用私人灵魂"),onChange:enabled=>run(()=>act('settings',{enabled}),tr("已更新总开关。"))}),h('span',null,tr("启用私人灵魂"))),h('div',{className:'soul-field'},h('span',null,tr("注入方式")),h(PromptModeSelect,{value:view?.mode??'priority',disabled,onChange:mode=>run(()=>act('settings',{mode}),tr("已更新注入方式。"))})),h(EnhancementControls)),
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
