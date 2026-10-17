const test=require('node:test'),assert=require('node:assert/strict');
const {score,questions,version,validAnswers,restoreDraft}=require('../dist/quiz.js');
const houses=['gryffindor','slytherin','ravenclaw','hufflepuff'];
test('sixteen distinct questions offer all four primary inclinations',()=>{
 assert.equal(questions.length,16);assert.equal(new Set(questions.map(q=>q.question)).size,16);
 for(const q of questions){assert.deepEqual(q.answers.map(a=>a.house).sort(),[...houses].sort());for(const a of q.answers){assert.equal('secondary' in a,false);assert.ok(a.text.length>0);}}
});
for(const house of houses)test('consistent '+house+' choices produce that house',()=>{
 const result=score(questions.map(q=>q.answers.findIndex(a=>a.house===house)));
 assert.deepEqual(result.tied,[house]);assert.equal(result.scores[house],16);assert.equal(result.total,16);assert.equal(Object.values(result.scores).reduce((a,b)=>a+b,0),16);
 for(const other of houses.filter(h=>h!==house))assert.equal(result.scores[other],0);
});
test('choosing any fixed answer position gives all four houses equal points',()=>{
 for(let position=0;position<4;position++){
  const result=score(Array(16).fill(position));
  assert.deepEqual(new Set(result.tied),new Set(houses));
  assert.deepEqual(Object.values(result.scores),[4,4,4,4]);
 }
});
test('the same pattern of house choices is symmetric under every house rotation',()=>{
 for(const counts of [[8,4,3,1],[7,7,1,1],[6,5,5,0],[4,4,4,4]])for(let rotation=0;rotation<4;rotation++){
  const order=houses.map((_,i)=>houses[(i+rotation)%4]);
  const selected=counts.flatMap((n,i)=>Array(n).fill(order[i]));
  const result=score(questions.map((q,i)=>q.answers.findIndex(a=>a.house===selected[i])));
  order.forEach((house,i)=>assert.equal(result.scores[house],counts[i]));
  assert.deepEqual(new Set(result.tied),new Set(order.filter((_,i)=>counts[i]===Math.max(...counts))));
 }
});
test('incomplete, sparse, legacy and corrupt answers cannot produce a result',()=>{
 for(const a of [null,[],Array(8).fill(0),Array(16).fill(null),Array(16).fill(-1),Array(16).fill(4),Array(16).fill('0'),Array(16)])assert.throws(()=>score(a),TypeError);
});
test('draft answers and sixteen-question progress restore correctly',()=>{
 const a=[0,1,...Array(14).fill(null)];assert.equal(validAnswers(a),true);assert.equal(validAnswers(a,true),false);
 assert.deepEqual(restoreDraft({quizVersion:version,answers:a,quizIndex:1}),{answers:a,index:1,updated:false});
 assert.equal(restoreDraft({quizVersion:version,answers:a,quizIndex:99}).index,2);
 const full=Array(16).fill(2);assert.deepEqual(restoreDraft({quizVersion:version,answers:full}).answers,full);
});
test('new question meanings reset old sorting answers with an explicit notice',()=>{
 for(const raw of [{answers:Array(8).fill(2)},{quizVersion:2,answers:Array(16).fill(1),resultHouse:'ravenclaw'},{quizVersion:99,answers:Array(16).fill(3)}]){
  const snapshot=JSON.stringify(raw),draft=restoreDraft(raw);
  assert.deepEqual(draft,{answers:Array(16).fill(null),index:0,updated:true});
  assert.equal(JSON.stringify(raw),snapshot,'migration must not mutate other saved fields');
 }
 assert.equal(restoreDraft({quizVersion:2,answers:Array(16).fill(null)}).updated,false);
 assert.deepEqual(restoreDraft(null),{answers:Array(16).fill(null),index:0,updated:false});
 assert.deepEqual(restoreDraft({quizVersion:version,answers:Array(16)}),{answers:Array(16).fill(null),index:0,updated:false});
});
test('ties preserve every highest scoring house',()=>{
 const fixture=require('./tie-fixture.json'),result=score(fixture);
 assert.ok(result.tied.length>1);const max=Math.max(...Object.values(result.scores));assert.deepEqual(result.tied,Object.keys(result.scores).filter(k=>result.scores[k]===max));
});
