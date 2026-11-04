// ===== 牌間關係、收尾、四透鏡（三種抽牌模式共用） =====
// 規則參考 daman-ovo-0404/tarot-skill（MIT）的 card-relations.md、combinations.md、SKILL.md；文字為本專案改寫。
// 這裡只放函式與常數，用到的 BY_ID、isCourt、relate 等在 index.html 主程式，呼叫時才取用。

// 愚人之旅三幕
const ACTS = [['第一幕', '建立自我'], ['第二幕', '內在修正'], ['第三幕', '陰影、崩塌到整合']];
const actOf = n => n <= 7 ? 0 : n <= 14 ? 1 : 2;
const actText = c => `愚人之旅${ACTS[actOf(c.num)][0]}（${ACTS[actOf(c.num)][1]}）`;
// 「高塔」、「星星」在愚人之旅第三幕（…）。（同一幕的大牌合併成一句）
const actLine = cs => ACTS.map((a, k) => cs.filter(c => c.arcana === 'major' && actOf(c.num) === k)).filter(l => l.length)
  .map(l => `${l.map(c => `「${c.name}」`).join('、')}在${actText(l[0])}`).join('，') + '。';

// 經典組合（不分先後）
const COMBO = {
  'm13+m17': '死神＋星星：結束之後的療癒',
  'm16+m17': '高塔＋星星：崩塌之後重建',
  'm13+m20': '死神＋審判：重新評估方向',
  'm18+m19': '月亮＋太陽：迷霧被照亮',
  'm08+m15': '力量＋惡魔：馴服自己的陰影',
  'm01+m02': '魔術師＋女祭司：直覺和行動要對準時間',
  'm06+m09': '戀人＋隱士：獨處的需要影響了連結',
  'm04+m10': '皇帝＋命運之輪：掌控欲被變化考驗',
  'm10+m11': '命運之輪＋正義：選擇碰上時機，會有回響',
  'm16+s10': '高塔＋寶劍十：舊結構徹底結束',
};

const pip = c => c.arcana === 'minor' && c.num <= 10;
// 兩張牌的關係：[[種類, 文字], ...]；adj＝相鄰（才看順序類關係），el＝要不要附元素關係
function pairRel(a, b, adj, el){
  const r = [], combo = COMBO[[a.id, b.id].sort().join('+')];
  const maj = a.arcana === 'major' && b.arcana === 'major';
  if (combo) r.push(['組合', combo]);
  if (maj && a.num + b.num === 21) r.push(['鏡像', '大牌編號相加是 21，兩張像鏡子的兩端，提醒你看見另一面']);
  if (pip(a) && pip(b) && a.num === b.num && a.suit !== b.suit) r.push(['共振', `同樣是數字 ${a.num}，同一個階段的功課在不同層面同時出現`]);
  if (adj){
    if (maj){
      const A = actOf(a.num), B = actOf(b.num);
      r.push(A === B ? ['強化', `都在愚人之旅${ACTS[A][0]}（${ACTS[A][1]}），同一段課題被加重`]
        : A < B ? ['推進', `愚人之旅從${ACTS[A][0]}走到${ACTS[B][0]}（${ACTS[B][1]}），一下子跨了一大步`]
        : ['補課', `愚人之旅從${ACTS[A][0]}退回${ACTS[B][0]}（${ACTS[B][1]}），有一段功課要回頭補`]);
    }
    if (pip(a) && pip(b) && a.suit === b.suit && a.num !== b.num){
      const s = a.name.slice(0, 2);
      r.push(a.num < b.num ? ['推進', `同為${s}，數字從 ${a.num} 走到 ${b.num}，事情一步步往前`]
        : ['重啟', `同為${s}，數字從 ${a.num} 退回 ${b.num}，有些事要重新開始`]);
      if (Math.min(a.num, b.num) <= 5 && Math.max(a.num, b.num) >= 5) r.push(['危機', '中間經過數字 5 的衝突點，過程會有一段卡關']);
    }
    const ct = [a, b].find(isCourt), other = ct === a ? b : a;
    if (ct && !isCourt(other)) r.push(['角色', `「${ct.name}」是角色，「${other.name}」是這個角色碰到的事`]);
    if (el) r.push(['元素', relate(a.element, b.element)]);
  }
  return r;
}
// 每組關係標成：因果／對話／遞進／轉折
const KIND = {組合: '經典組合', 推進: '遞進', 強化: '遞進', 補課: '轉折', 重啟: '轉折', 危機: '轉折', 角色: '因果', 鏡像: '對話', 共振: '對話', 元素: '對話'};

// cards: [[位置名, pick], ...]；前 seq 張有先後順序，相鄰的才比順序；el＝相鄰牌附元素關係
function relLines(cards, seq = cards.length, el = true){
  const out = [];
  cards.forEach(([na, pa], i) => cards.slice(i + 1).forEach(([nb, pb], k) => {
    const j = i + 1 + k, adj = j === i + 1 && j < seq;
    const r = pairRel(BY_ID[pa.id], BY_ID[pb.id], adj, adj && el);
    if (r.length) out.push(`${na}${adj ? ' → ' : '、'}${nb}【${KIND[r[0][0]]}】${r.map(x => x[1]).join('；')}。`);
  }));
  return out;
}

// 收尾：能量總結詞＋開放式問題（看焦點那張牌）
const WORD = {
  火: ['點火前進', '慢火回溫'], 水: ['順流感受', '向內療癒'], 風: ['看清方向', '鬆開思緒'], 土: ['穩穩落地', '照顧根基'],
  major: [['確立自我', '找回自己'], ['向內修正', '暫停整理'], ['穿越陰影', '放下重來']],
};
const QUESTION = {
  火: '有哪件事你想做卻還沒開始？第一步可以是什麼？',
  水: '你心裡最需要被聽見的感受是什麼？',
  風: '有哪個想法一直在腦中打轉，還沒說出口？',
  土: '哪個具體的小地方，你可以先動手照顧？',
};
function closing(p){
  const c = BY_ID[p.id], k = p.rev ? 1 : 0;
  return {word: c.arcana === 'major' ? WORD.major[actOf(c.num)][k] : WORD[c.element][k], q: QUESTION[c.element]};
}
const FREE = '牌顯示的是當下的能量，你的選擇隨時可以改變走向。';
const closeHtml = s => `<p class="focus">能量總結：<b>${s.word}</b></p><p>🌱 ${s.q}</p><p class="free">${FREE}</p>`;
const closeMd = s => `\n\n**能量總結**：${s.word}\n\n🌱 ${s.q}\n\n*${FREE}*`;

// 四透鏡：寫練習時可以換的角度
const LENS = '<div class="lens">🔍 四個角度：鏡子（現在的我）・窗戶（沒看見的盲點）・門（可以做的事）・錨（卡住的信念）</div>';
