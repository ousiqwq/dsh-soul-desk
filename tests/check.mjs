import { fileURLToPath } from 'node:url';
import {readdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
const root=new URL('../',import.meta.url);
for(const file of await readdir(root))if(file.endsWith('.js')){
  const result=spawnSync(process.execPath,['--check',fileURLToPath(new URL(file,root))],{stdio:'inherit'});
  if(result.status!==0)process.exit(result.status??1);
}
console.log('All plugin JavaScript files passed syntax checks.');
