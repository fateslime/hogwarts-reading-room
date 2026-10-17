(() => {
  'use strict';
  const E=window.StudentExam,D=window.LibraryData,root=document.querySelector('#exam-sheet');
  const key='hogwarts-student-exam-v1';
  let state=E.restore(null),storageOK=true,stage='welcome',reviewWrong=true;
  try{state=E.restore(JSON.parse(localStorage.getItem(key)||'null'));}catch{storageOK=false;}
  if(state.completed)stage='result';
  function save(){try{localStorage.setItem(key,JSON.stringify(state));}catch{storageOK=false;}status();}
  function status(){document.querySelector('#exam-save-status').textContent=storageOK?'作答進度會保留在這個瀏覽器。':'此瀏覽器無法保存進度，關閉頁面後不會保留。';}
  const action=(name,text,primary=false,disabled=false)=>'<button type="button" class="'+(primary?'button primary':'text-link')+'" data-exam-action="'+name+'" '+(disabled?'disabled':'')+'>'+text+'</button>';
  function gradeTable(){
    return '<details class="exam-grades"><summary>O.W.L.s 等第與本站計分方式</summary><p>O、E、A 為及格；P、D、T 為未及格。每題 1 分，不倒扣。等第名稱沿用小說，以下分數門檻及中文說明為本站設計。</p><div class="exam-table-wrap"><table><caption class="sr-only">學生測驗的等第對照</caption><thead><tr><th scope="col">等第</th><th scope="col">名稱</th><th scope="col">答對題數</th></tr></thead><tbody>'+E.grades.map((g,i)=>'<tr><th scope="row">'+g.letter+'</th><td>'+g.english+'<small>'+g.label+'</small></td><td>'+g.min+'–'+(i?E.grades[i-1].min-1:30)+' 題</td></tr>').join('')+'</tbody></table></div><a href="https://www.harrypotter.com/fact-file/magical-miscellany/o-w-l-s" target="_blank" rel="noopener noreferrer">官方 O.W.L.s 設定</a></details>';
  }
  function render(focus=false){
    const answered=state.answers.filter(a=>a!==null).length;
    if(stage==='welcome'){
      root.innerHTML='<div class="exam-welcome"><p>30 道單選題，由故事的起點走向藏在字裡行間的伏筆。不限時，每題都能返回修改。</p><p class="exam-spoiler-note">涵蓋七部小說，包含結局劇情。請在準備好後開始。</p><div class="exam-actions">'+action('start',answered?'繼續作答 · 已答 '+answered+' 題':'開始學生測試',true)+(answered?action('restart','重新開始'):'')+'</div>'+gradeTable()+'</div>';
    }else if(stage==='question'){
      const q=E.questions[state.index];
      root.innerHTML='<div class="exam-progress"><span>第 '+(state.index+1)+' / 30 題 · '+q.difficulty+'</span><span>已答 '+answered+' 題</span><progress value="'+answered+'" max="30" aria-label="已回答 '+answered+' 題，共 30 題"></progress></div><fieldset><legend>'+q.question+'</legend><div class="quiz-answers">'+q.options.map((option,i)=>'<label class="quiz-option"><input type="radio" name="exam-answer" value="'+i+'" '+(state.answers[state.index]===i?'checked':'')+'><span>'+option+'</span></label>').join('')+'</div></fieldset><div class="quiz-controls">'+action('back','上一題',false,state.index===0)+action('next',state.index===29?'檢查答卷':'下一題',true,state.answers[state.index]===null)+'</div><div class="exam-secondary">'+action('pause','暫停，稍後再答')+(answered===30?action('overview','檢查答卷'):'')+'</div>';
    }else if(stage==='overview'){
      root.innerHTML='<h3 tabindex="-1">交卷之前</h3><p>已回答 '+answered+' / 30 題。可以點選題號檢查答案，交卷後再揭曉解析。</p><div class="exam-overview" aria-label="選擇要檢查的題目">'+E.questions.map((q,i)=>'<button class="exam-number" data-exam-question="'+i+'" aria-label="檢查第 '+(i+1)+' 題，'+(state.answers[i]===null?'未作答':'已作答')+'">'+String(i+1).padStart(2,'0')+'</button>').join('')+'</div><div class="exam-actions">'+action('submit','交卷，查看成績',true,answered!==30)+action('last','回到最後一題')+'</div>';
    }else if(stage==='result'){
      const s=E.score(state.answers),g=s.grade;
      const bookMisses=D.books.map((b,i)=>({index:i,title:b.title,count:E.questions.filter((q,n)=>q.book===i&&!s.checks[n]).length})).filter(b=>b.count).sort((a,b)=>b.count-a.count).slice(0,3);
      root.innerHTML='<div class="exam-result"><div class="exam-result-heading"><div><p class="exam-result-label">你的 O.W.L.s 成績</p><h3>'+g.english+'</h3><p>'+g.label+' · '+(g.passed?'及格':'未及格')+'</p></div><span class="exam-grade-letter" aria-hidden="true">'+g.letter+'</span></div><p class="exam-score"><strong>'+s.correct+'</strong> / 30 題<span>答對率 '+s.percent+'%</span></p><p>'+g.message+'</p><dl class="exam-levels">'+['基礎','進階','挑戰'].map((label,i)=>'<div><dt>'+label+'</dt><dd>'+s.levels[i]+' / 10</dd></div>').join('')+'</dl><p class="exam-best">本機最佳紀錄：'+Math.max(state.best||0,s.correct)+' / 30</p><div class="exam-actions">'+action('review','查看答案解析',true)+action('copy','複製成績')+action('restart','重新挑戰')+'</div><div id="exam-copy" hidden><label for="exam-copy-text">請選取以下文字複製</label><textarea id="exam-copy-text" rows="4" readonly></textarea></div><p id="exam-copy-status" role="status"></p>'+(bookMisses.length?'<div class="exam-reading"><h4>適合重溫的小說</h4><div class="related-links">'+bookMisses.map(b=>'<button class="text-link" data-read-book="'+b.index+'">'+b.title+'</button>').join('')+'</div></div>':'')+gradeTable()+'</div>';
    }else if(stage==='review'){
      const s=E.score(state.answers);
      const indices=E.questions.map((_,i)=>i).filter(i=>!reviewWrong||!s.checks[i]);
      root.innerHTML='<div class="exam-review-heading"><h3>答案解析</h3>'+action('result','返回成績單')+'</div><label class="saved-filter"><input id="exam-wrong-only" type="checkbox" '+(reviewWrong?'checked':'')+'>只看答錯的題目（'+(30-s.correct)+' 題）</label><div class="exam-review-list">'+(indices.length?indices.map(i=>{
        const q=E.questions[i];
        return '<article class="exam-review-item"><p class="exam-review-meta">第 '+(i+1)+' 題 · '+q.difficulty+' · '+(s.checks[i]?'答對':'答錯')+'</p><h4>'+q.question+'</h4><p class="'+(s.checks[i]?'answer-correct':'answer-chosen')+'">你的答案：'+q.options[state.answers[i]]+'</p>'+(!s.checks[i]?'<p class="answer-correct">正確答案：'+q.options[q.answer]+'</p>':'')+'<p>'+q.explanation+'</p><div class="exam-review-source"><button class="text-link" data-read-book="'+q.book+'">重溫《'+D.books[q.book].title+'》</button><span>第 '+q.chapter+' 章</span></div></article>';
      }).join(''):'<p class="empty-state">全數答對！取消勾選即可閱讀全部解析。</p>')+'</div>';
    }else if(stage==='restart'){
      root.innerHTML='<h3>重新開始這份答卷？</h3><p>本次作答將清除，最佳紀錄會保留。小說閱讀進度、收藏與分院結果不受影響。</p><div class="exam-actions">'+action('confirm-restart','重新開始',true)+action('cancel-restart','保留目前答卷')+'</div>';
    }
    if(focus){const target=root.querySelector('legend,h3,[data-exam-action="start"]');if(target){target.tabIndex=-1;target.focus({preventScroll:true});}if(root.getBoundingClientRect().top<60)root.scrollIntoView({block:'start',behavior:'instant'});}
    status();
  }
  let beforeRestart='welcome';
  root.addEventListener('change',event=>{
    if(event.target.name==='exam-answer'){
      state.answers[state.index]=Number(event.target.value);save();
      root.querySelector('[data-exam-action="next"]').disabled=false;
      const count=state.answers.filter(a=>a!==null).length;
      root.querySelector('.exam-progress span:nth-child(2)').textContent='已答 '+count+' 題';
      const progress=root.querySelector('progress');progress.value=count;progress.setAttribute('aria-label','已回答 '+count+' 題，共 30 題');
    }else if(event.target.id==='exam-wrong-only'){reviewWrong=event.target.checked;render();root.querySelector('#exam-wrong-only').focus({preventScroll:true});}
  });
  root.addEventListener('click',async event=>{
    const jump=event.target.closest('[data-exam-question]');
    if(jump){state.index=Number(jump.dataset.examQuestion);stage='question';save();render(true);return;}
    const button=event.target.closest('[data-exam-action]');if(!button||button.disabled)return;
    const name=button.dataset.examAction;
    if(name==='start'){stage='question';}
    else if(name==='next'){if(state.answers[state.index]===null)return;if(state.index<29)state.index++;else stage='overview';}
    else if(name==='back'){state.index=Math.max(0,state.index-1);}
    else if(name==='last'){state.index=29;stage='question';}
    else if(name==='pause'){stage='welcome';}
    else if(name==='overview'){stage='overview';}
    else if(name==='submit'){if(!E.validAnswers(state.answers,true))return;state.completed=true;state.best=Math.max(state.best||0,E.score(state.answers).correct);stage='result';}
    else if(name==='review'){reviewWrong=E.score(state.answers).correct<30;stage='review';}
    else if(name==='result'){stage='result';}
    else if(name==='restart'){beforeRestart=stage;stage='restart';}
    else if(name==='cancel-restart'){stage=beforeRestart;}
    else if(name==='confirm-restart'){const best=state.best;state=E.restore(null);state.best=best;stage='question';}
    else if(name==='copy'){
      const s=E.score(state.answers),text=window.I18n.t('我在霍格華茲藏書室的學生測試答對 '+s.correct+' / 30 題，取得 '+s.grade.letter+' — '+s.grade.english+'！\n七部小說故事知識測驗，採用本站 O.W.L.s 分數門檻。'+(location.protocol==='file:'?'':'\n'+location.origin+location.pathname+'#student-exam'));
      try{await navigator.clipboard.writeText(text);root.querySelector('#exam-copy-status').textContent='成績已複製。';}catch{root.querySelector('#exam-copy').hidden=false;const field=root.querySelector('#exam-copy-text');field.value=text;field.focus();field.select();}
      return;
    }else return;
    save();render(true);
  });
  render();
})();

