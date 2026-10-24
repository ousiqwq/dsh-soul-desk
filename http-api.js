import { SoulError } from './memory-policy.js';
import { MAX_LIBRARY_BYTES } from './store.js';
import { organizePreview } from './model-memory.js';

const BASE='/private-soul/v2';
function send(response,status,value) {response.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});response.end(JSON.stringify(value));}
async function readBody(request,signal) {
  let size=0;const buffers=[];
  for await(const chunk of request){signal.throwIfAborted();size+=chunk.length;if(size>MAX_LIBRARY_BYTES+65536)throw new SoulError('导入文件过大，最多8 MiB。','body-size',413);buffers.push(chunk);}
  try{return JSON.parse(Buffer.concat(buffers).toString('utf8'));}catch{throw new SoulError('请求不是有效的 JSON。');}
}

export function registerSoulApi(ctx,store) {
  const connection=ctx.connection;
  ctx.effect(()=>ctx.webServer.register({kind:'prefix',path:BASE,handler:async(request,response)=>{
    const rejection=connection.requestRejection(request);
    if(rejection!==undefined){send(response,rejection,{error:rejection===401?'请使用 Harness 认证链接登录。':'请求来源不受信任。',code:'unauthorized'});return;}
    const controller=new AbortController();
    const abort=()=>{if(!response.writableEnded)controller.abort('client disconnected');};
    request.once('aborted',abort);response.once('close',abort);
    const signal=AbortSignal.any([controller.signal,AbortSignal.timeout(60000)]);
    try{
      const url=new URL(request.url,'http://local');const endpoint=url.pathname.slice(BASE.length);
      if(request.method==='GET'&&endpoint==='/state'){
        const since=url.searchParams.get('since');if(since!==null&&Number(since)===store.state.revision){send(response,200,{notModified:true,revision:store.state.revision});return;}
        send(response,200,store.view(url.searchParams.get('sessionId'),url.searchParams.get('compact')==='1'));return;
      }
      if(request.method==='GET'&&endpoint==='/export'){send(response,200,store.export());return;}
      if(request.method!=='POST'){send(response,404,{error:'接口不存在。'});return;}
      if(!String(request.headers['content-type']).toLowerCase().startsWith('application/json'))throw new SoulError('请求必须使用 application/json。','content-type',415);
      const data=await readBody(request,signal);
      if(endpoint==='/organize-preview'){
        const agent=data.sessionId?ctx.get('agents')?.get(data.sessionId):undefined;
        send(response,200,await organizePreview(ctx,store,data.personaId,{agent,signal}));return;
      }
      if(endpoint!=='/action'){send(response,404,{error:'接口不存在。'});return;}
      if(!Number.isSafeInteger(data.expectedRevision)||data.expectedRevision<0)throw new SoulError('写入需要有效的修订号。','revision-required');
      signal.throwIfAborted();const result=await store.action(data.action,data.data??{},data.expectedRevision);
      send(response,200,{...result,view:store.view(data.sessionId)});
    }catch(error){if(!response.writableEnded)send(response,error.status??500,{error:error instanceof SoulError?error.message:'操作未完成，请重试。',code:error.code??'internal'});}
    finally{request.off('aborted',abort);response.off('close',abort);}
  }}),'private-soul: authenticated API');
}
