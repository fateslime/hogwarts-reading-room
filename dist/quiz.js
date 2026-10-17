(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.SortingQuiz=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const houses={
    gryffindor:{name:'葛來分多',english:'Gryffindor',animal:'獅',traits:'勇氣・膽識・堅定',description:'面對害怕的事，你仍願意跨出一步。你看重公平與行動，也願意為珍惜的人挺身而出。勇氣不是從不害怕，而是在害怕時仍知道自己想守護什麼。'},
    slytherin:{name:'史萊哲林',english:'Slytherin',animal:'蛇',traits:'抱負・機敏・決心',description:'你習慣思考方向，也懂得為長遠目標準備。你重視自主、策略與把事情做到的能力。真正的抱負，也可以是為自己與重要的人創造更多可能。'},
    ravenclaw:{name:'雷文克勞',english:'Ravenclaw',animal:'鷹',traits:'智慧・好奇・創造',description:'你享受理解事物的過程，也願意提出不同的問題。比起急著得到答案，你更在意答案從何而來。讓好奇心陪著你，同時保留被新觀點改變的空間。'},
    hufflepuff:{name:'赫夫帕夫',english:'Hufflepuff',animal:'獾',traits:'忠誠・耐心・公正',description:'你珍惜可靠的關係，也願意把日常小事認真做好。你常看見被忽略的人，讓同行者覺得安心。溫柔與耐心並不微小，它們能讓一段旅程走得更遠。'}
  };
  const a=(text,house,secondary)=>({text,house,secondary});
  const questions=[
  {
    "question": "面對一段陌生的旅程，你會先？",
    "answers": [
      {
        "text": "踏出第一步，沿路再找答案。",
        "house": "gryffindor",
        "secondary": "slytherin"
      },
      {
        "text": "閱讀地圖，弄清楚有哪些可能。",
        "house": "ravenclaw",
        "secondary": "slytherin"
      },
      {
        "text": "找到願意一起出發的夥伴。",
        "house": "hufflepuff",
        "secondary": "gryffindor"
      },
      {
        "text": "想清楚目的地，再規劃路線。",
        "house": "slytherin",
        "secondary": "ravenclaw"
      }
    ]
  },
  {
    "question": "圖書館裡有一本沒有書名的書，你會？",
    "answers": [
      {
        "text": "研究裝訂與筆跡，推想它的來歷。",
        "house": "ravenclaw",
        "secondary": "hufflepuff"
      },
      {
        "text": "交給管理員，讓原本的主人找得到。",
        "house": "hufflepuff",
        "secondary": "ravenclaw"
      },
      {
        "text": "先確認它是否能幫助目前的計畫。",
        "house": "slytherin",
        "secondary": "ravenclaw"
      },
      {
        "text": "鼓起勇氣，翻開第一頁。",
        "house": "gryffindor",
        "secondary": "ravenclaw"
      }
    ]
  },
  {
    "question": "朋友被不公平地責備，你最可能？",
    "answers": [
      {
        "text": "陪在他身邊，先聽他把事情說完。",
        "house": "hufflepuff",
        "secondary": "ravenclaw"
      },
      {
        "text": "找出最有效的方法，讓局面改變。",
        "house": "slytherin",
        "secondary": "gryffindor"
      },
      {
        "text": "站出來，直接指出不公平的地方。",
        "house": "gryffindor",
        "secondary": "hufflepuff"
      },
      {
        "text": "整理證據，釐清事情真正的經過。",
        "house": "ravenclaw",
        "secondary": "hufflepuff"
      }
    ]
  },
  {
    "question": "一項困難的任務交到你手裡，你最在意？",
    "answers": [
      {
        "text": "最後能否達成一個有意義的成果。",
        "house": "slytherin",
        "secondary": "hufflepuff"
      },
      {
        "text": "自己是否願意挑戰原本的界限。",
        "house": "gryffindor",
        "secondary": "slytherin"
      },
      {
        "text": "能不能從過程中學到新的方法。",
        "house": "ravenclaw",
        "secondary": "slytherin"
      },
      {
        "text": "每位夥伴都能被公平對待。",
        "house": "hufflepuff",
        "secondary": "gryffindor"
      }
    ]
  },
  {
    "question": "假日空出一個下午，你想去哪裡？",
    "answers": [
      {
        "text": "探索一直沒去過的城堡角落。",
        "house": "gryffindor",
        "secondary": "ravenclaw"
      },
      {
        "text": "到圖書館讀一本超出課程的書。",
        "house": "ravenclaw",
        "secondary": "slytherin"
      },
      {
        "text": "和朋友待在交誼廳，分享近況。",
        "house": "hufflepuff",
        "secondary": "ravenclaw"
      },
      {
        "text": "練習一項能幫助未來目標的技能。",
        "house": "slytherin",
        "secondary": "hufflepuff"
      }
    ]
  },
  {
    "question": "當原本相信的答案被推翻，你會？",
    "answers": [
      {
        "text": "好奇新的證據，重新整理想法。",
        "house": "ravenclaw",
        "secondary": "gryffindor"
      },
      {
        "text": "給彼此一點時間，一起找出方向。",
        "house": "hufflepuff",
        "secondary": "ravenclaw"
      },
      {
        "text": "重新評估情勢，調整下一步策略。",
        "house": "slytherin",
        "secondary": "ravenclaw"
      },
      {
        "text": "承認錯誤，勇敢採取新的行動。",
        "house": "gryffindor",
        "secondary": "hufflepuff"
      }
    ]
  },
  {
    "question": "別人最常因為什麼而信任你？",
    "answers": [
      {
        "text": "答應的事，會耐心做到最後。",
        "house": "hufflepuff",
        "secondary": "slytherin"
      },
      {
        "text": "遇到難題，總能找到可行的辦法。",
        "house": "slytherin",
        "secondary": "ravenclaw"
      },
      {
        "text": "需要有人出面時，我會站出來。",
        "house": "gryffindor",
        "secondary": "hufflepuff"
      },
      {
        "text": "願意認真思考，也不害怕提問。",
        "house": "ravenclaw",
        "secondary": "hufflepuff"
      }
    ]
  },
  {
    "question": "旅程結束後，你最想帶走的是？",
    "answers": [
      {
        "text": "讓未來能走得更遠的能力。",
        "house": "slytherin",
        "secondary": "gryffindor"
      },
      {
        "text": "一次即使害怕，也沒有退縮的回憶。",
        "house": "gryffindor",
        "secondary": "ravenclaw"
      },
      {
        "text": "一個改變自己看世界方式的問題。",
        "house": "ravenclaw",
        "secondary": "slytherin"
      },
      {
        "text": "幾位知道能互相依靠的朋友。",
        "house": "hufflepuff",
        "secondary": "gryffindor"
      }
    ]
  },
  {
    "question": "你的小組需要準備一堂示範課，你會負責？",
    "answers": [
      {
        "text": "把大家的想法整理成有條理的解說。",
        "house": "ravenclaw",
        "secondary": "hufflepuff"
      },
      {
        "text": "安排分工，讓每個人都有能發揮的位置。",
        "house": "hufflepuff",
        "secondary": "slytherin"
      },
      {
        "text": "爭取最難的示範，帶頭試一次。",
        "house": "gryffindor",
        "secondary": "ravenclaw"
      },
      {
        "text": "設計流程，讓有限時間得到最好的成果。",
        "house": "slytherin",
        "secondary": "gryffindor"
      }
    ]
  },
  {
    "question": "一扇門後傳來求助聲，但你不清楚狀況。你會？",
    "answers": [
      {
        "text": "立即回應，讓對方知道有人會幫忙。",
        "house": "gryffindor",
        "secondary": "hufflepuff"
      },
      {
        "text": "先問清楚發生什麼事，找出安全的開門方法。",
        "house": "ravenclaw",
        "secondary": "slytherin"
      },
      {
        "text": "請附近的人一起協助，確保沒有人被落下。",
        "house": "hufflepuff",
        "secondary": "gryffindor"
      },
      {
        "text": "迅速確認可用的工具與出口，再採取行動。",
        "house": "slytherin",
        "secondary": "ravenclaw"
      }
    ]
  },
  {
    "question": "你和朋友想參加同一個名額有限的活動，你會？",
    "answers": [
      {
        "text": "坦白表達目標，努力爭取自己的機會。",
        "house": "slytherin",
        "secondary": "gryffindor"
      },
      {
        "text": "確認評選方式，找出最能展現能力的準備方法。",
        "house": "ravenclaw",
        "secondary": "slytherin"
      },
      {
        "text": "互相協助練習，讓彼此都能表現最好。",
        "house": "hufflepuff",
        "secondary": "ravenclaw"
      },
      {
        "text": "勇敢嘗試，即使落選也願意接受結果。",
        "house": "gryffindor",
        "secondary": "hufflepuff"
      }
    ]
  },
  {
    "question": "你照顧的魔法植物遲遲沒有發芽，你會？",
    "answers": [
      {
        "text": "每天記錄光線與水量，慢慢找出規律。",
        "house": "ravenclaw",
        "secondary": "hufflepuff"
      },
      {
        "text": "維持照顧，不因短期沒結果就放棄。",
        "house": "hufflepuff",
        "secondary": "slytherin"
      },
      {
        "text": "重新訂出目標與方法，請教有經驗的人。",
        "house": "slytherin",
        "secondary": "ravenclaw"
      },
      {
        "text": "試試尚未嘗試過的方法，承擔可能失敗的風險。",
        "house": "gryffindor",
        "secondary": "slytherin"
      }
    ]
  },
  {
    "question": "如果能在霍格華茲留下一項改變，你希望是？",
    "answers": [
      {
        "text": "讓害怕發言的人也敢表達意見。",
        "house": "gryffindor",
        "secondary": "hufflepuff"
      },
      {
        "text": "整理一份能讓後人繼續研究的知識紀錄。",
        "house": "ravenclaw",
        "secondary": "gryffindor"
      },
      {
        "text": "建立一個每個學生都能得到幫助的地方。",
        "house": "hufflepuff",
        "secondary": "ravenclaw"
      },
      {
        "text": "促成一項能長久運作的新制度。",
        "house": "slytherin",
        "secondary": "hufflepuff"
      }
    ]
  },
  {
    "question": "你發現一條校規妨礙了原本應該被幫助的人，你會？",
    "answers": [
      {
        "text": "蒐集不同例子，釐清規則出了什麼問題。",
        "house": "ravenclaw",
        "secondary": "slytherin"
      },
      {
        "text": "先照顧受影響的人，再和他們一起反映。",
        "house": "hufflepuff",
        "secondary": "gryffindor"
      },
      {
        "text": "找到有決定權的人，提出可以執行的修正方案。",
        "house": "slytherin",
        "secondary": "hufflepuff"
      },
      {
        "text": "公開表達異議，承擔站出來的責任。",
        "house": "gryffindor",
        "secondary": "ravenclaw"
      }
    ]
  },
  {
    "question": "任務進行到一半，大家開始意見不合。你會？",
    "answers": [
      {
        "text": "找出彼此共同的目標，重新協調下一步。",
        "house": "slytherin",
        "secondary": "hufflepuff"
      },
      {
        "text": "讓每個人把理由說完，重新檢查原本的假設。",
        "house": "ravenclaw",
        "secondary": "gryffindor"
      },
      {
        "text": "主動談出最難說的問題，避免繼續拖延。",
        "house": "gryffindor",
        "secondary": "slytherin"
      },
      {
        "text": "留意誰一直沒被聽見，讓討論回到公平的位置。",
        "house": "hufflepuff",
        "secondary": "ravenclaw"
      }
    ]
  },
  {
    "question": "分類帽最後問：面對未知，你最想守住什麼？",
    "answers": [
      {
        "text": "願意為相信的事踏出一步的勇氣。",
        "house": "gryffindor",
        "secondary": "ravenclaw"
      },
      {
        "text": "即使不同意，也願意理解的好奇心。",
        "house": "ravenclaw",
        "secondary": "hufflepuff"
      },
      {
        "text": "答應別人之後，就認真實踐的承諾。",
        "house": "hufflepuff",
        "secondary": "slytherin"
      },
      {
        "text": "不輕易放棄，也懂得調整的決心。",
        "house": "slytherin",
        "secondary": "gryffindor"
      }
    ]
  }
];
  function validAnswers(answers,complete=false){return Array.isArray(answers)&&answers.length===questions.length&&Array.from(answers).every(v=>(!complete&&v===null)||(Number.isInteger(v)&&v>=0&&v<4));}
  function score(answers){if(!validAnswers(answers,true))throw new TypeError('請先完成所有題目');const scores=Object.fromEntries(Object.keys(houses).map(k=>[k,0]));answers.forEach((n,i)=>{const option=questions[i].answers[n];scores[option.house]+=3;scores[option.secondary]+=1;});const max=Math.max(...Object.values(scores));return{scores,tied:Object.keys(scores).filter(k=>scores[k]===max),total:questions.length*4};}
  function restoreDraft(raw){
    const empty=()=>({answers:Array(questions.length).fill(null),index:0});
    if(!raw||typeof raw!=='object')return empty();
    if(validAnswers(raw.answers)){
      const next=raw.answers.findIndex(a=>a===null);
      return{answers:[...raw.answers],index:Number.isInteger(raw.quizIndex)&&raw.quizIndex>=0&&raw.quizIndex<questions.length?raw.quizIndex:(next<0?questions.length-1:next)};
    }
    if(Array.isArray(raw.answers)&&raw.answers.length===8&&Array.from(raw.answers).every(v=>v===null||(Number.isInteger(v)&&v>=0&&v<4))){
      const answers=[...raw.answers,...Array(questions.length-8).fill(null)];
      return{answers,index:answers.findIndex(a=>a===null)};
    }
    return empty();
  }
  return{houses,questions,score,validAnswers,restoreDraft};
});
