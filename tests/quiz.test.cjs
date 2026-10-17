const test=require('node:test'),assert=require('node:assert/strict');
const {score,questions,validAnswers,restoreDraft}=require('../dist/quiz.js');
const houses=['gryffindor','slytherin','ravenclaw','hufflepuff'];
test('sixteen distinct questions offer all four primary inclinations',()=>{
 assert.equal(questions.length,16);assert.equal(new Set(questions.map(q=>q.question)).size,16);
 for(const q of questions){assert.deepEqual(q.answers.map(a=>a.house).sort(),[...houses].sort());for(const a of q.answers){assert.ok(houses.includes(a.secondary));assert.notEqual(a.house,a.secondary);}}
});
for(const house of houses)test('consistent '+house+' choices produce that house',()=>{
 const result=score(questions.map(q=>q.answers.findIndex(a=>a.house===house)));
 assert.deepEqual(result.tied,[house]);assert.equal(result.scores[house],48);assert.equal(result.total,64);assert.equal(Object.values(result.scores).reduce((a,b)=>a+b,0),64);
});
test('incomplete, sparse, legacy and corrupt answers cannot produce a result',()=>{
 for(const a of [null,[],Array(8).fill(0),Array(16).fill(null),Array(16).fill(-1),Array(16).fill(4),Array(16).fill('0'),Array(16)])assert.throws(()=>score(a),TypeError);
});
test('draft answers and sixteen-question progress restore correctly',()=>{
 const a=[0,1,...Array(14).fill(null)];assert.equal(validAnswers(a),true);assert.equal(validAnswers(a,true),false);
 assert.deepEqual(restoreDraft({answers:a,quizIndex:1}),{answers:a,index:1});
 assert.equal(restoreDraft({answers:a,quizIndex:99}).index,2);
});
test('legacy eight-question progress is retained and extended, never a finished result',()=>{
 const legacy=Array(8).fill(2),draft=restoreDraft({answers:legacy,quizIndex:7,resultHouse:'ravenclaw'});
 assert.deepEqual(draft.answers,[...legacy,...Array(8).fill(null)]);assert.equal(draft.index,8);assert.equal(validAnswers(draft.answers,true),false);
 const partial=restoreDraft({answers:[0,1,...Array(6).fill(null)]});assert.equal(partial.index,2);
 assert.deepEqual(restoreDraft({answers:Array(8)}),{answers:Array(16).fill(null),index:0});
});
test('ties preserve every highest scoring house',()=>{
 const fixture=require('./tie-fixture.json'),result=score(fixture);
 assert.ok(result.tied.length>1);const max=Math.max(...Object.values(result.scores));assert.deepEqual(result.tied,Object.keys(result.scores).filter(k=>result.scores[k]===max));
});
