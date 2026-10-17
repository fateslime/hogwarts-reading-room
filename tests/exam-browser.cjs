const {chromium,browserOptions}=require('./browser-runtime.cjs');
const assert=require('node:assert/strict'),E=require('../dist/exam-data.js');
(async()=>{
 const browser=await chromium.launch(browserOptions());
 try{
  const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),page=await context.newPage(),errors=[],failed=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.url().startsWith('http://127.0.0.1')&&r.status()>=400)failed.push(r.url());});
  await page.goto('http://127.0.0.1:8765/',{waitUntil:'networkidle'});
  assert.equal(await page.locator('#main-nav [href="#student-exam"]').count(),1);
  await page.locator('#student-exam').scrollIntoViewIfNeeded();await page.screenshot({path:'.local/exam-welcome-desktop.png'});
  await page.locator('[data-exam-action="start"]').click();
  assert.equal(await page.locator('[data-exam-action="next"]').isDisabled(),true);
  await page.locator('input[name="exam-answer"][value="'+E.questions[0].answer+'"]').check();
  await page.locator('[data-exam-action="next"]').click();
  await page.locator('input[name="exam-answer"][value="'+E.questions[1].answer+'"]').check();
  await page.locator('[data-exam-action="back"]').click();
  assert.equal(await page.locator('input[name="exam-answer"]:checked').inputValue(),String(E.questions[0].answer));
  await page.locator('[data-exam-action="next"]').click();
  await page.locator('[data-exam-action="pause"]').click();
  await page.reload({waitUntil:'networkidle'});
  assert.match(await page.locator('[data-exam-action="start"]').textContent(),/已答 2 題/);
  await page.locator('[data-exam-action="start"]').click();
  assert.match(await page.locator('.exam-progress').textContent(),/第 2 \/ 30/);
  for(let i=1;i<30;i++){
   const answer=i===17?(E.questions[i].answer+1)%4:E.questions[i].answer;
   await page.locator('input[name="exam-answer"][value="'+answer+'"]').check();
   if(i===20){await page.locator('#exam-sheet').screenshot({path:'.local/exam-question-desktop.png'});}
   await page.locator('[data-exam-action="next"]').click();
  }
  assert.equal(await page.locator('.exam-number').count(),30);
  await page.locator('[data-exam-question="0"]').click();
  assert.equal(await page.locator('input[name="exam-answer"]:checked').inputValue(),String(E.questions[0].answer));
  await page.locator('[data-exam-action="overview"]').click();await page.locator('[data-exam-action="submit"]').click();
  assert.match(await page.locator('.exam-grade-letter').textContent(),/O/);assert.equal(await page.locator('.exam-score strong').textContent(),'29');
  await page.locator('#exam-sheet').screenshot({path:'.local/exam-result-desktop.png'});
  await page.reload({waitUntil:'networkidle'});assert.equal(await page.locator('.exam-score strong').textContent(),'29');
  await page.locator('[data-exam-action="review"]').click();assert.equal(await page.locator('.exam-review-item').count(),1);assert.match(await page.locator('.answer-correct').textContent(),/多比/);
  await page.locator('#exam-wrong-only').uncheck();assert.equal(await page.locator('.exam-review-item').count(),30);
  await page.locator('.exam-review-item').nth(17).locator('[data-read-book]').click();
  assert.equal(await page.locator('#book-tab-3').getAttribute('aria-selected'),'true');
  await page.locator('[data-exam-action="result"]').click();
  await page.locator('[data-exam-action="restart"]').click();await page.locator('[data-exam-action="cancel-restart"]').click();assert.equal(await page.locator('.exam-score strong').textContent(),'29');
  for(const width of [320,390,768,1024,1440]){
   await page.setViewportSize({width,height:900});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'overflow '+width);
   if(width===390)await page.locator('#exam-sheet').screenshot({path:'.local/exam-result-mobile.png'});
  }
  await page.setViewportSize({width:390,height:900});
  await page.locator('[data-exam-action="restart"]').click();await page.locator('[data-exam-action="confirm-restart"]').click();
  assert.equal(await page.locator('input[name="exam-answer"]:checked').count(),0);
  await page.locator('#exam-sheet').screenshot({path:'.local/exam-question-mobile.png'});
  const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('hogwarts-student-exam-v1')));assert.equal(stored.best,29);assert.equal(stored.completed,false);
  await page.locator('[data-quiz-action="start"]').click();assert.match(await page.locator('.quiz-progress').textContent(),/01 \/ 16/);
  await page.evaluate(()=>localStorage.setItem('hogwarts-student-exam-v1','not-json'));
  await page.reload({waitUntil:'networkidle'});assert.equal(await page.locator('[data-exam-action="start"]').textContent(),'開始學生測試');
  // Storage denial still permits the entire exam, and never interferes with sorting.
  const blocked=await browser.newContext({viewport:{width:390,height:900}});
  await blocked.addInitScript(()=>{Storage.prototype.getItem=function(){throw Error('blocked')};Storage.prototype.setItem=function(){throw Error('blocked')};});
  const off=await blocked.newPage();await off.goto('http://127.0.0.1:8765/');
  assert.match(await off.locator('#exam-save-status').textContent(),/無法保存/);
  await off.locator('[data-exam-action="start"]').click();
  for(let i=0;i<30;i++){await off.locator('input[name="exam-answer"][value="'+E.questions[i].answer+'"]').check();await off.locator('[data-exam-action="next"]').click();}
  await off.locator('[data-exam-action="submit"]').click();assert.equal(await off.locator('.exam-score strong').textContent(),'30');
  await off.evaluate(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:async()=>{throw Error('denied')}},configurable:true}));
  await off.locator('[data-exam-action="copy"]').click();assert.equal(await off.locator('#exam-copy').isVisible(),true);assert.match(await off.locator('#exam-copy-text').inputValue(),/30 \/ 30/);
  await off.locator('[data-exam-action="review"]').click();assert.equal(await off.locator('.exam-review-item').count(),30);
  await off.locator('#exam-wrong-only').check();assert.match(await off.locator('.empty-state').textContent(),/全數答對/);
  await blocked.close();
  assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
  console.log(JSON.stringify({status:'passed',checks:['30-question end-to-end','previous answer editing','pause and reload resume','review before submit','O grade and 29/30 score','wrong/all explanation filters','related book navigation','result persistence','restart confirmation and retained best','sorting remains 16 questions','five responsive widths','corrupt/blocked storage','full marks review','no local failed requests or runtime errors']},null,2));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

