// ===== 78 張牌義練習模式 =====
// 下拉選一張牌（或隨機），先看圖練習，再展開牌義。
// 「我的筆記」來自 mynotes.js（由 data/build_mynotes.py 從 HUNG_NOTE 產生，只在本機，不上傳）。

const SUIT_ZH = {wands: '權杖', cups: '聖杯', swords: '寶劍', pentacles: '錢幣'};
let studyId = 'm00', studyRev = false;

function studyBuild(){
  const groups = [['大牌（大阿爾克那）', c => c.arcana === 'major'],
    ...Object.entries(SUIT_ZH).map(([s, zh]) => [`${zh}（${BY_ID[s[0] + '01'].element}）`, c => c.suit === s])];
  $('studySel').innerHTML = groups.map(([g, f]) => `<optgroup label="${g}">${CARDS.filter(f).map(c =>
    `<option value="${c.id}">${c.arcana === 'major' ? String(c.num).padStart(2, '0') + ' ' : ''}${c.name}　${c.en}</option>`).join('')}</optgroup>`).join('');
  try { studyId = localStorage.getItem('study:id') || studyId; } catch(e){}
  studyShow();
}

const sec = (title, body) => `<details class="sec"><summary>${title}</summary>${body}</details>`;
const dl = rows => `<table class="kv">${rows.map(([k, v]) => `<tr><th>${k}</th><td>${esc(v).replace(/\n/g, '<br>')}</td></tr>`).join('')}</table>`;

function studyShow(){
  const c = BY_ID[studyId], p = {id: c.id, rev: studyRev}, mine = window.MYNOTES && MYNOTES[c.id];
  $('studySel').value = c.id;
  try { localStorage.setItem('study:id', c.id); } catch(e){}
  const side = k => dl([['關鍵詞', c[k].kw], ['整體', c[k].core], ['身', c[k].body], ['心', c[k].mind], ['靈', c[k].spirit]]);
  const extra = [
    numText(c) && ['數字週期', numText(c)],
    ...bodyMap(c).map(t => ['人體能量圖', t]),
    ['天地人比喻', `正位：${RIDE[c.id][0]}／逆位：${RIDE[c.id][1]}`],
    ['翻譯句型', story(c).lines.join('\n')],
  ].filter(Boolean);
  $('studyCard').innerHTML = `
    <div class="study-top">
      <img src="cards/${c.id}.jpg" alt="${c.name}" class="${studyRev ? 'rev' : ''}">
      <div>
        <h2>${c.name}<span class="tag ${studyRev ? 'rev' : ''}">${studyRev ? '逆位' : '正位'}</span></h2>
        <div class="kw">${c.en}・${c.element}元素${c.arcana === 'major' ? `・大牌 ${c.num}` : ''}</div>
        <div class="note-lbl">先看圖：人物、顏色、動作讓你想到什麼？想好再展開下面的牌義。</div>
      </div>
    </div>
    ${mine ? sec(`📒 我的筆記（HUNG_NOTE）｜${esc(mine.title)}`, dl(mine.fields)) : ''}
    ${sec(`正位｜${c.up.kw}`, side('up'))}
    ${sec(`逆位｜${c.rev.kw}`, side('rev'))}
    ${sec('解讀工具：數字・身體・比喻・句型', dl(extra))}`;
}

function studyStep(d){
  const i = CARDS.findIndex(c => c.id === studyId);
  studyId = CARDS[(i + d + 78) % 78].id; studyRev = false; studyShow();
}
function studyRandom(){
  const r = new Uint32Array(2); crypto.getRandomValues(r);
  studyId = CARDS[r[0] % 78].id; studyRev = r[1] % 2 === 1; studyShow();
}

$('studySel').onchange = e => { studyId = e.target.value; studyRev = false; studyShow(); };
$('studyPrev').onclick = () => studyStep(-1);
$('studyNext').onclick = () => studyStep(1);
$('studyRand').onclick = studyRandom;
$('studyFlip').onclick = () => { studyRev = !studyRev; studyShow(); };
studyBuild();
