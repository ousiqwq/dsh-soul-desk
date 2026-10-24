window.__ModuleLoader__.load({
  id: 'dsh-plugin-private-soul',
  factory: require => {
    const React=require('react'),h=React.createElement,{createPortal}=require('react-dom');
    const {Menu,Toast,IconUserOutlineRegular,IconChevronDownOutlineRegular}=require('@deepseek-ai/dsh-client-ui-primitives');
    const BASE='/private-soul/v2',labels={relationship:'关系',preference:'喜好',story:'故事'};
    const css=`
.soul-page{box-sizing:border-box;width:100%;min-width:0;display:flex;flex-direction:column;gap:16px;padding:6px 0;color:var(--dsw-alias-label-primary);container-type:inline-size}
.soul-page *{box-sizing:border-box}
.soul-page h2,.soul-page h3{margin:0;font-weight:600}
.soul-page h2{font-size:18px;line-height:1.4}
.soul-page h3{font-size:14px;line-height:1.5}
.soul-hint{font-size:12px;line-height:1.7;color:var(--dsw-alias-label-secondary);margin:0;overflow-wrap:anywhere}
.soul-row{display:flex;align-items:center;flex-wrap:wrap;gap:8px;min-width:0}
.soul-card{min-width:0;border:1px solid var(--dsw-alias-border-l2);border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:12px}
.soul-button,.soul-select,.soul-input{min-width:0;max-width:100%;font:inherit;font-size:13px;line-height:1.5;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-module-platform);color:inherit;padding:8px 10px;margin:0}
.soul-button{min-height:36px;cursor:pointer;text-align:center;white-space:normal;overflow-wrap:anywhere}
.soul-button:disabled,.soul-select:disabled{opacity:.45;cursor:default}
.soul-button:focus-visible,.soul-select:focus-visible,.soul-input:focus-visible{outline:2px solid #a779de;outline-offset:2px}
.soul-primary{background:#7854ae;color:white;border-color:#7854ae}
.soul-danger{color:#ff8c98}
.soul-input{display:block;width:100%}
.soul-text{width:100%;height:clamp(180px,28dvh,320px);min-height:180px;max-height:65dvh;resize:vertical;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;line-height:1.7;tab-size:2}
.soul-memory-text{height:110px;min-height:90px;max-height:40dvh}
.soul-badge{flex:none;font-size:11px;line-height:1.5;border-radius:20px;padding:4px 9px;background:color-mix(in srgb,#a779de 20%,transparent)}
.soul-settings{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,210px),1fr));gap:12px;align-items:end}
.soul-field{min-width:0;display:flex;flex-direction:column;gap:7px;font-size:13px}
.soul-field select{width:100%}
.soul-enable{display:inline-flex;align-items:center;gap:7px;font-size:13px;min-height:36px}
.soul-enable input{margin:0;flex:none;accent-color:#a779de}
.soul-layout{min-width:0;display:flex;flex-direction:column;gap:12px}
.soul-personas{display:flex;flex-wrap:wrap;gap:8px;min-width:0;max-height:150px;overflow:auto;scrollbar-gutter:stable;padding:2px}
.soul-persona{flex:0 1 180px;min-width:0;max-width:100%;text-align:left;display:flex;flex-direction:column;gap:4px}
.soul-persona-name{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.soul-persona[aria-pressed=true],.soul-tab[aria-selected=true]{border-color:#a779de;background:color-mix(in srgb,#a779de 16%,transparent)}
.soul-persona small{font-size:11px;color:var(--dsw-alias-label-secondary)}
.soul-editor{width:100%;min-width:0}
.soul-editor label{font-size:13px;font-weight:500}
.soul-editor-tabs{padding-bottom:10px;border-bottom:1px solid var(--dsw-alias-border-l2)}
.soul-actions{display:flex;align-items:center;flex-wrap:wrap;gap:8px;min-width:0}
.soul-actions-secondary{padding-top:4px}
.soul-error,.soul-success{font-size:13px;line-height:1.6;white-space:pre-wrap;margin:0;overflow-wrap:anywhere}
.soul-error{color:#ff8c98}.soul-success{color:#7ecba2}
.soul-memory{min-width:0;display:flex;flex-direction:column;gap:7px;padding:11px 0;border-bottom:1px solid var(--dsw-alias-border-l2)}
.soul-memory p{white-space:pre-wrap;margin:0;line-height:1.7;font-size:13px;overflow-wrap:anywhere}
.soul-preview{max-height:260px;overflow:auto}
.soul-memory-filter{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;min-width:0}
/* Match the workspace and agent-preset chips; reuse the native Menu card. */
.soul-chip{box-sizing:border-box;min-width:0;max-width:100%;display:inline-flex;align-items:center}
.soul-chip-anchor{min-width:54px;max-width:100%;display:inline-flex}
.soul-chip-button{box-sizing:border-box;border-radius:var(--dsw-radius-sm);min-width:0;max-width:min(100%,240px);min-height:28px;color:var(--dsw-alias-label-primary);white-space:nowrap;cursor:pointer;background:transparent;border:none;align-items:center;gap:4px;padding:0 8px;font:inherit;font-size:13px;font-weight:500;line-height:20px;display:inline-flex}
.soul-chip-button:hover{background:var(--dsw-alias-interactive-bg-hover)}
.soul-chip-button:focus-visible{outline:2px solid var(--dsw-alias-border-focus,#a779de);outline-offset:2px}
.soul-chip-button:disabled{opacity:.45;cursor:default}
.soul-chip-icon{color:var(--dsw-alias-label-primary);flex:none}
.soul-chip-label{text-overflow:ellipsis;white-space:nowrap;min-width:0;overflow:hidden}
.soul-chip-chevron{color:var(--dsw-alias-label-caption);flex:none}
.soul-menu-item{display:flex;flex-direction:column;gap:2px;min-width:0;max-width:280px}
.soul-menu-name{overflow-wrap:anywhere}
.soul-menu-description{color:var(--dsw-alias-label-caption);white-space:normal;overflow-wrap:anywhere;font-size:12px;line-height:16px}
@container(max-width:420px){.soul-card{padding:12px}.soul-actions>.soul-primary{flex:1 1 100%}.soul-actions>.soul-button{flex:1 1 auto}.soul-persona{flex:1 1 140px}.soul-memory-filter{grid-template-columns:minmax(0,1fr)}.soul-text{height:210px;min-height:160px}}
@media(max-width:650px){
  [data-shortcut-modal="settings"]:has(.soul-page){flex-direction:column;width:calc(100vw - 24px);max-width:calc(100vw - 24px);height:calc(100dvh - 24px)}
  [data-shortcut-modal="settings"]:has(.soul-page)>nav{width:100%;min-width:0;flex-direction:row;align-items:center;gap:8px;padding:12px 12px 0}
  [data-shortcut-modal="settings"]:has(.soul-page)>nav>:first-child{flex:none;white-space:nowrap;padding:0}
  [data-shortcut-modal="settings"]:has(.soul-page)>nav>:last-child{flex:1;min-width:0;flex-direction:row;overflow-x:auto;overflow-y:hidden;scrollbar-width:thin}
  [data-shortcut-modal="settings"]:has(.soul-page)>nav button{flex:none;height:36px;padding:7px 10px}
  [data-shortcut-modal="settings"]:has(.soul-page)>nav+div{min-height:0}
  [data-shortcut-modal="settings"]:has(.soul-page)>nav+div>:first-child{height:42px;padding:8px 12px 4px}
  [data-shortcut-modal="settings"]:has(.soul-page)>nav+div>:last-child{padding:0 14px 14px}
}
`;
    async function request(path,data){
      const response=await fetch(BASE+path,{method:data===undefined?'GET':'POST',cache:'no-store',credentials:'same-origin',...(data===undefined?{}:{headers:{'Content-Type':'application/json'},body:JSON.stringify(data)})});
      const value=await response.json();if(!response.ok)throw new Error(value.error||`请求失败（${response.status}）`);if(path==='/action')window.dispatchEvent(new Event('private-soul-library-changed'));return value;
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
    const button=(text,click,disabled=false,kind='')=>h('button',{type:'button',className:'soul-button '+(kind?'soul-'+kind:''),onClick:click,disabled},text);
    function download(name,value,mime='application/json;charset=utf-8'){const url=URL.createObjectURL(new Blob([value],{type:mime}));const link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}

    function SoulEditor(){
      const library=useLibrary(),view=library.view;
      const [selected,setSelected]=React.useState(null),[draft,setDraft]=React.useState({name:'',soul:''}),[tab,setTab]=React.useState('persona');
      const baseline=React.useRef({id:null,name:'',soul:''});
      const [busy,setBusy]=React.useState(false),[error,setError]=React.useState(''),[message,setMessage]=React.useState('');
      const [filter,setFilter]=React.useState(''),[kindFilter,setKindFilter]=React.useState('');
      const [memoryDraft,setMemoryDraft]=React.useState({id:null,kind:'relationship',content:''});
      const [importPreview,setImportPreview]=React.useState(null),[strategy,setStrategy]=React.useState('merge'),[organize,setOrganize]=React.useState(null);
      const importInput=React.useRef(null),soulInput=React.useRef(null);
      const persona=view?.personas.find(row=>row.id===selected);
      const dirty=draft.name!==baseline.current.name||draft.soul!==baseline.current.soul;
      function choose(id,force=false){
        if(!force&&dirty&&!window.confirm('切换编辑对象会替换未保存的草稿。是否继续？'))return;
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
        if(selected&&old&&(old.name!==baseline.current.name||old.soul!==baseline.current.soul))throw new Error('这个人设已被其他页面编辑，草稿仍保留。请导出草稿后重新读取并合并。');
        const result=await act('persona-save',{id:selected,...draft,activate});choose(result.personaId,true);
      }
      async function importAll(event){const file=event.target.files?.[0];event.target.value='';if(!file)return;try{if(file.size>8*1024*1024)throw new Error('整体存档最多8 MiB。');const archive=JSON.parse(await file.text());if(archive.format!=='private-soul-backup'||archive.version!==2||!Array.isArray(archive.data?.personas))throw new Error('请选择“导出全部”生成的 JSON 存档。');setImportPreview(archive);setStrategy('merge');setError('');}catch(cause){setError(cause.message);}}
      async function importSoul(event){const file=event.target.files?.[0];event.target.value='';if(!file)return;try{if(file.size>1024*1024)throw new Error('人格文本文件过大。');const soul=await file.text();if(soul.length>262144)throw new Error('人格文本最多262144字符。');setDraft(value=>({...value,soul}));setMessage('已导入人格草稿，保存后生效。');}catch(cause){setError(cause.message);}}
      const disabled=busy||!view,total=view?.personas.reduce((n,row)=>n+row.memories.length,0)??0;
      const rows=[...(persona?.memories??[])].filter(row=>(!kindFilter||row.kind===kindFilter)&&(!filter||row.content.toLowerCase().includes(filter.toLowerCase()))).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));
      const personaPanel=h(React.Fragment,null,
        h('label',{htmlFor:'soul-persona-name'},'人设名称'),h('input',{id:'soul-persona-name',className:'soul-input',value:draft.name,maxLength:80,disabled,onChange:e=>setDraft(value=>({...value,name:e.target.value})),placeholder:'例如：温柔的伙伴'}),
        h('label',{htmlFor:'private-soul-text'},'人格 / SOUL.md'),h('textarea',{id:'private-soul-text',className:'soul-input soul-text',value:draft.soul,disabled,onChange:e=>setDraft(value=>({...value,soul:e.target.value})),placeholder:'# 我是谁\n\n粘贴完整的人格、语气、价值观和交流习惯……',spellCheck:false}),
        h('p',{className:'soul-hint'},`${draft.soul.length.toLocaleString()} 字符${dirty?' · 有未保存修改':''}。{{…}} 保留原文。`),
        h('div',{className:'soul-actions'},button('保存并启用此人设',()=>run(()=>savePersona(true),'已保存并设为全局默认人设。'),disabled||!draft.name.trim()||!draft.soul.trim(),'primary'),button('仅保存',()=>run(()=>savePersona(false),'人设已保存。'),disabled||!draft.name.trim())),
        h('div',{className:'soul-actions soul-actions-secondary'},button('导入 SOUL.md',()=>soulInput.current.click(),disabled),button('导出草稿',()=>download('SOUL.md',draft.soul,'text/markdown;charset=utf-8'),!draft.soul),selected?button('重新读取人设',()=>{if(!dirty||window.confirm('重新读取会替换当前草稿，是否继续？'))run(async()=>{await library.load(true);choose(selected,true);});},disabled):null,h('input',{ref:soulInput,type:'file',accept:'.md,.txt,text/plain',hidden:true,onChange:importSoul,'aria-label':'导入人格文本文件'})),
        selected?h('div',{className:'soul-actions'},button('删除此人设及其记忆',()=>{if(window.confirm(`删除“${persona?.name}”及其 ${persona?.memories.length??0} 条记忆？服务器会先备份。`))run(async()=>{await act('persona-delete',{id:selected});choose(library.current.current.defaultPersonaId,true);},'人设已删除，服务器已保留备份。');},disabled,'danger')):null,
        h('p',{className:'soul-hint'},'人格优先保留工具说明；完整替换只保留人格与个人记忆规则。模型提供方的上层规则仍由提供方控制。'));
      const memoryPanel=!persona?h('p',{className:'soul-hint'},'先保存或选择一个人设，再管理它的个人记忆。'):h(React.Fragment,null,
        h('p',{className:'soul-hint'},`“${persona.name}”的独立记忆库。自动记录还需通过模型语义审核。`),
        h('div',{className:'soul-memory-filter'},h('input',{className:'soul-input',value:filter,onChange:e=>setFilter(e.target.value),placeholder:'搜索个人记忆','aria-label':'搜索个人记忆'}),h('select',{className:'soul-select',value:kindFilter,onChange:e=>setKindFilter(e.target.value),'aria-label':'筛选记忆类别'},h('option',{value:''},'全部类别'),...Object.entries(labels).map(([key,label])=>h('option',{key,value:key},label)))),
        h('div',{className:'soul-row'},button('一键去重',()=>run(()=>act('memory-dedupe',{personaId:selected}),'已去除重复的个人记忆。'),disabled),button('智能整理',()=>run(async()=>{setOrganize(await request('/organize-preview',{personaId:selected}));},'建议已生成，确认后才会写入。'),disabled||!persona.memories.length)),
        organize?h('div',{className:'soul-card',role:'dialog','aria-label':'记忆整理预览'},h('h3',null,'记忆整理预览'),h('p',{className:'soul-hint'},`${persona.memories.length} 条 → ${organize.memories.length} 条。${organize.note}`),h('div',{className:'soul-preview'},...organize.memories.map((row,index)=>h('p',{key:index,className:'soul-hint'},`${labels[row.kind]}：${row.content}`))),h('div',{className:'soul-row'},button('应用整理',()=>run(async()=>{await act('memory-organize',{personaId:selected,memories:organize.memories},organize.revision);setOrganize(null);},'记忆已整理，原内容已自动备份。'),busy,'primary'),button('取消整理',()=>setOrganize(null),busy))):null,
        h('div',{className:'soul-card'},h('h3',null,memoryDraft.id?'编辑个人记忆':'新增个人记忆'),h('select',{className:'soul-select',value:memoryDraft.kind,onChange:e=>setMemoryDraft(value=>({...value,kind:e.target.value})),'aria-label':'记忆类别'},...Object.entries(labels).map(([key,label])=>h('option',{key,value:key},label))),h('textarea',{className:'soul-input soul-text soul-memory-text',value:memoryDraft.content,onChange:e=>setMemoryDraft(value=>({...value,content:e.target.value})),placeholder:'例如：用户喜欢我叫他“小林”，这个称呼让他感觉亲切。','aria-label':'个人记忆内容',disabled}),h('div',{className:'soul-row'},button('保存记忆',()=>run(async()=>{await act('memory-save',{personaId:selected,...memoryDraft});setMemoryDraft({id:null,kind:'relationship',content:''});},'个人记忆已保存，只属于当前人设。'),disabled||!memoryDraft.content.trim(),'primary'),memoryDraft.id?button('取消编辑',()=>setMemoryDraft({id:null,kind:'relationship',content:''}),busy):null)),
        ...rows.map(row=>h('article',{key:row.id,className:'soul-memory','data-memory-id':row.id},h('div',{className:'soul-row'},h('span',{className:'soul-badge'},labels[row.kind]),h('span',{className:'soul-hint'},new Date(row.updatedAt).toLocaleDateString())),h('p',null,row.content),h('div',{className:'soul-row'},button('编辑',()=>setMemoryDraft({id:row.id,kind:row.kind,content:row.content,expectedVersion:row.version}),busy),button('删除',()=>run(()=>act('memory-delete',{personaId:selected,id:row.id}),'记忆已删除，服务器已保留备份。'),busy,'danger')))),
        !rows.length?h('p',{className:'soul-hint'},'暂无符合条件的记忆。真实互动出现关系、喜好或故事时，人设可通过记忆工具记录。'):null);
      return h('section',{className:'soul-page','aria-label':'私人灵魂人设与记忆管理'},
        h('div',{className:'soul-row'},h('h2',null,'私人灵魂'),h('span',{className:'soul-badge',role:'status'},view?.enabled?'已启用':'未启用'),h('span',{className:'soul-hint'},`${view?.personas.length??0} 个人设 · ${total} 条个人记忆`)),
        h('p',{className:'soul-hint'},'每个人设拥有独立的跨会话记忆。只记录关系、喜好与共同故事；代码、任务进度和具体工作内容不进入长期记忆。'),
        h('div',{className:'soul-card'},h('div',{className:'soul-row'},h('label',{className:'soul-enable'},h('input',{type:'checkbox',checked:!!view?.enabled,disabled,'aria-label':'启用私人灵魂',onChange:e=>run(()=>act('settings',{enabled:e.target.checked}),'已更新总开关。')}),'启用私人灵魂')),h('div',{className:'soul-settings'},h('label',{className:'soul-field'},'注入方式',h('select',{className:'soul-select',value:view?.mode??'priority',disabled,'aria-label':'注入方式',onChange:e=>run(()=>act('settings',{mode:e.target.value}),'已更新注入方式。')},h('option',{value:'priority'},'人格优先'),h('option',{value:'complete'},'完整替换'))),h('label',{className:'soul-field',htmlFor:'soul-default-persona'},'全局默认人设',h('select',{id:'soul-default-persona',className:'soul-select',value:view?.defaultPersonaId??'',disabled,onChange:e=>run(()=>act('settings',{defaultPersonaId:e.target.value||null}),'默认人设已切换，下一次请求生效。')},h('option',{value:''},'不使用默认人设'),...(view?.personas??[]).map(row=>h('option',{key:row.id,value:row.id},row.name))))),h('p',{className:'soul-hint'},'未单独绑定的会话跟随默认人设。聊天页的人设菜单可单独选择人设，切换时一起切换它的记忆。')),
        h('div',{className:'soul-actions'},button('新建人设',()=>{if(!dirty||window.confirm('新建会替换未保存草稿，是否继续？')){baseline.current={id:'new',name:'',soul:''};setSelected(null);setDraft({name:'',soul:''});setTab('persona');}},disabled),button('导出全部',()=>run(async()=>{download(`私人灵魂-${new Date().toISOString().slice(0,10)}.json`,JSON.stringify(await request('/export'),null,2));},'整体存档已下载，包含所有人设、记忆和会话绑定。'),disabled||dirty),button('导入全部',()=>importInput.current.click(),disabled||dirty),h('input',{ref:importInput,type:'file',accept:'.json,application/json',onChange:importAll,hidden:true,'aria-label':'导入整体存档文件'})),
        importPreview?h('div',{className:'soul-card',role:'dialog','aria-label':'整体存档导入预览'},h('h3',null,'导入预览'),h('p',{className:'soul-hint'},`包含 ${importPreview.data.personas.length} 个人设、${importPreview.data.personas.reduce((n,row)=>n+(row.memories?.length??0),0)} 条记忆。`),h('select',{className:'soul-select',value:strategy,onChange:e=>setStrategy(e.target.value),'aria-label':'整体导入方式'},h('option',{value:'merge'},'合并导入：保留现有，冲突项作为副本'),h('option',{value:'replace'},'替换全部：恢复整个存档')),h('p',{className:'soul-hint'},'替换、删除和整理前服务器会自动备份。验证失败不会写入。'),h('div',{className:'soul-row'},button('确认导入',()=>run(async()=>{await act('import',{archive:importPreview,strategy});setImportPreview(null);choose(library.current.current.defaultPersonaId,true);},'整体存档已导入。'),busy,'primary'),button('取消导入',()=>setImportPreview(null),busy))):null,
        h('div',{className:'soul-layout'},view?.personas.length?h('aside',{className:'soul-personas','aria-label':'人设列表'},...view.personas.map(row=>h('button',{key:row.id,className:'soul-button soul-persona','aria-pressed':selected===row.id,onClick:()=>choose(row.id),disabled:busy,title:row.name},h('span',{className:'soul-persona-name'},row.name),h('small',null,`${row.memories.length} 条记忆${view.defaultPersonaId===row.id?' · 默认':''}`)))):null,h('div',{className:'soul-card soul-editor'},h('div',{className:'soul-row soul-editor-tabs',role:'tablist'},...['persona','memory'].map(id=>h('button',{key:id,className:'soul-button soul-tab',role:'tab','aria-selected':tab===id,onClick:()=>setTab(id)},id==='persona'?'人格':'个人记忆'))),tab==='persona'?personaPanel:memoryPanel)),
        busy?h('p',{className:'soul-hint',role:'status'},'正在处理，请稍候…'):null,error||library.error?h('p',{className:'soul-error',role:'alert'},error||library.error):null,message?h('p',{className:'soul-success',role:'status'},message):null);
    }

    function PersonaMenu({soulSessionId}){
      const library=useLibrary(soulSessionId,true),[busy,setBusy]=React.useState(false),[error,setError]=React.useState(''),[open,setOpen]=React.useState(false);
      const view=library.view;
      React.useEffect(()=>{setOpen(false);setError('');},[soulSessionId,view?.enabled]);
      if(!view||!view.personas.length)return null;
      const defaultName=view.personas.find(row=>row.id===view.defaultPersonaId)?.name??'无';
      const selected=view.override??'';
      const currentName=selected==='none'?'不使用人设':view.personas.find(row=>row.id===(selected||view.defaultPersonaId))?.name??'人设';
      const label=(name,description)=>h('span',{className:'soul-menu-item'},h('span',{className:'soul-menu-name'},name),h('span',{className:'soul-menu-description'},description));
      const items=[
        {id:'',label:label('跟随默认',`全局默认人设：${defaultName}`)},
        ...view.personas.map(row=>({id:row.id,label:label(row.name,`${row.memoryCount} 条个人记忆`)})),
        {id:'soul:separator',type:'separator'},
        {id:'none',label:label('此会话不使用人设','关闭本会话的人格与个人记忆')},
      ];
      const choose=async personaId=>{
        setOpen(false);setBusy(true);setError('');
        try{await request('/action',{action:'session-select',data:{sessionId:soulSessionId,personaId},expectedRevision:view.revision,sessionId:soulSessionId});await library.load(true);}
        catch(cause){setError(cause.message);await library.load(true);}
        finally{setBusy(false);}
      };
      return h('span',{className:'soul-chip'},h(Menu,{
        open:open&&view.enabled&&!busy,items,selectedId:selected,onSelect:choose,onClose:()=>setOpen(false),portal:true,align:'start',className:'soul-chip-anchor',
        anchor:h('button',{type:'button',className:'soul-chip-button','aria-label':'本会话人设','aria-haspopup':'menu','aria-expanded':open&&view.enabled&&!busy,disabled:busy||!view.enabled,title:!view.enabled?'请在设置 → 私人灵魂启用人设':`人设：${selected?'':'跟随默认 · '}${currentName}`,onClick:()=>setOpen(value=>!value)},h(IconUserOutlineRegular,{size:16,className:'soul-chip-icon'}),h('span',{className:'soul-chip-label'},currentName),h(IconChevronDownOutlineRegular,{size:12,className:'soul-chip-chevron'})),
      }),error?h(Toast,{text:error,holdMs:5000,onDone:()=>setError('')}):null);
    }

    function QuickSwitch({soulSessionId}){
      const anchor=React.useRef(null),[target,setTarget]=React.useState(null);
      React.useLayoutEffect(()=>{
        const dock=anchor.current?.closest('[data-slot="conversation.input.dock"]');
        const scope=dock?.closest('[data-phase]')??dock?.closest('[data-content-phase]')??dock?.parentElement;
        if(!scope)return;
        let seat=null;
        const place=()=>{
          // The blank-session chip row and the existing-session header are owned
          // by the framework. A portal appends our chip without replacing them.
          const hero=scope.querySelector('[data-slot="conversation.hero.agentPreset"]');
          const header=scope.querySelector('[data-slot="conversation.session.header.actions"]');
          const row=(hero??header)?.parentElement;
          if(seat?.parentElement===row)return;
          seat?.remove();seat=null;
          if(row){seat=document.createElement('span');seat.dataset.soulPersonaSeat='';seat.style.display='contents';row.appendChild(seat);}
          setTarget(seat);
        };
        place();
        const observer=new MutationObserver(place);observer.observe(scope,{childList:true,subtree:true});
        return()=>{observer.disconnect();seat?.remove();};
      },[soulSessionId]);
      const control=h(PersonaMenu,{soulSessionId});
      return h(React.Fragment,null,h('span',{ref:anchor,hidden:true,'data-soul-persona-anchor':''}),target?createPortal(control,target):control);
    }
    function apply(ctx){
      ctx.effect(()=>{const style=document.createElement('style');style.dataset.plugin='private-soul-v2';style.textContent=css;document.head.appendChild(style);return()=>style.remove();},'private-soul: styles');
      ctx.slots.inject('settings.section',()=>ctx.slots.register({name:'settings.section',id:'private-soul',order:15,label:()=> '私人灵魂'},SoulEditor));
      ctx.slots.inject('conversation.input.dock',()=>ctx.slots.register({name:'conversation.input.dock',id:'private-soul-quick-switch',order:20,inject:sessionId=>({soulSessionId:sessionId})},QuickSwitch));
    }
    return {name:'private-soul-client',inject:['slots'],apply};
  },
});
