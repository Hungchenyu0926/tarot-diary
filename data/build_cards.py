# 合併 cards_a.json + cards_b.json → ../cards.js（網頁直接載入，本機雙擊也能用）
import json, pathlib

here = pathlib.Path(__file__).parent
cards = json.loads((here / 'cards_a.json').read_text('utf-8')) + json.loads((here / 'cards_b.json').read_text('utf-8'))

ids = [c['id'] for c in cards]
assert len(cards) == 78 and len(set(ids)) == 78, f'牌數或 id 有誤：{len(cards)} 筆、{len(set(ids))} 個不重複'
for c in cards:
    assert (here.parent / 'cards' / f"{c['id']}.jpg").exists(), f"缺牌圖 {c['id']}"
    assert c['element'] in '火水風土', f"{c['id']} 元素錯誤 {c['element']}"
    for o in ('up', 'rev'):
        for k in ('kw', 'core', 'body', 'mind', 'spirit'):
            assert c[o][k].strip(), f"{c['id']}.{o}.{k} 空白"

(here.parent / 'cards.js').write_text('window.CARDS = ' + json.dumps(cards, ensure_ascii=False, indent=0) + ';\n', 'utf-8')
print('OK 78 張，已寫入 cards.js')
