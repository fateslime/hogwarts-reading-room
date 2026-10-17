const {chromium,browserOptions}=require('./browser-runtime.cjs');
const assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{
const browser=await chromium.launch(browserOptions());
try{
const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:8765/',{waitUntil:'networkidle'});
for(let i=0;i<12;i++){
 await page.locator('#character-list [data-character="'+i+'"]').click();

 assert.equal(await page.locator('.portrait img').count(),1);await page.locator('.portrait img').evaluate(img=>img.decode());
 assert.ok(await page.locator('.portrait img').evaluate(img=>img.naturalWidth>=1200&&img.naturalHeight>=832));
 assert.match(await page.locator('.portrait figcaption a').getAttribute('href'),/^https:\/\/www\.harrypotter\.com\/fact-file\/characters-and-pets\//);
 assert.equal(await page.locator('.profile-facts dt').count(),3);
 if(i===0)await page.locator('#detail-dialog').screenshot({path:'.local/profile-desktop.png'});
 await page.keyboard.press('Escape');
}
await page.locator('#character-list [data-character="0"]').click();
await page.locator('[data-favorite="character:harry-potter"]').click();
await page.locator('#dialog-content [data-character="1"]').click();assert.match(await page.locator('#dialog-title').textContent(),/妙麗/);
await page.keyboard.press('Escape');
await page.locator('#character-favorites').check();assert.equal(await page.locator('.character-entry').count(),1);
await page.reload({waitUntil:'networkidle'});await page.locator('#character-favorites').check();assert.equal(await page.locator('.character-entry').count(),1);await page.locator('#character-favorites').uncheck();
await page.locator('[data-creature-filter="water"]').click();assert.equal(await page.locator('.creature-card').count(),2);
await page.locator('#creature-search').fill('人魚');assert.equal(await page.locator('.creature-card').count(),1);
await page.locator('#creature-grid [data-creature="10"]').click();await page.locator('[data-favorite="creature:merperson"]').click();await page.keyboard.press('Escape');
await page.locator('#creature-search').fill('');await page.locator('[data-creature-filter="all"]').click();await page.locator('#creature-favorites').check();assert.equal(await page.locator('.creature-card').count(),1);
await page.reload({waitUntil:'networkidle'});await page.locator('#creature-favorites').check();assert.equal(await page.locator('.creature-card').count(),1);await page.locator('#creature-favorites').uncheck();
assert.equal(await page.locator('.creature-card').count(),6);await page.locator('#creatures-more').click();assert.equal(await page.locator('.creature-card').count(),12);
await page.locator('#creature-grid [data-creature="9"]').click();assert.match(await page.locator('#dialog-title').textContent(),/人馬/);await page.locator('#detail-dialog').screenshot({path:'.local/centaur-desktop.png'});await page.keyboard.press('Escape');
await page.locator('#book-tab-2').click();await page.locator('#book-expand').click();await page.locator('#book-panel [data-creature="0"]').click();assert.match(await page.locator('#dialog-title').textContent(),/鷹馬/);await page.keyboard.press('Escape');
await page.locator('#character-list [data-character="7"]').click();assert.equal(await page.locator('#dialog-content .spoiler-content').count(),0);await page.keyboard.press('Escape');await page.locator('#spoilers').check();await page.locator('#character-list [data-character="7"]').click();assert.equal(await page.locator('#dialog-content .spoiler-content').count(),1);await page.keyboard.press('Escape');await page.locator('#spoilers').uncheck();
for(const width of [320,390,768,1440]){
 await page.setViewportSize({width,height:844});await page.locator('#character-list [data-character="3"]').click();assert.ok(await page.locator('#detail-dialog').evaluate(d=>d.scrollWidth<=d.clientWidth+1));if(width===390)await page.locator('#detail-dialog').screenshot({path:'.local/profile-mobile.png'});await page.keyboard.press('Escape');assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
}
await page.setViewportSize({width:390,height:844});await page.locator('[data-creature-filter="water"]').click();await page.locator('#creatures').scrollIntoViewIfNeeded();await page.screenshot({path:'.local/water-mobile.png'});
await page.evaluate(()=>localStorage.setItem('hogwarts-reading-room-v1',JSON.stringify({visited:[0,1],currentBook:1,answers:Array(8).fill(0),quizIndex:7,resultHouse:'gryffindor'})));
await page.reload({waitUntil:'networkidle'});assert.match(await page.locator('#reading-progress').textContent(),/2 \/ 7/);assert.equal(await page.locator('.quiz-result').count(),0);await page.locator('[data-quiz-action="start"]').click();assert.match(await page.locator('.quiz-progress').textContent(),/09 \/ 16/);
await page.locator('input[name="quiz-answer"][value="2"]').check();await page.locator('[data-quiz-action="next"]').click();await page.reload({waitUntil:'networkidle'});await page.locator('[data-quiz-action="start"]').click();assert.match(await page.locator('.quiz-progress').textContent(),/10 \/ 16/);
assert.deepEqual(errors,[]);console.log(JSON.stringify({status:'passed',checks:['12 official film photographs with attribution','profile related navigation','character and creature favorites persist','water filter and search','12-creature expansion','book to creature connections','profile spoiler protection','profile overflow at four widths','legacy progress + 16-question resume','all WebP photographs decode','no runtime errors']},null,2));
}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
