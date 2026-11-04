// ===== 天地人問事模式 =====
// 依「神癒三維解牌模型——命運導航系統」：
//   天＝大牌 22 張＝天氣／路況廣播（Why）：不可抗力、大環境能量，決定基調
//   人＝宮廷牌 16 張＝駕駛員（Who）：當事人的性格、態度，技術好壞影響結果
//   地＝數字牌 40 張＝車子／當下路程（What）：具體事件、物質實相、現狀
// 影響力：天 > 人 > 地。比喻文字為本專案自寫。
// 人體能量全息圖（BODY、bodyHtml、bodyMd）定義在 index.html，兩種模式共用。

const ASK_POS = [
  {key: 'sky',   name: '天', role: '天氣／路況廣播', q: 'Why',  hint: '大環境・不可抗力', field: 'core'},
  {key: 'man',   name: '人', role: '駕駛員',         q: 'Who',  hint: '性格・態度・技術', field: 'mind'},
  {key: 'earth', name: '地', role: '車子／當下路程', q: 'What', hint: '具體事件・現狀',   field: 'core'},
];

// id: [正位比喻, 逆位比喻, 正位順逆, 逆位順逆]（+1 順、0 中性、-1 逆；宮廷牌不計順逆）
const RIDE = {
  // 天：天氣／路況
  m00: ['晴朗微風，適合出遊', '起霧路滑，看不清方向', 1, -1],
  m01: ['能見度極佳，萬事俱備', '海市蜃樓，看得到摸不到', 1, -1],
  m02: ['夜裡薄霧，宜靜靜觀察', '濃霧籠罩，訊號不明', 0, -1],
  m03: ['春暖花開，風和日麗', '悶熱潮濕，讓人慵懶', 1, 0],
  m04: ['交通管制，照規矩走就順', '封路管制，處處受限', 0, -1],
  m05: ['照導航走的標準路線', '導航失靈，老路不通', 0, -1],
  m06: ['來到雙向交會的路口，需要選擇', '雙方會車，互不相讓', 1, -1],
  m07: ['順風的高速公路', '側風強勁，方向盤難抓', 1, -1],
  m08: ['穩定的好天氣，耐心前行', '悶雷不斷，心浮氣躁', 1, -1],
  m09: ['夜間行車，獨自打燈前進', '天色過暗，孤立無援', 0, -1],
  m10: ['天氣說變就變，時來運轉', '天氣反覆，時機不對', 1, -1],
  m11: ['測速照相路段，照規矩就沒事', '規則不清，判定不公', 0, -1],
  m12: ['塞車暫停，正好換個角度看', '長時間塞車，動彈不得', -1, -1],
  m13: ['道路封閉改道，舊路到此為止', '封路了卻不肯改道', -1, -1],
  m14: ['溫和多雲，冷熱調和', '冷熱交替，忽快忽慢', 1, -1],
  m15: ['迷霧陷阱路段，容易繞進去', '霧漸漸散了，準備掙脫', -1, 0],
  m16: ['狂風暴雨，突發災變', '暴風將至，或餘震未停', -1, -1],
  m17: ['雨過天青，滿天星光', '雲層遮住星光，信心不足', 1, 0],
  m18: ['夜霧朦朧，路況不明', '霧正在散，真相慢慢浮現', -1, 0],
  m19: ['大晴天，一路暢通', '晴時多雲，熱度稍減', 1, 0],
  m20: ['廣播響起，出發的號角', '廣播聽不清，遲遲不出發', 1, -1],
  m21: ['抵達目的地的好天氣', '終點前最後一段塞車', 1, 0],
  // 人：駕駛員
  w11: ['興奮的新手駕駛，躍躍欲試', '衝動的新手，三分鐘熱度'],
  w12: ['猛踩油門，說走就走', '暴衝搶快，容易擦撞'],
  w13: ['自信熱情的領航者', '情緒起伏，搶著握方向盤'],
  w14: ['有遠見的老司機，帶隊前進', '霸道駕駛，聽不進建議'],
  c11: ['浪漫的新手，邊開邊看風景', '分心駕駛，情緒化'],
  c12: ['慢慢開的浪漫派，跟著感覺走', '只顧感覺，忘了看路'],
  c13: ['體貼的駕駛，照顧每位乘客', '情緒疲勞駕駛'],
  c14: ['情緒穩定的老手，遇事不慌', '表面冷靜，內心暗湧'],
  s11: ['警覺的新手，頻頻看後照鏡', '疑神疑鬼，急煞不斷'],
  s12: ['飆車，直線衝刺', '魯莽飆車，橫衝直撞'],
  s13: ['冷靜精準，看清路況', '嚴苛挑剔，一路碎念'],
  s14: ['理性規劃路線的老手', '固執己見，不肯改路線'],
  p11: ['認真學開車的新手', '拖拖拉拉，不敢上路'],
  p12: ['慢而穩的駕駛，一步一步', '開太慢，卡在原地'],
  p13: ['細心照顧車況的駕駛', '過度擔心，處處保守'],
  p14: ['穩穩開，經驗豐富', '只求安穩，錯過出口'],
  // 地：車子／當下路程
  w01: ['點火發動，新的旅程', '打不著火，熱情未起', 1, -1],
  w02: ['站在路口規劃路線', '猶豫不決，遲遲不出發', 0, -1],
  w03: ['車已上路，遠方在望', '前方延誤，進度卡住', 1, 0],
  w04: ['抵達休息站，慶祝一下', '休息站客滿，安頓不了', 1, 0],
  w05: ['車陣互卡，大家搶道', '爭執降溫，或內耗更深', -1, 0],
  w06: ['領先車隊，一路綠燈', '落後車隊，掌聲變少', 1, -1],
  w07: ['上坡路段，守住車道', '撐不住，被超車', 0, -1],
  w08: ['高速直行，進展飛快', '速度失控，或一再延誤', 1, -1],
  w09: ['帶傷繼續開，快到了', '體力透支，該停車休息', 0, -1],
  w10: ['車子超載，負擔過重', '卸下行李，減輕負擔', -1, 0],
  c01: ['加滿油，心情滿載', '油箱漏油，情感枯竭', 1, -1],
  c02: ['兩車並行，默契十足', '兩車方向不同步', 1, -1],
  c03: ['車隊同行，歡樂出遊', '車隊走散，熱鬧過頭', 1, 0],
  c04: ['停在路邊，提不起勁', '重新發動，留意新機會', -1, 0],
  c05: ['擦撞後回頭看損失', '收拾心情，準備上路', -1, 0],
  c06: ['開回老家的懷舊路線', '困在回憶，繞回原點', 1, -1],
  c07: ['岔路太多，看得眼花', '收斂選擇，看清方向', 0, 1],
  c08: ['離開舊路，往山裡去', '想走又走不了', 0, -1],
  c09: ['心滿意足的兜風', '期待過高，略感空虛', 1, 0],
  c10: ['全家出遊，溫馨抵達', '家人意見不合，氣氛僵', 1, -1],
  s01: ['撥雲見日，方向清楚', '方向混亂，判斷失準', 1, -1],
  s02: ['停在路口，兩難不決', '被迫做出決定', -1, 0],
  s03: ['心碎的事故現場', '傷口慢慢修復', -1, 0],
  s04: ['路肩休息，暫停充電', '休息不夠，急著上路', 0, 0],
  s05: ['搶道贏了卻傷了和氣', '停止爭執，各退一步', -1, 0],
  s06: ['渡河轉換，往平靜處去', '卡在渡口，走不了', 1, -1],
  s07: ['抄小路，別有用心', '被抓包，或回到正途', -1, 0],
  s08: ['困在車陣，自我設限', '找到出口，開始脫困', -1, 0],
  s09: ['夜裡惡夢，焦慮失眠', '焦慮漸消，或壓到極點', -1, 0],
  s10: ['車子拋錨，走到盡頭', '最壞已過，慢慢修車', -1, 0],
  p01: ['拿到新車鑰匙，新機會', '錯過機會，鑰匙掉了', 1, -1],
  p02: ['S 型彎道，左右平衡', '手忙腳亂，失去平衡', 0, -1],
  p03: ['團隊一起修車，合作打造', '配合不佳，品質打折', 1, -1],
  p04: ['緊握方向盤，守住油錢', '太過保守，或花錢放手', 0, 0],
  p05: ['冷天拋錨在路邊', '雪停了，找到援助', -1, 0],
  p06: ['互相借油，資源流通', '付出不對等', 1, -1],
  p07: ['路邊等待，看看收成', '等太久，成果不如預期', 0, -1],
  p08: ['專心練車，反覆精進', '重複乏味，品質下滑', 1, -1],
  p09: ['自在開著好車', '表面光鮮，內在不安', 1, -1],
  p10: ['家族傳承的好車，長遠穩定', '家族財務或傳承出狀況', 1, -1],
};
const ride = p => RIDE[p.id][p.rev ? 1 : 0];
const tone = p => RIDE[p.id][p.rev ? 3 : 2];

const SUIT_AREA = {wands: '行動與事業', cups: '感情與關係', swords: '想法與溝通', pentacles: '金錢、工作與身體'};
const RANK = {
  11: '你在這件事上還是學習者，多問、多試，不必急著證明自己。',
  12: '你正用行動推進，留意車速有沒有配合路況。',
  13: '你用照顧與包容的方式在開車，記得也顧好自己。',
  14: '你握有主導權，能做決定，但要留意別太固執。',
};
// 數字生命週期（NUM、phase）定義在 index.html
const stage = n => `數字 ${n} 是「${NUM[n][0]}」，屬於${phase(n)}：${NUM[n][1]}`;

// ---- 狀態（只保留目前這一問；存檔後寫進 HUNG_NOTE） ----
let ask;
const ASK_KEY = 'ask:current';
function askSave(){ try { localStorage.setItem(ASK_KEY, JSON.stringify(ask)) } catch(e){} }
function askFresh(q){
  const d = fresh().deck, kind = p => BY_ID[p.id];
  return {date: today, q: q || '', started: false, revealed: false, picks: {}, notes: {},
    piles: {sky: d.filter(p => kind(p).arcana === 'major'), man: d.filter(p => isCourt(kind(p))),
            earth: d.filter(p => kind(p).arcana === 'minor' && !isCourt(kind(p)))}};
}
const askNext = () => ASK_POS.find(p => !ask.picks[p.key]);
const askSlot = k => $('askSpread').querySelector(`.slot[data-k="${k}"]`);

function askBuild(){
  $('askPiles').innerHTML = ASK_POS.map(p => `<div class="pile" data-k="${p.key}">
    <div class="plbl">${p.name}・${p.role}<small>${{sky: '大牌 22 張', man: '宮廷牌 16 張', earth: '數字牌 40 張'}[p.key]}</small></div>
    <div class="deck ${ask.started ? '' : 'stack'}">${ask.piles[p.key].map((d, i) =>
      `<div class="card back" tabindex="0" role="button" aria-label="${p.name}的第 ${i + 1} 張牌" data-i="${i}"></div>`).join('')}</div></div>`).join('');
  $('askSpread').innerHTML = ASK_POS.map(p => `<div class="slot" data-k="${p.key}"><div class="lbl">${p.name}<small>${p.role}（${p.q}）</small></div>
    <div class="place"></div><div class="cname"></div></div>`).join('');
  ASK_POS.forEach(p => ask.picks[p.key] && askFill(p.key));
  askLayout();
}
function askFill(k){
  const p = ask.picks[k], c = BY_ID[p.id];
  askSlot(k).querySelector('.place').innerHTML = `<div class="flip ${ask.revealed ? 'on' : ''}"><div class="back"></div>
    <div class="front ${p.rev ? 'rev' : ''}"><img src="cards/${c.id}.jpg" alt="${c.name}"></div></div>`;
  if (ask.revealed) askName(k);
}
function askName(k){
  const p = ask.picks[k];
  askSlot(k).querySelector('.cname').innerHTML = `${BY_ID[p.id].name}<span class="tag ${p.rev ? 'rev' : ''}">${p.rev ? '逆' : '正'}</span>`;
}

// 三疊牌各自一排；收疊時置中，攤開時成小扇形
function askLayout(){
  if (!ask || $('modeAsk').hidden) return;
  $('askPiles').querySelectorAll('.deck').forEach(box => {
    const W = $('askPiles').clientWidth - 8, n = box.children.length, stacked = box.classList.contains('stack');
    const cw = W < 560 ? 34 : 46, ch = cw * 600 / 350, lift = 18, H = Math.max(ch + lift + 26, ch * 1.4 + 16);
    box.style.width = W + 'px'; box.style.height = H + 'px'; box.style.setProperty('--cw', cw + 'px');
    [...box.children].forEach((el, i) => {
      const t = n > 1 ? i / (n - 1) : .5;
      const x = stacked ? (W - cw) / 2 : cw * .3 + t * (W - cw * 1.6);
      const y = stacked ? (H - ch) / 2 - i * .2 : lift * 4 * (t - .5) ** 2 + 12;
      el.style.left = x + 'px'; el.style.top = y + 'px'; el.style.setProperty('--y', y + 'px');
      el.style.transform = stacked ? 'scale(1.4)' : `rotate(${(t - .5) * 26}deg)`; el.style.zIndex = i;
    });
  });
}

function askRefresh(){
  const nx = askNext(), on = ask.started, all = !nx;
  $('askPiles').hidden = all;
  $('askPiles').querySelectorAll('.pile').forEach(el => {
    const k = el.dataset.k, done = !!ask.picks[k];
    el.classList.toggle('done', done);
    el.classList.toggle('now', on && !done && nx && nx.key === k);
    el.classList.toggle('wait', on && !done && nx && nx.key !== k);
    el.querySelectorAll('.card').forEach(c => c.classList.toggle('gone', done && ask.piles[k][c.dataset.i].id === ask.picks[k].id));
  });
  $('askSpread').querySelectorAll('.slot').forEach(s => s.classList.toggle('next', on && !busy && nx && nx.key === s.dataset.k));
  $('askQ').value = ask.q; $('askQ').readOnly = on;
  $('askShuffle').hidden = on;
  $('askShuffle').disabled = busy;
  $('askReveal').hidden = !all || ask.revealed;
  $('askReveal').disabled = busy;
  $('askRedraw').hidden = !on;
  $('askRedraw').disabled = busy;
  if (busy) return;
  $('askStatus').textContent = !on ? '寫下想問的事，專心想著它，再按「洗牌」'
    : nx ? `從「${nx.name}」那疊抽一張：${nx.role}（${nx.q}）`
    : !ask.revealed ? '天、人、地都就位了，準備好就翻開'
    : '先寫下自己的解讀，再展開牌義與整體解牌';
}

async function askShuffle(){
  if (busy) return;
  const q = $('askQ').value.trim();
  if (!q){ $('askQ').focus(); $('askStatus').textContent = '請先寫下想問的事'; return; }
  busy = true; ask = askFresh(q); askSave();
  $('askReading').classList.remove('show'); askBuild(); askRefresh();
  $('askStatus').textContent = '洗牌中……專心想著你的問題';
  await wait(300);
  const boxes = [...$('askPiles').querySelectorAll('.deck')];
  for (const side of [1, -1]){
    if (calm) break;
    await Promise.all(boxes.flatMap(box => {
      const cards = [...box.children], cw = cards[0].offsetWidth, half = cards.slice(cards.length >> 1);
      return half.map((el, k) => el.animate([
        {transform: 'scale(1.4)'},
        {transform: `scale(1.4) translateX(${side * cw * .7}px) rotate(${side * 10}deg)`, offset: .45},
        {transform: 'scale(1.4)'}], {duration: 480, delay: k * 10, easing: 'ease-in-out'}).finished);
    }));
  }
  ask.started = true; askSave();
  boxes.forEach(box => { [...box.children].forEach((el, i) => el.style.transitionDelay = (calm ? 0 : i * 14) + 'ms'); box.classList.remove('stack'); });
  askLayout();
  await wait(40 * 14 + 650);
  boxes.forEach(box => [...box.children].forEach(el => el.style.transitionDelay = ''));
  busy = false; askRefresh();
}

async function askPick(k, i){
  const nx = askNext();
  if (busy || !ask.started || !nx || nx.key !== k) return;
  busy = true;
  const el = $('askPiles').querySelector(`.pile[data-k="${k}"] .card[data-i="${i}"]`);
  const flight = fly(el, askSlot(k).querySelector('.place'));
  ask.picks[k] = ask.piles[k][i]; askSave();
  el.classList.add('gone');
  await flight;
  askFill(k);
  busy = false; askRefresh();
}

async function askReveal(){
  if (busy) return;
  busy = true; ask.revealed = true; askSave(); askRefresh();
  for (const p of ASK_POS){
    askSlot(p.key).querySelector('.flip').classList.add('on');
    await wait(450); askName(p.key); await wait(200);
  }
  busy = false; askRefresh(); askRender();
  await wait(500);
  $('askReading').scrollIntoView({behavior: calm ? 'auto' : 'smooth'});
}

function askRedraw(){
  if (busy || !confirm('確定要重新問事嗎？這一問的牌和筆記都會清空。')) return;
  ask = askFresh(); askSave();
  $('askReading').classList.remove('show'); askBuild(); askRefresh();
  scrollTo({top: 0}); $('askQ').focus();
}

// ---- 解牌 ----
function askBlock(pos){
  const p = ask.picks[pos.key], c = BY_ID[p.id], f = pos.field;
  const row = (rev, name) => `<tr class="${rev === p.rev ? 'hit' : ''}"><th>${name}</th><td>${RIDE[c.id][rev ? 1 : 0]}</td>
    <td>${c[rev ? 'rev' : 'up'].kw}｜${c[rev ? 'rev' : 'up'][f]}</td></tr>`;
  return `<div class="pos"><img src="cards/${c.id}.jpg" alt="${c.name}" class="${p.rev ? 'rev' : ''}">
    <div><h3>${pos.name}｜${c.name}<span class="tag ${p.rev ? 'rev' : ''}">${p.rev ? '逆位' : '正位'}</span></h3>
    <div class="kw">${pos.role}（${pos.q}）・${c.en}・${c.element}元素</div>${numHtml(c)}${bodyHtml(c)}
    ${storyHtml(c)}
    <textarea data-ask-note="${pos.key}" placeholder="${storyHint(c)}（放在「${pos.role}」的位置）">${esc(ask.notes[pos.key])}</textarea>
    <details><summary>看牌義（正位／逆位對照）</summary>
      <p class="say"><b>${ride(p)}</b>：${c[ori(p)][f]}</p>
      <table><tr><th></th><th>${pos.role}</th><th>關鍵詞｜解讀</th></tr>${row(false, '正位')}${row(true, '逆位')}</table>
    </details></div></div>`;
}

function askSynth(){
  const {sky, man, earth} = ask.picks, S = BY_ID[sky.id], M = BY_ID[man.id], E = BY_ID[earth.id];
  const ts = tone(sky), te = tone(earth), out = [];
  // 天：基調
  out.push(`<b>天（Why）</b>大環境是「${ride(sky)}」。${S[ori(sky)].core}` +
    [' 這是不可抗力的氣候：與其硬衝，不如調整開法、等待時機。', ' 氣候不好不壞，結果多半取決於你怎麼開。', ' 整體氣候對你有利，這件事有順風。'][ts + 1]);
  // 人：駕駛
  out.push(`<b>人（Who）</b>駕駛是「${ride(man)}」。${RANK[M.num]}${man.rev ? '逆位代表這份駕駛特質現在用過頭或卡住了，先穩住自己。' : ''}`);
  out.push(`天與人：${relate(S.element, M.element)}。`);
  // 地：路程
  out.push(`<b>地（What）</b>眼前路況是「${ride(earth)}」。${stage(E.num)}，落在${SUIT_AREA[E.suit]}的層面。${E[ori(earth)].core}`);
  // 人體能量全息圖：人是鏡子，地是身體部位
  const bm = BODY[M.suit], be = BODY[E.suit];
  out.push(`<b>人體能量圖</b>人（${M.name}）是一面鏡子，照出你在這件事裡扮演的角色：「我現在看起來是什麼樣子？」它屬於${bm.part}，問問自己「${bm.q}」` +
    `地（${E.name}）落在${be.part}，問問自己「${be.q}」` +
    (M.suit === E.suit ? `人和地落在同一個部位，這件事的關鍵就在${be.part}（${be.note}）。` : ''));
  // 天 × 地
  out.push(ts > 0 && te > 0 ? '天時和路況都好，這是推進的好時機，放心踩油門。'
    : ts > 0 && te < 0 ? '大環境其實有利，眼前的卡關只是暫時的路況，駕駛方式調整好就過得去。'
    : ts < 0 && te > 0 ? '眼前看起來順，但大環境有變數，別鬆懈，保留一點彈性。'
    : ts < 0 && te < 0 ? '天時和路況都不理想，先求安全：減速、保留體力，等雨停再走。'
    : ts === 0 ? '天氣中性，這件事的關鍵在駕駛，也就是你自己的做法。'
    : '路況平平，跟著天氣的節奏走就好。');
  const rv = ASK_POS.filter(p => ask.picks[p.key].rev).map(p => `「${p.name}」`);
  if (rv.length) out.push(`逆位落在${rv.join('、')}，那是這件事目前卡住、需要特別留意的環節。`);
  const focus = `影響力是天 ＞ 人 ＞ 地：天改變不了，地是結果的呈現，你真正能調整的是方向盤。${M[ori(man)].mind}`;
  return {paras: out, focus};
}

function askRender(){
  if (!ask.revealed) return;
  $('askPositions').innerHTML = `<div class="pos" style="display:block"><h3>問題</h3><p style="margin:0">${esc(ask.q)}</p></div>` +
    ASK_POS.map(askBlock).join('');
  const s = askSynth();
  $('askGuide').innerHTML = `<details><summary style="font-size:1.1rem">天地人整體解牌（寫完自己的解讀再打開）</summary>
    ${s.paras.map(p => `<p>${p}</p>`).join('')}<p class="focus">${s.focus}</p></details>`;
  $('askOverall').value = ask.notes.overall || '';
  $('askReading').classList.add('show');
}

// ---- 匯出（格式比照 HUNG_NOTE/30.每日紀錄） ----
const askTitle = () => '塔羅問事：' + ask.q.replace(/[\\/:*?"<>|\r\n]+/g, ' ').trim().slice(0, 24);
function askMarkdown(){
  const s = askSynth(), wd = '日一二三四五六'[new Date(ask.date + 'T00:00:00').getDay()];
  const plain = t => t.replace(/<\/?b>/g, '**');
  return `---\ntitle: "${askTitle()}"\ndate: ${ask.date}\nweek: ${isoWeek(ask.date)}\ntype: 每日記錄\ntags:\n  - 每日記錄\n  - 塔羅牌\n  - 天地人問事\n` +
    `source: "身心靈塔羅日記・天地人問事"\ncards:\n${ASK_POS.map(p => `  - "${p.name}：${label(ask.picks[p.key])}"`).join('\n')}\n---\n\n` +
    `# ${ask.date}（週${wd}）｜${askTitle()}\n\n> 問題：${ask.q}\n\n---\n\n## 🃏 天地人牌陣\n\n| 位置 | 角色 | 牌 | 正逆 | 比喻 |\n|---|---|---|---|---|\n` +
    ASK_POS.map(p => { const k = ask.picks[p.key];
      return `| ${p.name} | ${p.role}（${p.q}） | ${BY_ID[k.id].name} | ${k.rev ? '逆位' : '正位'} | ${ride(k)} |`; }).join('\n') + '\n\n---\n\n' +
    ASK_POS.map(p => { const k = ask.picks[p.key], c = BY_ID[k.id];
      return `## ${p.name}・${p.role}：${c.name}（${k.rev ? '逆位' : '正位'}）\n\n- **比喻**：${ride(k)}\n- **關鍵詞**：${c[ori(k)].kw}\n${numMd(c)}${bodyMd(c)}${storyMd(c)}- **牌義**：${c[ori(k)][p.field]}\n` +
        `- 正位對照：${RIDE[c.id][0]}｜${c.up.kw}\n- 逆位對照：${RIDE[c.id][1]}｜${c.rev.kw}\n- **我的解讀**：${ask.notes[p.key] || ''}\n`; }).join('\n') +
    `\n---\n\n## 🔮 天地人整體解牌\n\n${s.paras.map(plain).join('\n\n')}\n\n> ${s.focus}\n\n## 📓 我的結論\n\n${ask.notes.overall || ''}\n`;
}

// ---- 事件 ----
$('askShuffle').onclick = askShuffle;
$('askReveal').onclick = askReveal;
$('askRedraw').onclick = askRedraw;
$('askExport').onclick = () => saveFile(`${ask.date}-${askTitle()}.md`, askMarkdown(), 'askMsg');
$('askCopy').onclick = e => copyText(askMarkdown(), e.target);
$('askPiles').addEventListener('click', e => { const c = e.target.closest('.card'); if (c) askPick(c.closest('.pile').dataset.k, +c.dataset.i); });
$('askPiles').addEventListener('keydown', e => { const c = e.target.closest('.card');
  if (c && (e.key === 'Enter' || e.key === ' ')){ e.preventDefault(); askPick(c.closest('.pile').dataset.k, +c.dataset.i); } });
$('modeAsk').addEventListener('input', e => {
  if (e.target.id === 'askQ' && !ask.started){ ask.q = e.target.value; askSave(); }
  const k = e.target.dataset.askNote || (e.target.id === 'askOverall' && 'overall');
  if (k){ ask.notes[k] = e.target.value; askSave(); }
});

// ---- 模式切換：身心靈日記／天地人問事 ----
function setMode(m){
  if (busy) return;
  document.querySelectorAll('.modes button').forEach(b => b.classList.toggle('on', b.dataset.mode === m));
  $('modeDiary').hidden = m !== 'diary'; $('modeAsk').hidden = m !== 'ask'; $('modeStudy').hidden = m !== 'study';
  try { localStorage.setItem('mode', m); } catch(e){}
  if (m === 'diary') layoutDeck(); else if (m === 'ask') askLayout();
}
document.querySelectorAll('.modes button').forEach(b => b.onclick = () => setMode(b.dataset.mode));

try { ask = JSON.parse(localStorage.getItem(ASK_KEY)); } catch(e){}
if (!ask || !ask.piles) ask = askFresh();
setMode((() => { try { return localStorage.getItem('mode') } catch(e){} })() || 'diary');
askBuild(); askRefresh(); askRender();
