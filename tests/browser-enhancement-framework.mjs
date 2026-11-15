import {reportDirectory} from './report-directory.mjs';
import assert from'node:assert/strict';import{readFile,writeFile}from'node:fs/promises';
const {chromium}=await import(process.env.DSH_TEST_PLAYWRIGHT),base='http://127.0.0.1:14086',out=await reportDirectory('framework');
const browser=await chromium.launch({executablePath:process.env.DSH_TEST_CHROME,args:['--no-sandbox']}),page=await browser.newPage({viewport:{width:1440,height:1050},locale:'zh-CN',colorScheme:'dark'}),errors=[],report={};page.on('pageerror',e=>errors.push(e.message));
const enhancement=()=>page.request.get(base+'/private-soul/v2/enhancement').then(r=>r.json());
async function until(fn){for(let n=0;n<150;n++){const v=await fn();if(v)return v;await new Promise(r=>setTimeout(r,80));}throw Error('framework browser timeout');}
try{
 const original=await enhancement(),library=await readFile('test-results/native-host/home/private-soul/library.json'),requests=await readFile('test-results/native-host/reports/model-requests.jsonl');
 await page.goto(base);await page.waitForTimeout(1000);await page.getByRole('button',{name:/^(账号菜单|Account menu)$/}).click();await page.getByText(/^(设置|Settings)$/,{exact:true}).click();
 if(await page.getByRole('button',{name:'General',exact:true}).count()){await page.getByRole('button',{name:'General',exact:true}).click();await page.getByRole('button',{name:'English',exact:true}).click();await page.getByRole('menuitem',{name:'中文',exact:true}).click();}
 await page.getByRole('button',{name:'私人灵魂',exact:true}).click();await page.getByRole('button',{name:'提示词增强高级设置',exact:true}).click();const dialog=page.getByRole('dialog',{name:'提示词增强高级设置',exact:true});await dialog.waitFor();await dialog.getByRole('tab',{name:'诊断',exact:true}).click();
 await dialog.getByRole('button',{name:'重新检查模式',exact:true}).click();await until(async()=>Object.values((await enhancement()).modes).every(m=>m.checked));
 await dialog.getByRole('tab',{name:'提示词',exact:true}).click();
 const editor=dialog.getByRole('textbox',{name:'增强提示词（仅新增部分）',exact:true});await editor.fill('FULL_PREVIEW_LITERAL {{literal}}');await dialog.getByRole('tab',{name:'诊断',exact:true}).click();
 const rows=[];
 for(const [id,label]of[['standard','Standard'],['ptc','PTC'],['minimal','Minimal'],['cordis','Cordis']]){
  await dialog.getByRole('tab',{name:label,exact:true}).click();await dialog.getByRole('button',{name:'预览完整系统提示词',exact:true}).click();const preview=dialog.getByRole('textbox',{name:'完整系统提示词预览',exact:true});await until(async()=>await preview.count());const text=await preview.inputValue();assert.match(text,/FULL_PREVIEW_LITERAL \{\{literal\}\}/);assert.match(text,/personal-memory instructions are exempt/);assert.ok(text.length>1500);if(id==='ptc')assert.match(text,/declare const tools/);rows.push({id,characters:text.length,literal:true,fullAssembly:true});
 }
 report.fourFullPreviews=rows;
 for(const width of[1440,390,320])for(const scheme of['dark','light']){
  await page.setViewportSize({width,height:700});await page.emulateMedia({colorScheme:scheme});await page.waitForTimeout(350);
  const dimensions=await dialog.evaluate(n=>{const r=n.getBoundingClientRect(),c=n.firstElementChild;return{top:r.y,bottom:r.bottom,width:r.width,contentWidth:c.clientWidth,contentScroll:c.scrollWidth};});assert.ok(dimensions.top>=0&&dimensions.bottom<=700);assert.ok(dimensions.contentScroll<=dimensions.contentWidth+1,JSON.stringify(dimensions));
  await dialog.getByRole('button',{name:'保存设置',exact:true}).scrollIntoViewIfNeeded();assert.ok(await dialog.getByRole('button',{name:'保存设置',exact:true}).evaluate(n=>n.getBoundingClientRect().bottom<=innerHeight));
  await page.screenshot({path:out+'/framework-'+scheme+'-'+width+'.png'});
 }
 await page.keyboard.press('Escape');await dialog.waitFor({state:'hidden'});const after=await enhancement();assert.equal(after.enabled,original.enabled);assert.equal(after.revision,original.revision);assert.deepEqual(after.settings,original.settings);assert.deepEqual(await readFile('test-results/native-host/home/private-soul/library.json'),library);assert.deepEqual(await readFile('test-results/native-host/reports/model-requests.jsonl'),requests);assert.deepEqual(errors,[]);
 Object.assign(report,{recheckAndPreviewsReadOnly:true,noModelCalls:true,originalLibraryUnchanged:true,allWidthsAndThemes:true,pageErrors:errors,passed:true});
}catch(error){report.error=String(error);report.pageErrors=errors;await page.screenshot({path:out+'/framework-failure.png'}).catch(()=>{});throw error;}finally{await writeFile(out+'/browser-framework.json',JSON.stringify(report,null,2));console.log(report);await browser.close();}
