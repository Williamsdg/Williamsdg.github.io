const puppeteer = require('puppeteer');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, 'ad-videos');
const HTML_FILE = path.join(__dirname, 'ads.html');
const WIDTH = 1080;
const HEIGHT = 1080;

const AD_LABELS = [
    'restaurant', 'real-estate', 'fitness', 'law-firm', 'healthcare',
    'ecommerce', 'construction', 'salon-spa', 'automotive', 'photography',
    'accounting', 'dental', 'landscaping', 'coffee-shop', 'tech-startup',
    'wedding-events', 'pet-services', 'education', 'home-services', 'architecture'
];

async function run() {
    if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

    console.log('Launching browser...');
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: WIDTH, height: HEIGHT });

    const fullHtml = fs.readFileSync(HTML_FILE, 'utf-8');
    const parts = fullHtml.split('<div class="ad-card">');

    for (let i = 0; i < 20; i++) {
        const label = AD_LABELS[i];
        console.log(`[${i + 1}/20] ${label}...`);

        const cardContent = parts[i + 1];
        if (!cardContent) { console.log('  Skipped (no card found)'); continue; }

        const cardHtml = '<div class="ad-card">' + cardContent.split('\n\n    <!-- ')[0].split('\n\n</div>')[0];
        const singlePage = buildPage(cardHtml);

        await page.setContent(singlePage, { waitUntil: 'networkidle0', timeout: 10000 });

        // Screenshot the static ad
        const imgPath = path.join(OUTPUT_DIR, `${label}.png`);
        await page.screenshot({ path: imgPath, type: 'png' });

        // Use ffmpeg to make a 6s video: 1s fade in, 4s hold, 1s fade out
        const mp4Path = path.join(OUTPUT_DIR, `ad-${String(i + 1).padStart(2, '0')}-${label}.mp4`);
        execSync(`ffmpeg -y -loop 1 -i "${imgPath}" -c:v libx264 -t 6 -pix_fmt yuv420p -vf "fps=30,fade=in:0:30,fade=out:150:30" -preset fast -crf 18 "${mp4Path}" 2>/dev/null`);

        // Clean up the png
        fs.unlinkSync(imgPath);
        console.log(`  ✓ ${mp4Path}`);
    }

    await browser.close();
    console.log(`\nDone! 20 videos in: ${OUTPUT_DIR}`);
}

function buildPage(cardHtml) {
    return `<!DOCTYPE html>
<html><head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
:root{--bg-primary:#0a0a0f;--bg-secondary:#12121a;--text-primary:#fff;--text-secondary:#a1a1aa;--accent-1:#6366f1;--accent-2:#8b5cf6;--accent-3:#06b6d4;--gradient-1:linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#06b6d4 100%);--border-color:rgba(255,255,255,0.08)}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',-apple-system,sans-serif;background:var(--bg-primary);color:var(--text-primary);width:${WIDTH}px;height:${HEIGHT}px;display:flex;align-items:center;justify-content:center;overflow:hidden}
.ad-card{background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:24px;overflow:hidden;width:920px;position:relative;box-shadow:0 0 80px rgba(99,102,241,0.12)}
.ad-inner{padding:56px;min-height:420px;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden}
.ad-badge{display:inline-flex;align-items:center;gap:6px;font-size:.75rem;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:var(--accent-3);background:rgba(6,182,212,0.1);border:1px solid rgba(6,182,212,0.2);padding:8px 18px;border-radius:100px;width:fit-content;margin-bottom:16px}
.ad-industry{font-size:.85rem;font-weight:600;text-transform:uppercase;letter-spacing:2px;color:var(--text-secondary);margin-bottom:10px}
.ad-headline{font-size:2.4rem;font-weight:800;line-height:1.15;margin-bottom:16px}
.ad-headline .gradient-text{background:var(--gradient-1);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.ad-body{color:var(--text-secondary);font-size:1.05rem;line-height:1.7;margin-bottom:28px}
.ad-cta{display:inline-flex;align-items:center;gap:8px;padding:14px 34px;background:var(--gradient-1);color:#fff;font-weight:600;font-size:1rem;border-radius:100px;text-decoration:none;width:fit-content;border:none}
.ad-cta-outline{background:transparent;border:1px solid rgba(99,102,241,0.4);color:var(--accent-1)}
.ad-icon{font-size:3rem;margin-bottom:14px}
.ad-footer{display:flex;align-items:center;justify-content:space-between;padding:20px 56px;border-top:1px solid var(--border-color);background:rgba(255,255,255,0.02)}
.ad-footer-logo{font-weight:700;font-size:1rem;background:var(--gradient-1);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.ad-footer-url{font-size:.9rem;color:var(--text-secondary)}
.deco-grid{position:absolute;top:0;right:0;width:250px;height:250px;background-image:linear-gradient(rgba(99,102,241,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.06) 1px,transparent 1px);background-size:20px 20px;pointer-events:none}
.deco-gradient-blur{position:absolute;width:250px;height:250px;border-radius:50%;filter:blur(80px);pointer-events:none;opacity:0.4}
.stats-row{display:flex;gap:32px;margin-bottom:24px}
.stat-item{text-align:center}
.stat-number{font-size:1.7rem;font-weight:800;background:var(--gradient-1);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.stat-label{font-size:.75rem;color:var(--text-secondary);text-transform:uppercase;letter-spacing:1px}
.feature-list{list-style:none;margin-bottom:24px}
.feature-list li{padding:7px 0;color:var(--text-secondary);font-size:1rem;display:flex;align-items:center;gap:10px}
.feature-list li::before{content:'→';color:var(--accent-3);font-weight:700}
.quote-block{border-left:3px solid;border-image:var(--gradient-1) 1;padding-left:20px;margin-bottom:24px}
.quote-block p{color:var(--text-secondary);font-style:italic;font-size:1rem;line-height:1.6}
.quote-block .author{color:var(--text-primary);font-style:normal;font-weight:600;font-size:.9rem;margin-top:8px}
.cta-row{display:flex;gap:14px;flex-wrap:wrap}
.price-tag{display:inline-block;font-size:2rem;font-weight:800;background:var(--gradient-1);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
</style></head><body>${cardHtml}</body></html>`;
}

run().catch(console.error);
