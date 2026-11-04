// ===== 牌陣占卜模式 =====
// 六種牌陣參考 daman-ovo-0404/tarot-skill（MIT）的 spreads.md；位置說明為本專案改寫。
// 從 78 張牌扇依序抽牌 → 一起翻開 → 逐張練習 → 整體解讀（大牌比例、愚人之旅、花色、牌間關係、收尾）。

const SP = {
  single:    ['單張指引', [['當下指引', '此刻最需要知道的事']]],
  three:     ['過去・現在・未來', [['過去', '帶到現在的影響'], ['現在', '此刻的狀態'], ['未來', '照現在走下去的方向']]],
  diamond:   ['五張菱形（卡住的決定）', [['核心', '問題的中心'], ['根源', '事情怎麼來的'], ['阻力', '擋住你的東西'], ['潛力', '還沒用上的資源'], ['建議', '可以怎麼做']]],
  moon:      ['月相四張（一個月的週期）', [['新月', '想種下的意圖'], ['上弦', '要採取的行動'], ['滿月', '會看見的事'], ['下弦', '該放下的東西']]],
  horseshoe: ['馬蹄形七張（時間線）', [['遠期過去', '早先埋下的因'], ['近期過去', '剛發生的事'], ['現在', '此刻的狀態'], ['近期未來', '接下來的發展'],
              ['外部影響', '別人與環境'], ['建議', '可以怎麼做'], ['結果', '目前的走向']]],
  celtic:    ['凱爾特十字（複雜局面）', [['核心', '現況'], ['交叉', '挑戰或助力'], ['意識目標', '你想要的'], ['根基', '潛意識與過去的基礎'],
              ['近期過去', '剛發生的事'], ['近期未來', '即將發生的事'], ['自我', '你的態度'], ['環境', '身邊的人事'],
              ['希望與恐懼', '心裡的期待與擔心'], ['結果', '目前的走向']]],
};

let sp;
const SP_KEY = 'spread:current';
const spPos = () => SP[sp.spread][1];
function spSave(){ try { localStorage.setItem(SP_KEY, JSON.stringify(sp)) } catch(e){} }
const spFresh = (spread = 'three', q = '') => ({date: today, spread, q, deck: fresh().deck, started: false, picks: [], revealed: false, notes: {}});
const spSlot = i => $('spSpread').querySelector(`.slot[data-i="${i}"]`);

function spBuild(){
  $('spSel').innerHTML = Object.entries(SP).map(([k, [name, pos]]) =>
    `<option value="${k}" ${k === sp.spread ? 'selected' : ''}>${name}・${pos.length} 張</option>`).join('');
  $('spSpread').innerHTML = spPos().map(([name, hint], i) => `<div class="slot" data-i="${i}"><div class="lbl">${name}<small>${hint}</small></div>
    <div class="place"></div><div class="cname"></div></div>`).join('');
  $('spDeck').classList.toggle('stack', !sp.started);
  $('spDeck').innerHTML = sp.deck.map((d, i) =>
    `<div class="card back" tabindex="0" role="button" aria-label="第 ${i + 1} 張牌" data-i="${i}"></div>`).join('');
  sp.picks.forEach((p, i) => spFill(i));
  spLayout();
}
function spLayout(){ if (sp && !$('modeSpread').hidden) layoutDeck($('spDeck')); }
function spFill(i){
  const p = sp.picks[i], c = BY_ID[p.id];
  spSlot(i).querySelector('.place').innerHTML = `<div class="flip ${sp.revealed ? 'on' : ''}"><div class="back"></div>
    <div class="front ${p.rev ? 'rev' : ''}"><img src="cards/${c.id}.jpg" alt="${c.name}"></div></div>`;
  if (sp.revealed) spName(i);
}
function spName(i){
  const p = sp.picks[i];
  spSlot(i).querySelector('.cname').innerHTML = `${BY_ID[p.id].name}<span class="tag ${p.rev ? 'rev' : ''}">${p.rev ? '逆' : '正'}</span>`;
}

function spRefresh(){
  const P = spPos(), n = sp.picks.length, on = sp.started, full = n >= P.length, used = new Set(sp.picks.map(p => p.id));
  [...$('spDeck').children].forEach(el => el.classList.toggle('gone', used.has(sp.deck[el.dataset.i].id)));
  $('spDeck').classList.toggle('locked', !on || full || busy);
  $('spDeck').style.display = full ? 'none' : '';
  $('spSpread').querySelectorAll('.slot').forEach(s => s.classList.toggle('next', on && !busy && +s.dataset.i === n));
  $('spQ').value = sp.q; $('spQ').readOnly = on;
  $('spSel').disabled = on || busy;
  $('spShuffle').hidden = on; $('spShuffle').disabled = busy;
  $('spReveal').hidden = !full || sp.revealed; $('spReveal').disabled = busy;
  $('spRedraw').hidden = !on; $('spRedraw').disabled = busy;
  if (busy) return;
  $('spStatus').textContent = !on ? '選好牌陣，想著你的問題，準備好就按「洗牌」'
    : !full ? `憑直覺抽第 ${n + 1} 張：「${P[n][0]}」（${P[n][1]}）`
    : !sp.revealed ? '全部就位了，準備好就一起翻開'
    : '先寫下自己的解讀，再展開牌義與整體解讀';
}

async function spShuffle(){
  if (busy) return;
  busy = true; sp = spFresh($('spSel').value, $('spQ').value.trim()); spSave();
  $('spReading').classList.remove('show'); spBuild(); spRefresh();
  $('spStatus').textContent = '洗牌中……專心想著你的問題';
  await wait(350);
  await riffle($('spDeck'), () => { sp.started = true; spSave(); });
  busy = false; spRefresh();
}
async function spPick(i){
  const P = spPos(), d = sp.deck[i];
  if (busy || !sp.started || sp.picks.length >= P.length || sp.picks.some(p => p.id === d.id)) return;
  busy = true;
  const flight = fly($('spDeck').children[i], spSlot(sp.picks.length).querySelector('.place'));
  sp.picks.push(d); spSave(); spRefresh();
  await flight;
  spFill(sp.picks.length - 1);
  busy = false; spRefresh();
}
async function spReveal(){
  if (busy) return;
  busy = true; sp.revealed = true; spSave(); spRefresh();
  const step = sp.picks.length > 5 ? 180 : 400;
  for (let i = 0; i < sp.picks.length; i++){
    spSlot(i).querySelector('.flip').classList.add('on');
    await wait(step); spName(i);
  }
  await wait(300);
  busy = false; spRefresh(); spRender();
  await wait(500);
  $('spReading').scrollIntoView({behavior: calm ? 'auto' : 'smooth'});
}
function spRedraw(){
  if (busy || !confirm('確定要重新抽牌嗎？這次的牌和筆記都會清空。')) return;
  sp = spFresh(sp.spread); spSave();
  $('spReading').classList.remove('show'); spBuild(); spRefresh();
  scrollTo({top: 0});
}

// ---- 整體解讀 ----
const spSuit = s => BY_ID[s[0] + '01'].name.slice(0, 2);
function spSynth(){
  const P = spPos(), picks = sp.picks, cs = picks.map(p => BY_ID[p.id]), n = cs.length, out = [];
  // 大牌比例＋愚人之旅
  const maj = cs.filter(c => c.arcana === 'major'), r = maj.length / n;
  out.push(n === 1 ? (maj.length ? '這是一張大牌，這件事牽動比較深的人生課題。' : '這是一張小牌，答案落在日常的選擇裡，主動權在你手上。')
    : `大牌 ${maj.length}／${n} 張：` + (r > .5 ? '超過一半，這件事牽動重大轉折，順勢而為比硬推更重要。'
      : r >= .3 ? '命運的安排和你的選擇各佔一半。' : '日常選擇主導，主動權在你手上，多看看自己能做什麼。'));
  if (maj.length) out.push(actLine(cs));
  // 逆位
  const rv = picks.map((p, i) => p.rev ? `「${P[i][0]}」` : '').filter(Boolean);
  out.push(!rv.length ? (n === 1 ? '正位，能量順暢。' : '全是正位，能量大致順暢。')
    : rv.length === n ? (n === 1 ? '逆位：能量卡住、過度或向內，先處理阻塞再求前進。' : '全是逆位，能量明顯向內，先整理、放慢。')
    : `逆位在${rv.join('、')}，那裡是卡住、需要特別留意的環節。`);
  // 花色：3 張以上同花色為主導；5 張以上的牌陣才看缺席的花色
  const cnt = {};
  cs.filter(c => c.arcana === 'minor').forEach(c => cnt[c.suit] = (cnt[c.suit] || 0) + 1);
  const top = Object.keys(cnt).find(s => cnt[s] >= 3);
  if (top) out.push(`${spSuit(top)}有 ${cnt[top]} 張，這件事的重心在${SUIT_AREA[top]}。`);
  const miss = Object.keys(SUIT_AREA).filter(s => !cnt[s]);
  if (n >= 5 && miss.length && miss.length < 4) out.push(`沒有出現${miss.map(spSuit).join('、')}，${miss.map(s => SUIT_AREA[s]).join('、')}這塊可能被忽略了。`);
  // 焦點：有「建議」看建議，沒有就看最後一張
  let f = P.findIndex(x => x[0] === '建議');
  if (f < 0) f = n - 1;
  const focus = `${n > 1 ? `「${P[f][0]}」` : ''}${cs[f].name}${picks[f].rev ? '（逆位）' : ''}：${cs[f][ori(picks[f])].core}`;
  return {paras: out, rel: relLines(picks.map((p, i) => [P[i][0], p]), n, n <= 5), focus, ...closing(picks[f])};
}

function spRender(){
  if (!sp.revealed) return;
  const P = spPos();
  $('spPositions').innerHTML = `<div class="pos" style="display:block"><h3>${SP[sp.spread][0]}</h3><p style="margin:0">${esc(sp.q) || '今日指引'}</p></div>` +
    sp.picks.map((p, i) => cardBlock(p, `${P[i][0]}（${P[i][1]}）`, 'core', 'n' + i, sp.notes, 'sp-note')).join('');
  const s = spSynth();
  $('spGuide').innerHTML = `<details><summary style="font-size:1.1rem">牌陣整體解讀（寫完自己的解讀再打開）</summary>
    ${s.paras.map(p => `<p>${p}</p>`).join('')}${relHtml(s.rel)}<p class="focus">${s.focus}</p>${closeHtml(s)}</details>`;
  $('spOverall').value = sp.notes.overall || '';
  $('spReading').classList.add('show');
}

// ---- 匯出（格式比照 HUNG_NOTE/30.每日紀錄） ----
const spTitle = () => `塔羅牌陣：${SP[sp.spread][0].replace(/（.*）/, '')}｜` + (sp.q.replace(/[\\/:*?"<>|\r\n]+/g, ' ').trim().slice(0, 20) || '今日指引');
function spMarkdown(){
  const P = spPos(), s = spSynth(), wd = '日一二三四五六'[new Date(sp.date + 'T00:00:00').getDay()];
  return `---\ntitle: "${spTitle()}"\ndate: ${sp.date}\nweek: ${isoWeek(sp.date)}\ntype: 每日記錄\ntags:\n  - 每日記錄\n  - 塔羅牌\n  - 牌陣占卜\n` +
    `source: "身心靈塔羅日記・牌陣占卜"\ncards:\n${sp.picks.map((p, i) => `  - "${P[i][0]}：${label(p)}"`).join('\n')}\n---\n\n` +
    `# ${sp.date}（週${wd}）｜${spTitle()}\n\n> 牌陣：${SP[sp.spread][0]}\n> 問題：${sp.q || '今日指引'}\n\n---\n\n## 🃏 牌陣\n\n| 位置 | 牌 | 正逆 | 關鍵詞 |\n|---|---|---|---|\n` +
    sp.picks.map((p, i) => `| ${P[i][0]} | ${BY_ID[p.id].name} | ${p.rev ? '逆位' : '正位'} | ${BY_ID[p.id][ori(p)].kw} |`).join('\n') + '\n\n---\n\n' +
    sp.picks.map((p, i) => { const c = BY_ID[p.id];
      return `## ${P[i][0]}（${P[i][1]}）：${c.name}（${p.rev ? '逆位' : '正位'}）\n\n- **關鍵詞**：${c[ori(p)].kw}\n- **牌義**：${c[ori(p)].core}\n` +
        `- 正位對照：${c.up.kw}｜${c.up.core}\n- 逆位對照：${c.rev.kw}｜${c.rev.core}\n- **我的解讀**：${sp.notes['n' + i] || ''}\n`; }).join('\n') +
    `\n---\n\n## 🔮 牌陣整體解讀\n\n${s.paras.join('\n\n')}${relMd(s.rel)}\n\n> ${s.focus}${closeMd(s)}\n\n## 📓 我的結論\n\n${sp.notes.overall || ''}\n`;
}

// ---- 事件 ----
$('spSel').onchange = e => { if (sp.started) return; sp.spread = e.target.value; spSave(); spBuild(); spRefresh(); };
$('spShuffle').onclick = spShuffle;
$('spReveal').onclick = spReveal;
$('spRedraw').onclick = spRedraw;
$('spExport').onclick = () => saveFile(`${sp.date}-${spTitle()}.md`, spMarkdown(), 'spMsg');
$('spCopy').onclick = e => copyText(spMarkdown(), e.target);
$('spDeck').addEventListener('click', e => { const el = e.target.closest('.card'); if (el) spPick(+el.dataset.i); });
$('spDeck').addEventListener('keydown', e => { const el = e.target.closest('.card');
  if (el && (e.key === 'Enter' || e.key === ' ')){ e.preventDefault(); spPick(+el.dataset.i); } });
$('modeSpread').addEventListener('input', e => {
  if (e.target.id === 'spQ' && !sp.started){ sp.q = e.target.value; spSave(); }
  const k = e.target.dataset.spNote || (e.target.id === 'spOverall' && 'overall');
  if (k){ sp.notes[k] = e.target.value; spSave(); }
});

try { sp = JSON.parse(localStorage.getItem(SP_KEY)); } catch(e){}
if (!sp || !SP[sp.spread]) sp = spFresh();
spBuild(); spRefresh(); spRender();
