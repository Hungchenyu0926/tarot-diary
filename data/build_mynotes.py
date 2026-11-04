# 把 HUNG_NOTE「20.知識庫/塔羅牌義」的筆記轉成 ../mynotes.js，供「78 張牌義」模式顯示。
# 用法：python build_mynotes.py  （筆記更新後重跑一次，再推上 GitHub，線上版才會更新）
import json, pathlib, re, sys

SRC = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else r'G:\我的雲端硬碟\HUNG_NOTE\20.知識庫\塔羅牌義')
OUT = pathlib.Path(__file__).parent.parent / 'mynotes.js'

SUIT = {'權杖': 'w', '聖杯': 'c', '寶劍': 's', '錢幣': 'p'}
RANK = {'一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9, '十': 10,
        '侍者': 11, '騎士': 12, '王后': 13, '皇后': 13, '國王': 14}
MAJOR_FIELDS = ['階段', '傳統牌義', '核心邏輯', '生活例子', '正面特質', '負面特質']

def clean(s):
    s = re.sub(r'\[\[(?:[^\]|]*\|)?([^\]]*)\]\]', r'\1', s)       # [[連結|文字]] → 文字
    return s.replace('**', '').strip()

notes = {}

# 大牌：每張一個檔，內容在 frontmatter
for f in sorted((SRC / '大阿爾克那').glob('*.md')):
    m = re.match(r'(\d+)', f.stem)
    fm = f.read_text('utf-8').split('---')[1]
    kv = dict(re.findall(r'^([^\s:#][^:]*):\s*(.+)$', fm, re.M))
    notes[f'm{int(m.group(1)):02d}'] = {'title': f.stem[3:], 'fields': [[k, clean(kv[k])] for k in MAJOR_FIELDS if kv.get(k)]}

# 小牌：每個花色一個檔，每張牌是一個「### 名稱（英文）｜標題」段落
for f in SRC.glob('1.*.md'):
    for sec in re.split(r'^### ', f.read_text('utf-8'), flags=re.M)[1:]:
        head = re.match(r'(權杖|聖杯|寶劍|錢幣)(一|二|三|四|五|六|七|八|九|十|侍者|騎士|王后|皇后|國王)（[^）]*）｜(.+)', sec)
        if not head:
            continue
        fields, story = [], []
        for line in sec.splitlines()[1:]:
            if line.startswith('## '):
                break
            kv = re.match(r'- \*\*(.+?)\*\*[：:]\s*(.*)', line)
            sub = re.match(r'\s+- (.+)', line)
            if kv and kv.group(1) != '故事線':
                fields.append([kv.group(1), clean(kv.group(2))])
            elif sub:
                story.append(clean(sub.group(1)))
        if story:
            fields.append(['故事線', '\n'.join(story)])
        notes[f'{SUIT[head.group(1)]}{RANK[head.group(2)]:02d}'] = {'title': clean(head.group(3)), 'fields': fields}

assert len(notes) == 78, f'只讀到 {len(notes)} 張：缺 {sorted(set(f"{s}{n:02d}" for s in "wcsp" for n in range(1, 15)) | {f"m{i:02d}" for i in range(22)} - set(notes))}'
OUT.write_text('window.MYNOTES = ' + json.dumps(notes, ensure_ascii=False) + ';\n', 'utf-8')
print(f'OK 78 張，已寫入 {OUT.name}')
