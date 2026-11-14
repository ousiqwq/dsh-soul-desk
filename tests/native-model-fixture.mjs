import { appendFile, readFile } from 'node:fs/promises';
import { join } from 'node:path';
if (!process.env.DSH_TEST_RUNTIME || !process.env.DSH_TEST_REPORTDIR) throw new Error('This fixture requires an isolated native test host');
const { LlmAdapter, ToolCallId } = await import(join(process.env.DSH_TEST_RUNTIME,'node_modules/@deepseek-ai/dsh-llm/lib/index.js'));
export const name='soul-native-validation-model';
export const inject=['llm'];
class Adapter extends LlmAdapter {
  providerInfo(provider){return{id:provider,name:'Soul isolated fixture'};}
  async listModels(provider){return[{provider,id:'fixture',name:'Soul isolated fixture'},{provider,id:'fixture-alt',name:'Alternate isolated fixture'}];}
  async resolveModel(provider,id){return{provider,id,name:'Soul isolated fixture',context:{contextWindow:128000}};}
  async *stream(options){
    options.signal?.throwIfAborted();
    const last=options.messages?.filter(m=>['assistant','tool'].includes(m.role)||['user','agent-message'].includes(m.source?.kind)).at(-1)??options.messages?.findLast(m=>m.role==='user');
    const text=last?.content?.filter(c=>c.type==='text').map(c=>c.text).join('\n')??'';
    const system=JSON.stringify(options.messages?.filter(m=>m.role==='system')??[]);
    const skillCatalog=options.messages?.flatMap(m=>m.content?.filter(c=>c.type==='text'&&c.text.includes('<available_skills>')).map(c=>c.text)??[]).at(-1)??'';
    const identity=system.match(/SOUL_PERSONA_([ABC])/)?.[1]??'none';
    await appendFile(join(process.env.DSH_TEST_REPORTDIR,'model-requests.jsonl'),JSON.stringify({identity,system,skillCatalog,systemPersonas:[...new Set([...system.matchAll(/SOUL_PERSONA_([ABC])/g)].map(match=>match[1]))],text,tools:options.tools?.map(t=>t.name),privateMemory:system.includes('SOUL_PRIVATE_MEMORY'),memoryB:system.includes('SOUL_MEMORY_B'),toolResult:last?.role==='tool'?last.content:undefined})+'\n');
    if(last?.role==='user'&&text.startsWith('SOUL_CALL:')){
      const {name,args}=JSON.parse(text.slice(10).split('\n')[0]),id=ToolCallId('soul-fixture-'+Date.now());
      yield{type:'block-start',index:0,blockType:'tool-call'};
      yield{type:'tool-call-delta',index:0,id,name,argumentsDelta:JSON.stringify(args)};
      yield{type:'block-end',index:0,block:{type:'tool-call',id,name,arguments:JSON.stringify(args)}};
      yield{type:'finish',reason:{kind:'tool-calls'}};return;
    }
    let data;try{data=JSON.parse(text);}catch{}
    const systemText=(options.system??'')+'\n'+(options.messages?.filter(m=>m.role==='system').flatMap(m=>m.content?.filter(c=>c.type==='text').map(c=>c.text)??[]).join('\n')??'');
    const forced=systemText.includes('"force":true');
    if (Array.isArray(data?.items) && data.items.some(item=>item.name.startsWith('queue-ui-'))) {
      const controlFile=join(process.env.DSH_TEST_REPORTDIR,'translation-control.json');
      const control=async()=>JSON.parse(await readFile(controlFile,'utf8').catch(()=>'{}'));
      const key=data.items[0].name; this.translationActive=(this.translationActive??0)+1;
      const event=phase=>appendFile(join(process.env.DSH_TEST_REPORTDIR,'translation-events.jsonl'),JSON.stringify({phase,key,active:this.translationActive})+'\n');
      await event('start');
      try {
        for (;;) { options.signal?.throwIfAborted(); const config=await control(); if (!config.hold || config.release?.includes(key)) break; await new Promise(resolve=>setTimeout(resolve,40)); }
        const config=await control(); if(config.fail?.includes(key)){yield{type:'text-delta',index:0,text:'not JSON'};yield{type:'finish',reason:{kind:'stop'}};return;}
      } finally { this.translationActive--; await event('end'); }
    }

    const content=JSON.stringify(Array.isArray(data?.items)?{items:data.items.map(item=>item.name==='native-ui-policy'&&!forced?{key:item.key,status:'same_language',title:item.name,description:item.description}:{key:item.key,status:'translated',title:'测试 · '+item.name,description:'这是第 '+Date.now()+' 次本地夹具翻译说明。'} )}:{identity,privateMemory:system.includes('SOUL_PRIVATE_MEMORY'),response:'Native fixture completed'});
    yield{type:'block-start',index:0,blockType:'text'};yield{type:'text-delta',index:0,text:content};yield{type:'block-end',index:0,block:{type:'text',text:content}};yield{type:'finish',reason:{kind:'stop'}};
  }
}
export function apply(ctx){
  ctx.llm.registerAdapter(['soul-fixture'],new Adapter());
  ctx.inject(['skills'],child=>{
    for(const name of ['native-ui-fixture','native-ui-policy',...Array.from({length:12},(_,n)=>'queue-ui-'+String(n+1).padStart(2,'0'))])child.skills.register({name,description:name==='native-ui-policy'?'这是中文说明，用于验证同语言提示和再次点击强制翻译。':'Translate and configure this synthetic native UI test skill.',content:'Synthetic acceptance fixture only.',source:'native-ui-test'});
  });
}
