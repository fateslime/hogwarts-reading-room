const {chromium,browserOptions}=require('./browser-runtime.cjs');
const assert=require('node:assert/strict'),Q=require('../dist/quiz.js');
(async()=>{
 const browser=await chromium.launch(browserOptions());
 try{
  const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8765/',{waitUntil:'networkidle'});
  assert.equal(await page.locator('#houses article').count(),4);
  assert.ok(await page.evaluate(()=>document.querySelector('#houses').compareDocumentPosition(document.querySelector('#sorting'))&Node.DOCUMENT_POSITION_FOLLOWING));
  for(const lang of ['zh-Hant','en']){
   await page.locator('[data-language="'+lang+'"]').click();
   for(const width of [320,390,768,1024,1440]){
    await page.setViewportSize({width,height:1000});
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'page overflow '+lang+' '+width);
    assert.ok(await page.locator('#houses article').evaluateAll(es=>es.every(e=>e.scrollWidth<=e.clientWidth+1)),'house overflow '+lang+' '+width);
    if(lang==='zh-Hant'&&(width===1440||width===390))await page.locator('#houses').screenshot({path:'.local/houses-'+width+'.png'});
   }
   if(lang==='en')assert.doesNotMatch(await page.locator('#houses').textContent(),/[\u3400-\u9fff]/);
  }
  await page.locator('[data-language="zh-Hant"]').click();
  for(const house of Object.keys(Q.houses)){
   if(await page.locator('[data-quiz-action=restart]').count())await page.locator('[data-quiz-action=restart]').click();
   await page.locator('[data-quiz-action=start]').click();
   for(const q of Q.questions){
    await page.locator('input[name=quiz-answer][value="'+q.answers.findIndex(a=>a.house===house)+'"]').check();
    await page.locator('[data-quiz-action=next]').click();
   }
   assert.equal(await page.locator('.quiz-result h3').textContent(),Q.houses[house].name);
   assert.equal(await page.locator('.result-bar.'+house+' span').last().textContent(),'100%');
   await page.reload({waitUntil:'networkidle'});
   assert.equal(await page.locator('.quiz-result h3').textContent(),Q.houses[house].name);
  }
  // A prior complete result must not be silently rescored using the new questions.
  const exam={version:1,answers:[0,1,...Array(28).fill(null)],index:1,completed:false,best:23};
  await page.evaluate(exam=>{
   localStorage.setItem('hogwarts-reading-room-v1',JSON.stringify({visited:[0,2],currentBook:2,favorites:['character:harry-potter','creature:phoenix'],answers:Array(16).fill(0),quizIndex:15,quizVersion:2,resultHouse:'ravenclaw'}));
   localStorage.setItem('hogwarts-student-exam-v1',JSON.stringify(exam));
  },exam);
  await page.reload({waitUntil:'networkidle'});
  assert.equal(await page.locator('.quiz-result').count(),0);
  assert.match(await page.locator('.quiz-update').textContent(),/重新作答/);
  assert.match(await page.locator('#reading-progress').textContent(),/2 \/ 7/);
  await page.locator('[data-language=en]').click();
  assert.match(await page.locator('.quiz-update').textContent(),/questions and scoring have changed/);
  await page.locator('[data-quiz-action=start]').click();
  assert.match(await page.locator('.quiz-progress').textContent(),/01 \/ 16/);
  assert.equal(await page.locator('input[name=quiz-answer]:checked').count(),0);
  await page.locator('input[name=quiz-answer][value="2"]').check();await page.locator('[data-quiz-action=next]').click();
  await page.reload({waitUntil:'networkidle'});
  assert.equal(await page.locator('.quiz-update').count(),0);
  await page.locator('[data-quiz-action=start]').click();assert.match(await page.locator('.quiz-progress').textContent(),/02 \/ 16/);
  const stored=await page.evaluate(()=>({reading:JSON.parse(localStorage.getItem('hogwarts-reading-room-v1')),exam:JSON.parse(localStorage.getItem('hogwarts-student-exam-v1'))}));
  assert.equal(stored.reading.quizVersion,3);assert.equal(stored.reading.answers[0],2);
  assert.deepEqual(stored.reading.visited,[0,2]);assert.deepEqual(stored.reading.favorites,['character:harry-potter','creature:phoenix']);
  assert.deepEqual(stored.exam,exam);
  const denied=await browser.newContext({reducedMotion:'reduce'});
  await denied.addInitScript(()=>{Storage.prototype.getItem=()=>{throw Error('blocked')};Storage.prototype.setItem=()=>{throw Error('blocked')};});
  const off=await denied.newPage();off.on('pageerror',e=>errors.push(e.message));await off.goto('http://127.0.0.1:8765/');
  await off.locator('[data-quiz-action=start]').click();
  for(const q of Q.questions){await off.locator('input[name=quiz-answer][value="'+q.answers.findIndex(a=>a.house==='hufflepuff')+'"]').check();await off.locator('[data-quiz-action=next]').click();}
  assert.equal(await off.locator('.quiz-result h3').textContent(),'赫夫帕夫');await denied.close();
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({status:'passed',checks:['four house introductions above sorting','Chinese and English at five widths','all four house results + reload','v2 result reset with bilingual notice','reading/favorites/student exam preserved','v3 resume','sorting works with storage denied']}));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
