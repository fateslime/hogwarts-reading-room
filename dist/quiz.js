(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.SortingQuiz=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const houses={
    gryffindor:{name:'葛來分多',english:'Gryffindor',animal:'獅',traits:'勇氣・膽識・堅定',description:'面對害怕的事，你仍願意跨出一步。你看重公平與行動，也願意為珍惜的人挺身而出。勇氣不是從不害怕，而是在害怕時仍知道自己想守護什麼。'},
    slytherin:{name:'史萊哲林',english:'Slytherin',animal:'蛇',traits:'抱負・機敏・決心',description:'你習慣思考方向，也懂得為長遠目標準備。你重視自主、策略與把事情做到的能力。真正的抱負，也可以是為自己與重要的人創造更多可能。'},
    ravenclaw:{name:'雷文克勞',english:'Ravenclaw',animal:'鷹',traits:'智慧・好奇・創造',description:'你享受理解事物的過程，也願意提出不同的問題。比起急著得到答案，你更在意答案從何而來。讓好奇心陪著你，同時保留被新觀點改變的空間。'},
    hufflepuff:{name:'赫夫帕夫',english:'Hufflepuff',animal:'獾',traits:'忠誠・耐心・公正',description:'你珍惜可靠的關係，也願意把日常小事認真做好。你常看見被忽略的人，讓同行者覺得安心。溫柔與耐心並不微小，它們能讓一段旅程走得更遠。'}
  };
  const questions=[
  {
    "question": "社團要辦一場魔法展示，你最想負責哪個部分？",
    "answers": [
      {
        "text": "上台示範，和觀眾分享第一次成功的經驗。",
        "house": "gryffindor"
      },
      {
        "text": "設計小實驗，讓觀眾看懂魔法背後的原理。",
        "house": "ravenclaw"
      },
      {
        "text": "陪同學反覆練習，讓每個人都能參與演出。",
        "house": "hufflepuff"
      },
      {
        "text": "聯絡合作社團，爭取把展示辦得更有規模。",
        "house": "slytherin"
      }
    ]
  },
  {
    "question": "你只能選一門額外課程。哪種學習經驗最吸引你？",
    "answers": [
      {
        "text": "追查一個沒有標準答案的魔法謎題。",
        "house": "ravenclaw"
      },
      {
        "text": "長期照顧一株植物，見證細小的變化。",
        "house": "hufflepuff"
      },
      {
        "text": "把自己的點子發展成能實際運作的計畫。",
        "house": "slytherin"
      },
      {
        "text": "練習在眾人面前表達自己真正的立場。",
        "house": "gryffindor"
      }
    ]
  },
  {
    "question": "朋友的提案在討論時被忽略，你比較想怎麼幫忙？",
    "answers": [
      {
        "text": "陪他整理想說的話，再一起參與討論。",
        "house": "hufflepuff"
      },
      {
        "text": "替提案爭取一次小規模試辦的機會。",
        "house": "slytherin"
      },
      {
        "text": "在會議上支持他，請大家重新聽一次。",
        "house": "gryffindor"
      },
      {
        "text": "和他找出被誤解的地方，換個角度說明。",
        "house": "ravenclaw"
      }
    ]
  },
  {
    "question": "準備校內比賽時，哪件事最能讓你投入？",
    "answers": [
      {
        "text": "設定想突破的成績，為目標調整訓練。",
        "house": "slytherin"
      },
      {
        "text": "挑戰自己還不熟悉的位置，累積上場經驗。",
        "house": "gryffindor"
      },
      {
        "text": "研究不同打法，理解每種選擇的效果。",
        "house": "ravenclaw"
      },
      {
        "text": "和隊友固定練習，一起把配合練得更好。",
        "house": "hufflepuff"
      }
    ]
  },
  {
    "question": "一個學期結束，哪句評語會讓你最有感？",
    "answers": [
      {
        "text": "和你一起做事，大家知道承諾會被實踐。",
        "house": "hufflepuff"
      },
      {
        "text": "你在不容易開口的時候，說出了自己的想法。",
        "house": "gryffindor"
      },
      {
        "text": "你把想做的事，一步一步變成了成果。",
        "house": "slytherin"
      },
      {
        "text": "你的問題，讓我們看見原本沒想到的事情。",
        "house": "ravenclaw"
      }
    ]
  },
  {
    "question": "新學會的符咒一直不穩定，你比較願意花時間做什麼？",
    "answers": [
      {
        "text": "把想達成的效果分成幾階段，逐項完成。",
        "house": "slytherin"
      },
      {
        "text": "一次改變一個動作，觀察是哪個細節造成差異。",
        "house": "ravenclaw"
      },
      {
        "text": "找人一起固定練習，互相記住需要改進的地方。",
        "house": "hufflepuff"
      },
      {
        "text": "請同學當觀眾，練習在緊張時也能施展。",
        "house": "gryffindor"
      }
    ]
  },
  {
    "question": "畢業多年後，你希望同學最常記得你的哪一面？",
    "answers": [
      {
        "text": "遇到需要有人出面的事，願意承擔責任。",
        "house": "gryffindor"
      },
      {
        "text": "清楚自己想走的路，也願意為它付出努力。",
        "house": "slytherin"
      },
      {
        "text": "常有新鮮的觀點，也樂於聽不同的解釋。",
        "house": "ravenclaw"
      },
      {
        "text": "相處時可靠真誠，珍惜一路同行的人。",
        "house": "hufflepuff"
      }
    ]
  },
  {
    "question": "新同學剛搬進宿舍。你最想帶他做哪件事？",
    "answers": [
      {
        "text": "逛逛圖書館，交換彼此最想研究的題目。",
        "house": "ravenclaw"
      },
      {
        "text": "熟悉日常作息，找個時間一起吃飯聊天。",
        "house": "hufflepuff"
      },
      {
        "text": "一起參加第一次社團活動，陪他開口介紹自己。",
        "house": "gryffindor"
      },
      {
        "text": "聊聊他的學期目標，介紹適合參加的活動。",
        "house": "slytherin"
      }
    ]
  },
  {
    "question": "團體作業可以自行分工，你最想接下哪項責任？",
    "answers": [
      {
        "text": "查核資料與推論，找出尚未解開的疑點。",
        "house": "ravenclaw"
      },
      {
        "text": "代表小組發表，回答現場提出的問題。",
        "house": "gryffindor"
      },
      {
        "text": "協調時程與資源，讓提案能如期完成。",
        "house": "slytherin"
      },
      {
        "text": "整合每個人的成果，確保沒有漏掉誰的貢獻。",
        "house": "hufflepuff"
      }
    ]
  },
  {
    "question": "你希望改變一項不公平的社團規定，會先投入哪件事？",
    "answers": [
      {
        "text": "和受影響的人討論，讓他們能一起參與修改。",
        "house": "hufflepuff"
      },
      {
        "text": "提出替代方案，逐一爭取成員支持。",
        "house": "slytherin"
      },
      {
        "text": "在成員會議上提出異議，表明自己的立場。",
        "house": "gryffindor"
      },
      {
        "text": "比較不同做法，釐清規定造成問題的原因。",
        "house": "ravenclaw"
      }
    ]
  },
  {
    "question": "週末有半天空檔，你比較想參加哪個活動？",
    "answers": [
      {
        "text": "參加企畫交流，向別人介紹自己想完成的作品。",
        "house": "slytherin"
      },
      {
        "text": "和熟悉的夥伴整理溫室，一邊工作一邊聊天。",
        "house": "hufflepuff"
      },
      {
        "text": "參加解謎聚會，交換各種不同的解法。",
        "house": "ravenclaw"
      },
      {
        "text": "參加即興演出，試著接住沒有預先排練的情節。",
        "house": "gryffindor"
      }
    ]
  },
  {
    "question": "如果能請一位老師指導，你最想向他學什麼？",
    "answers": [
      {
        "text": "在沒有把握的時候，仍能表達自己的判斷。",
        "house": "gryffindor"
      },
      {
        "text": "辨認自己的盲點，提出更有意思的問題。",
        "house": "ravenclaw"
      },
      {
        "text": "在漫長的合作裡，維持耐心與彼此的信任。",
        "house": "hufflepuff"
      },
      {
        "text": "在許多機會之間，選出值得持續投入的方向。",
        "house": "slytherin"
      }
    ]
  },
  {
    "question": "社團想留下一項傳統，你最希望保留什麼？",
    "answers": [
      {
        "text": "讓成員提出自己的計畫，募集願意合作的人。",
        "house": "slytherin"
      },
      {
        "text": "保留一晚自由提問，討論課程以外的想法。",
        "house": "ravenclaw"
      },
      {
        "text": "每學期讓成員挑戰一件從沒做過的事。",
        "house": "gryffindor"
      },
      {
        "text": "由老成員陪伴新成員，直到他們熟悉環境。",
        "house": "hufflepuff"
      }
    ]
  },
  {
    "question": "小組意見不合時，你通常願意負責哪件事？",
    "answers": [
      {
        "text": "把大家避而不談的分歧說出來，開始正面討論。",
        "house": "gryffindor"
      },
      {
        "text": "留意還沒說話的人，讓每個人都有發言時間。",
        "house": "hufflepuff"
      },
      {
        "text": "整理各方願意接受的條件，協商下一步。",
        "house": "slytherin"
      },
      {
        "text": "分開事實與猜測，確認大家爭論的是同一件事。",
        "house": "ravenclaw"
      }
    ]
  },
  {
    "question": "完成一段旅程後，你最想保存什麼？",
    "answers": [
      {
        "text": "記下沿途新發現、還想繼續追問的筆記。",
        "house": "ravenclaw"
      },
      {
        "text": "一份記錄收穫、也寫下下一個目標的清單。",
        "house": "slytherin"
      },
      {
        "text": "和同行者一起寫下的回憶與約定。",
        "house": "hufflepuff"
      },
      {
        "text": "提醒自己曾跨出舒適圈的一件紀念品。",
        "house": "gryffindor"
      }
    ]
  },
  {
    "question": "如果四件事都值得做，你最不想放棄哪一件？",
    "answers": [
      {
        "text": "把答應夥伴的事，耐心完成到最後。",
        "house": "hufflepuff"
      },
      {
        "text": "為自己相信的事，承擔一次站出來的責任。",
        "house": "gryffindor"
      },
      {
        "text": "把一直困擾自己的疑問，追究得更清楚。",
        "house": "ravenclaw"
      },
      {
        "text": "把自己選定的方向，推進到下一個階段。",
        "house": "slytherin"
      }
    ]
  }
];
  const version=3;
  function validAnswers(answers,complete=false){return Array.isArray(answers)&&answers.length===questions.length&&Array.from(answers).every(v=>(!complete&&v===null)||(Number.isInteger(v)&&v>=0&&v<4));}
  function score(answers){
    if(!validAnswers(answers,true))throw new TypeError('請先完成所有題目');
    const scores=Object.fromEntries(Object.keys(houses).map(k=>[k,0]));
    answers.forEach((n,i)=>{scores[questions[i].answers[n].house]+=1;});
    const max=Math.max(...Object.values(scores));
    return {scores,tied:Object.keys(scores).filter(k=>scores[k]===max),total:questions.length};
  }
  function restoreDraft(raw){
    const empty=updated=>({answers:Array(questions.length).fill(null),index:0,updated});
    if(!raw||typeof raw!=='object')return empty(false);
    // The v3 questions have new meanings and positions. Never reinterpret old answers.
    if(raw.quizVersion!==version)return empty(Array.isArray(raw.answers)&&raw.answers.some(v=>v!==null));
    if(!validAnswers(raw.answers))return empty(false);
    const next=raw.answers.findIndex(a=>a===null);
    return {answers:[...raw.answers],index:Number.isInteger(raw.quizIndex)&&raw.quizIndex>=0&&raw.quizIndex<questions.length?raw.quizIndex:(next<0?questions.length-1:next),updated:false};
  }
  return {houses,questions,version,score,validAnswers,restoreDraft};
});
