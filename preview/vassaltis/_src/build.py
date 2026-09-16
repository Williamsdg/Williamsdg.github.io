# Assembles _src/<page>.body into /<page>.html with the shared <head>.
# First line of each .body file:  TITLE | page-key
import glob, os
here = os.path.dirname(os.path.abspath(__file__)); root = os.path.dirname(here)
head = open(os.path.join(here, 'head.html')).read()
for f in sorted(glob.glob(os.path.join(here, '*.body'))):
    first, body = open(f).read().split('\n', 1)
    title, key = [x.strip() for x in first.split('|')]
    html = head.replace('__TITLE__', title) + f'<body data-page="{key}">\n<div data-vx-header></div>\n' + body + '''
<div data-vx-footer></div>
<script src="assets/data.js"></script>
<script src="assets/store.js"></script>
<script src="assets/site.js"></script>
''' + (open(f.replace('.body', '.js')).read() if os.path.exists(f.replace('.body', '.js')) else '') + '</body>\n</html>\n'
    out = os.path.join(root, os.path.basename(f).replace('.body', '.html'))
    open(out, 'w').write(html); print('built', os.path.basename(out))
