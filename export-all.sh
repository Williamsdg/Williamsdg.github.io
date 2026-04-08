#!/bin/bash
set -e
cd "$(dirname "$0")"
mkdir -p ad-videos

CSS='<style>
:root{--bg-primary:#0a0a0f;--bg-secondary:#12121a;--text-primary:#fff;--text-secondary:#a1a1aa;--accent-1:#6366f1;--accent-2:#8b5cf6;--accent-3:#06b6d4;--gradient-1:linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#06b6d4 100%);--border-color:rgba(255,255,255,0.08)}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,sans-serif;background:var(--bg-primary);color:var(--text-primary);width:1080px;height:1080px;display:flex;align-items:center;justify-content:center;overflow:hidden}
.ad-card{background:var(--bg-secondary);border:1px solid var(--border-color);border-radius:24px;overflow:hidden;width:920px;box-shadow:0 0 80px rgba(99,102,241,0.12)}
.ad-inner{padding:56px;min-height:420px;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden}
.ad-badge{display:inline-flex;font-size:.75rem;font-weight:600;text-transform:uppercase;letter-spacing:1.5px;color:var(--accent-3);background:rgba(6,182,212,0.1);border:1px solid rgba(6,182,212,0.2);padding:8px 18px;border-radius:100px;width:fit-content;margin-bottom:16px}
.ad-industry{font-size:.85rem;font-weight:600;text-transform:uppercase;letter-spacing:2px;color:var(--text-secondary);margin-bottom:10px}
.ad-headline{font-size:2.4rem;font-weight:800;line-height:1.15;margin-bottom:16px}
.gradient-text{background:var(--gradient-1);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.ad-body{color:var(--text-secondary);font-size:1.05rem;line-height:1.7;margin-bottom:28px}
.ad-cta{display:inline-flex;padding:14px 34px;background:var(--gradient-1);color:#fff;font-weight:600;font-size:1rem;border-radius:100px;text-decoration:none;width:fit-content}
.ad-cta-outline{background:transparent;border:1px solid rgba(99,102,241,0.4);color:var(--accent-1)}
.ad-icon{font-size:3rem;margin-bottom:14px}
.ad-footer{display:flex;align-items:center;justify-content:space-between;padding:20px 56px;border-top:1px solid var(--border-color);background:rgba(255,255,255,0.02)}
.ad-footer-logo{font-weight:700;font-size:1rem;background:var(--gradient-1);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.ad-footer-url{font-size:.9rem;color:var(--text-secondary)}
.deco-gradient-blur{position:absolute;width:250px;height:250px;border-radius:50%;filter:blur(80px);pointer-events:none;opacity:0.4}
.deco-grid{position:absolute;top:0;right:0;width:250px;height:250px;background-image:linear-gradient(rgba(99,102,241,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.06) 1px,transparent 1px);background-size:20px 20px;pointer-events:none}
.stats-row{display:flex;gap:32px;margin-bottom:24px}
.stat-item{text-align:center}
.stat-number{font-size:1.7rem;font-weight:800;background:var(--gradient-1);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.stat-label{font-size:.75rem;color:var(--text-secondary);text-transform:uppercase;letter-spacing:1px}
.feature-list{list-style:none;margin-bottom:24px}
.feature-list li{padding:7px 0;color:var(--text-secondary);font-size:1rem;display:flex;align-items:center;gap:10px}
.feature-list li::before{content:"→";color:var(--accent-3);font-weight:700}
.quote-block{border-left:3px solid;border-image:var(--gradient-1) 1;padding-left:20px;margin-bottom:24px}
.quote-block p{color:var(--text-secondary);font-style:italic;font-size:1rem;line-height:1.6}
.quote-block .author{color:var(--text-primary);font-style:normal;font-weight:600;font-size:.9rem;margin-top:8px}
.cta-row{display:flex;gap:14px}
</style>'

render_ad() {
    local NUM="$1" NAME="$2" BODY="$3"
    local PNG="ad-videos/ad-${NUM}-${NAME}.png"
    local MP4="ad-videos/ad-${NUM}-${NAME}.mp4"

    echo "[${NUM}] ${NAME}..."

    node -e "
const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch({ headless: true });
  const p = await b.newPage();
  await p.setViewport({ width: 1080, height: 1080 });
  const html = \`<html><head>${CSS}</head><body>${BODY}</body></html>\`;
  await p.setContent(html, { waitUntil: 'load' });
  await p.screenshot({ path: '${PNG}' });
  await b.close();
})();
"

    ffmpeg -y -loop 1 -i "${PNG}" -c:v libx264 -t 6 -pix_fmt yuv420p -vf "fps=30,fade=in:0:30,fade=out:150:30" -preset fast -crf 18 "${MP4}" 2>/dev/null
    rm -f "${PNG}"
    echo "  ✓ ${MP4}"
}

# Ad 2: Real Estate
render_ad "02" "real-estate" "<div class='ad-card'><div class='ad-inner'><div class='deco-grid'></div><div><div class='ad-badge'>Featured</div><div class='ad-industry'>Real Estate</div><div class='ad-headline'>Listings That <span class='gradient-text'>Close Deals</span></div><p class='ad-body'>IDX integration, virtual tours, and lead capture built in. Give your properties the digital presence they deserve.</p><div class='stats-row'><div class='stat-item'><div class='stat-number'>3x</div><div class='stat-label'>More Leads</div></div><div class='stat-item'><div class='stat-number'>40%</div><div class='stat-label'>Faster Sales</div></div><div class='stat-item'><div class='stat-number'>24/7</div><div class='stat-label'>Availability</div></div></div></div><a class='ad-cta' href='#'>Start Your Project →</a></div><div class='ad-footer'><span class='ad-footer-logo'>Williams Digital</span><span class='ad-footer-url'>williamsdigital.io</span></div></div>"

# Ad 3: Fitness
render_ad "03" "fitness" "<div class='ad-card'><div class='ad-inner'><div class='deco-gradient-blur' style='bottom:-80px;left:-60px;background:var(--accent-3)'></div><div><div class='ad-icon'>💪</div><div class='ad-industry'>Fitness &amp; Wellness</div><div class='ad-headline'>Websites as Strong as<br><span class='gradient-text'>Your Brand</span></div><p class='ad-body'>Class scheduling, membership portals, and mobile-first design that keeps your gym at the top of its game.</p><ul class='feature-list'><li>Online class booking &amp; scheduling</li><li>Membership management portals</li><li>Mobile-optimized experience</li></ul></div><a class='ad-cta' href='#'>Get Started →</a></div><div class='ad-footer'><span class='ad-footer-logo'>Williams Digital</span><span class='ad-footer-url'>williamsdigital.io</span></div></div>"

# Ad 4: Law Firm
render_ad "04" "law-firm" "<div class='ad-card'><div class='ad-inner'><div class='deco-grid'></div><div><div class='ad-icon'>⚖️</div><div class='ad-industry'>Legal Services</div><div class='ad-headline'>Command <span class='gradient-text'>Authority</span> Online</div><p class='ad-body'>Your firm's reputation starts at the first click. We craft professional, trust-building websites with secure client portals and case inquiry forms.</p></div><div class='cta-row'><a class='ad-cta' href='#'>View Legal Sites →</a><a class='ad-cta ad-cta-outline' href='#'>Free Consult</a></div></div><div class='ad-footer'><span class='ad-footer-logo'>Williams Digital</span><span class='ad-footer-url'>williamsdigital.io</span></div></div>"

# Ad 5: Healthcare
render_ad "05" "healthcare" "<div class='ad-card'><div class='ad-inner'><div class='deco-gradient-blur' style='top:-40px;right:-80px;background:var(--accent-2)'></div><div><div class='ad-icon'>🏥</div><div class='ad-industry'>Healthcare &amp; Medical</div><div class='ad-headline'>Patient-First <span class='gradient-text'>Digital Care</span></div><p class='ad-body'>HIPAA-conscious design, appointment booking, patient portals, and telehealth integration. Modern healthcare deserves a modern web presence.</p><ul class='feature-list'><li>Online appointment scheduling</li><li>Patient portal integration</li><li>Accessible &amp; compliant design</li></ul></div><a class='ad-cta' href='#'>Learn More →</a></div><div class='ad-footer'><span class='ad-footer-logo'>Williams Digital</span><span class='ad-footer-url'>williamsdigital.io</span></div></div>"

# Ad 6: E-commerce
render_ad "06" "ecommerce" "<div class='ad-card'><div class='ad-inner'><div class='deco-grid'></div><div><div class='ad-badge'>E-Commerce</div><div class='ad-industry'>Retail &amp; Online Stores</div><div class='ad-headline'>Turn Clicks Into <span class='gradient-text'>Customers</span></div><p class='ad-body'>Custom storefronts, seamless checkout, inventory management, and conversion-optimized product pages that actually sell.</p><div class='stats-row'><div class='stat-item'><div class='stat-number'>85%</div><div class='stat-label'>Mobile Sales</div></div><div class='stat-item'><div class='stat-number'>2.5x</div><div class='stat-label'>Conversion</div></div><div class='stat-item'><div class='stat-number'>\$0</div><div class='stat-label'>Platform Fees</div></div></div></div><a class='ad-cta' href='#'>Build Your Store →</a></div><div class='ad-footer'><span class='ad-footer-logo'>Williams Digital</span><span class='ad-footer-url'>williamsdigital.io</span></div></div>"

# Ad 7: Construction
render_ad "07" "construction" "<div class='ad-card'><div class='ad-inner'><div class='deco-gradient-blur' style='bottom:-60px;right:-60px;background:var(--accent-1)'></div><div><div class='ad-icon'>🏗️</div><div class='ad-industry'>Construction &amp; Contracting</div><div class='ad-headline'>Build Your <span class='gradient-text'>Online Presence</span></div><p class='ad-body'>Project galleries, quote request forms, and service area maps. Show prospects the quality of your work before they ever pick up the phone.</p></div><div class='quote-block'><p>Our website from Williams Digital generates more leads than any other marketing we have done.</p><div class='author'>— Oakwood Builders</div></div><a class='ad-cta' href='#'>See Our Work →</a></div><div class='ad-footer'><span class='ad-footer-logo'>Williams Digital</span><span class='ad-footer-url'>williamsdigital.io</span></div></div>"

# Ad 8: Salon/Spa
render_ad "08" "salon-spa" "<div class='ad-card'><div class='ad-inner'><div class='deco-gradient-blur' style='top:-60px;left:-60px;background:var(--accent-2)'></div><div><div class='ad-icon'>✨</div><div class='ad-industry'>Salon &amp; Spa</div><div class='ad-headline'>Beauty Meets <span class='gradient-text'>Innovation</span></div><p class='ad-body'>Online booking, service menus, gift card sales, and Instagram-worthy design. Let your digital presence be as polished as your work.</p><ul class='feature-list'><li>One-click appointment booking</li><li>Service &amp; pricing menus</li><li>Digital gift card system</li></ul></div><a class='ad-cta' href='#'>Get a Free Quote →</a></div><div class='ad-footer'><span class='ad-footer-logo'>Williams Digital</span><span class='ad-footer-url'>williamsdigital.io</span></div></div>"

# Ad 9: Automotive
render_ad "09" "automotive" "<div class='ad-card'><div class='ad-inner'><div class='deco-grid'></div><div><div class='ad-icon'>🚗</div><div class='ad-industry'>Automotive &amp; Dealerships</div><div class='ad-headline'>Drive Traffic. <span class='gradient-text'>Drive Sales.</span></div><p class='ad-body'>Inventory showcases, financing calculators, and lead capture that converts tire-kickers into buyers. Your lot deserves a world-class website.</p><div class='stats-row'><div class='stat-item'><div class='stat-number'>60%</div><div class='stat-label'>Online Starts</div></div><div class='stat-item'><div class='stat-number'>5x</div><div class='stat-label'>Lead Volume</div></div><div class='stat-item'><div class='stat-number'>Fast</div><div class='stat-label'>Load Speed</div></div></div></div><a class='ad-cta' href='#'>Start a Project →</a></div><div class='ad-footer'><span class='ad-footer-logo'>Williams Digital</span><span class='ad-footer-url'>williamsdigital.io</span></div></div>"

# Ad 10: Photography
render_ad "10" "photography" "<div class='ad-card'><div class='ad-inner'><div class='deco-gradient-blur' style='top:-80px;right:-40px;background:var(--accent-3)'></div><div><div class='ad-icon'>📷</div><div class='ad-industry'>Photography &amp; Creatives</div><div class='ad-headline'>Your Work Deserves a <span class='gradient-text'>Stunning Stage</span></div><p class='ad-body'>Lightning-fast galleries, client proofing portals, and portfolio layouts designed to let your images do the talking.</p></div><div class='cta-row'><a class='ad-cta' href='#'>View Portfolios →</a><a class='ad-cta ad-cta-outline' href='#'>Book a Call</a></div></div><div class='ad-footer'><span class='ad-footer-logo'>Williams Digital</span><span class='ad-footer-url'>williamsdigital.io</span></div></div>"

# Ad 11: Accounting
render_ad "11" "accounting" "<div class='ad-card'><div class='ad-inner'><div class='deco-grid'></div><div><div class='ad-icon'>📊</div><div class='ad-industry'>Accounting &amp; Finance</div><div class='ad-headline'>Numbers Don't Lie.<br><span class='gradient-text'>Neither Should Your Site.</span></div><p class='ad-body'>Secure client portals, document upload systems, and professional design that builds the trust your firm needs to win high-value clients.</p><ul class='feature-list'><li>Secure document exchange</li><li>Client portal with login</li><li>Service-based lead funnels</li></ul></div><a class='ad-cta' href='#'>See Finance Sites →</a></div><div class='ad-footer'><span class='ad-footer-logo'>Williams Digital</span><span class='ad-footer-url'>williamsdigital.io</span></div></div>"

# Ad 12: Dental
render_ad "12" "dental" "<div class='ad-card'><div class='ad-inner'><div class='deco-gradient-blur' style='bottom:-60px;left:-80px;background:var(--accent-1)'></div><div><div class='ad-icon'>🦷</div><div class='ad-industry'>Dental Practices</div><div class='ad-headline'>Smile-Worthy <span class='gradient-text'>Web Design</span></div><p class='ad-body'>New patient forms, appointment requests, insurance info, and a welcoming design that puts patients at ease before they walk through the door.</p></div><div class='quote-block'><p>We doubled our new patient inquiries within two months of launching our new site.</p><div class='author'>— A Williams Digital Client</div></div><a class='ad-cta' href='#'>Get Started →</a></div><div class='ad-footer'><span class='ad-footer-logo'>Williams Digital</span><span class='ad-footer-url'>williamsdigital.io</span></div></div>"

# Ad 13: Landscaping
render_ad "13" "landscaping" "<div class='ad-card'><div class='ad-inner'><div class='deco-gradient-blur' style='top:-60px;left:-40px;background:var(--accent-3)'></div><div><div class='ad-icon'>🌿</div><div class='ad-industry'>Landscaping &amp; Outdoor</div><div class='ad-headline'>Grow Your Business <span class='gradient-text'>Online</span></div><p class='ad-body'>Before-and-after galleries, service area maps, and quote request forms. Show the transformation you deliver — digitally.</p><div class='stats-row'><div class='stat-item'><div class='stat-number'>4.9★</div><div class='stat-label'>Avg Rating</div></div><div class='stat-item'><div class='stat-number'>100%</div><div class='stat-label'>Satisfaction</div></div><div class='stat-item'><div class='stat-number'>Fast</div><div class='stat-label'>Turnaround</div></div></div></div><a class='ad-cta' href='#'>See Landscaping Sites →</a></div><div class='ad-footer'><span class='ad-footer-logo'>Williams Digital</span><span class='ad-footer-url'>williamsdigital.io</span></div></div>"

# Ad 14: Coffee Shop
render_ad "14" "coffee-shop" "<div class='ad-card'><div class='ad-inner'><div class='deco-grid'></div><div><div class='ad-icon'>☕</div><div class='ad-industry'>Coffee Shops &amp; Cafes</div><div class='ad-headline'>Brew a Better <span class='gradient-text'>First Impression</span></div><p class='ad-body'>Online ordering, loyalty programs, menu showcases, and location-optimized SEO that puts your shop on the map — literally.</p><ul class='feature-list'><li>Online ordering integration</li><li>Menu with seasonal updates</li><li>Local SEO optimization</li></ul></div><a class='ad-cta' href='#'>Let's Talk →</a></div><div class='ad-footer'><span class='ad-footer-logo'>Williams Digital</span><span class='ad-footer-url'>williamsdigital.io</span></div></div>"

# Ad 15: Tech Startup
render_ad "15" "tech-startup" "<div class='ad-card'><div class='ad-inner'><div class='deco-gradient-blur' style='top:-40px;right:-60px;background:var(--accent-2)'></div><div><div class='ad-badge'>Startups</div><div class='ad-industry'>Tech &amp; SaaS</div><div class='ad-headline'>Ship Faster With a <span class='gradient-text'>World-Class Site</span></div><p class='ad-body'>Landing pages that convert, product demos that sell, and scalable architecture from React to Node. We speak your stack.</p><div class='stats-row'><div class='stat-item'><div class='stat-number'>React</div><div class='stat-label'>Frontend</div></div><div class='stat-item'><div class='stat-number'>Node</div><div class='stat-label'>Backend</div></div><div class='stat-item'><div class='stat-number'>AWS</div><div class='stat-label'>Infra</div></div></div></div><a class='ad-cta' href='#'>Build With Us →</a></div><div class='ad-footer'><span class='ad-footer-logo'>Williams Digital</span><span class='ad-footer-url'>williamsdigital.io</span></div></div>"

# Ad 16: Wedding/Events
render_ad "16" "wedding-events" "<div class='ad-card'><div class='ad-inner'><div class='deco-gradient-blur' style='bottom:-80px;right:-40px;background:var(--accent-1)'></div><div><div class='ad-icon'>💒</div><div class='ad-industry'>Weddings &amp; Events</div><div class='ad-headline'>Make Every <span class='gradient-text'>Moment</span> Count</div><p class='ad-body'>Elegant galleries, inquiry forms, package showcases, and video integration. Give your event business a digital presence as beautiful as the moments you create.</p></div><div class='cta-row'><a class='ad-cta' href='#'>See Examples →</a><a class='ad-cta ad-cta-outline' href='#'>Free Consult</a></div></div><div class='ad-footer'><span class='ad-footer-logo'>Williams Digital</span><span class='ad-footer-url'>williamsdigital.io</span></div></div>"

# Ad 17: Pet Services
render_ad "17" "pet-services" "<div class='ad-card'><div class='ad-inner'><div class='deco-grid'></div><div><div class='ad-icon'>🐾</div><div class='ad-industry'>Pet Services</div><div class='ad-headline'>Fetch More <span class='gradient-text'>Clients</span></div><p class='ad-body'>Booking systems, pet profiles, daycare cam integration, and playful design that pet parents love. Stand out in a crowded market.</p><ul class='feature-list'><li>Online booking &amp; scheduling</li><li>Pet parent portal</li><li>Review &amp; referral system</li></ul></div><a class='ad-cta' href='#'>Get a Quote →</a></div><div class='ad-footer'><span class='ad-footer-logo'>Williams Digital</span><span class='ad-footer-url'>williamsdigital.io</span></div></div>"

# Ad 18: Education
render_ad "18" "education" "<div class='ad-card'><div class='ad-inner'><div class='deco-gradient-blur' style='top:-60px;right:-80px;background:var(--accent-3)'></div><div><div class='ad-icon'>📚</div><div class='ad-industry'>Education &amp; Tutoring</div><div class='ad-headline'>Teach the World. <span class='gradient-text'>Start Here.</span></div><p class='ad-body'>Course catalogs, student portals, scheduling tools, and payment integration. Empower your educational business with a platform that scales.</p></div><div class='quote-block'><p>Our enrollment doubled after Williams Digital rebuilt our website with an integrated booking system.</p><div class='author'>— A Tutoring Academy</div></div><a class='ad-cta' href='#'>Start Your Project →</a></div><div class='ad-footer'><span class='ad-footer-logo'>Williams Digital</span><span class='ad-footer-url'>williamsdigital.io</span></div></div>"

# Ad 19: Home Services
render_ad "19" "home-services" "<div class='ad-card'><div class='ad-inner'><div class='deco-gradient-blur' style='bottom:-40px;left:-60px;background:var(--accent-1)'></div><div><div class='ad-icon'>🔧</div><div class='ad-industry'>Home Services &amp; Trades</div><div class='ad-headline'>Be the First Call. <span class='gradient-text'>Every Time.</span></div><p class='ad-body'>Emergency contact buttons, service area coverage, review showcases, and local SEO that puts you at the top of Google when it matters most.</p><div class='stats-row'><div class='stat-item'><div class='stat-number'>#1</div><div class='stat-label'>Local SEO</div></div><div class='stat-item'><div class='stat-number'>24/7</div><div class='stat-label'>Lead Capture</div></div><div class='stat-item'><div class='stat-number'>Mobile</div><div class='stat-label'>Optimized</div></div></div></div><a class='ad-cta' href='#'>Get Found Online →</a></div><div class='ad-footer'><span class='ad-footer-logo'>Williams Digital</span><span class='ad-footer-url'>williamsdigital.io</span></div></div>"

# Ad 20: Architecture
render_ad "20" "architecture" "<div class='ad-card'><div class='ad-inner'><div class='deco-grid'></div><div><div class='ad-badge'>Premium</div><div class='ad-industry'>Architecture &amp; Design</div><div class='ad-headline'>Design Deserves <span class='gradient-text'>Great Design</span></div><p class='ad-body'>Immersive project showcases, 3D render galleries, and a portfolio experience as refined as your work. Your website should be your best project.</p><ul class='feature-list'><li>Full-bleed project galleries</li><li>Case study layouts</li><li>Inquiry &amp; RFP forms</li></ul></div><div class='cta-row'><a class='ad-cta' href='#'>View Our Work →</a><a class='ad-cta ad-cta-outline' href='#'>Start a Project</a></div></div><div class='ad-footer'><span class='ad-footer-logo'>Williams Digital</span><span class='ad-footer-url'>williamsdigital.io</span></div></div>"

echo ""
echo "✅ All 20 ads exported to ad-videos/"
ls -lh ad-videos/*.mp4
