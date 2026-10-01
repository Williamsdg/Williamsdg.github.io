#!/usr/bin/env python3
"""Builds data.js for the Simply Infused concept from the store's public Shopify feed.

    curl -s "https://www.simply-infused.com/products.json?limit=250" -o products.json
    python3 _build_data.py products.json

Everything on the page (names, prices, sizes, descriptions, pairings, proteins, vegetables)
comes from that feed. Nothing is invented here; the only editorial layer is the flavour
families in FAMILIES, which are keyword matches on the product name.
"""
import html, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
src = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, 'products.json')
products = json.load(open(src))['products']

FAMILIES = [
    ('spicy', r'habanero|chimichurri|baklouti|chili|jalape|calabrian|harissa|cayenne|chipotle|peppercorn|hot honey'),
    ('citrus', r'lemon|lime|orange|grapefruit|gremolata'),
    ('herb', r'rosemary|dill|basil|tuscan|provence|oregano|neapolitan|sage|cilantro|pesto|gremolata|lemongrass'),
    ('fruit', r'pomegranate|pineapple|apple|raspberry|strawberry|peach|pear|blackberry|fig|cherry|mango|blueberry|coconut|quince|cranberry'),
    ('sweet', r'vanilla|maple|chocolate|espresso|honey|cinnamon|coconut|denissimo|traditional'),
    ('savory', r'garlic|butter|smoked|mushroom|onion|truffle'),
]

def lines(body):
    h = re.sub(r'<(br|/p|/div|/li|/h\d|/tr)[^>]*>', '\n', body or '')
    h = re.sub(r'<h\d[^>]*>', '\n@@', h)
    h = re.sub(r'<(strong|b)>', '@@', h)
    t = html.unescape(re.sub(r'<[^>]+>', '', h)).replace('\xa0', ' ')
    return [' '.join(l.split()) for l in t.split('\n') if l.strip() and l.strip() != '@@']

def split_list(s):
    s = re.sub(r'[.…]+\s*$', '', s.strip())
    return [x.strip(' .') for x in re.split(r',\s*', s) if x.strip(' .')]

def kind(p):
    t, name = p['product_type'], p['title']
    if 'Sampler' in t: return 'gift'
    if 'Ultra Premium Extra Virgin' in name: return 'evoo'
    if 'Olive' in t: return 'infused'
    return 'dark' if t.startswith('Dark') else 'white'

def clean_name(title):
    badge = ''
    m = re.search(r'\(([^)]*(SELLER|SELLING)[^)]*)\)', title)
    if m:
        badge = 'Top-selling spicy oil' if 'SPICY' in m.group(1) else 'Best seller'
        title = title.replace(m.group(0), '').strip()
    title = re.sub(r'^(MILD|MEDIUM|ROBUST)\b', lambda x: x.group(1).title(), title)
    return title, badge

def short_name(name, k):
    if k == 'evoo': return name.split()[0]
    s = re.sub(r'\s+(Infused |Extra Virgin |Fused )*Olive Oil$', '', name)
    s = re.sub(r'\s+(Dark |White )?Balsamic( Vinegar)?$', '', s)
    s = re.sub(r'\s+(Dark|White)$', '', s)
    s = re.sub(r'\s+Vinegar Condimento$', '', s)
    s = re.sub(r'^Limited Batch ', '', s)
    return s.strip()

STOP = set('''balsamic balsamics olive oil oils vinegar fused infused white dark all natural all-natural flavored
year yr old year-old aged and the our evoo evoos extra virgin ultra premium ultra-premium barrel italian wild vinegars'''.split())

def tokens(s):
    s = s.lower().replace('ñ', 'n').replace('&', ' ').replace('-', ' ')
    s = re.sub(r"[^a-z0-9 ]", '', s)
    return [t for t in s.split() if t not in STOP]

out, index = [], []
for p in products:
    k = kind(p)
    name, badge = clean_name(p['title'])
    L = lines(p['body_html'])
    sec, cur = {}, 'lead'
    for l in L:
        l = l.replace('@@@@', '@@')
        if l.startswith('@@') and len(l) > 72: l = l.lstrip('@')  # body text set in a heading tag
        if l.startswith('@@'):
            h = l[2:].upper()
            cur = ('pairs' if 'COMBINATION' in h else 'proteins' if 'PROTEIN' in h or 'MEATS' in h else 'veg' if 'VEGETABLE' in h
                   else 'other' if 'OTHER APPLICATION' in h else 'uses' if h == 'USES' else 'skip' if sec.get('lead') else 'lead')
            continue
        m = re.match(r'^(?:Balsamic & Wine Vinegar )?Pairings:?\s*(.*)$', l)
        if m:
            cur = 'pairs'
            if m.group(1): sec.setdefault(cur, []).append(m.group(1))
            continue
        sec.setdefault(cur, []).append(l)
    lead = ' '.join(sec.get('lead', [])[:2])
    lead = re.sub(r'\s*SUGGESTED.*$', '', lead)
    if lead.startswith('Suggested'): lead = ''
    raw_pairs = []
    for l in sec.get('pairs', []):
        for ph in (split_list(l) if ',' in l else [l.strip(' .')]):
            ph = re.sub(r'^(and|or|pairs? with|our)\s+', '', ph.strip(' @'), flags=re.I)
            raw_pairs += [x.strip() for x in re.split(r'\s+and\s+', ph) if x.strip()]
    def lst(key):
        v = sec.get(key, [])
        if not v: return []
        return split_list(v[0]) if len(v) == 1 else [x.strip(' .') for x in v]
    sizes = []
    for v in p['variants']:
        m = re.match(r'\s*(\d+)\s*ml', v['title'])
        sizes.append({'id': v['id'], 'ml': int(m.group(1)) if m else 0, 'price': float(v['price']),
                      'label': (m.group(1) + 'ml') if m else 'Set of 4'})
    fam = [f for f, rx in FAMILIES if re.search(rx, name.lower())] if k != 'gift' else []
    item = {'h': p['handle'], 'n': name, 's': short_name(name, k), 'k': k, 'b': badge, 'd': lead,
            'f': fam, 'z': sizes, 'pr': lst('proteins'), 'vg': lst('veg'), 'ot': lst('other'), 'us': lst('uses'),
            '_raw': raw_pairs}
    out.append(item)
    index.append((set(tokens(short_name(name, k))), item))

def match(phrase, source):
    """Resolve a pairing phrase from the shop's copy to a product on the opposite shelf."""
    pl = phrase.lower()
    if re.search(r'^all\b|any ', pl): return None
    want_oil = source['k'] in ('dark', 'white')
    if 'balsamic' in pl: want_oil = False
    if 'olive oil' in pl or 'evoo' in pl: want_oil = True
    t = set(tokens(phrase))
    if re.search(r'\b18', pl): t = {'traditional', '18'}
    if not t: return None
    best = None
    for toks, item in index:
        if item is source or item['k'] == 'gift': continue
        if (item['k'] in ('evoo', 'infused')) != want_oil: continue
        if t == toks: return item['h']
        if t <= toks or (toks <= t and len(toks) > 1):
            if best is None or len(toks) < best[0]: best = (len(toks), item['h'])
    return best[1] if best else None

unmatched = {}
for item in out:
    pairs, also, everything = [], [], False
    for ph in item.pop('_raw'):
        if re.search(r'\ball\b', ph.lower()):
            everything = True
            continue
        hd = match(ph, item)
        if hd and hd not in pairs: pairs.append(hd)
        elif not hd and len(ph.split()) <= 6 and ph not in also and ':' not in ph and re.search(r'balsamic|oil|vinegar', ph, re.I):
            also.append(ph); unmatched[ph] = unmatched.get(ph, 0) + 1
    item['p'], item['pa'], item['pall'] = pairs, also, everything

open(os.path.join(HERE, 'data.js'), 'w').write(
    '/* Generated by _build_data.py from simply-infused.com/products.json. Do not hand-edit. */\n'
    'window.SI_CATALOG=' + json.dumps(out, ensure_ascii=False, separators=(',', ':')) + ';\n')
print(len(out), 'products;', sum(1 for i in out if i['p']), 'with matched pairings')
if '-v' in sys.argv:
    for k, v in sorted(unmatched.items(), key=lambda x: -x[1]): print(v, k)
    for i in out: print(i['k'], '|', i['s'], '|', i['b'], '|', i['f'], '|', len(i['p']), i['pall'], '|', i['d'][:70])
