import { appendFile } from 'node:fs/promises';
import { join } from 'node:path';
if (!process.env.DSH_TEST_RUNTIME || !process.env.DSH_TEST_REPORTDIR) throw new Error('This fixture requires an isolated native test host');
const { LlmAdapter, ToolCallId } = await import(join(process.env.DSH_TEST_RUNTIME,'node_modules/@deepseek-ai/dsh-llm/lib/index.js'));
export const name='soul-native-validation-model';
export const inject=['llm'];
class Adapter extends LlmAdapter {
  providerInfo(provider){return{id:provider,name:'Soul isolated fixture'};}
  async listModels(provider){return[{provider,id:'fixture',name:'Soul isolated fixture'}];}
  async resolveModel(provider,id){return{provider,id,name:'Soul isolated fixture',context:{contextWindow:128000}};}
  async *stream(options){
    options.signal?.throwIfAborted();
    const last=options.messages?.filter(m=>['assistant','tool'].includes(m.role)||['user','agent-message'].includes(m.source?.kind)).at(-1);
    const text=last?.content?.filter(c=>c.type==='text').map(c=>c.text).join('\n')??'';
    const system=JSON.stringify(options.messages?.filter(m=>m.role==='system')??[]);
    const identity=system.match(/SOUL_PERSONA_([ABC])/)?.[1]??'none';
    await appendFile(join(process.env.DSH_TEST_REPORTDIR,'model-requests.jsonl'),JSON.stringify({identity,text,tools:options.tools?.map(t=>t.name),privateMemory:system.includes('SOUL_PRIVATE_MEMORY'),toolResult:last?.role==='tool'?last.content:undefined})+'\n');
    if(last?.role==='user'&&text.startsWith('SOUL_CALL:')){
      const {name,args}=JSON.parse(text.slice(10).split('\n')[0]),id=ToolCallId('soul-fixture-'+Date.now());
      yield{type:'block-start',index:0,blockType:'tool-call'};
      yield{type:'tool-call-delta',index:0,id,name,argumentsDelta:JSON.stringify(args)};
      yield{type:'block-end',index:0,block:{type:'tool-call',id,name,arguments:JSON.stringify(args)}};
      yield{type:'finish',reason:{kind:'tool-calls'}};return;
    }
    const content=JSON.stringify({identity,privateMemory:system.includes('SOUL_PRIVATE_MEMORY'),response:'Native fixture completed'});
    yield{type:'block-start',index:0,blockType:'text'};yield{type:'text-delta',index:0,text:content};yield{type:'block-end',index:0,block:{type:'text',text:content}};yield{type:'finish',reason:{kind:'stop'}};
  }
}
export function apply(ctx){ctx.llm.registerAdapter(['soul-fixture'],new Adapter());}
