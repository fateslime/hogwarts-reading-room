const {chromium,browserOptions}=require('./browser-runtime.cjs');
const assert=require('node:assert/strict'),E=require('../dist/exam-data.js');
const targetSelectors='.text-link,.filter,.saved-filter,.spoiler-toggle,.language-switch button,.menu-toggle,.book-tab,.exam-number,select,.search-field input,.exam-grades summary';
async function audit(page,width,scope='body'){
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'page overflow '+width);
 if(width>800)return;
 const small=await page.locator(scope).evaluate((root,selector)=>[...root.querySelectorAll(selector)].filter(e=>e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden'&&!e.closest('.characters-section,.creatures-section,dialog[data-kind=profile]')).map(e=>{const r=e.getBoundingClientRect();return{tag:e.tagName,classes:e.className,width:r.width,height:r.height}}).filter(e=>e.width<43.9||e.height<43.9),targetSelectors);
 assert.deepEqual(small,[],'small mobile controls '+width);
}
(async()=>{const browser=await chromium.launch(browserOptions());try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[],knownIssues=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8765/',{waitUntil:'networkidle'});
 for(const language of ['zh-Hant','en']){
  await page.evaluate(l=>window.I18n.setLanguage(l),language);
  for(const width of [320,390,768,1024,1440]){
   await page.setViewportSize({width,height:1000});await audit(page,width);
   const panels=await page.evaluate(()=>['.quiz-panel','.exam-sheet'].map(s=>{const c=getComputedStyle(document.querySelector(s));return[c.border,c.backgroundColor,c.boxShadow,c.padding,c.borderRadius]}));assert.deepEqual(panels[0],panels[1],'assessment panels match');
   if(width<=800){await page.locator('.menu-toggle').click();await audit(page,width,'#main-nav');await page.keyboard.press('Escape');}
   await page.locator('#character-list [data-character="0"]').click();
   assert.ok(await page.locator('dialog').evaluate(d=>d.scrollWidth<=d.clientWidth+1),'profile overflow');
   assert.ok(await page.locator('.portrait img').evaluate(img=>Math.abs(img.clientWidth/img.clientHeight-1200/832)<.02),'photo aspect ratio');
   await audit(page,width,'dialog');
   await page.locator('dialog').evaluate(d=>d.scrollTop=d.scrollHeight);
   const close=await page.locator('.dialog-close').boundingBox();assert.ok(close.y>=0&&close.y+close.height<=1000,'close remains reachable');
   await page.locator('.dialog-close').click();
   await page.locator('#creature-grid [data-creature="0"]').click();
   const overflow=await page.locator('dialog').evaluate(d=>d.scrollWidth-d.clientWidth);
   // The user explicitly retained this baseline layout; report, never hide, its narrow English limit.
   if(language==='en'&&width===320&&overflow>1&&overflow<=4)knownIssues.push({kind:'retained baseline creature dialog overflow',language,width,overflow});
   else assert.ok(overflow<=1,'creature overflow '+language+' '+width+' '+overflow);
   await audit(page,width,'dialog');await page.keyboard.press('Escape');
  }
 }
 await page.evaluate(answers=>localStorage.setItem('hogwarts-student-exam-v1',JSON.stringify({version:1,answers,index:29,completed:true,best:28})),E.questions.map((q,i)=>[17,27].includes(i)?(q.answer+1)%4:q.answer));
 await page.reload({waitUntil:'networkidle'});await page.locator('[data-exam-action="review"]').click();
 for(const language of ['zh-Hant','en']){
  await page.evaluate(l=>window.I18n.setLanguage(l),language);
  for(const width of [320,390,768,1024,1440]){
   await page.setViewportSize({width,height:1000});await audit(page,width,'#exam-sheet');
   assert.equal(await page.locator('.exam-answer-group').count(),2);
   assert.equal(await page.locator('.exam-explanation').count(),2);
   assert.ok(await page.locator('.exam-review-item').first().evaluate(e=>e.clientWidth<=608));
  }
 }
 await page.locator('[data-exam-action="result"]').click();await page.locator('[data-exam-action="restart"]').click();await page.locator('[data-exam-action="confirm-restart"]').click();
 for(let i=0;i<30;i++){await page.locator('input[name="exam-answer"][value="'+E.questions[i].answer+'"]').check();await page.locator('[data-exam-action="next"]').click();}
 for(const width of [320,390,768]){await page.setViewportSize({width,height:1000});await audit(page,width,'#exam-sheet');}
 assert.deepEqual(errors,[]);console.log(JSON.stringify({status:knownIssues.length?'completed_with_known_issue':'passed',knownIssues,checks:['bilingual page/profile/creature/review at five widths','retained mobile improvements at least 44x44, excluding restored character/creature areas','both assessment panels match at five widths','uncropped photo ratio','sticky close reachable after scroll','answer/explanation grouping','30 answer overview touch targets','no runtime errors']}));
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
