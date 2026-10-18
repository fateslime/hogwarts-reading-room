(() => {
  'use strict';
  const D=window.LibraryData,Q=window.SortingQuiz,$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const storageKey='hogwarts-reading-room-v1';
  let visited=[],currentBook=0,bookExpanded=false,showSpoilers=false,storageAvailable=true;
  let favorites=[];
  const totalQuestions=Q.questions.length;
  let answers=Array(totalQuestions).fill(null),quizIndex=0,resultHouse=null,quizStage='welcome',quizUpdated=false;
  try{const raw=JSON.parse(localStorage.getItem(storageKey)||'null');if(raw&&typeof raw==='object'){
    if(Array.isArray(raw.visited))visited=[...new Set(raw.visited.filter(v=>Number.isInteger(v)&&v>=0&&v<7))];
    if(Number.isInteger(raw.currentBook)&&raw.currentBook>=0&&raw.currentBook<7)currentBook=raw.currentBook;
    const draft=Q.restoreDraft(raw);answers=draft.answers;quizIndex=draft.index;quizUpdated=draft.updated;
    const validFavorites=new Set([...D.characters.map(c=>'character:'+c.id),...D.creatures.map(c=>'creature:'+c.id)]);
    if(Array.isArray(raw.favorites))favorites=[...new Set(raw.favorites.filter(k=>validFavorites.has(k)))];
    if(Q.validAnswers(answers,true)&&Q.score(answers).tied.includes(raw.resultHouse)){resultHouse=raw.resultHouse;quizStage='result';}
  }}catch{storageAvailable=false;}
  function save(){try{localStorage.setItem(storageKey,JSON.stringify({visited,currentBook,answers,quizIndex,resultHouse,favorites,quizVersion:Q.version}));}catch{storageAvailable=false;}}
  let toastTimer;function toast(message){clearTimeout(toastTimer);$('#toast').textContent=message;$('#toast').classList.add('visible');toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),3300);}
  const menu=$('.menu-toggle'),nav=$('#main-nav');
  function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','開啟導覽選單');}
  menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';nav.classList.toggle('open',open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'關閉導覽選單':'開啟導覽選單');});
  nav.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){closeMenu();menu.focus();}});
  $('#world-toggle').addEventListener('click',()=>{const expanded=$('#world-toggle').getAttribute('aria-expanded')!=='true';$('#world-content').hidden=!expanded;$('#world-toggle').setAttribute('aria-expanded',String(expanded));$('#world-toggle').textContent=expanded?'收起介紹':'閱讀介紹';});
  function renderRoute(){
    $('#book-route').innerHTML=D.books.map((b,i)=>`<button class="book-tab ${visited.includes(i)?'visited':''}" id="book-tab-${i}" type="button" role="tab" aria-selected="${currentBook===i}" aria-controls="book-panel" aria-label="第 ${i+1} 部，${b.title}${visited.includes(i)?'，已探索':''}" tabindex="${currentBook===i?0:-1}" data-book="${i}"><span class="chapter-number">0${i+1}</span><span class="book-tab-title">${b.title}</span></button>`).join('');
    $('#reading-progress').textContent=`已探索 ${visited.length} / 7 部`;$('#reading-meter').value=visited.length;
  }
  function renderBook(){const b=D.books[currentBook];$('#book-panel').setAttribute('aria-labelledby',`book-tab-${currentBook}`);$('#book-panel').innerHTML=`<div class="book-main"><div class="book-copy"><h3>${b.title}</h3><div class="book-english">${b.english} · ${b.year}</div><p>${b.intro}</p></div><button class="text-link" id="book-expand" aria-expanded="${bookExpanded}" aria-controls="book-detail">${bookExpanded?'收起介紹':'探索這一部'} </button></div><div class="book-detail" id="book-detail" ${bookExpanded?'':'hidden'}><div><p>${b.detail}</p></div><aside>${showSpoilers?`<div class="spoiler-content"><h4>關鍵劇情 · 含結局</h4><p>${b.spoiler}</p></div>`:'<p class="spoiler-hidden">重大劇情已隱藏，可用下方開關顯示。</p>'}</aside></div>${bookExpanded?bookConnections(currentBook):''}`;
    $('#book-expand').addEventListener('click',()=>{bookExpanded=!bookExpanded;if(bookExpanded&&!visited.includes(currentBook)){visited.push(currentBook);save();renderRoute();toast(visited.length===7?'已探索全部七部小說。':`已記錄第 ${currentBook+1} 部。`);}renderBook();$('#book-expand').focus({preventScroll:true});});
  }
  function selectBook(index,focus=false){currentBook=index;bookExpanded=false;save();renderRoute();renderBook();if(focus)$(`#book-tab-${index}`).focus({preventScroll:true});}
  $('#book-route').addEventListener('click',e=>{const b=e.target.closest('[data-book]');if(b)selectBook(Number(b.dataset.book),true);});
  $('#book-route').addEventListener('keydown',e=>{let n=currentBook;if(e.key==='ArrowRight')n=(n+1)%7;else if(e.key==='ArrowLeft')n=(n+6)%7;else if(e.key==='Home')n=0;else if(e.key==='End')n=6;else return;e.preventDefault();selectBook(n,true);});
  $('#spoilers').addEventListener('change',e=>{showSpoilers=e.target.checked;$('#spoiler-label').textContent=showSpoilers?'劇透已開啟':'劇透保護中';renderBook();toast(showSpoilers?'已開啟重大劇情，人物檔案也會顯示相關內容。':'已重新收起重大劇情。');});
  $('#reset-reading').addEventListener('click',()=>{visited=[];save();renderRoute();toast('閱讀進度已重設。');});
  const dialog=$('#detail-dialog');let dialogTrigger=null;
  function openDialog(html,kind=''){if(!dialog.open)dialogTrigger=document.activeElement;dialog.dataset.kind=kind;$('#dialog-content').innerHTML=html;if(!dialog.open)dialog.showModal();dialog.scrollTop=0;document.body.style.overflow='hidden';const title=$('#dialog-title');if(title){title.tabIndex=-1;title.focus({preventScroll:true});}}
  dialog.addEventListener('close',()=>{document.body.style.overflow='';if(dialogTrigger&&document.contains(dialogTrigger))dialogTrigger.focus({preventScroll:true});else if(dialog.dataset.kind==='profile')$('#character-search').focus({preventScroll:true});});
  $('.dialog-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});

  const favoriteKey=(kind,c)=>kind+':'+c.id;
  const favoriteButton=(kind,c)=>'<button class="text-link favorite-button" data-favorite="'+favoriteKey(kind,c)+'" aria-pressed="'+favorites.includes(favoriteKey(kind,c))+'">'+(favorites.includes(favoriteKey(kind,c))?'已收藏':'加入收藏')+'</button>';
  const sourceLink=c=>'<p class="profile-source">設定來源：<a href="'+c.source+'" target="_blank" rel="noopener noreferrer">官方檔案（可能含劇情）</a></p>';
  function relatedReading(c){
    return '<div class="profile-related"><h3>相關閱讀</h3><div class="related-links">'+c.books.map((i,n)=>'<button class="text-link" '+(n===0?'id="related-book" ':'')+'data-read-book="'+i+'">'+D.books[i].title+'</button>').join('')+'</div></div>';
  }
  function relatedPeople(c){
    if(!c.related?.length||(c.relatedSpoiler&&!showSpoilers))return '';
    return '<div class="profile-related"><h3>相關人物</h3><div class="related-links">'+c.related.map(i=>'<button class="text-link" data-character="'+i+'">'+D.characters[i].name+'</button>').join('')+'</div></div>';
  }
  function bookConnections(i){
    const characters=D.characters.map((c,index)=>({c,index})).filter(({c})=>c.books.includes(i));
    const creatures=D.creatures.map((c,index)=>({c,index})).filter(({c})=>c.books.includes(i));
    return '<div class="book-connections"><h4>書中檔案</h4><div class="related-links">'+characters.map(({c,index})=>'<button class="text-link" data-character="'+index+'">'+c.name+'</button>').join('')+creatures.map(({c,index})=>'<button class="text-link" data-creature="'+index+'">'+c.name+'</button>').join('')+'</div></div>';
  }
  function renderCharacters(){
    const term=$('#character-search').value.trim().toLocaleLowerCase(),filter=$('#character-filter').value,onlySaved=$('#character-favorites').checked;
    const matched=D.characters.map((c,i)=>({...c,index:i})).filter(c=>(filter==='all'||c.role===filter)&&(!onlySaved||favorites.includes(favoriteKey('character',c)))&&[c.name,c.english,c.house,c.tags,c.facts.flat().join(' '),window.I18n.english(c.house+' '+c.facts.flat().join(' '))].join(' ').toLocaleLowerCase().includes(term));
    $('#character-list').innerHTML=matched.length?matched.map(c=>'<button class="character-entry" data-character="'+c.index+'" aria-label="閱讀'+c.name+'的人物檔案"><span><span class="character-name">'+c.name+'</span><span class="character-meta">'+c.house+'</span></span></button>').join(''):'<p class="empty-state">'+(onlySaved?'沒有符合條件的收藏人物。<br>可在人物檔案中按「加入收藏」。':'沒有符合條件的人物。<br>請嘗試其他關鍵字。')+'</p>';
    $('#character-count').textContent='找到 '+matched.length+' 位人物';
  }
  function openCharacter(i){
    const c=D.characters[i];if(!c)return;
    openDialog('<div class="profile-header'+(c.portrait?'': ' profile-header-text')+'">'+(c.portrait?'<figure class="portrait"><img src="'+c.portrait+'" alt="'+c.name+'的電影人物照片" width="1200" height="832" decoding="async"><figcaption><a href="'+c.portraitSource+'" target="_blank" rel="noopener noreferrer">電影照片來源：HarryPotter.com ↗</a></figcaption></figure>':'')+'<div><h2 id="dialog-title">'+c.name+'</h2><p class="book-english">'+c.english+'</p>'+favoriteButton('character',c)+'</div></div><p>'+c.intro+'</p><dl class="profile-facts">'+c.facts.map(([label,value])=>'<div><dt>'+label+'</dt><dd>'+value+'</dd></div>').join('')+'</dl><p>'+c.story+'</p>'+(c.spoiler?(showSpoilers?'<div class="spoiler-content"><h3>關鍵劇情 · 含結局</h3><p>'+c.spoiler+'</p></div>':'<p class="spoiler-hidden">此人物的重大劇情已隱藏，可在小說區開啟劇透。</p>'):'')+relatedPeople(c)+(c.creatures?'<div class="profile-related"><h3>相關神奇動物</h3><div class="related-links">'+c.creatures.map(n=>'<button class="text-link" data-creature="'+n+'">'+D.creatures[n].name+'</button>').join('')+'</div></div>':'')+relatedReading(c)+sourceLink(c),'profile');
  }
  $('#character-search').addEventListener('input',renderCharacters);
  $('#character-filter').addEventListener('change',renderCharacters);
  $('#character-favorites').addEventListener('change',renderCharacters);
  function creatureArt(c,extra=''){
    const crop=c.artHeight?';background-size:300% '+(1024/c.artHeight*100)+'%;aspect-ratio:512/'+c.artHeight:'';
    return '<div class="creature-art '+extra+'" style="background-image:url(assets/'+c.art+');background-position:'+c.x+'% '+c.y+'%'+crop+'" role="img" aria-label="'+c.name+'的鋼筆淡彩插畫"></div>';
  }
  let creatureFilter='all',creatureLimit=6;
  function renderCreatures(){
    const term=$('#creature-search').value.trim().toLocaleLowerCase(),onlySaved=$('#creature-favorites').checked;
    const list=D.creatures.map((c,i)=>({...c,index:i})).filter(c=>(creatureFilter==='all'||c.type===creatureFilter)&&(!onlySaved||favorites.includes(favoriteKey('creature',c)))&&[c.name,c.english,c.habitat,c.ability,window.I18n.english(c.habitat+' '+c.ability)].join(' ').toLocaleLowerCase().includes(term));
    const visible=list.slice(0,creatureLimit);
    $('#creature-count').textContent=list.length+' 種';
    $('#creature-grid').innerHTML=visible.length?visible.map(c=>'<article class="creature-card">'+creatureArt(c)+'<h3>'+c.name+'<span>'+c.english+'</span></h3><p>'+c.intro+'</p><button class="text-link" data-creature="'+c.index+'" aria-label="閱讀'+c.name+'的觀察筆記">查看詳情</button></article>').join(''):'<p class="empty-state">'+(onlySaved?'沒有符合條件的收藏。可在生物檔案中加入收藏。':'沒有符合條件的生物，請試試其他關鍵字。')+'</p>';
    const more=$('#creatures-more');more.hidden=list.length<=visible.length;more.textContent='顯示其餘 '+(list.length-visible.length)+' 種';
  }
  function openCreature(i){
    const c=D.creatures[i];if(!c)return;
    openDialog(creatureArt(c,'dialog-art')+'<div class="profile-title"><div><h2 id="dialog-title">'+c.name+'</h2><p class="book-english">'+c.english+'</p></div>'+favoriteButton('creature',c)+'</div><p>'+c.detail+'</p><dl class="profile-facts"><div><dt>棲地</dt><dd>'+c.habitat+'</dd></div><div><dt>能力</dt><dd>'+c.ability+'</dd></div><div><dt>接近之前</dt><dd>'+c.care+'</dd></div></dl><p>'+c.extra+'</p>'+relatedPeople(c)+relatedReading(c)+sourceLink(c),'profile');
  }
  $$('.filter').forEach(b=>b.addEventListener('click',()=>{$$('.filter').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b));});creatureFilter=b.dataset.creatureFilter;creatureLimit=6;renderCreatures();}));
  $('#creature-search').addEventListener('input',()=>{creatureLimit=6;renderCreatures();});
  $('#creature-favorites').addEventListener('change',()=>{creatureLimit=6;renderCreatures();});
  $('#creatures-more').addEventListener('click',()=>{creatureLimit=D.creatures.length;renderCreatures();const next=$('#creature-grid [data-creature="6"]')||$('#creature-grid button:last-of-type');if(next)next.focus({preventScroll:true});});
  document.addEventListener('click',e=>{
    const character=e.target.closest('[data-character]'),creature=e.target.closest('[data-creature]'),favorite=e.target.closest('[data-favorite]'),book=e.target.closest('[data-read-book]');
    if(character)openCharacter(Number(character.dataset.character));
    else if(creature)openCreature(Number(creature.dataset.creature));
    else if(favorite){
      const key=favorite.dataset.favorite,existed=favorites.includes(key);
      favorites=existed?favorites.filter(k=>k!==key):[...favorites,key];save();
      favorite.textContent=existed?'加入收藏':'已收藏';favorite.setAttribute('aria-pressed',String(!existed));
      renderCharacters();renderCreatures();toast(existed?'已移除收藏。':storageAvailable?'已收藏，可用「只看收藏」找到。':'已加入本次收藏，關閉頁面後不保留。');
    }else if(book){if(dialog.open)dialog.close();selectBook(Number(book.dataset.readBook));$('#books').scrollIntoView();$('[aria-selected="true"]').focus({preventScroll:true});}
  });
  function quizFocus(){const target=$('#quiz legend')||$('#quiz h3')||$('#quiz [data-quiz-action="start"]');if(target){if(target.tagName!=='BUTTON')target.tabIndex=-1;target.focus({preventScroll:true});}}
  function renderQuiz(focus=false){const el=$('#quiz');if(quizStage==='welcome'){const hasProgress=answers.some(a=>a!==null);el.innerHTML=`<div class="quiz-welcome">${quizUpdated?'<p class="quiz-update" role="status">分院題目與計分已更新，請重新作答；閱讀進度、收藏與學生測驗紀錄都會保留。</p>':''}<p>每題選擇最接近你的做法，<br>不必挑選看起來最厲害的答案。</p><button class="button primary" data-quiz-action="start">${hasProgress?'繼續作答':'戴上分類帽'} </button><span class="quiz-note">16 題 · 約 4 分鐘</span>${hasProgress?'<button class="text-link subtle" data-quiz-action="restart" style="margin-top:14px">重新開始</button>':''}</div>`;
    }else if(quizStage==='question'){const q=Q.questions[quizIndex];el.innerHTML=`<div class="quiz-progress"><span>${String(quizIndex+1).padStart(2,'0')} / ${totalQuestions}</span><progress max="${totalQuestions}" value="${quizIndex+1}" aria-label="第 ${quizIndex+1} 題，共 ${totalQuestions} 題"></progress></div><fieldset><legend>${q.question}</legend><div class="quiz-answers">${q.answers.map((a,i)=>`<label class="quiz-option"><input type="radio" name="quiz-answer" value="${i}" ${answers[quizIndex]===i?'checked':''}><span>${a.text}</span></label>`).join('')}</div></fieldset><div class="quiz-controls"><button class="text-link subtle" data-quiz-action="back" ${quizIndex===0?'disabled':''}>上一題</button><button class="button primary" data-quiz-action="next" ${answers[quizIndex]===null?'disabled':''}>${quizIndex===totalQuestions-1?'聽聽分類帽的答案':'下一題'}</button></div>`;
    }else if(quizStage==='tie'){const tied=Q.score(answers).tied;el.innerHTML=`<fieldset><legend>你擁有不只一種鮮明特質。<br>哪一份價值，更讓你感到歸屬？</legend><div class="quiz-answers">${tied.map(id=>`<label class="quiz-option"><input type="radio" name="tie-answer" value="${id}"><span>${Q.houses[id].traits}<small style="display:block;color:var(--muted)">${Q.houses[id].name}</small></span></label>`).join('')}</div></fieldset><div class="quiz-controls"><button class="text-link subtle" data-quiz-action="last">返回最後一題</button><button class="button primary" data-quiz-action="tie-result" disabled>這是我的選擇</button></div>`;
    }else if(quizStage==='result'){const h=Q.houses[resultHouse],s=Q.score(answers);el.innerHTML=`<div class="quiz-result ${resultHouse}"><h3>${h.name}</h3><p class="book-english">${h.english}</p><p class="result-traits">${h.traits}</p><p class="result-description">${h.description}</p><div class="result-bars" aria-label="四大學院的本次選擇分布">${Object.entries(Q.houses).map(([id,house])=>`<div class="result-bar ${id}"><span>${house.name}</span><div class="bar-track" aria-hidden="true"><i style="width:${s.scores[id]/s.total*100}%"></i></div><span>${Math.round(s.scores[id]/s.total*100)}%</span></div>`).join('')}</div><small class="quiz-note">比例代表本次作答分布，並非能力或人格評分。</small><div class="result-actions"><button class="text-link" data-quiz-action="copy">複製分院結果</button><button class="text-link" data-quiz-action="restart">重新測驗</button></div></div>`;}if(focus)quizFocus();}
  function completeQuiz(id){resultHouse=id;quizStage='result';save();renderQuiz(true);toast(`歡迎來到${Q.houses[id].name}。`);}
  $('#quiz').addEventListener('change',e=>{if(e.target.name==='quiz-answer'){answers[quizIndex]=Number(e.target.value);resultHouse=null;save();$('[data-quiz-action="next"]').disabled=false;}else if(e.target.name==='tie-answer')$('[data-quiz-action="tie-result"]').disabled=false;});
  $('#quiz').addEventListener('click',e=>{const b=e.target.closest('[data-quiz-action]');if(!b||b.disabled)return;const action=b.dataset.quizAction;
    if(action==='start'){quizUpdated=false;quizStage='question';save();renderQuiz(true);}else if(action==='restart'){quizUpdated=false;answers=Array(totalQuestions).fill(null);quizIndex=0;resultHouse=null;quizStage='welcome';save();renderQuiz(true);}else if(action==='back'&&quizIndex>0){quizIndex--;save();renderQuiz(true);}else if(action==='last'){quizIndex=totalQuestions-1;quizStage='question';renderQuiz(true);}else if(action==='next'&&answers[quizIndex]!==null){if(quizIndex<totalQuestions-1){quizIndex++;save();renderQuiz(true);}else{const score=Q.score(answers);if(score.tied.length===1)completeQuiz(score.tied[0]);else{quizStage='tie';renderQuiz(true);}}}else if(action==='tie-result'){const selected=$('input[name="tie-answer"]:checked');if(selected&&Q.score(answers).tied.includes(selected.value))completeQuiz(selected.value);}else if(action==='copy'){const h=Q.houses[resultHouse];copyText(window.I18n.t(`我在「霍格華茲藏書室」的分院結果是：${h.name}！\n${h.traits}\n${location.protocol==='file:'?'':location.origin+location.pathname}`));}
  });
  async function copyText(text){try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(text);toast('已複製，可以貼到你想分享的地方。');return;}}catch{}
    openDialog('<h2 id="dialog-title">文字已為你準備好</h2><p>目前瀏覽器無法自動複製，請選取下方文字後複製。</p><label class="letter-form"><span class="sr-only">待複製文字</span><textarea id="copy-fallback" rows="7" readonly></textarea></label>');$('#copy-fallback').value=text;$('#copy-fallback').focus();$('#copy-fallback').select();}
  $('#sources-open').addEventListener('click',()=>openDialog(`<h2 id="dialog-title">參考資料</h2><p>介紹以七部小說為核心，中文名稱以台灣皇冠繁體中文版為準。下列資料可作為延伸閱讀；外部頁面可能包含劇情。</p><ul class="source-list">${D.sources.map(([name,url])=>`<li><a href="${url}" target="_blank" rel="noopener noreferrer">${esc(name)}</a></li>`).join('')}</ul><p style="font-size:12px;color:var(--muted)">人物電影照片來自 HarryPotter.com 官方人物百科，各人物檔案均附來源連結；圖片權利歸原權利人。城堡與奇獸為 AI 輔助插畫。本站為非官方導覽，分院題目為本站原創娛樂設計，並非官方分類帽測驗。</p>`));
  $('#contact-open').addEventListener('click',()=>{openDialog(`<h2 id="dialog-title">寫給藏書室的一封信</h2><p>${D.owner.email?'寫下你的訊息，再交給你的電子郵件程式。':'收件信箱尚未設定。這裡可以撰寫並複製訊息，不會寄出或儲存你的資料。'}</p><form class="letter-form" id="letter-form"><label>你的稱呼<input name="sender" maxlength="80" placeholder="一位來訪的讀者" required autocomplete="name"></label><label>想說的話<textarea name="message" maxlength="2000" required placeholder="想分享的心得，或希望新增的內容…"></textarea></label><button class="button primary" type="submit">${D.owner.email?'開啟電子郵件程式':'複製這封信'} </button><small>${D.owner.email?'是否寄出，由你在郵件程式中決定。':'關閉視窗後，這封信的草稿不會保留。'}</small></form>`);$('#letter-form').addEventListener('submit',e=>{e.preventDefault();const form=new FormData(e.target),text=`致 ${D.owner.name}：\n\n${form.get('message')}\n\n${form.get('sender')}`;if(D.owner.email){location.href=`mailto:${encodeURIComponent(D.owner.email)}?subject=${encodeURIComponent('來自藏書室讀者的信')}&body=${encodeURIComponent(text)}`;}else copyText(text);});});
  if(D.owner.email)$('#contact-description').textContent=`寫信給 ${D.owner.email}，分享你的閱讀心得。`;
  if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){nav.querySelectorAll('a').forEach(a=>{const active=a.hash===`#${entry.target.id==='sorting'?'houses':entry.target.id}`;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}});},{rootMargin:'-15% 0px -65% 0px'});['world','books','characters','creatures','houses','sorting','student-exam'].forEach(id=>observer.observe(document.getElementById(id)));}
  renderRoute();renderBook();renderCharacters();renderCreatures();renderQuiz();
})();
