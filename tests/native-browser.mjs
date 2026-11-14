import {readFile,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
const root='http://127.0.0.1:14086',dir='test-results/native-host/reports';
const {chromium}=await import(process.env.DSH_TEST_PLAYWRIGHT??'playwright');
const browser=await chromium.launch({headless:true,...(process.env.DSH_TEST_CHROME?{executablePath:process.env.DSH_TEST_CHROME}:{}),args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1440,height:1000},locale:'zh-CN',colorScheme:'dark'}),errors=[];
const fixture=JSON.parse(await readFile('test-results/native-host/fixture.json','utf8'));
page.on('pageerror',e=>errors.push(e.message));
try{
  await page.goto(root);
  await page.waitForTimeout(800);
  if(await page.getByRole('button',{name:'继续',exact:true}).count())await page.getByRole('button',{name:'继续',exact:true}).click();
  await page.getByRole('button',{name:'账号菜单',exact:true}).click();
  await page.getByText('设置',{exact:true}).click();
  await page.getByRole('button',{name:'私人灵魂',exact:true}).click();
  await page.getByRole('region',{name:'人设使用规则'}).waitFor();
  console.log((await page.locator('body').innerText()).slice(-7000));
  const metrics=[];
  for(const width of [1440,900,650,390,320]){
    await page.setViewportSize({width,height:1000});
    const sizes=await page.locator('.soul-page').evaluate(el=>({width:el.clientWidth,scroll:el.scrollWidth}));
    assert.ok(sizes.scroll<=sizes.width+1,JSON.stringify({width,sizes}));
    const region=page.getByRole('region',{name:'人设使用规则'}),picker=region.getByRole('button',{name:'选择工作区',exact:true});
    await region.getByRole('tab',{name:'全局默认',exact:true}).click();await page.waitForTimeout(250);
    assert.ok(await picker.isDisabled());const globalBox=await region.boundingBox(),globalPicker=await picker.boundingBox();
    const selected=await picker.innerText();
    await region.getByRole('tab',{name:'工作区',exact:true}).click();await page.waitForTimeout(250);
    assert.ok(await picker.isEnabled());const workspaceBox=await region.boundingBox(),workspacePicker=await picker.boundingBox();
    assert.ok(Math.abs(globalBox.height-workspaceBox.height)<1,JSON.stringify({width,globalBox,workspaceBox}));
    assert.ok(Math.abs(globalPicker.y-workspacePicker.y)<1);assert.ok(Math.abs(globalPicker.height-workspacePicker.height)<1);assert.equal(await picker.innerText(),selected);
    metrics.push({viewport:width,...sizes,globalHeight:globalBox.height,workspaceHeight:workspaceBox.height,pickerPositionStable:true});
  }
  await page.setViewportSize({width:1440,height:1000});
  const region=page.getByRole('region',{name:'人设使用规则'});
  assert.equal(await region.getByRole('tab').count(),2);
  assert.equal(await region.getByRole('tab',{name:'会话',exact:true}).count(),0);
  await region.getByRole('tab',{name:'工作区',exact:true}).click();
  await region.getByRole('button',{name:'选择工作区',exact:true}).click();
  assert.ok((await page.getByRole('menu').innerText()).includes('/home/'));
  const note=page.locator('.soul-workspace-path').first();
  const noteStyle=await note.evaluate(el=>({note:parseFloat(getComputedStyle(el).fontSize),name:parseFloat(getComputedStyle(el.previousElementSibling).fontSize)}));assert.ok(noteStyle.note<noteStyle.name);
  await page.screenshot({path:dir+'/workspace-options-local.png'});
  await page.keyboard.press('Escape');
  const picker=region.getByRole('button',{name:'选择工作区',exact:true});
  assert.ok(!(await picker.innerText()).includes('/home/'));assert.ok((await picker.boundingBox()).height<=40);
  await picker.click();await page.getByRole('menuitem').filter({hasText:fixture.space.path}).click();
  const chosenWorkspace=await picker.innerText();
  await region.getByRole('tab',{name:'全局默认',exact:true}).click();await page.waitForTimeout(250);assert.ok(await picker.isDisabled());
  assert.equal(await picker.innerText(),chosenWorkspace);
  await page.screenshot({path:dir+'/rules-global-disabled.png'});
  await region.getByRole('tab',{name:'工作区',exact:true}).click();await page.waitForTimeout(250);assert.ok(await picker.isEnabled());
  assert.equal(await picker.innerText(),chosenWorkspace);
  await page.screenshot({path:dir+'/rules-workspace-local.png'});
  await page.getByRole('button',{name:'关闭',exact:true}).click();
  await page.getByText('灵魂三层与子代理验收',{exact:true}).first().click();
  const trigger=page.getByRole('button',{name:'本会话人设与子代理规则',exact:true});
  assert.equal(await trigger.count(),1);
  await page.mouse.move(10,10);
  const appearance=await trigger.evaluate(el=>{const s=getComputedStyle(el);return{background:s.backgroundColor,border:s.borderTopWidth,shadow:s.boxShadow};});
  assert.equal(appearance.background,'rgba(0, 0, 0, 0)');assert.equal(appearance.border,'0px');assert.equal(appearance.shadow,'none');
  async function choose(group,name){await trigger.click();await page.getByRole('menuitem',{name:new RegExp('^'+group+'：')}).hover();await page.getByRole('menu').last().getByRole('menuitem',{name,exact:true}).last().click();}
  async function verifyInjection(expected){
    const text='UI_SWITCH_PROBE_'+randomUUID();
    const response=await page.request.post(root+'/api/session/prompt',{headers:{Origin:root},data:{type:'client-request',rpcId:randomUUID(),method:'session/prompt',payload:{args:{request:{sessionId:fixture.root,requestId:randomUUID(),mode:'queue',content:[{type:'text',text}]}}}}});
    const receipt=await response.json();assert.equal(receipt.result?.ok,true,JSON.stringify(receipt));
    for(let i=0;i<100;i++){
      const rows=(await readFile(dir+'/model-requests.jsonl','utf8')).trim().split('\n').map(line=>JSON.parse(line)),row=rows.find(row=>row.text===text);
      if(row){assert.deepEqual(row.systemPersonas,[expected]);assert.equal(row.privateMemory,false);assert.equal(row.memoryB,expected==='B');return;}
      await new Promise(resolve=>setTimeout(resolve,100));
    }
    throw Error('UI-selected persona did not reach the native model request');
  }
  await choose('本会话','验收人设 B');
  await page.waitForFunction(async([root,id])=>(await(await fetch(root+'/private-soul/v2/state?sessionId='+id)).json()).activePersonaId!==null,[root,fixture.root]);
  await choose('子代理','复用当前人设');
  let view=await(await page.request.get(root+'/private-soul/v2/state?sessionId='+fixture.root)).json();assert.equal(view.activePersonaId,fixture.ids.B);assert.equal(view.children.selection.mode,'parent');
  await verifyInjection('B');
  await page.reload();await trigger.waitFor();assert.equal(await trigger.count(),1);assert.match(await trigger.innerText(),/验收人设 B.*子代理：复用当前人设/s);
  await trigger.click();await page.getByRole('menuitem',{name:/^本会话：/}).hover();await page.screenshot({path:dir+'/conversation-menu-dark.png'});await page.keyboard.press('Escape');await page.keyboard.press('Escape');
  await page.emulateMedia({colorScheme:'light'});await page.screenshot({path:dir+'/conversation-light.png'});
  await choose('本会话','验收人设 C');await choose('子代理','不使用人设');
  view=await(await page.request.get(root+'/private-soul/v2/state?sessionId='+fixture.root)).json();assert.equal(view.activePersonaId,fixture.ids.C);assert.equal(view.children.selection.mode,'none');
  await verifyInjection('C');
  await page.getByRole('button',{name:'账号菜单',exact:true}).click();await page.getByText('设置',{exact:true}).click();await page.getByRole('button',{name:'通用设置',exact:true}).click();
  console.log('GENERAL', (await page.locator('body').innerText()).slice(-5000));
  await page.getByRole('button',{name:'中文',exact:true}).click();await page.getByRole('menuitem',{name:'English',exact:true}).click();
  await page.getByRole('button',{name:'Private Soul',exact:true}).click();await page.getByRole('region',{name:'Persona rules',exact:true}).waitFor();
  assert.equal(await page.getByRole('region',{name:'Persona rules'}).getByRole('tab').count(),2);
  await page.screenshot({path:dir+'/rules-english.png'});
  await page.getByRole('button',{name:'General',exact:true}).click();await page.getByRole('button',{name:'English',exact:true}).click();await page.getByRole('menuitem',{name:'中文',exact:true}).click();
  assert.deepEqual(errors,[]);
  await writeFile(dir+'/browser-local.json',JSON.stringify({metrics,settingsGlobalAndWorkspaceOnly:true,workspaceTriggerNameOnly:true,workspaceMenuPathNotes:noteStyle,workspaceControlSingleLine:true,transparentBorderlessHeader:appearance,oneNativeDropdown:true,independentGroupsSaved:true,uiChoicesUsedByModel:true,reloadPreservesSelection:true,darkAndLight:true,liveLanguageSwitch:true,errors},null,2));
} finally{await browser.close();}
