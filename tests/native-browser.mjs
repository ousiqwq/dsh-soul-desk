import {readFile,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
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
  await page.screenshot({path:dir+'/rules-dark.png'});
  const metrics=[];
  for(const width of [1440,900,650,390,320]){
    await page.setViewportSize({width,height:1000});
    const sizes=await page.locator('.soul-page').evaluate(el=>({width:el.clientWidth,scroll:el.scrollWidth}));
    assert.ok(sizes.scroll<=sizes.width+1,JSON.stringify({width,sizes}));metrics.push({viewport:width,...sizes});
  }
  await page.setViewportSize({width:1440,height:1000});
  const region=page.getByRole('region',{name:'人设使用规则'});
  await region.getByRole('tab',{name:'工作区',exact:true}).click();
  await region.getByRole('button',{name:'选择工作区',exact:true}).click();
  console.log('MENUS',await page.getByRole('menu').allTextContents());
  await page.keyboard.press('Escape');
  await region.getByRole('tab',{name:'会话',exact:true}).click();
  await region.getByRole('button',{name:'选择会话',exact:true}).click();
  console.log('SESSION MENU',await page.getByRole('menu').allTextContents());
  await page.keyboard.press('Escape');
  await page.screenshot({path:dir+'/rules-session.png'});
  await page.getByRole('button',{name:'关闭',exact:true}).click();
  await page.getByText('灵魂三层与子代理验收',{exact:true}).first().click();
  const trigger=page.getByRole('button',{name:'本会话人设与子代理规则',exact:true});
  assert.equal(await trigger.count(),1);
  async function choose(group,name){await trigger.click();await page.getByRole('menuitem',{name:new RegExp('^'+group+'：')}).hover();await page.getByRole('menu').last().getByRole('menuitem',{name,exact:true}).last().click();}
  await choose('本会话','验收人设 B');
  await page.waitForFunction(async([root,id])=>(await(await fetch(root+'/private-soul/v2/state?sessionId='+id)).json()).activePersonaId!==null,[root,fixture.root]);
  await choose('子代理','复用当前人设');
  let view=await(await page.request.get(root+'/private-soul/v2/state?sessionId='+fixture.root)).json();assert.equal(view.activePersonaId,fixture.ids.B);assert.equal(view.children.selection.mode,'parent');
  await page.reload();await trigger.waitFor();assert.equal(await trigger.count(),1);assert.match(await trigger.innerText(),/验收人设 B.*子代理：复用当前人设/s);
  await trigger.click();await page.getByRole('menuitem',{name:/^本会话：/}).hover();await page.screenshot({path:dir+'/conversation-menu-dark.png'});await page.keyboard.press('Escape');await page.keyboard.press('Escape');
  await page.emulateMedia({colorScheme:'light'});await page.screenshot({path:dir+'/conversation-light.png'});
  await choose('本会话','验收人设 C');await choose('子代理','不使用人设');
  view=await(await page.request.get(root+'/private-soul/v2/state?sessionId='+fixture.root)).json();assert.equal(view.activePersonaId,fixture.ids.C);assert.equal(view.children.selection.mode,'none');
  await page.getByRole('button',{name:'账号菜单',exact:true}).click();await page.getByText('设置',{exact:true}).click();await page.getByRole('button',{name:'通用设置',exact:true}).click();
  console.log('GENERAL', (await page.locator('body').innerText()).slice(-5000));
  await page.getByRole('button',{name:'中文',exact:true}).click();await page.getByRole('menuitem',{name:'English',exact:true}).click();
  await page.getByRole('button',{name:'Private Soul',exact:true}).click();await page.getByRole('region',{name:'Persona rules',exact:true}).waitFor();
  await page.screenshot({path:dir+'/rules-english.png'});
  await page.getByRole('button',{name:'General',exact:true}).click();await page.getByRole('button',{name:'English',exact:true}).click();await page.getByRole('menuitem',{name:'中文',exact:true}).click();
  assert.deepEqual(errors,[]);
  await writeFile(dir+'/browser.json',JSON.stringify({metrics,oneNativeDropdown:true,independentGroupsSaved:true,reloadPreservesSelection:true,darkAndLight:true,liveLanguageSwitch:true,errors},null,2));
} finally{await browser.close();}
