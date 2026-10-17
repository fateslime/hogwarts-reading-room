const {test}=require('node:test');
const assert=require('node:assert/strict');
const E=require('../dist/exam-data.js');
const correct=()=>E.questions.map(q=>q.answer);
test('exactly 30 unique, complete questions cover all seven books and three levels',()=>{
 assert.equal(E.questions.length,30);assert.equal(new Set(E.questions.map(q=>q.id)).size,30);
 assert.deepEqual([...new Set(E.questions.map(q=>q.book))].sort(),[0,1,2,3,4,5,6]);
 assert.deepEqual(['基礎','進階','挑戰'].map(level=>E.questions.filter(q=>q.difficulty===level).length),[10,10,10]);
 for(const q of E.questions){assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.ok(q.answer>=0&&q.answer<4);assert.ok(q.explanation.length>20);assert.ok(q.chapter>0);}
});
test('all 31 possible scores produce the intended O.W.L.s threshold and pass status',()=>{
 const expected=n=>n>=27?'O':n>=23?'E':n>=18?'A':n>=12?'P':n>=6?'D':'T';
 for(let n=0;n<=30;n++){const answers=correct().map((a,i)=>i<n?a:(a+1)%4),s=E.score(answers);assert.equal(s.correct,n);assert.equal(s.grade.letter,expected(n));assert.equal(s.grade.passed,n>=18);assert.equal(s.levels.reduce((a,b)=>a+b),n);}
});
test('incomplete and malformed answers cannot obtain a grade',()=>{
 for(const value of [null,{},[],Array(30).fill(null),Array(30).fill('0'),Array(30).fill(4),Array(30).fill(-1),Array(30),Array(29).fill(0)])assert.throws(()=>E.score(value));
 for(const value of [-1,31,NaN,1.5,'30'])assert.throws(()=>E.gradeFor(value));
});
test('restores a valid draft and never trusts a stored result without answers',()=>{
 const input={version:1,answers:Array(30).fill(null),index:12,completed:true,best:20};
 input.answers[0]=2;const draft=E.restore(input);assert.equal(draft.index,12);assert.equal(draft.answers[0],2);assert.equal(draft.completed,false);assert.equal(draft.best,20);
 draft.answers[0]=0;assert.equal(input.answers[0],2);
 const finished=E.restore({...input,answers:correct()});assert.equal(finished.completed,true);
});
test('invalid saved data resets safely, retaining only validated fields',()=>{
 for(const raw of [null,'x',[],{version:2,answers:correct()},{version:1,answers:Array(30).fill('<img>'),index:-1,best:Infinity,completed:true}]){
 const s=E.restore(raw);assert.deepEqual(s.answers,Array(30).fill(null));assert.equal(s.completed,false);assert.equal(s.index,0);assert.equal(s.best,null);
 }
});
test('novel-specific questions distinguish the film adaptations',()=>{
 assert.equal(E.questions[17].options[E.questions[17].answer],'多比');
 assert.match(E.questions[29].options[E.questions[29].answer],/冬青木魔杖/);
});

