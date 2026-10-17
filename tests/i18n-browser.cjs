const fs=require('node:fs'),assert=require('node:assert/strict');
const {chromium,browserOptions}=require('./browser-runtime.cjs');
const E=require('../dist/exam-data.js');
(async()=>{
 const browser=await chromium.launch(browserOptions());
 try{
  const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  const page=await context.newPage(),errors=[],failures=[],missing=new Set();
  page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.url().startsWith('http://127.0.0.1:8765/')&&r.status()>=400)failures.push(r.url());});
  await page.goto('http://127.0.0.1:8765/',{waitUntil:'networkidle'});
  assert.equal(await page.locator('html').getAttribute('lang'),'zh-Hant');
  await page.locator('[data-language=en]').click();
  assert.equal(await page.locator('html').getAttribute('lang'),'en');
  async function scan(){
   const found=await page.evaluate(()=>{
    const found=[],han=/[\u3400-\u9fff]/;
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    for(let n=walker.nextNode();n;n=walker.nextNode()){
     const e=n.parentElement;
     if(e&&!e.closest('script,style,textarea,noscript,[data-no-i18n]')&&e.getClientRects().length&&han.test(n.nodeValue))found.push(n.nodeValue.trim());
    }
    document.querySelectorAll('[aria-label],[placeholder],[alt],[title],meta[name=description]').forEach(e=>{
     if(e.closest('[data-no-i18n]'))return;
     for(const a of ['aria-label','placeholder','alt','title','content'])if(e.hasAttribute(a)&&han.test(e.getAttribute(a)))found.push(e.getAttribute(a));
    });
    return found;
   });found.forEach(s=>missing.add(s));
  }
  await scan();
  for(const width of [320,390,768,1024,1440]){
   await page.setViewportSize({width,height:900});
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'English page overflow '+width);
   const rects=await page.locator('.brand,.language-switch,.menu-toggle').evaluateAll(es=>es.filter(e=>e.getClientRects().length).map(e=>({class:e.className,x:e.getBoundingClientRect().x,right:e.getBoundingClientRect().right})));
   if(width<=800)assert.ok(rects[0].right<=rects[1].x+1,'brand overlaps switch '+width);
   if(width===390||width===1440)await page.screenshot({path:'.local/language-home-'+width+'.png'});
  }
  await page.setViewportSize({width:1440,height:1000});
  await page.locator('#world-toggle').click();await scan();
  await page.locator('#spoilers').check();
  for(let i=0;i<7;i++){await page.locator('[data-book="'+i+'"]').click();await page.locator('#book-expand').click();await scan();}
  await page.locator('[data-language="zh-Hant"]').click();
  assert.equal(await page.locator('#reading-progress').textContent(),'已探索 7 / 7 部');
  assert.equal(await page.locator('#book-panel h3').textContent(),'死神的聖物');
  assert.equal(await page.locator('#book-expand').getAttribute('aria-expanded'),'true');
  await page.locator('[data-language=en]').click();
  for(let i=0;i<12;i++){await page.locator('#character-list [data-character="'+i+'"]').click();await scan();await page.locator('.dialog-close').click();}
  await page.locator('#character-list [data-character="0"]').click();
  await page.locator('[data-favorite="character:harry-potter"]').click();
  await page.locator('[data-language-toggle]').click();
  assert.equal(await page.locator('#dialog-title').textContent(),'哈利・波特');
  assert.equal(await page.locator('[data-favorite]').getAttribute('aria-pressed'),'true');
  await page.locator('[data-language-toggle]').click();
  assert.equal(await page.locator('#dialog-title').textContent(),'Harry Potter');
  for(const width of [320,390,768,1440]){
   await page.setViewportSize({width,height:900});
   assert.ok(await page.locator('#detail-dialog').evaluate(d=>d.scrollWidth<=d.clientWidth+1),'English dialog overflow '+width);
   if(width===390)await page.locator('#detail-dialog').screenshot({path:'.local/language-profile-mobile.png'});
  }
  await page.locator('.dialog-close').click();await page.setViewportSize({width:1440,height:1000});
  await page.locator('#character-search').fill('Gryffindor');assert.ok(await page.locator('.character-entry').count()>0);await page.locator('#character-search').fill('');
  await page.locator('#creatures-more').click();
  for(let i=0;i<12;i++){await page.locator('#creature-grid [data-creature="'+i+'"]').click();await scan();await page.locator('.dialog-close').click();}
  await page.locator('#creature-search').fill('forest');assert.ok(await page.locator('.creature-card').count()>0);await page.locator('#creature-search').fill('');
  await page.locator('#sources-open').click();await scan();await page.locator('.dialog-close').click();
  await page.locator('#contact-open').click();await scan();
  await page.locator('[name=sender]').fill('測試讀者 Reader');
  await page.locator('[name=message]').fill('喜歡鳳凰。Keep my original words.');
  await page.locator('[data-language-toggle]').click();await page.locator('[data-language-toggle]').click();
  assert.equal(await page.locator('[name=message]').inputValue(),'喜歡鳳凰。Keep my original words.');
  assert.equal(await page.locator('[name=sender]').inputValue(),'測試讀者 Reader');
  await page.locator('.dialog-close').click();
  await page.locator('[data-quiz-action=start]').click();
  for(let i=0;i<16;i++){
   await scan();await page.locator('input[name=quiz-answer]').first().check();
   if(i===4){
    await page.locator('[data-language="zh-Hant"]').click();
    assert.equal(await page.locator('input[name=quiz-answer]:checked').inputValue(),'0');
    await page.locator('[data-language=en]').click();
    assert.equal(await page.locator('input[name=quiz-answer]:checked').inputValue(),'0');
   }
   await page.locator('[data-quiz-action=next]').click();
  }
  if(await page.locator('input[name=tie-answer]').count()){await scan();await page.locator('input[name=tie-answer]').first().check();await page.locator('[data-quiz-action=tie-result]').click();}
  await scan();
  await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:async text=>{window.copied=text;}},configurable:true}));
  await page.locator('[data-quiz-action=copy]').click();
  assert.match(await page.evaluate(()=>window.copied),/sorted me into/);
  await page.locator('[data-exam-action=start]').click();
  for(let i=0;i<30;i++){
   await scan();const a=i===17?(E.questions[i].answer+1)%4:E.questions[i].answer;
   await page.locator('input[name=exam-answer][value="'+a+'"]').check();
   if(i===6){
    await page.locator('[data-language="zh-Hant"]').click();
    assert.equal(await page.locator('input[name=exam-answer]:checked').inputValue(),String(a));
    await page.locator('[data-language=en]').click();
    await page.locator('[data-exam-action=pause]').click();
    await page.reload({waitUntil:'networkidle'});
    assert.equal(await page.locator('html').getAttribute('lang'),'en');
    await page.locator('[data-exam-action=start]').click();
    assert.equal(await page.locator('input[name=exam-answer]:checked').inputValue(),String(a));
   }
   await page.locator('[data-exam-action=next]').click();
  }
  await scan();await page.locator('[data-exam-action=submit]').click();await scan();
  assert.equal(await page.locator('.exam-score strong').textContent(),'29');
  await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:async text=>{window.copied=text;}},configurable:true}));
  await page.locator('[data-exam-action=copy]').click();
  assert.match(await page.evaluate(()=>window.copied),/I scored 29 \/ 30/);
  await page.locator('#exam-sheet').screenshot({path:'.local/language-result-desktop.png'});
  await page.locator('[data-exam-action=review]').click();await page.locator('#exam-wrong-only').uncheck();await scan();
  assert.equal(await page.locator('.exam-review-item').count(),30);
  await page.locator('[data-exam-action=result]').click();await page.locator('[data-exam-action=restart]').click();await scan();
  await page.locator('[data-exam-action=cancel-restart]').click();
  await page.locator('[data-language="zh-Hant"]').click();
  assert.equal(await page.locator('.exam-score strong').textContent(),'29');
  assert.match(await page.locator('.exam-result-label').textContent(),/你的 O.W.L.s 成績/);
  await page.reload({waitUntil:'networkidle'});
  assert.equal(await page.locator('html').getAttribute('lang'),'zh-Hant');
  assert.equal(await page.locator('.exam-score strong').textContent(),'29');
  await page.locator('#character-favorites').check();assert.equal(await page.locator('.character-entry').count(),1);

  const blocked=await browser.newContext({viewport:{width:390,height:900}});
  await blocked.addInitScript(()=>{Storage.prototype.getItem=function(){throw Error('blocked')};Storage.prototype.setItem=function(){throw Error('blocked')};});
  const off=await blocked.newPage();await off.goto('http://127.0.0.1:8765/');await off.locator('[data-language=en]').click();
  assert.equal(await off.locator('html').getAttribute('lang'),'en');
  await off.locator('[data-exam-action=start]').click();await off.locator('input[name=exam-answer]').first().check();
  await off.locator('[data-language="zh-Hant"]').click();assert.equal(await off.locator('input[name=exam-answer]:checked').count(),1);
  await blocked.close();
  assert.deepEqual([...missing],[],'untranslated text');
  assert.deepEqual(errors,[]);assert.deepEqual(failures,[]);
  console.log(JSON.stringify({status:'passed',checks:['both languages and remembered choice','all books, 12 profiles and 12 creatures','all 16 sorting and 30 exam questions plus explanations','no untranslated Chinese in audited English UI or accessibility labels','in-place dialog and form preservation','answers, reading and favorites survive switching','English result copying','English search by house and habitat','mobile and desktop layout','storage denial fallback']},null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
