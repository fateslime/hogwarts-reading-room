/* Display-only localization. Canonical content and saved answer indices stay unchanged. */
(() => {
  'use strict';
  const catalog = window.EnglishCatalog || {};
  const storageKey = 'hogwarts-language-v1';
  let language = 'zh-Hant';
  try { if (localStorage.getItem(storageKey) === 'en') language = 'en'; } catch {}
  const textSources = new WeakMap(), attributeSources = new WeakMap();
  const attrs = ['aria-label', 'placeholder', 'alt', 'title'];
  const skip = 'script,style,textarea,noscript,[data-no-i18n]';
  const han = /[\u3400-\u9fff]/;
  // Longest phrase first prevents short names from consuming full source sentences.
  const fragments = Object.keys(catalog).filter(key => han.test(key)).sort((a,b) => b.length-a.length);
  const escaped = fragments.map(key => key.replace(/[.*+?^\x24{}()|[\]\\]/g, '\\$&'));
  const fragmentPattern = new RegExp(escaped.join('|'), 'g');

  function english(value) {
    const raw = String(value), source = raw.trim();
    if (Object.hasOwn(catalog, source)) return raw.replace(source, catalog[source]);
    if (!han.test(source)) return raw;
    let match;
    const rules = [
      [/^已探索 (\d+) \/ 7 部$/, m => m[1] + ' of 7 books explored'],
      [/^已記錄第 (\d+) 部。$/, m => 'Book ' + m[1] + ' marked as explored.'],
      [/^第 (\d+) 部，(.+?)(，已探索)?$/, m => 'Book ' + m[1] + ', ' + english(m[2]) + (m[3] ? ', explored' : '')],
      [/^找到 (\d+) 位人物$/, m => m[1] + ' characters found'],
      [/^顯示其餘 (\d+) 種$/, m => 'Show ' + m[1] + ' more creatures'],
      [/^(\d+) 種$/, m => m[1] + ' creatures'],
      [/^閱讀(.+)的人物檔案$/, m => 'Read about ' + english(m[1])],
      [/^閱讀(.+)的觀察筆記$/, m => 'Read field notes on ' + english(m[1])],
      [/^(.+)的電影人物照片$/, m => 'Film photograph of ' + english(m[1])],
      [/^(.+)的鋼筆淡彩插畫$/, m => 'Pen-and-watercolour illustration of ' + english(m[1])],
      [/^歡迎來到(.+)。$/, m => 'Welcome to ' + english(m[1]) + '.'],
      [/^繼續作答 · 已答 (\d+) 題$/, m => 'Continue · ' + m[1] + ' answered'],
      [/^第 (\d+) \/ 30 題 · (.+)$/, m => 'Question ' + m[1] + ' / 30 · ' + english(m[2])],
      [/^已答 (\d+) 題$/, m => m[1] + ' answered'],
      [/^已回答 (\d+) 題，共 30 題$/, m => m[1] + ' of 30 questions answered'],
      [/^第 (\d+) 題，共 (\d+) 題$/, m => 'Question ' + m[1] + ' of ' + m[2]],
      [/^已回答 (\d+) \/ 30 題。可以點選題號檢查答案，交卷後再揭曉解析。$/, m => m[1] + ' of 30 answered. Select a number to check your answer. Explanations appear after you submit.'],
      [/^檢查第 (\d+) 題，(未作答|已作答)$/, m => 'Review question ' + m[1] + ', ' + (m[2] === '已作答' ? 'answered' : 'unanswered')],
      [/^答對率 (\d+)%$/, m => m[1] + '% correct'],
      [/^本機最佳紀錄：(\d+) \/ 30$/, m => 'Best on this browser: ' + m[1] + ' / 30'],
      [/^只看答錯的題目（(\d+) 題）$/, m => 'Show incorrect answers only (' + m[1] + ')'],
      [/^第 (\d+) 題 · (.+) · (答對|答錯)$/, m => 'Question ' + m[1] + ' · ' + english(m[2]) + ' · ' + (m[3] === '答對' ? 'Correct' : 'Incorrect')],
      [/^(你的答案|正確答案)：(.+)$/, m => (m[1] === '你的答案' ? 'Your answer: ' : 'Correct answer: ') + english(m[2])],
      [/^重溫《(.+)》$/, m => 'Revisit ' + english(m[1])],
      [/^第 (\d+) 章$/, m => 'Chapter ' + m[1]],
      [/^(\d+–\d+) 題$/, m => m[1] + ' correct'],
      [/^\/ 30 題$/, () => '/ 30'],
      [/^寫信給 (.+)，分享你的閱讀心得。$/, m => 'Write to ' + m[1] + ' to share your thoughts.'],
      [/^我在「霍格華茲藏書室」的分院結果是：(.+)！\n(.+)(?:\n(.*))?$/, m => 'The Hogwarts Reading Room sorted me into ' + english(m[1]) + '!\n' + english(m[2]) + (m[3] ? '\n' + m[3] : '')],
      [/^我在霍格華茲藏書室的學生測試答對 (\d+) \/ 30 題，取得 (.+)！\n七部小說故事知識測驗，採用本站 O.W.L.s 分數門檻。([\s\S]*)$/, m => 'I scored ' + m[1] + ' / 30 in the Hogwarts Reading Room student exam: ' + m[2] + '!\nA seven-book story quiz using this site’s O.W.L.s score thresholds.' + m[3]]
    ];
    for (const [pattern, format] of rules) {
      match = source.match(pattern);
      if (match) return raw.replace(source, format(match));
    }
    return raw.replace(fragmentPattern, key => catalog[key]);
  }
  const t = value => language === 'en' ? english(value) : String(value);

  // Retain originals per node/attribute so switching back is lossless. New render output
  // replaces the remembered source only when it differs from our last translated value.
  function translated(current, previous) {
    const source = previous && current === previous.output ? previous.source : current;
    return { source, output: t(source) };
  }
  let observer;
  function apply() {
    if (!document.body) return;
    observer.disconnect();
    const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (!node.parentElement || node.parentElement.closest(skip) || !node.nodeValue.trim()) continue;
      const record = translated(node.nodeValue, textSources.get(node));
      textSources.set(node, record);
      if (node.nodeValue !== record.output) node.nodeValue = record.output;
    }
    document.querySelectorAll('[aria-label],[placeholder],[alt],[title],meta[name="description"]').forEach(element => {
      if (element.closest('script,style,noscript,[data-no-i18n]')) return;
      const records = attributeSources.get(element) || {};
      const names = element.matches('meta[name="description"]') ? ['content'] : attrs;
      names.forEach(name => {
        if (!element.hasAttribute(name)) return;
        records[name] = translated(element.getAttribute(name), records[name]);
        if (element.getAttribute(name) !== records[name].output) element.setAttribute(name, records[name].output);
      });
      attributeSources.set(element, records);
    });
    document.documentElement.lang = language;
    document.querySelectorAll('[data-language]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === language)));
    document.querySelectorAll('[data-language-toggle]').forEach(button => {
      button.textContent = language === 'en' ? '中文' : 'English';
      button.lang = language === 'en' ? 'zh-Hant' : 'en';
      button.setAttribute('aria-label', language === 'en' ? '切換為中文' : 'Switch to English');
    });
    observer.observe(document.documentElement, { childList:true, subtree:true, characterData:true, attributes:true, attributeFilter:attrs.concat('content') });
  }
  function setLanguage(next) {
    if (!['zh-Hant', 'en'].includes(next)) return;
    language = next;
    try { localStorage.setItem(storageKey, language); } catch {}
    apply();
    document.dispatchEvent(new CustomEvent('languagechange', {detail:{language}}));
  }
  window.I18n = {t, english, setLanguage, get language() { return language; }};
  observer = new MutationObserver(apply);
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-language],[data-language-toggle]');
    if (button) setLanguage(button.hasAttribute('data-language-toggle') ? (language === 'en' ? 'zh-Hant' : 'en') : button.dataset.language);
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply, {once:true});
  else apply();
})();
