const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'../dist');
function load(){
 const memory=new Map(),context={window:{},localStorage:{getItem:k=>memory.get(k),setItem:(k,v)=>memory.set(k,v)},document:{readyState:'loading',addEventListener(){}},MutationObserver:class{disconnect(){} observe(){}}};
 vm.createContext(context);
 for(const file of ['data.js','quiz.js','exam-data.js','locales/en.js','i18n.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});
 context.window.SortingQuiz=context.SortingQuiz;context.window.StudentExam=context.StudentExam;
 return context.window;
}
const W=load(),noHan=s=>assert.doesNotMatch(W.I18n.english(s),/[\u3400-\u9fff]/,'Missing English: '+s);
test('all visible book, character and creature fields have English coverage',()=>{
 const D=W.LibraryData;
 for(const b of D.books)for(const f of ['title','intro','detail','spoiler','note'])noHan(b[f]);
 for(const c of D.characters){for(const f of ['name','house','intro','story','spoiler'])if(c[f])noHan(c[f]);c.facts.flat().forEach(noHan);}
 for(const c of D.creatures)for(const f of ['name','intro','detail','habitat','ability','care','extra'])noHan(c[f]);
});
test('every sorting/exam question, option, explanation and grade is translated',()=>{
 for(const q of W.SortingQuiz.questions){noHan(q.question);q.answers.forEach(a=>noHan(a.text));}
 for(const h of Object.values(W.SortingQuiz.houses))for(const f of ['name','traits','description'])noHan(h[f]);
 for(const q of W.StudentExam.questions){noHan(q.question);q.options.forEach(noHan);noHan(q.explanation);noHan(q.difficulty);}
 for(const g of W.StudentExam.grades){noHan(g.label);noHan(g.message);}
});
test('dynamic labels preserve values and translate sharing text',()=>{
 assert.equal(W.I18n.english('已探索 7 / 7 部'),'7 of 7 books explored');
 assert.equal(W.I18n.english('第 30 / 30 題 · 挑戰'),'Question 30 / 30 · Challenge');
 assert.equal(W.I18n.english('本機最佳紀錄：29 / 30'),'Best on this browser: 29 / 30');
 assert.equal(W.I18n.english('閱讀哈利・波特的人物檔案'),'Read about Harry Potter');
 noHan('我在「霍格華茲藏書室」的分院結果是：葛來分多！\n'+W.SortingQuiz.houses.gryffindor.traits+'\nhttps://example.com/');
 noHan('我在「霍格華茲藏書室」的分院結果是：葛來分多！\n'+W.SortingQuiz.houses.gryffindor.traits+'\n');
 noHan('我在霍格華茲藏書室的學生測試答對 29 / 30 題，取得 O — Outstanding！\n七部小說故事知識測驗，採用本站 O.W.L.s 分數門檻。\nhttps://example.com/');
});
test('default language preserves canonical text and unknown content unchanged',()=>{
 assert.equal(W.I18n.language,'zh-Hant');
 assert.equal(W.I18n.t('七部小說'),'七部小說');
 assert.equal(W.I18n.english('https://example.com/?q=30'),'https://example.com/?q=30');
 assert.equal(W.I18n.english('  27–30 題  '),'  27–30 correct  ');
});
