const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'../dist'),E=require('../dist/exam-data.js');
const W={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'data.js'),'utf8'),W);
test('O.W.L.s labels use Taiwan publisher names without changing thresholds',()=>{
 assert.deepEqual(E.grades.map(g=>[g.letter,g.label,g.min]),[['O','傑出',27],['E','超乎期待',23],['A','合格',18],['P','不佳',12],['D','糟糕',6],['T','山怪',0]]);
});
test('answer meanings and positions survive Taiwan terminology corrections',()=>{
 assert.match(E.questions[20].options[E.questions[20].answer],/獅子阿爾發・布萊克/);
 assert.equal(E.questions[24].options[E.questions[24].answer],'熄燈器');
 assert.equal(E.questions[27].options[E.questions[27].answer],'毛糞石（bezoar）');
 assert.match(E.questions[21].question,/王冕/);
 assert.equal(E.questions[5].options[0],'守門手');
 assert.equal(E.questions[13].options[E.questions[13].answer],'叱叱，荒唐，想像滑稽的樣子');
 assert.equal(W.window.LibraryData.characters.find(c=>c.id==='minerva-mcgonagall').name,'麥教授');
 assert.ok(JSON.stringify(W.window.LibraryData.characters.find(c=>c.id==='neville-longbottom')).includes('藥草學'));
});
test('corrected terms cannot regress in shipped text or translation keys',()=>{
 for(const name of ['data.js','exam-data.js','exam.js','index.html','locales/en.js']){
  const s=fs.readFileSync(path.join(root,name),'utf8');
  assert.doesNotMatch(s,/雷古勒斯|消光器|(?<!毛)糞石|草藥學|看守手|冠冕/,name);
 }
});
