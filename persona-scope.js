import { scopeChainOf } from '@deepseek-ai/dsh-scope';

export function createPersonaRuntime(store) {
  const bindings=new WeakMap();
  const resolve=scope=>store.resolve(scopeChainOf(scope).map(key=>key?.session?.id??key?.id).filter(id=>typeof id==='string'));
  return {
    forPrompt(scope){const persona=resolve(scope);if(scope)bindings.set(scope,persona?.id??null);return persona;},
    forExecution(agent){
      if(!store.state.enabled)return null;
      if(bindings.has(agent)){const id=bindings.get(agent);return id?store.state.personas.find(row=>row.id===id)??null:null;}
      return resolve(agent);
    },
  };
}
