import {spawn} from 'node:child_process';
import {resolve} from 'node:path';
const runtime=process.env.DSH_TEST_RUNTIME;
if(!runtime)throw Error('DSH_TEST_RUNTIME must point to the native test runtime');
const root=resolve('test-results/native-host');
const child=spawn(process.execPath,[runtime+'/lib/bin.js','web','--patch',root+'/test.patch.yml','--host','127.0.0.1','--port','14086','--no-open'],{cwd:root+'/workspaces/alpha',env:{...process.env,DSH_HOME:root+'/home',DSH_LAN_NO_AUTH:'1',DSH_TEST_RUNTIME:runtime,DSH_TEST_REPORTDIR:root+'/reports',PATH:runtime+'/node_modules/.bin:'+process.env.PATH},stdio:'inherit'});
for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>child.kill(signal));
child.on('exit',code=>process.exit(code??1));
