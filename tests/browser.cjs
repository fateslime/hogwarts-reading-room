const {chromium,browserOptions}=require('./browser-runtime.cjs');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const Q=require('../dist/quiz.js');
(async()=>{
const browser=await chromium.launch(browserOptions());
const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
const out=path.resolve(__dirname,'../.local');fs.mkdirSync(out,{recursive:true});
try{
await page.goto('http://127.0.0.1:8765/',{waitUntil:'networkidle'});
await page.screenshot({path:path.join(out,'desktop.png'),fullPage:false});
assert.equal(await page.locator('[role=tab]').count(),7);
assert.equal(await page.locator('.character-entry').count(),12);
assert.equal(await page.locator('.creature-card').count(),6);
await page.locator('#world-toggle').click();assert.equal(await page.locator('#world-content').isVisible(),true);await page.locator('#world-toggle').click();
await page.locator('#book-tab-0').focus();await page.keyboard.press('ArrowRight');assert.equal(await page.locator('#book-tab-1').getAttribute('aria-selected'),'true');
for(let i=0;i<7;i++){await page.locator(`#book-tab-${i}`).click();await page.locator('#book-expand').click();}
assert.match(await page.locator('#reading-progress').textContent(),/7 \/ 7/);
assert.equal(await page.locator('.spoiler-content').count(),0);
await page.locator('#spoilers').check();assert.equal(await page.locator('.spoiler-content').isVisible(),true);await page.locator('#spoilers').uncheck();
await page.reload({waitUntil:'networkidle'});assert.match(await page.locator('#reading-progress').textContent(),/7 \/ 7/);assert.equal(await page.locator('#spoilers').isChecked(),false);
await page.locator('#character-search').fill('露娜');assert.equal(await page.locator('.character-entry').count(),1);
await page.locator('.character-entry').click();assert.match(await page.locator('#dialog-title').textContent(),/露娜/);await page.keyboard.press('Escape');assert.equal(await page.locator('#detail-dialog').isVisible(),false);
await page.locator('#character-search').fill('找不到的人物');assert.equal(await page.locator('.character-entry').count(),0);assert.equal(await page.locator('.empty-state').isVisible(),true);
await page.locator('#character-search').fill('');await page.locator('#character-filter').selectOption('teacher');assert.equal(await page.locator('.character-entry').count(),4);await page.locator('#character-filter').selectOption('all');
await page.locator('[data-creature-filter=land]').click();assert.equal(await page.locator('.creature-card').count(),6);await page.locator('[data-creature="2"]').click();assert.match(await page.locator('#dialog-title').textContent(),/獨角獸/);await page.locator('#related-book').click();assert.equal(await page.locator('#book-tab-0').getAttribute('aria-selected'),'true');await page.locator('[data-creature-filter=all]').click();
await page.locator('[data-quiz-action=start]').click();assert.equal(await page.locator('[data-quiz-action=next]').isDisabled(),true);
const raven=Q.questions.map(q=>q.answers.findIndex(a=>a.house==='ravenclaw'));
await page.locator(`input[name=quiz-answer][value="${raven[0]}"]`).check();await page.locator('[data-quiz-action=next]').click();await page.locator('[data-quiz-action=back]').click();assert.equal(await page.locator(`input[name=quiz-answer][value="${raven[0]}"]`).isChecked(),true);
for(let i=0;i<Q.questions.length;i++){await page.locator(`input[name=quiz-answer][value="${raven[i]}"]`).check();await page.locator('[data-quiz-action=next]').click();}
assert.match(await page.locator('.quiz-result h3').textContent(),/雷文克勞/);await page.reload({waitUntil:'networkidle'});assert.match(await page.locator('.quiz-result h3').textContent(),/雷文克勞/);
await page.locator('[data-quiz-action=restart]').click();await page.locator('[data-quiz-action=start]').click();
const tieAnswers=require('./tie-fixture.json');
for(let i=0;i<Q.questions.length;i++){await page.locator(`input[name=quiz-answer][value="${tieAnswers[i]}"]`).check();await page.locator('[data-quiz-action=next]').click();}
assert.equal(await page.locator('input[name=tie-answer]').count(),Q.score(tieAnswers).tied.length);assert.equal(await page.locator('[data-quiz-action=tie-result]').isDisabled(),true);
const chosen=Q.score(tieAnswers).tied[0];await page.locator(`input[name=tie-answer][value=${chosen}]`).check();await page.locator('[data-quiz-action=tie-result]').click();assert.equal(await page.locator('.quiz-result h3').textContent(),Q.houses[chosen].name);
await page.locator('#contact-open').click();assert.equal(await page.locator('#letter-form').count(),1);assert.match(await page.locator('#dialog-content').textContent(),/不會寄出/);await page.keyboard.press('Escape');
await page.locator('#reset-reading').click();assert.match(await page.locator('#reading-progress').textContent(),/0 \/ 7/);
await page.locator('[data-quiz-action=restart]').click();await page.locator('[data-quiz-action=start]').click();
await page.locator('#sorting').screenshot({path:path.join(out,'quiz.png')});
for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:844});await page.evaluate(()=>scrollTo(0,0));assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`horizontal overflow at ${width}`);}
await page.setViewportSize({width:390,height:844});await page.evaluate(()=>scrollTo(0,0));await page.waitForFunction(()=>getComputedStyle(document.querySelector('#toast')).opacity==='0');await page.screenshot({path:path.join(out,'mobile.png'),fullPage:false});
await page.locator('.menu-toggle').click();assert.equal(await page.locator('#main-nav').isVisible(),true);await page.locator('#main-nav a[href="#creatures"]').click();assert.equal(await page.locator('#main-nav').isVisible(),false);await page.screenshot({path:path.join(out,'mobile-creatures.png'),fullPage:false});
await page.locator('#books').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,'mobile-books.png'),fullPage:false});
assert.deepEqual(errors,[]);console.log(JSON.stringify({status:'passed',viewports:[320,390,768,1440],checks:['seven books + keyboard tabs','progress persistence + reset','spoiler toggle','character search + role filters + empty state','dialogs + Escape','creature filters + related reading','quiz previous answer retention','16-question result + reload','tie selection','contact composer','mobile menu','no horizontal overflow','no browser runtime errors'],screenshots:out},null,2));
}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
