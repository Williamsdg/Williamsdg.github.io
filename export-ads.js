const puppeteer = require('puppeteer');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, 'ad-videos');
const FRAMES_DIR = path.join(__dirname, 'ad-frames');
const HTML_FILE = path.join(__dirname, 'ads.html');
const FPS = 30;
const DURATION = 6; // seconds per ad
const WIDTH = 1080;
const HEIGHT = 1080;
const TOTAL_FRAMES = FPS * DURATION;

const AD_LABELS = [
    'restaurant', 'real-estate', 'fitness', 'law-firm', 'healthcare',
    'ecommerce', 'construction', 'salon-spa', 'automotive', 'photography',
    'accounting', 'dental', 'landscaping', 'coffee-shop', 'tech-startup',
    'wedding-events', 'pet-services', 'education', 'home-services', 'architecture'
];

async function run() {
    // Clean up and create dirs
    if (fs.existsSync(FRAMES_DIR)) fs.rmSync(FRAMES_DIR, { recursive: true });
    if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);
    fs.mkdirSync(FRAMES_DIR);

    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: WIDTH, height: HEIGHT });

    // Load a single-ad template for each card
    for (let i = 0; i < 20; i++) {
        const label = AD_LABELS[i];
        const frameDir = path.join(FRAMES_DIR, label);
        fs.mkdirSync(frameDir);

        console.log(`[${i + 1}/20] Rendering: ${label}`);

        // Build a standalone page for this single ad
        const adHtml = buildSingleAdPage(i);
        await page.setContent(adHtml, { waitUntil: 'networkidle0' });
        await page.waitForSelector('.ad-card');

        // Capture frames with animation progression
        for (let f = 0; f < TOTAL_FRAMES; f++) {
            const progress = f / TOTAL_FRAMES;

            await page.evaluate((p) => {
                const card = document.querySelector('.ad-card');
                const inner = document.querySelector('.ad-inner');
                const headline = document.querySelector('.ad-headline');
                const body = document.querySelector('.ad-body');
                const cta = document.querySelector('.ad-cta');
                const icon = document.querySelector('.ad-icon');
                const badge = document.querySelector('.ad-badge');
                const footer = document.querySelector('.ad-footer');
                const extras = document.querySelectorAll('.stats-row, .feature-list, .quote-block');
                const glow = document.querySelector('.deco-gradient-blur');
                const industry = document.querySelector('.ad-industry');

                // Phase timing
                const fadeIn = Math.min(p / 0.15, 1);          // 0-15%: card fades in
                const contentIn = Math.max(0, Math.min((p - 0.1) / 0.15, 1));  // 10-25%
                const headIn = Math.max(0, Math.min((p - 0.15) / 0.15, 1));    // 15-30%
                const bodyIn = Math.max(0, Math.min((p - 0.25) / 0.15, 1));    // 25-40%
                const extrasIn = Math.max(0, Math.min((p - 0.35) / 0.15, 1));  // 35-50%
                const ctaIn = Math.max(0, Math.min((p - 0.45) / 0.15, 1));     // 45-60%
                const footerIn = Math.max(0, Math.min((p - 0.55) / 0.1, 1));   // 55-65%
                const shimmer = Math.max(0, (p - 0.7) / 0.3);                   // 70-100%: glow pulse

                // Easing
                const ease = t => t < 0.5 ? 2*t*t : -1+(4-2*t)*t;

                // Card
                card.style.opacity = ease(fadeIn);
                card.style.transform = `translateY(${(1 - ease(fadeIn)) * 40}px)`;

                // Icon / Badge
                if (icon) {
                    icon.style.opacity = ease(contentIn);
                    icon.style.transform = `scale(${0.5 + ease(contentIn) * 0.5})`;
                }
                if (badge) {
                    badge.style.opacity = ease(contentIn);
                    badge.style.transform = `translateX(${(1 - ease(contentIn)) * -20}px)`;
                }

                // Industry label
                if (industry) {
                    industry.style.opacity = ease(contentIn);
                }

                // Headline
                if (headline) {
                    headline.style.opacity = ease(headIn);
                    headline.style.transform = `translateY(${(1 - ease(headIn)) * 20}px)`;
                }

                // Body
                if (body) {
                    body.style.opacity = ease(bodyIn);
                    body.style.transform = `translateY(${(1 - ease(bodyIn)) * 15}px)`;
                }

                // Extras (stats, features, quotes)
                extras.forEach(el => {
                    el.style.opacity = ease(extrasIn);
                    el.style.transform = `translateY(${(1 - ease(extrasIn)) * 15}px)`;
                });

                // CTA
                if (cta) {
                    cta.style.opacity = ease(ctaIn);
                    cta.style.transform = `translateY(${(1 - ease(ctaIn)) * 10}px)`;
                }
                // Also handle cta-row
                const ctaRow = document.querySelector('.cta-row');
                if (ctaRow) {
                    ctaRow.style.opacity = ease(ctaIn);
                    ctaRow.style.transform = `translateY(${(1 - ease(ctaIn)) * 10}px)`;
                }

                // Footer
                if (footer) {
                    footer.style.opacity = ease(footerIn);
                }

                // Glow animation
                if (glow) {
                    const pulseScale = 1 + Math.sin(shimmer * Math.PI * 2) * 0.15;
                    glow.style.transform = `scale(${pulseScale})`;
                    glow.style.opacity = 0.3 + shimmer * 0.3;
                }
            }, progress);

            const framePath = path.join(frameDir, `frame_${String(f).padStart(4, '0')}.png`);
            await page.screenshot({ path: framePath, type: 'png' });
        }

        // Encode to MP4 with ffmpeg
        const outputPath = path.join(OUTPUT_DIR, `ad-${String(i + 1).padStart(2, '0')}-${label}.mp4`);
        await encode(frameDir, outputPath);
        console.log(`  ✓ Exported: ${outputPath}`);

        // Clean up frames
        fs.rmSync(frameDir, { recursive: true });
    }

    await browser.close();
    fs.rmSync(FRAMES_DIR, { recursive: true, force: true });
    console.log(`\nDone! All 20 ads exported to: ${OUTPUT_DIR}`);
}

function encode(frameDir, outputPath) {
    return new Promise((resolve, reject) => {
        const cmd = `ffmpeg -y -framerate ${FPS} -i "${frameDir}/frame_%04d.png" -c:v libx264 -pix_fmt yuv420p -preset fast -crf 18 -vf "scale=${WIDTH}:${HEIGHT}" "${outputPath}"`;
        exec(cmd, (err, stdout, stderr) => {
            if (err) { console.error(stderr); reject(err); }
            else resolve();
        });
    });
}

function buildSingleAdPage(index) {
    // Read the original HTML, extract the nth ad-card, and wrap it in a standalone page
    const fullHtml = fs.readFileSync(HTML_FILE, 'utf-8');

    // Extract all ad cards
    const cardRegex = /<!-- \d+\. [\s\S]*?<div class="ad-card">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/g;
    const cards = [];
    // Simpler: split by ad-card divs
    const parts = fullHtml.split('<div class="ad-card">');
    // parts[0] is before first card, parts[1..20] are the cards
    const cardContent = parts[index + 1];
    if (!cardContent) return '';

    // Find where this card ends (before the next card or end of grid)
    const cardHtml = '<div class="ad-card">' + cardContent.split('</div>\n\n')[0] + '</div>';

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=${WIDTH}, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-primary: #0a0a0f;
            --bg-secondary: #12121a;
            --text-primary: #ffffff;
            --text-secondary: #a1a1aa;
            --accent-1: #6366f1;
            --accent-2: #8b5cf6;
            --accent-3: #06b6d4;
            --gradient-1: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%);
            --border-color: rgba(255, 255, 255, 0.08);
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', -apple-system, sans-serif;
            background: var(--bg-primary);
            color: var(--text-primary);
            width: ${WIDTH}px;
            height: ${HEIGHT}px;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }
        .ad-card {
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 24px;
            overflow: hidden;
            width: 920px;
            position: relative;
            box-shadow: 0 0 80px rgba(99, 102, 241, 0.12);
        }
        .ad-inner {
            padding: 56px;
            min-height: 420px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative;
            overflow: hidden;
        }
        .ad-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: var(--accent-3);
            background: rgba(6, 182, 212, 0.1);
            border: 1px solid rgba(6, 182, 212, 0.2);
            padding: 8px 18px;
            border-radius: 100px;
            width: fit-content;
            margin-bottom: 16px;
        }
        .ad-industry {
            font-size: 0.85rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: var(--text-secondary);
            margin-bottom: 10px;
        }
        .ad-headline {
            font-size: 2.4rem;
            font-weight: 800;
            line-height: 1.15;
            margin-bottom: 16px;
        }
        .ad-headline .gradient-text {
            background: var(--gradient-1);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .ad-body {
            color: var(--text-secondary);
            font-size: 1.05rem;
            line-height: 1.7;
            margin-bottom: 28px;
        }
        .ad-cta {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 14px 34px;
            background: var(--gradient-1);
            color: white;
            font-weight: 600;
            font-size: 1rem;
            border-radius: 100px;
            text-decoration: none;
            width: fit-content;
            border: none;
        }
        .ad-cta-outline {
            background: transparent;
            border: 1px solid rgba(99, 102, 241, 0.4);
            color: var(--accent-1);
        }
        .ad-icon { font-size: 3rem; margin-bottom: 14px; }
        .ad-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20px 56px;
            border-top: 1px solid var(--border-color);
            background: rgba(255, 255, 255, 0.02);
        }
        .ad-footer-logo {
            font-weight: 700;
            font-size: 1rem;
            background: var(--gradient-1);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .ad-footer-url {
            font-size: 0.9rem;
            color: var(--text-secondary);
        }
        .deco-circle { position: absolute; border-radius: 50%; pointer-events: none; }
        .deco-grid {
            position: absolute; top: 0; right: 0;
            width: 250px; height: 250px;
            background-image:
                linear-gradient(rgba(99, 102, 241, 0.06) 1px, transparent 1px),
                linear-gradient(90deg, rgba(99, 102, 241, 0.06) 1px, transparent 1px);
            background-size: 20px 20px;
            pointer-events: none;
        }
        .deco-gradient-blur {
            position: absolute;
            width: 250px; height: 250px;
            border-radius: 50%;
            filter: blur(80px);
            pointer-events: none;
            opacity: 0.4;
        }
        .stats-row { display: flex; gap: 32px; margin-bottom: 24px; }
        .stat-item { text-align: center; }
        .stat-number {
            font-size: 1.7rem; font-weight: 800;
            background: var(--gradient-1);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .stat-label { font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 1px; }
        .feature-list { list-style: none; margin-bottom: 24px; }
        .feature-list li {
            padding: 7px 0; color: var(--text-secondary); font-size: 1rem;
            display: flex; align-items: center; gap: 10px;
        }
        .feature-list li::before { content: '→'; color: var(--accent-3); font-weight: 700; }
        .quote-block {
            border-left: 3px solid; border-image: var(--gradient-1) 1;
            padding-left: 20px; margin-bottom: 24px;
        }
        .quote-block p { color: var(--text-secondary); font-style: italic; font-size: 1rem; line-height: 1.6; }
        .quote-block .author { color: var(--text-primary); font-style: normal; font-weight: 600; font-size: 0.9rem; margin-top: 8px; }
        .cta-row { display: flex; gap: 14px; flex-wrap: wrap; }
    </style>
</head>
<body>
    ${cardHtml.includes('</div>') ? cardHtml : cardHtml + '</div></div></div>'}
</body>
</html>`;
}

run().catch(console.error);
