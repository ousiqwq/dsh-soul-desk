import { SoulError } from './memory-policy.js';
import { MAX_LIBRARY_BYTES } from './store.js';
import { organizePreview } from './model-memory.js';
import { renderEnhancementPrompt } from './prompt-enhancement.js';

const BASE='/private-soul/v2';
export const ENHANCEMENT_API = '/api/private-soul/enhancement';
const MAX_ENHANCEMENT_BODY_BYTES = 128 * 1024;
function send(response,status,value) {response.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});response.end(JSON.stringify(value));}
async function readBody(request,signal) {
  let size=0;const buffers=[];
  for await(const chunk of request){signal.throwIfAborted();size+=chunk.length;if(size>MAX_LIBRARY_BYTES+65536)throw new SoulError('导入文件过大，最多8 MiB。','body-size',413);buffers.push(chunk);}
  try{return JSON.parse(Buffer.concat(buffers).toString('utf8'));}catch{throw new SoulError('请求不是有效的 JSON。');}
}

function enhancementView(store, runtime) {
  return { ...store.view(), ...runtime?.status() };
}

async function enhancementAction(store, runtime, data, signal) {
  signal.throwIfAborted();
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new SoulError('请求必须是 JSON 对象。');
  }
  if (data.action === 'preview') return { preview: renderEnhancementPrompt(data.data?.settings) };
  if (data.action === 'preview-mode' && runtime) {
    return runtime.previewFor(data.data?.presetId, { settings: data.data?.settings, signal });
  }
  if (data.action === 'recheck' && runtime) return runtime.recheck();
  return { ...await store.action(data.action, data.data ?? {}, data.expectedRevision), ...runtime?.status() };
}

async function readEnhancementBody(request, signal) {
  const mediaType = request.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase();
  if (mediaType !== 'application/json') throw new SoulError('请求必须使用 application/json。', 'content-type', 415);
  const chunks = [];
  let bytes = 0;
  for await (const chunk of request.body ?? []) {
    signal.throwIfAborted();
    bytes += chunk.byteLength;
    if (bytes > MAX_ENHANCEMENT_BODY_BYTES) throw new SoulError('增强设置请求过大。', 'body-size', 413);
    chunks.push(chunk);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch { throw new SoulError('请求不是有效的 JSON。'); }
}

/** The Connection exact-route registry applies its owner and origin checks. */
export function registerEnhancementApi(ctx, store, runtime) {
  return ctx.connection.fetch.register({
    path: ENHANCEMENT_API,
    methods: ['GET', 'POST'],
    requestBody: 'buffered',
    async fetch(request) {
      const headers = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };
      const signal = AbortSignal.any([request.signal, AbortSignal.timeout(60000)]);
      try {
        if (request.method === 'GET') return Response.json(enhancementView(store, runtime), { headers });
        const data = await readEnhancementBody(request, signal);
        return Response.json(await enhancementAction(store, runtime, data, signal), { headers });
      } catch (error) {
        const failure = error instanceof SoulError;
        return Response.json({
          error: failure ? error.message : '操作未完成，请重试。',
          code: failure ? error.code : 'internal',
        }, { status: failure ? error.status : 500, headers });
      }
    },
  });
}

export function registerSoulApi(ctx,store,runtime,enhancement,enhancementRuntime) {
  const connection=ctx.connection;
  ctx.effect(()=>ctx.webServer.register({kind:'prefix',path:BASE,auth:'required',handler:async(request,response,peer)=>{
    // Older WebServer versions authenticate the request in the handler itself.
    const rejection = peer ? (peer.principal?.kind === 'owner' ? undefined : 403)
      : typeof connection.requestRejection === 'function' ? connection.requestRejection(request) : 401;
    if(rejection!==undefined){send(response,rejection,{error:rejection===401?'请使用 Harness 认证链接登录。':'请求来源不受信任。',code:'unauthorized'});return;}
    const controller=new AbortController();
    const abort=()=>{if(!response.writableEnded)controller.abort('client disconnected');};
    request.once('aborted',abort);response.once('close',abort);
    const signal=AbortSignal.any([controller.signal,AbortSignal.timeout(60000)]);
    try{
      const url=new URL(request.url,'http://local');const endpoint=url.pathname.slice(BASE.length);
      if(request.method==='GET'&&endpoint==='/enhancement'&&enhancement){send(response,200,enhancementView(enhancement,enhancementRuntime));return;}
      if(request.method==='GET'&&endpoint==='/state'){
        const id=url.searchParams.get('sessionId'),compact=url.searchParams.get('compact')==='1';
        const view=store.view(id,compact,id?runtime?.descriptor(id):{});
        if(!compact&&runtime){await runtime.refresh();Object.assign(view,{catalog:runtime.catalog()});}
        send(response,200,view);return;
      }
      if(request.method==='GET'&&endpoint==='/export'){send(response,200,store.export());return;}
      if(request.method!=='POST'){send(response,404,{error:'接口不存在。'});return;}
      if(!String(request.headers['content-type']).toLowerCase().startsWith('application/json'))throw new SoulError('请求必须使用 application/json。','content-type',415);
      const data=await readBody(request,signal);
      if(!data||typeof data!=='object'||Array.isArray(data))throw new SoulError('请求必须是 JSON 对象。');
      if(endpoint==='/enhancement'&&enhancement){
        send(response,200,await enhancementAction(enhancement,enhancementRuntime,data,signal));return;
      }
      if(endpoint==='/organize-preview'){
        const agent=data.sessionId?ctx.get('agents')?.get(data.sessionId):undefined;
        send(response,200,await organizePreview(ctx,store,data.personaId,{agent,signal}));return;
      }
      if(endpoint!=='/action'){send(response,404,{error:'接口不存在。'});return;}
      if(!Number.isSafeInteger(data.expectedRevision)||data.expectedRevision<0)throw new SoulError('写入需要有效的修订号。','revision-required');
      if(data.action==='rule-set'&&runtime){
        const catalog=runtime.catalog();
        if(data.data?.scope==='workspace'&&!catalog.workspaces.some(row=>row.id===data.data.id))throw new SoulError('工作区已不存在，请刷新。');
        if(data.data?.scope==='session'&&!catalog.sessions.some(row=>row.id===data.data.id))throw new SoulError('会话已不存在，请刷新。');
      }
      signal.throwIfAborted();const result=await store.action(data.action,data.data??{},data.expectedRevision);
      const view=store.view(data.sessionId,false,data.sessionId?runtime?.descriptor(data.sessionId):{});
      if(runtime)view.catalog=runtime.catalog();
      send(response,200,{...result,view});
    }catch(error){if(!response.writableEnded)send(response,error.status??500,{error:error instanceof SoulError?error.message:'操作未完成，请重试。',code:error.code??'internal'});}
    finally{request.off('aborted',abort);response.off('close',abort);}
  }}),'private-soul: authenticated API');
}
