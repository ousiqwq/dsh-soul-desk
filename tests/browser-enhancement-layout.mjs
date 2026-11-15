import {reportDirectory} from './report-directory.mjs';
import assert from'node:assert/strict';import{readFile,writeFile}from'node:fs/promises';
const{chromium}=await import(process.env.DSH_TEST_PLAYWRIGHT),base='http://127.0.0.1:14086',out=await reportDirectory('layout');
const browser=await chromium.launch({executablePath:process.env.DSH_TEST_CHROME,args:['--no-sandbox']}),page=await browser.newPage({viewport:{width:1440,height:1000},locale:'zh-CN',colorScheme:'dark'}),report={},errors=[];page.on('pageerror',e=>errors.push(e.message));
const state=()=>page.request.get(base+'/private-soul/v2/enhancement').then(r=>r.json());
try{
 const before=await state(),library=await readFile('test-results/native-host/home/private-soul/library.json');await page.goto(base);await page.waitForTimeout(900);await page.getByRole('button',{name:/^(账号菜单|Account menu)$/}).click();await page.getByText(/^(设置|Settings)$/,{exact:true}).click();
 if(await page.getByRole('button',{name:'General',exact:true}).count()){await page.getByRole('button',{name:'General',exact:true}).click();await page.getByRole('button',{name:'English',exact:true}).click();await page.getByRole('menuitem',{name:'中文',exact:true}).click();}
 await page.getByRole('button',{name:'私人灵魂',exact:true}).click();const gear=page.getByRole('button',{name:'提示词增强高级设置',exact:true});await gear.click();const dialog=page.getByRole('dialog',{name:'提示词增强高级设置',exact:true});await dialog.waitFor();await page.waitForTimeout(350);
 assert.equal(await dialog.getByRole('tab',{name:'常规',exact:true}).getAttribute('aria-selected'),'true');assert.equal(await dialog.getByRole('switch').count(),4);assert.equal(await dialog.getByRole('textbox').count(),0);assert.equal(await dialog.getByRole('button',{name:'重新检查模式',exact:true}).count(),0);
 const layouts=[];
 for(const scheme of['dark','light'])for(const width of[1440,390,320]){
  await page.emulateMedia({colorScheme:scheme});await page.setViewportSize({width,height:700});let reference;
  for(const[section,label]of[['general','常规'],['prompt','提示词'],['diagnostics','诊断']]){
   await dialog.getByRole('tab',{name:label,exact:true}).click();await page.waitForTimeout(120);const box=await dialog.boundingBox();if(reference){assert.ok(Math.abs(box.height-reference.height)<1);assert.ok(Math.abs(box.y-reference.y)<1);}else reference=box;
   const metrics=await dialog.evaluate(n=>{const r=n.getBoundingClientRect(),panel=n.querySelector('[data-soul-enhancement-panel]');return{top:r.top,bottom:r.bottom,right:r.right,width:r.width,scroll:n.scrollWidth,client:n.clientWidth,panelScroll:panel.scrollWidth,panelWidth:panel.clientWidth};});assert.ok(metrics.top>=0&&metrics.bottom<=700&&metrics.right<=width);assert.ok(metrics.scroll<=metrics.client+1&&metrics.panelScroll<=metrics.panelWidth+1,JSON.stringify(metrics));
   assert.ok(await dialog.getByRole('button',{name:'保存设置',exact:true}).evaluate(n=>{const r=n.getBoundingClientRect();return r.y>=0&&r.bottom<=innerHeight;}));
   await page.screenshot({path:out+'/'+section+'-'+scheme+'-'+width+'.png',animations:'disabled'});layouts.push({section,scheme,viewport:width,...metrics});
  }
 }
 report.fixedWindowAcrossTabsAndWidths=layouts;
 await page.setViewportSize({width:1440,height:1000});await dialog.getByRole('tab',{name:'常规',exact:true}).click();const child=dialog.getByRole('switch',{name:'应用于子代理',exact:true}),wasChecked=await child.getAttribute('aria-checked');await child.click();
 await dialog.getByRole('tab',{name:'提示词',exact:true}).click();const editor=dialog.getByRole('textbox',{name:'增强提示词（仅新增部分）',exact:true});await editor.fill('跨页保留草稿 {{literal}}');
 await dialog.getByRole('tab',{name:'诊断',exact:true}).click();await dialog.getByRole('tab',{name:'提示词',exact:true}).click();assert.equal(await editor.inputValue(),'跨页保留草稿 {{literal}}');await dialog.getByRole('tab',{name:'常规',exact:true}).click();assert.notEqual(await child.getAttribute('aria-checked'),wasChecked);
 await page.keyboard.press('Escape');await dialog.waitFor({state:'hidden'});await gear.click();await dialog.waitFor();assert.notEqual(await child.getAttribute('aria-checked'),wasChecked);await dialog.getByRole('tab',{name:'提示词',exact:true}).click();assert.equal(await editor.inputValue(),'跨页保留草稿 {{literal}}');await page.keyboard.press('Escape');
 const after=await state();assert.equal(after.revision,before.revision);assert.equal(after.enabled,before.enabled);assert.deepEqual(after.settings,before.settings);assert.deepEqual(await readFile('test-results/native-host/home/private-soul/library.json'),library);assert.deepEqual(errors,[]);Object.assign(report,{draftAcrossTabsAndReopen:true,noConfigurationWrites:true,libraryUnchanged:true,pageErrors:errors,passed:true});
}catch(error){report.error=String(error);report.pageErrors=errors;await page.screenshot({path:out+'/layout-failure.png'}).catch(()=>{});throw error;}finally{await writeFile(out+'/layout.json',JSON.stringify(report,null,2));console.log({passed:report.passed,error:report.error,layouts:report.fixedWindowAcrossTabsAndWidths?.length,pageErrors:errors});await browser.close();}
