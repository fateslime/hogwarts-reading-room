(function(root,factory){
  const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.StudentExam=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const questions=[
  {
    "question": "前往霍格華茲的列車，從哪一座月台出發？",
    "options": [
      "七又二分之一月台",
      "九又四分之三月台",
      "十三號月台",
      "十一又四分之一月台"
    ],
    "answer": 1,
    "book": 0,
    "chapter": 6,
    "explanation": "霍格華茲特快車從王十字車站的九又四分之三月台出發。哈利跟著衛斯理一家，第一次穿過通往月台的障壁。"
  },
  {
    "question": "分類帽最後將哈利分進哪一個學院？",
    "options": [
      "葛來分多",
      "雷文克勞",
      "史萊哲林",
      "赫夫帕夫"
    ],
    "answer": 0,
    "book": 0,
    "chapter": 7,
    "explanation": "分類帽考慮過史萊哲林，但也聽見哈利的意願，最後將他分進葛來分多。"
  },
  {
    "question": "海格送給哈利的雪鴞，後來取名叫什麼？",
    "options": [
      "牙牙",
      "斑斑",
      "歪腿",
      "嘿美"
    ],
    "answer": 3,
    "book": 0,
    "chapter": 5,
    "explanation": "海格在斜角巷買了一隻雪鴞作為生日禮物。哈利之後從書中找到「嘿美」這個名字。"
  },
  {
    "question": "哈利一年級入學時，霍格華茲的校長是誰？",
    "options": [
      "石內卜",
      "鄧不利多",
      "洛哈",
      "麥教授"
    ],
    "answer": 1,
    "book": 0,
    "chapter": 7,
    "explanation": "阿不思・鄧不利多是哈利入學時的校長。開學宴會上，他歡迎新生並提醒大家學校的規則。"
  },
  {
    "question": "一年級的萬聖節，哈利與榮恩從山怪手中救下哪位同學？",
    "options": [
      "金妮",
      "露娜",
      "妙麗",
      "張秋"
    ],
    "answer": 2,
    "book": 0,
    "chapter": 10,
    "explanation": "妙麗當時躲在女廁，並不知道山怪闖入。這場危機讓三人建立起真正的友誼。"
  },
  {
    "question": "哈利在葛來分多魁地奇隊擔任什麼位置？",
    "options": [
      "守門手",
      "打擊手",
      "搜捕手",
      "追蹤手"
    ],
    "answer": 2,
    "book": 0,
    "chapter": 9,
    "explanation": "麥教授看見哈利在飛行課上的表現，便將他推薦給隊長木透，成為負責抓金探子的搜捕手。"
  },
  {
    "question": "哈利在斜角巷的哪一家店，買到第一根魔杖？",
    "options": [
      "奧利凡德魔杖店",
      "華麗與污痕書店",
      "古靈閣",
      "咿啦貓頭鷹商場"
    ],
    "answer": 0,
    "book": 0,
    "chapter": 5,
    "explanation": "奧利凡德替哈利試過多根魔杖，最後選中他的，是冬青木、鳳凰羽毛杖芯的魔杖。"
  },
  {
    "question": "《消失的密室》中，到德思禮家警告哈利的家庭小精靈是誰？",
    "options": [
      "怪角",
      "眨眨",
      "郝琪",
      "多比"
    ],
    "answer": 3,
    "book": 1,
    "chapter": 2,
    "explanation": "多比為了阻止哈利回到危險的霍格華茲，偷偷來到德思禮家；他的好意卻讓哈利惹上不少麻煩。"
  },
  {
    "question": "哈利完整現形的護法，外形是哪一種動物？",
    "options": [
      "牡鹿",
      "牝鹿",
      "獺",
      "鳳凰"
    ],
    "answer": 0,
    "book": 2,
    "chapter": 21,
    "explanation": "哈利的護法是一頭牡鹿，與父親詹姆的化獸師形態相呼應。他在湖邊救下了自己與天狼星。"
  },
  {
    "question": "史萊哲林的密室中，潛藏著哪一種生物？",
    "options": [
      "龍",
      "八眼巨蛛",
      "蛇妖",
      "鷹馬"
    ],
    "answer": 2,
    "book": 1,
    "chapter": 16,
    "explanation": "妙麗查出密室的怪物是蛇妖。遭遇者透過鏡面、相機等間接看見牠的眼睛，因此石化而沒有直接死亡。"
  },
  {
    "question": "意若思鏡真正顯示的是什麼？",
    "options": [
      "最近遺失的物品",
      "一定會發生的未來",
      "觀看者最恐懼的事",
      "觀看者內心最深的渴望"
    ],
    "answer": 3,
    "book": 0,
    "chapter": 12,
    "explanation": "意若思鏡映出心底最深的渴望，並不保證預言未來。哈利在鏡中見到家人，榮恩則看見獲得肯定的自己。"
  },
  {
    "question": "要讓守護活板門的三頭犬「毛毛」睡著，可以怎麼做？",
    "options": [
      "餵牠南瓜汁",
      "演奏音樂",
      "遮住三雙眼睛",
      "對牠鞠躬"
    ],
    "answer": 1,
    "book": 0,
    "chapter": 16,
    "explanation": "毛毛聽見音樂就會入睡。三人利用這個弱點通過牠守護的活板門，音樂停下後牠便可能醒來。"
  },
  {
    "question": "正確調製的變身水，主要能讓飲用者做到什麼？",
    "options": [
      "暫時變成另一個人的外貌",
      "變成任何一種動物",
      "永久改變自己的年齡",
      "閱讀他人的記憶"
    ],
    "answer": 0,
    "book": 1,
    "chapter": 12,
    "explanation": "變身水用來暫時變成另一個人，需要加入對方的身體成分，例如頭髮。妙麗誤用了貓毛，提醒我們它不適合跨物種變形。"
  },
  {
    "question": "路平教授教導學生，對付幻形怪要搭配什麼咒語與想像？",
    "options": [
      "路摸思，想像陽光",
      "溫咖癲啦唯啊薩，想像飛行",
      "叱叱，荒唐，想像滑稽的樣子",
      "阿咯哈呣啦，想像一扇門"
    ],
    "answer": 2,
    "book": 2,
    "chapter": 7,
    "explanation": "Riddikulus（叱叱，荒唐）配合可笑的想像，可以改變幻形怪的外觀；笑聲是對付牠的重要力量。"
  },
  {
    "question": "是誰把劫盜地圖交給哈利？",
    "options": [
      "詹姆與天狼星",
      "弗雷與喬治",
      "路平與鄧不利多",
      "榮恩與妙麗"
    ],
    "answer": 1,
    "book": 2,
    "chapter": 10,
    "explanation": "弗雷與喬治把地圖送給哈利，讓他得以找出通往活米村的密道。他們先前從飛七的辦公室取得這張地圖。"
  },
  {
    "question": "《阿茲卡班的逃犯》中，妙麗用哪一樣物品兼顧同時上課的課表？",
    "options": [
      "儲思盆",
      "熄燈器",
      "記憶球",
      "時光器"
    ],
    "answer": 3,
    "book": 2,
    "chapter": 21,
    "explanation": "妙麗經由麥教授取得時光器，用它回到稍早的時間上另一堂課。後來她與哈利用同一件物品回到湖邊事件之前。"
  },
  {
    "question": "三巫鬥法大賽第一項任務，哈利抽到的是哪一種龍？",
    "options": [
      "威爾斯綠龍",
      "瑞典短吻龍",
      "中國火球龍",
      "匈牙利角尾龍"
    ],
    "answer": 3,
    "book": 3,
    "chapter": 20,
    "explanation": "哈利必須面對匈牙利角尾龍，取得牠守護的金蛋。他召來火閃電，發揮自己最有把握的飛行能力。"
  },
  {
    "question": "依《火盃的考驗》小說，是誰把魚鰓草交給哈利？",
    "options": [
      "奈威",
      "多比",
      "妙麗",
      "路平"
    ],
    "answer": 1,
    "book": 3,
    "chapter": 26,
    "explanation": "小說裡是多比將魚鰓草交給哈利，幫助他在第二項任務中於水下呼吸。電影把這段改由奈威完成。"
  },
  {
    "question": "鄧不利多的軍隊，主要在哪裡練習防禦魔法？",
    "options": [
      "禁忌森林",
      "尖叫屋",
      "萬應室",
      "魔法部的審判室"
    ],
    "answer": 2,
    "book": 4,
    "chapter": 18,
    "explanation": "萬應室會依使用者的需要提供合適空間。哈利與同學們在這裡練習課堂上缺乏的實際防禦魔法。"
  },
  {
    "question": "史拉轟介紹的「福來福喜」，會帶來哪一種效果？",
    "options": [
      "讓飲用者暫時變得幸運",
      "讓人短暫隱形",
      "讓人墜入真正的愛情",
      "讓人說出真話"
    ],
    "answer": 0,
    "book": 5,
    "chapter": 9,
    "explanation": "福來福喜又稱幸運藥水，能在一段時間內帶來好運。它不是萬能捷徑，小說也提到過量飲用及在比賽中使用的問題。"
  },
  {
    "question": "假分靈體小金匣裡的署名「R.A.B.」，指的是誰？",
    "options": [
      "天狼星・布萊克",
      "獅子阿爾發・布萊克（Regulus Arcturus Black）",
      "魯霸・海格",
      "阿不思・鄧不利多"
    ],
    "answer": 1,
    "book": 6,
    "chapter": 10,
    "explanation": "R.A.B. 是天狼星的弟弟 Regulus Arcturus Black（獅子阿爾發・布萊克）。怪角的敘述揭開了他調換小金匣、反抗佛地魔的經過。"
  },
  {
    "question": "哈利最後在哪裡找到雷文克勞的王冕？",
    "options": [
      "古靈閣的金庫",
      "霍格華茲的湖底",
      "鄧不利多的墓中",
      "萬應室堆放藏匿物品的空間"
    ],
    "answer": 3,
    "book": 6,
    "chapter": 31,
    "explanation": "王冕藏在萬應室堆滿隱藏物品的空間。哈利六年級藏魔藥課本時其實已經見過它，當時尚未明白其意義。"
  },
  {
    "question": "葛來分多的寶劍為何能摧毀分靈體？",
    "options": [
      "它吸收了蛇妖的毒液",
      "任何銀製武器都做得到",
      "只要由校長使用就可以",
      "劍柄藏著重生石"
    ],
    "answer": 0,
    "book": 6,
    "chapter": 15,
    "explanation": "妖精打造的寶劍只吸收能強化它的物質。哈利曾用它刺殺蛇妖，因此劍吸收了足以毀滅分靈體容器的蛇妖毒液。"
  },
  {
    "question": "在最後決戰前，哪一件事使接骨木魔杖的效忠從跩哥轉向哈利？",
    "options": [
      "哈利繼承鄧不利多的遺物",
      "哈利折斷自己的冬青木魔杖",
      "哈利在馬份莊園奪走跩哥的魔杖",
      "佛地魔打開鄧不利多的墓"
    ],
    "answer": 2,
    "book": 6,
    "chapter": 36,
    "explanation": "跩哥曾解除鄧不利多的武裝，取得接骨木魔杖的效忠；哈利之後在馬份莊園擊敗跩哥、奪走他的魔杖，效忠也隨之轉移。"
  },
  {
    "question": "鄧不利多留給榮恩、後來協助他回到夥伴身邊的物品是什麼？",
    "options": [
      "金探子",
      "劫盜地圖",
      "時光器",
      "熄燈器"
    ],
    "answer": 3,
    "book": 6,
    "chapter": 19,
    "explanation": "熄燈器除了收放光線，也讓榮恩聽見妙麗的聲音，並透過一道光找到返回夥伴身邊的路。"
  },
  {
    "question": "鄧不利多把重生石藏在哪一件留給哈利的物品裡？",
    "options": [
      "一本魔藥課本",
      "哈利首次抓到的金探子",
      "一只銀色打火機",
      "一副半月形眼鏡"
    ],
    "answer": 1,
    "book": 6,
    "chapter": 34,
    "explanation": "重生石藏在哈利首次抓到的金探子中。哈利準備走進禁忌森林時，終於理解了如何讓它打開。"
  },
  {
    "question": "石內卜「混血王子」的名字中，「王子」來自哪裡？",
    "options": [
      "母親婚前的姓氏 Prince",
      "父親的魔法部職稱",
      "史萊哲林的級長稱號",
      "他在決鬥比賽得到的稱號"
    ],
    "answer": 0,
    "book": 5,
    "chapter": 30,
    "explanation": "石內卜的母親是女巫 Eileen Prince，父親則是麻瓜 Tobias Snape。他把自己的血統與母親的姓氏組成了「混血王子」這個名字。"
  },
  {
    "question": "榮恩喝下有毒蜂蜜酒後，哈利用什麼救了他？",
    "options": [
      "變身水",
      "曼德拉草葉",
      "福來福喜",
      "毛糞石（bezoar）"
    ],
    "answer": 3,
    "book": 5,
    "chapter": 18,
    "explanation": "哈利想到混血王子在魔藥課本上的筆記，把毛糞石塞進榮恩嘴裡。它是取自山羊胃中的石狀物，能解多種毒。"
  },
  {
    "question": "哈利透過雙面鏡碎片看見的藍眼睛，實際屬於誰？",
    "options": [
      "阿不思・鄧不利多",
      "瘋眼穆敵",
      "阿波佛・鄧不利多",
      "蓋勒・葛林戴華德"
    ],
    "answer": 2,
    "book": 6,
    "chapter": 28,
    "explanation": "阿波佛買下另一面鏡子，藉此留意哈利的處境。看見求救後，他派多比前往馬份莊園。"
  },
  {
    "question": "依《死神的聖物》小說，決戰結束後，哈利用接骨木魔杖完成哪一件事？",
    "options": [
      "修好自己折斷的冬青木魔杖",
      "消除榮恩的記憶",
      "把重生石重新放入戒指",
      "讓金探子變成鳳凰"
    ],
    "answer": 0,
    "book": 6,
    "chapter": 36,
    "explanation": "小說中哈利先修復自己原本的冬青木魔杖，再決定把接骨木魔杖放回鄧不利多的墓。這與電影中折斷接骨木魔杖的處理不同。"
  }
];
  // Stable IDs preserve saved answers. Thresholds are a site adaptation, not canon.
  questions.forEach((q,i)=>{q.id='owl-'+String(i+1).padStart(2,'0');q.difficulty=i<10?'基礎':i<20?'進階':'挑戰';});
  const grades=[
    {letter:'O',english:'Outstanding',label:'傑出',min:27,passed:true,message:'你記得細節，也能串起跨越七部小說的伏筆。'},
    {letter:'E',english:'Exceeds Expectations',label:'超乎期待',min:23,passed:true,message:'你已相當熟悉故事，再重溫幾段細節就更完整了。'},
    {letter:'A',english:'Acceptable',label:'合格',min:18,passed:true,message:'你掌握了不少重要情節，還有幾條故事線等著重新發現。'},
    {letter:'P',english:'Poor',label:'不佳',min:12,passed:false,message:'你已找到一些熟悉的線索，可以從答錯題目的相關小說開始重溫。'},
    {letter:'D',english:'Dreadful',label:'糟糕',min:6,passed:false,message:'魔法世界還有許多待認識的細節，翻開閱讀地圖再來挑戰吧。'},
    {letter:'T',english:'Troll',label:'山怪',min:0,passed:false,message:'第一次探索也值得記錄。先從第一部小說出發，故事會慢慢變得熟悉。'}
  ];
  const validAnswer=a=>Number.isInteger(a)&&a>=0&&a<4;
  const validAnswers=(a,complete=false)=>Array.isArray(a)&&a.length===30&&Array.from(a).every(v=>validAnswer(v)||(!complete&&v===null));
  function gradeFor(correct){if(!Number.isInteger(correct)||correct<0||correct>30)throw new RangeError('Invalid score');return grades.find(g=>correct>=g.min);}
  function score(answers){
    if(!validAnswers(answers,true))throw new TypeError('Complete all 30 questions');
    const checks=questions.map((q,i)=>answers[i]===q.answer),correct=checks.filter(Boolean).length;
    return {correct,total:30,percent:Math.round(correct/30*100),grade:gradeFor(correct),checks,levels:[0,10,20].map(start=>checks.slice(start,start+10).filter(Boolean).length)};
  }
  function restore(raw){
    const blank={version:1,answers:Array(30).fill(null),index:0,completed:false,best:null};
    if(!raw||typeof raw!=='object'||raw.version!==1)return blank;
    if(validAnswers(raw.answers))blank.answers=raw.answers.slice();
    if(Number.isInteger(raw.index)&&raw.index>=0&&raw.index<30)blank.index=raw.index;
    blank.completed=raw.completed===true&&validAnswers(blank.answers,true);
    if(Number.isInteger(raw.best)&&raw.best>=0&&raw.best<=30)blank.best=raw.best;
    return blank;
  }
  return {questions,grades,gradeFor,score,restore,validAnswers};
});

