const puppeteer = require('puppeteer');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'logo-animations');
const FPS = 30;
const DURATION = 4;
const TOTAL_FRAMES = FPS * DURATION;
const W = 1080, H = 1080;

if (fs.existsSync(OUT)) fs.rmSync(OUT, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });

const ease = t => t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
const clamp = (v,a,b) => Math.min(b, Math.max(a, v));

// Each logo gets its own animated HTML with a `setProgress(p)` function
const logos = {
    circuit: {
        html: () => `
        <div id="scene">
            <svg id="icon" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs><linearGradient id="g" x1="0" y1="0" x2="52" y2="52" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#6366f1"/><stop offset="50%" stop-color="#8b5cf6"/><stop offset="100%" stop-color="#06b6d4"/></linearGradient></defs>
                <rect width="52" height="52" rx="12" fill="url(#g)" id="bg"/>
                <path id="wline" d="M12 16L18 36L26 22L34 36L40 16" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                <circle class="node" cx="12" cy="16" r="2.5" fill="white"/>
                <circle class="node" cx="18" cy="36" r="2.5" fill="white"/>
                <circle class="node" cx="26" cy="22" r="2.5" fill="white"/>
                <circle class="node" cx="34" cy="36" r="2.5" fill="white"/>
                <circle class="node" cx="40" cy="16" r="2.5" fill="white"/>
                <line class="trace" x1="12" y1="16" x2="6" y2="16" stroke="white" stroke-width="1.5" opacity="0.4"/>
                <line class="trace" x1="40" y1="16" x2="46" y2="16" stroke="white" stroke-width="1.5" opacity="0.4"/>
                <line class="trace" x1="26" y1="22" x2="26" y2="12" stroke="white" stroke-width="1.5" opacity="0.4"/>
                <circle class="tracedot" cx="6" cy="16" r="1.5" fill="white" opacity="0.4"/>
                <circle class="tracedot" cx="46" cy="16" r="1.5" fill="white" opacity="0.4"/>
                <circle class="tracedot" cx="26" cy="12" r="1.5" fill="white" opacity="0.4"/>
            </svg>
            <div id="textWrap">
                <div id="mainText">Williams Digital</div>
                <div id="subText">Building Digital Experiences</div>
            </div>
            <div id="glow"></div>
        </div>`,
        style: `
            #scene{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:40px;width:100%;height:100%;position:relative}
            #icon{width:200px;height:200px}
            #textWrap{text-align:center}
            #mainText{font-size:3.2rem;font-weight:800;letter-spacing:-1px;background:linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
            #subText{font-size:1rem;font-weight:500;color:#a1a1aa;letter-spacing:4px;text-transform:uppercase;margin-top:8px}
            #glow{position:absolute;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(99,102,241,0.3),transparent 70%);filter:blur(40px);pointer-events:none}
        `,
        animate: `(p) => {
            const ease = t => t<0.5?2*t*t:-1+(4-2*t)*t;
            const cl = (v,a,b) => Math.min(b,Math.max(a,v));

            const bgP = ease(cl(p/0.15,0,1));
            const iconP = ease(cl((p-0.05)/0.2,0,1));
            const wP = cl((p-0.1)/0.25,0,1);
            const nodeP = ease(cl((p-0.25)/0.15,0,1));
            const traceP = ease(cl((p-0.35)/0.15,0,1));
            const textP = ease(cl((p-0.4)/0.2,0,1));
            const subP = ease(cl((p-0.55)/0.15,0,1));
            const glowP = cl((p-0.3)/0.7,0,1);

            const icon = document.getElementById('icon');
            const bg = document.getElementById('bg');
            icon.style.opacity = iconP;
            icon.style.transform = 'scale('+(0.6+iconP*0.4)+') rotate('+(1-iconP)*-10+'deg)';

            // W line draw
            const wline = document.getElementById('wline');
            const len = 95;
            wline.setAttribute('stroke-dasharray', len);
            wline.setAttribute('stroke-dashoffset', len*(1-wP));

            // Nodes pop in
            document.querySelectorAll('.node').forEach((n,i) => {
                const d = ease(cl((p-0.2-i*0.03)/0.1,0,1));
                n.style.opacity = d;
                n.setAttribute('r', 2.5*d);
            });

            // Traces
            document.querySelectorAll('.trace').forEach(t => { t.style.opacity = traceP*0.4; });
            document.querySelectorAll('.tracedot').forEach(t => { t.style.opacity = traceP*0.4; });

            // Text
            const mt = document.getElementById('mainText');
            mt.style.opacity = textP;
            mt.style.transform = 'translateY('+(1-textP)*20+'px)';

            const st = document.getElementById('subText');
            st.style.opacity = subP;
            st.style.transform = 'translateY('+(1-subP)*15+'px)';

            // Glow
            const glow = document.getElementById('glow');
            glow.style.opacity = glowP*0.6;
            const pulse = 1+Math.sin(p*Math.PI*4)*0.1;
            glow.style.transform = 'scale('+pulse+')';
        }`
    },
    pixel: {
        html: () => `
        <div id="scene">
            <svg id="icon" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs><linearGradient id="g" x1="0" y1="0" x2="52" y2="52" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#6366f1"/><stop offset="50%" stop-color="#8b5cf6"/><stop offset="100%" stop-color="#06b6d4"/></linearGradient></defs>
                <rect width="52" height="52" rx="12" fill="url(#g)"/>
                <rect class="px" x="8" y="12" width="5" height="5" rx="1" fill="white"/>
                <rect class="px" x="39" y="12" width="5" height="5" rx="1" fill="white"/>
                <rect class="px" x="10" y="19" width="5" height="5" rx="1" fill="white"/>
                <rect class="px" x="37" y="19" width="5" height="5" rx="1" fill="white"/>
                <rect class="px" x="12" y="26" width="5" height="5" rx="1" fill="white"/>
                <rect class="px" x="22" y="26" width="5" height="5" rx="1" fill="white" opacity="0.7"/>
                <rect class="px" x="25" y="26" width="5" height="5" rx="1" fill="white" opacity="0.7"/>
                <rect class="px" x="35" y="26" width="5" height="5" rx="1" fill="white"/>
                <rect class="px" x="14" y="33" width="5" height="5" rx="1" fill="white"/>
                <rect class="px" x="20" y="33" width="5" height="5" rx="1" fill="white"/>
                <rect class="px" x="27" y="33" width="5" height="5" rx="1" fill="white"/>
                <rect class="px" x="33" y="33" width="5" height="5" rx="1" fill="white"/>
                <rect class="px" x="17" y="40" width="5" height="5" rx="1" fill="white" opacity="0.8"/>
                <rect class="px" x="30" y="40" width="5" height="5" rx="1" fill="white" opacity="0.8"/>
                <!-- Scanlines -->
                <rect id="scan" x="0" y="0" width="52" height="3" fill="rgba(255,255,255,0.12)"/>
            </svg>
            <div id="textWrap">
                <div id="mainText">Williams Digital</div>
                <div id="subText">Building Digital Experiences</div>
            </div>
            <div id="glow"></div>
        </div>`,
        style: `
            #scene{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:40px;width:100%;height:100%;position:relative}
            #icon{width:200px;height:200px}
            #textWrap{text-align:center}
            #mainText{font-size:3.2rem;font-weight:800;letter-spacing:-1px;background:linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
            #subText{font-size:1rem;font-weight:500;color:#a1a1aa;letter-spacing:4px;text-transform:uppercase;margin-top:8px}
            #glow{position:absolute;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(139,92,246,0.3),transparent 70%);filter:blur(40px);pointer-events:none}
        `,
        animate: `(p) => {
            const ease = t => t<0.5?2*t*t:-1+(4-2*t)*t;
            const cl = (v,a,b) => Math.min(b,Math.max(a,v));

            const iconP = ease(cl(p/0.15,0,1));
            const icon = document.getElementById('icon');
            icon.style.opacity = iconP;
            icon.style.transform = 'scale('+(0.7+iconP*0.3)+')';

            // Pixels pop in one by one
            document.querySelectorAll('.px').forEach((px, i) => {
                const d = ease(cl((p-0.08-i*0.025)/0.08,0,1));
                px.style.opacity = d * parseFloat(px.getAttribute('opacity')||'1');
                px.style.transform = 'scale('+d+')';
                px.style.transformOrigin = 'center';
            });

            // Scanline sweeps down
            const scan = document.getElementById('scan');
            const scanY = (p * 80) % 52;
            scan.setAttribute('y', scanY);
            scan.style.opacity = cl(p/0.2,0,1) * 0.12;

            // Text
            const textP = ease(cl((p-0.45)/0.2,0,1));
            const mt = document.getElementById('mainText');
            mt.style.opacity = textP;
            mt.style.transform = 'translateY('+(1-textP)*20+'px)';

            const subP = ease(cl((p-0.6)/0.15,0,1));
            const st = document.getElementById('subText');
            st.style.opacity = subP;
            st.style.transform = 'translateY('+(1-subP)*15+'px)';

            const glow = document.getElementById('glow');
            const glowP = cl((p-0.3)/0.7,0,1);
            glow.style.opacity = glowP*0.5;
        }`
    },
    monogram: {
        html: () => `
        <div id="scene">
            <svg id="icon" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs><linearGradient id="g" x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#6366f1"/><stop offset="50%" stop-color="#8b5cf6"/><stop offset="100%" stop-color="#06b6d4"/></linearGradient></defs>
                <rect width="56" height="56" rx="14" fill="url(#g)"/>
                <path id="wpath" d="M10 14L17 42L28 24L39 42L46 14" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                <line id="dstem" x1="46" y1="14" x2="46" y2="42" stroke="white" stroke-width="2.5" stroke-linecap="round" opacity="0.6"/>
                <path id="dcurve" d="M46 14C52 14 54 22 54 28C54 34 52 42 46 42" stroke="white" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.6"/>
                <circle class="ddot" cx="53" cy="21" r="1.5" fill="white" opacity="0.5"/>
                <circle class="ddot" cx="54.5" cy="28" r="1.5" fill="white" opacity="0.5"/>
                <circle class="ddot" cx="53" cy="35" r="1.5" fill="white" opacity="0.5"/>
                <line id="ctrace" x1="28" y1="24" x2="28" y2="10" stroke="white" stroke-width="1.5" opacity="0.3"/>
                <circle id="cdot" cx="28" cy="10" r="1.5" fill="white" opacity="0.3"/>
            </svg>
            <div id="textWrap">
                <div id="mainText">Williams Digital</div>
                <div id="subText">Building Digital Experiences</div>
            </div>
            <div id="glow"></div>
        </div>`,
        style: `
            #scene{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:40px;width:100%;height:100%;position:relative}
            #icon{width:200px;height:200px}
            #textWrap{text-align:center}
            #mainText{font-size:3.2rem;font-weight:800;letter-spacing:-1px;background:linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
            #subText{font-size:1rem;font-weight:500;color:#a1a1aa;letter-spacing:4px;text-transform:uppercase;margin-top:8px}
            #glow{position:absolute;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(6,182,212,0.3),transparent 70%);filter:blur(40px);pointer-events:none}
        `,
        animate: `(p) => {
            const ease = t => t<0.5?2*t*t:-1+(4-2*t)*t;
            const cl = (v,a,b) => Math.min(b,Math.max(a,v));

            // Icon scale in
            const iconP = ease(cl(p/0.15,0,1));
            const icon = document.getElementById('icon');
            icon.style.opacity = iconP;
            icon.style.transform = 'scale('+(0.6+iconP*0.4)+')';

            // W draws in
            const wP = cl((p-0.08)/0.25,0,1);
            const wp = document.getElementById('wpath');
            wp.setAttribute('stroke-dasharray','110');
            wp.setAttribute('stroke-dashoffset', 110*(1-wP));

            // D stem draws down
            const dP = cl((p-0.3)/0.15,0,1);
            const ds = document.getElementById('dstem');
            ds.setAttribute('stroke-dasharray','28');
            ds.setAttribute('stroke-dashoffset', 28*(1-dP));
            ds.style.opacity = dP*0.6;

            // D curve draws
            const dcP = cl((p-0.4)/0.15,0,1);
            const dc = document.getElementById('dcurve');
            dc.setAttribute('stroke-dasharray','50');
            dc.setAttribute('stroke-dashoffset', 50*(1-dcP));
            dc.style.opacity = dcP*0.6;

            // D dots pop
            document.querySelectorAll('.ddot').forEach((d,i) => {
                const dd = ease(cl((p-0.48-i*0.04)/0.08,0,1));
                d.style.opacity = dd*0.5;
                d.setAttribute('r', 1.5*dd);
            });

            // Center trace
            const tP = ease(cl((p-0.55)/0.1,0,1));
            document.getElementById('ctrace').style.opacity = tP*0.3;
            document.getElementById('cdot').style.opacity = tP*0.3;

            // Text
            const textP = ease(cl((p-0.5)/0.2,0,1));
            const mt = document.getElementById('mainText');
            mt.style.opacity = textP;
            mt.style.transform = 'translateY('+(1-textP)*20+'px)';

            const subP = ease(cl((p-0.65)/0.15,0,1));
            const st = document.getElementById('subText');
            st.style.opacity = subP;

            const glow = document.getElementById('glow');
            glow.style.opacity = cl((p-0.3)/0.7,0,1)*0.5;
        }`
    }
};

async function run() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: W, height: H });

    for (const [name, logo] of Object.entries(logos)) {
        console.log(`Rendering ${name}...`);

        const frameDir = path.join(OUT, `${name}-frames`);
        fs.mkdirSync(frameDir, { recursive: true });

        const fullHtml = `<!DOCTYPE html><html><head>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
            <style>*{margin:0;padding:0;box-sizing:border-box}body{width:${W}px;height:${H}px;background:#0a0a0f;font-family:Inter,-apple-system,sans-serif;overflow:hidden;display:flex;align-items:center;justify-content:center}${logo.style}</style>
            </head><body>${logo.html()}</body></html>`;

        await page.setContent(fullHtml, { waitUntil: 'networkidle0' });

        for (let f = 0; f < TOTAL_FRAMES; f++) {
            const p = f / TOTAL_FRAMES;
            await page.evaluate(new Function('p', `return (${logo.animate})(p)`), p);
            await page.screenshot({ path: path.join(frameDir, `f_${String(f).padStart(4,'0')}.png`) });
        }

        // Encode MP4
        const mp4 = path.join(OUT, `${name}-animated.mp4`);
        execSync(`ffmpeg -y -framerate ${FPS} -i "${frameDir}/f_%04d.png" -c:v libx264 -pix_fmt yuv420p -preset fast -crf 18 "${mp4}" 2>/dev/null`);
        console.log(`  ✓ ${mp4}`);

        // Clean frames
        fs.rmSync(frameDir, { recursive: true });
    }

    await browser.close();
    console.log(`\nDone! Animated logos in: ${OUT}/`);
}

run().catch(console.error);
