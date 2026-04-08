const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'logo-exports');

// 4 icon marks
const marks = {
    circuit: `<svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs><linearGradient id="g" x1="0" y1="0" x2="52" y2="52" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#6366f1"/><stop offset="50%" stop-color="#8b5cf6"/><stop offset="100%" stop-color="#06b6d4"/></linearGradient></defs>
        <rect width="52" height="52" rx="12" fill="url(#g)"/>
        <path d="M12 16L18 36L26 22L34 36L40 16" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <circle cx="12" cy="16" r="2.5" fill="white"/><circle cx="18" cy="36" r="2.5" fill="white"/><circle cx="26" cy="22" r="2.5" fill="white"/><circle cx="34" cy="36" r="2.5" fill="white"/><circle cx="40" cy="16" r="2.5" fill="white"/>
        <line x1="12" y1="16" x2="6" y2="16" stroke="white" stroke-width="1.5" opacity="0.4"/><line x1="40" y1="16" x2="46" y2="16" stroke="white" stroke-width="1.5" opacity="0.4"/><line x1="26" y1="22" x2="26" y2="12" stroke="white" stroke-width="1.5" opacity="0.4"/>
        <circle cx="6" cy="16" r="1.5" fill="white" opacity="0.4"/><circle cx="46" cy="16" r="1.5" fill="white" opacity="0.4"/><circle cx="26" cy="12" r="1.5" fill="white" opacity="0.4"/>
    </svg>`,
    monogram: `<svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs><linearGradient id="g" x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#6366f1"/><stop offset="50%" stop-color="#8b5cf6"/><stop offset="100%" stop-color="#06b6d4"/></linearGradient></defs>
        <rect width="56" height="56" rx="14" fill="url(#g)"/>
        <path d="M11 15L17.5 41L28 23L38.5 41L45 15" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <path d="M28 10C38 10 46 18 46 28C46 38 38 46 28 46" stroke="white" stroke-width="2" stroke-linecap="round" opacity="0.5" fill="none"/>
        <circle cx="36" cy="11.5" r="2" fill="white" opacity="0.7"/><circle cx="44" cy="20" r="2" fill="white" opacity="0.7"/><circle cx="44" cy="36" r="2" fill="white" opacity="0.7"/><circle cx="36" cy="44.5" r="2" fill="white" opacity="0.7"/>
    </svg>`,
    pixel: `<svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs><linearGradient id="g" x1="0" y1="0" x2="52" y2="52" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#6366f1"/><stop offset="50%" stop-color="#8b5cf6"/><stop offset="100%" stop-color="#06b6d4"/></linearGradient></defs>
        <rect width="52" height="52" rx="12" fill="url(#g)"/>
        <rect x="8" y="12" width="5" height="5" rx="1" fill="white"/><rect x="39" y="12" width="5" height="5" rx="1" fill="white"/>
        <rect x="10" y="19" width="5" height="5" rx="1" fill="white"/><rect x="37" y="19" width="5" height="5" rx="1" fill="white"/>
        <rect x="12" y="26" width="5" height="5" rx="1" fill="white"/><rect x="22" y="26" width="5" height="5" rx="1" fill="white" opacity="0.7"/><rect x="25" y="26" width="5" height="5" rx="1" fill="white" opacity="0.7"/><rect x="35" y="26" width="5" height="5" rx="1" fill="white"/>
        <rect x="14" y="33" width="5" height="5" rx="1" fill="white"/><rect x="20" y="33" width="5" height="5" rx="1" fill="white"/><rect x="27" y="33" width="5" height="5" rx="1" fill="white"/><rect x="33" y="33" width="5" height="5" rx="1" fill="white"/>
        <rect x="17" y="40" width="5" height="5" rx="1" fill="white" opacity="0.8"/><rect x="30" y="40" width="5" height="5" rx="1" fill="white" opacity="0.8"/>
    </svg>`,
    codepulse: `<svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs><linearGradient id="g" x1="0" y1="0" x2="52" y2="52" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#6366f1"/><stop offset="50%" stop-color="#8b5cf6"/><stop offset="100%" stop-color="#06b6d4"/></linearGradient></defs>
        <rect width="52" height="52" rx="12" fill="url(#g)"/>
        <path d="M18 16L10 26L18 36" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <path d="M34 16L42 26L34 36" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <path d="M20 26L23 26L25 19L27 33L29 26L32 26" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <rect x="22" y="40" width="8" height="2" rx="1" fill="white" opacity="0.5"/>
    </svg>`
};

// Platform sizes
const sizes = [
    { name: 'favicon-16', w: 16, h: 16, type: 'icon' },
    { name: 'favicon-32', w: 32, h: 32, type: 'icon' },
    { name: 'favicon-48', w: 48, h: 48, type: 'icon' },
    { name: 'apple-touch-180', w: 180, h: 180, type: 'icon' },
    { name: 'android-192', w: 192, h: 192, type: 'icon' },
    { name: 'android-512', w: 512, h: 512, type: 'icon' },
    { name: 'og-image-1200x630', w: 1200, h: 630, type: 'horizontal' },
    { name: 'twitter-card-1200x675', w: 1200, h: 675, type: 'horizontal' },
    { name: 'instagram-profile-320', w: 320, h: 320, type: 'icon' },
    { name: 'facebook-profile-170', w: 170, h: 170, type: 'icon' },
    { name: 'linkedin-logo-300', w: 300, h: 300, type: 'icon' },
    { name: 'linkedin-banner-1584x396', w: 1584, h: 396, type: 'banner' },
    { name: 'youtube-profile-800', w: 800, h: 800, type: 'icon' },
    { name: 'youtube-banner-2560x1440', w: 2560, h: 1440, type: 'banner' },
    { name: 'twitter-profile-400', w: 400, h: 400, type: 'icon' },
    { name: 'twitter-header-1500x500', w: 1500, h: 500, type: 'banner' },
    { name: 'email-signature-600x200', w: 600, h: 200, type: 'horizontal' },
];

function buildIconPage(svg, w, h) {
    return `<html><head><style>*{margin:0;padding:0}body{width:${w}px;height:${h}px;display:flex;align-items:center;justify-content:center;background:#0a0a0f;overflow:hidden}svg{width:${Math.round(w*0.85)}px;height:${Math.round(h*0.85)}px}</style></head><body>${svg}</body></html>`;
}

function buildHorizontalPage(svg, w, h) {
    const iconSz = Math.round(h * 0.45);
    const fontSize = Math.round(h * 0.12);
    return `<html><head>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@800&display=swap" rel="stylesheet">
    <style>*{margin:0;padding:0}body{width:${w}px;height:${h}px;display:flex;align-items:center;justify-content:center;gap:${Math.round(h*0.08)}px;background:#0a0a0f;overflow:hidden;font-family:Inter,sans-serif}
    svg{width:${iconSz}px;height:${iconSz}px}
    .text{font-size:${fontSize}px;font-weight:800;background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#06b6d4 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent}</style></head>
    <body>${svg}<div class="text">Williams Digital</div></body></html>`;
}

function buildBannerPage(svg, w, h) {
    const iconSz = Math.round(h * 0.3);
    const fontSize = Math.round(h * 0.09);
    const subSize = Math.round(h * 0.04);
    return `<html><head>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;800&display=swap" rel="stylesheet">
    <style>*{margin:0;padding:0}body{width:${w}px;height:${h}px;display:flex;align-items:center;justify-content:center;gap:${Math.round(h*0.06)}px;background:#0a0a0f;overflow:hidden;font-family:Inter,sans-serif}
    svg{width:${iconSz}px;height:${iconSz}px}
    .wrap{display:flex;flex-direction:column;gap:4px}
    .text{font-size:${fontSize}px;font-weight:800;background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#06b6d4 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
    .sub{font-size:${subSize}px;font-weight:500;color:#a1a1aa;letter-spacing:4px;text-transform:uppercase}</style></head>
    <body>${svg}<div class="wrap"><div class="text">Williams Digital</div><div class="sub">Building Digital Experiences</div></div></body></html>`;
}

async function run() {
    if (fs.existsSync(OUT)) fs.rmSync(OUT, { recursive: true });
    fs.mkdirSync(OUT, { recursive: true });

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    for (const [markName, svg] of Object.entries(marks)) {
        const dir = path.join(OUT, markName);
        fs.mkdirSync(dir, { recursive: true });

        for (const size of sizes) {
            await page.setViewport({ width: size.w, height: size.h, deviceScaleFactor: 2 });

            let html;
            if (size.type === 'icon') html = buildIconPage(svg, size.w, size.h);
            else if (size.type === 'horizontal') html = buildHorizontalPage(svg, size.w, size.h);
            else html = buildBannerPage(svg, size.w, size.h);

            await page.setContent(html, { waitUntil: 'load' });

            const filePath = path.join(dir, `${markName}-${size.name}.png`);
            await page.screenshot({ path: filePath, type: 'png' });
            console.log(`  ${markName}/${size.name}`);
        }
    }

    // Also save raw SVGs
    const svgDir = path.join(OUT, 'svg');
    fs.mkdirSync(svgDir, { recursive: true });
    for (const [name, svg] of Object.entries(marks)) {
        fs.writeFileSync(path.join(svgDir, `${name}.svg`), svg.trim());
    }
    console.log('  SVGs saved');

    await browser.close();
    console.log('\nDone! All logos exported to: logo-exports/');
}

run().catch(console.error);
