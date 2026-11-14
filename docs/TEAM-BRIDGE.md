# Team Desk integration / 团队联动

Soul Desk provides optional host service `privateSoulBridge`, protocol `1`, in 0.4.2. Team Desk 0.14.0 uses it to apply preset persona references to existing or newly created native sessions.

`prepare([{sessionId,rules:{persona?,children?}}])` validates at most 12 unique session IDs and returns an opaque in-memory token. `apply(token)` atomically writes those rules to the existing Soul store. Only touched fields participate in the concurrency check; other fields, memories and persona text remain unchanged. Deleted personas or changed destination rules reject the whole batch. Successful tokens cannot be reused.

`persona` accepts `{mode:"follow"}`, `{mode:"none"}` or `{mode:"persona",personaId}`. `children` also accepts `{mode:"parent"}`. Omitted fields remain unchanged. The service does not enable Soul or initiate model requests. The original resolver and prompt contribution remain authoritative; future children use native creation-time capture. Existing child decisions are preserved.

Team Desk stores persona IDs in presets, not persona content. It can operate without this service. Frontend selectors use compact metadata and the existing `rule-set` API, so later manual changes remain ordinary Soul session rules.

联动只将预设明确的人设/子代理规则写入原有会话规则。未指定不覆盖；后续手动选择有效；缺少插件时团队继续工作。所有人设注入、记忆归属、全局启用开关及子代理派生仍由 Soul 原流程控制。批量准备与提交之间若人设被删除或目标规则改变，整批拒绝并要求重新读取。
