#!/usr/bin/env python3
"""Generate the six WCOPA discipline pages from one master template.
Run:  python3 _generate.py   (from this directory)
Each page = shared structure (hero > categories > divisions > rounds > judging
> archives > CTA > explore strip) with per-discipline visuals/content.
Category lists are the VERIFIED lists from wcopa.com — do not invent categories.
"""
import os

TEMPLATE = r"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title>{{NAME}} — WCOPA Concept | Williams Digital</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../../wcopa.css">
<style>
.d-hero{position:relative;min-height:74vh;display:flex;align-items:flex-end;padding:130px 0 90px;color:#fff;overflow:hidden;background:var(--navy)}
.d-hero .bg{position:absolute;inset:0;background-size:cover;background-position:center;opacity:.5}
.d-hero::after{content:"";position:absolute;inset:0;background:linear-gradient(to bottom,rgba(7,20,38,.4),rgba(7,20,38,.9) 92%)}
.d-hero .wrap{position:relative;z-index:2}
.d-hero h1{font-size:clamp(56px,9vw,140px)}
.d-hero .sub{font-family:var(--serif);font-style:italic;font-size:clamp(18px,2.3vw,27px);color:rgba(255,255,255,.8);max-width:640px;margin-top:22px}
.catcard-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
@media(max-width:820px){.catcard-grid{grid-template-columns:1fr}}
.catcard{background:var(--white);border:1px solid var(--line-l);padding:34px 32px;position:relative}
.catcard::before{content:"";position:absolute;top:0;left:0;width:44px;height:3px;background:linear-gradient(90deg,var(--gold),var(--gold-hi))}
.catcard h3{font-family:var(--display);font-size:22px;text-transform:uppercase;color:var(--navy)}
.catcard p{font-size:13px;color:var(--slate);line-height:1.65;margin-top:9px}
.chipcloud{display:flex;flex-wrap:wrap;gap:10px}
.chipcloud span{font-family:var(--display);font-size:clamp(18px,2.4vw,26px);text-transform:uppercase;letter-spacing:.03em;color:var(--navy);border:1px solid rgba(7,20,38,.2);padding:16px 24px;transition:.25s}
.chipcloud span:hover{border-color:var(--gold-deep);color:var(--gold-deep);transform:translateY(-3px)}
.mini-divs{display:grid;grid-template-columns:1fr 1fr;gap:12px;max-width:760px}
@media(max-width:680px){.mini-divs{grid-template-columns:1fr}}
.mini-div{background:var(--white);border:1px solid var(--line-l);padding:34px}
.mini-div .age{font-family:var(--display);font-size:44px;color:var(--navy)}
.mini-div h3{font-family:var(--mono);font-size:11px;letter-spacing:.26em;text-transform:uppercase;color:var(--gold-deep);margin-top:4px}
.mini-div p{font-size:12.5px;color:var(--slate);margin-top:12px;line-height:1.6}
.r3{display:grid;grid-template-columns:1fr auto 1fr auto 1fr;gap:18px;align-items:stretch;max-width:1000px;margin:0 auto}
@media(max-width:900px){.r3{grid-template-columns:1fr}.r3 .arr{transform:rotate(90deg);justify-self:center}}
.r3 .rc{background:var(--royal-card);border:1px solid var(--line-d);padding:32px 30px}
.r3 .rc.final{border-color:rgba(214,168,75,.5);background:linear-gradient(120deg,rgba(214,168,75,.12),var(--royal-card) 60%)}
.r3 .rn{font-family:var(--mono);font-size:10px;letter-spacing:.26em;color:var(--gold);text-transform:uppercase}
.r3 h3{font-family:var(--display);font-size:24px;text-transform:uppercase;margin-top:10px}
.r3 p{font-size:13px;color:rgba(255,255,255,.6);line-height:1.65;margin-top:10px}
.r3 .arr{display:grid;place-items:center;color:var(--gold);font-size:20px}
.looks{max-width:860px}
.look{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:20px 4px;border-bottom:1px solid var(--line-d)}
.look:last-child{border-bottom:0}
.look b{font-size:16px;font-weight:700}
.look .star{font-family:var(--mono);font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold-hi);border:1px solid rgba(214,168,75,.45);padding:4px 9px;border-radius:99px;white-space:nowrap}
.look .n{font-family:var(--display);font-size:20px;color:rgba(255,255,255,.25)}
.arch-band{display:flex;gap:16px;flex-wrap:wrap;margin-top:36px}
.explore-strip{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}
.explore-strip a{font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;border:1px solid var(--line-l);color:var(--slate);padding:14px 22px;transition:.25s}
.explore-strip a:hover{border-color:var(--gold-deep);color:var(--gold-deep)}
.explore-strip a.now{border-color:var(--navy);background:var(--navy);color:var(--gold-hi);pointer-events:none}
{{THEME_CSS}}
</style>
</head>
<body class="{{PAGE_CLASS}}">

<div class="concept-bar">Design Concept — prepared by <b>Williams Digital</b> · Not affiliated with or endorsed by WCOPA · Illustrative preview</div>

<nav class="site">
  <div class="wrap">
    <a class="brand" href="../../"><span class="brand-mark">W</span><span><span class="brand-name">WCOPA</span><span class="brand-sub">The World Stage</span></span></a>
    <div class="nav-groups">
      <div class="nav-group"><button>Compete</button><div class="dd">
        <a href="../../how-to-enter/">How to Enter</a><a href="../../competition/">Competition</a><a href="../../competition/#disciplines">Disciplines</a><a href="../../competition/#judging">Judging</a>
      </div></div>
      <div class="nav-group"><button>Experience</button><div class="dd">
        <a class="soon" href="#">WCOPA Week</a><a class="soon" href="#">Schedule</a><a class="soon" href="#">Travel &amp; Stay</a><a href="../../#live">WCOPA Live</a>
      </div></div>
      <div class="nav-group"><button>The World</button><div class="dd">
        <a href="../../countries/">Countries</a><a href="../../countries/#directors">National Directors</a><a href="../../champions/">Champions</a>
      </div></div>
      <div class="nav-group"><button>About</button><div class="dd">
        <a class="soon" href="#">About WCOPA</a><a class="soon" href="#">Team</a><a class="soon" href="#">FAQ</a><a class="soon" href="#">Contact</a>
      </div></div>
    </div>
    <div class="nav-ctas">
      <a class="nav-cc" href="../../dashboard/">Command Center ↗</a>
      <a class="nav-cta" href="../../how-to-enter/?discipline={{NAME}}">Audition</a>
    </div>
  </div>
</nav>

<header class="d-hero on-dark">
  <div class="bg" style="background-image:url('{{HERO_IMG}}')"></div>
  {{HERO_FX}}
  <div class="wrap">
    <div class="kicker">Discipline {{NUM}} — {{NAME}}</div>
    <h1 class="h-display">{{TAG_HTML}}</h1>
    <p class="sub">{{ABOUT}}</p>
  </div>
</header>

<section class="{{CATS_BG}} on-light" id="categories">
  <div class="wrap">
    <div class="sec-head reveal">
      <div class="kicker">Competition Categories</div>
      <h2 class="h-display">{{CATS_HEAD}}</h2>
      {{CATS_LEDE}}
    </div>
    <div class="reveal">{{CATS_HTML}}</div>
  </div>
</section>

{{EXTRA_HTML}}

<section class="bg-ivory on-light">
  <div class="wrap">
    <div class="sec-head reveal">
      <div class="kicker">Age Divisions</div>
      <h2 class="h-display">Junior &amp; Senior</h2>
    </div>
    <div class="mini-divs reveal">
      <div class="mini-div"><div class="age">5–15</div><h3>Junior</h3><p>Preliminary brackets: 5–7 · 8–10 · 11–12 · 13–15</p></div>
      <div class="mini-div"><div class="age">16+</div><h3>Senior</h3><p>Preliminary brackets: 16–17 · 18–24 · 25–29 · 30 &amp; up</p></div>
    </div>
  </div>
</section>

<section class="bg-navy on-dark">
  <div class="wrap">
    <div class="sec-head reveal" style="text-align:center;max-width:720px;margin-left:auto;margin-right:auto">
      <div class="kicker center">How Competition Works</div>
      <h2 class="h-display">Three Rounds<br>to <span class="gold-foil">Gold</span></h2>
    </div>
    <div class="r3 reveal">
      <div class="rc"><div class="rn">Round 01</div><h3>Preliminaries</h3><p>Compete in your age bracket. Judges score on the 100-point system — gold, silver and bronze medals are decided here.</p></div>
      <div class="arr">→</div>
      <div class="rc"><div class="rn">Round 02</div><h3>Semifinals</h3><p>Medalists compete within their division for the title of Overall World Champion in {{NAME_LOWER}}.</p></div>
      <div class="arr">→</div>
      <div class="rc final"><div class="rn">Round 03</div><h3>Grand Final</h3><p>The Showcase of Champions — a VIP industry panel crowns the Grand Champion Performer of the World.</p></div>
    </div>
  </div>
</section>

<section class="bg-royal on-dark">
  <div class="wrap">
    <div class="sec-head reveal">
      <div class="kicker">The 100-Point System</div>
      <h2 class="h-display">What Judges<br>Look For</h2>
      <p class="lede">{{JUDGE_INTRO}}</p>
    </div>
    <div class="looks reveal">
      <div class="look"><b>Technical Skill</b><span class="n">01</span></div>
      <div class="look"><b>Stage Presence</b><span class="n">02</span></div>
      <div class="look"><b>Originality</b><span class="n">03</span></div>
      <div class="look"><b>Entertainment Value</b><span style="display:flex;gap:14px;align-items:center"><span class="star">Special Emphasis</span><span class="n">04</span></span></div>
      <div class="look"><b>Marketability</b><span style="display:flex;gap:14px;align-items:center"><span class="star">Special Emphasis</span><span class="n">05</span></span></div>
    </div>
  </div>
</section>

<section class="bg-black on-dark">
  <div class="wrap">
    <div class="sec-head reveal">
      <div class="kicker">The Legacy</div>
      <h2 class="h-display">{{NAME}} Champions<br><span class="gold-foil">Since 1996</span></h2>
      <p class="lede">In the production build, this section features past {{NAME_LOWER}} medalists and Overall World Champions — photography, countries and performance film from WCOPA's archives.</p>
    </div>
    <div class="arch-band reveal">
      <a class="btn btn-gold" href="../../champions/">Hall of Champions →</a>
      <a class="btn btn-outline-light" href="../../champions/">World Champion Stories</a>
    </div>
  </div>
</section>

<section class="cta-band">
  <div class="wrap reveal">
    <div class="kicker center">Your Category Is Waiting</div>
    <h2 class="h-display" style="margin-top:24px">{{CTA_HEAD}}</h2>
    <span class="serif-i">{{CTA_SUB}}</span>
    <a class="btn btn-navy" href="../../how-to-enter/?discipline={{NAME}}">Audition in {{NAME}} →</a>
  </div>
</section>

<section class="bg-white on-light" style="padding:70px 0">
  <div class="wrap" style="text-align:center">
    <div class="kicker center reveal" style="margin-bottom:30px">Explore Another Discipline</div>
    <div class="explore-strip reveal">{{EXPLORE_HTML}}</div>
  </div>
</section>

<footer>
  <div class="wrap foot-grid">
    <div>
      <div class="brand"><span class="brand-mark">W</span><span><span class="brand-name">WCOPA</span><span class="brand-sub">The World Stage — Concept</span></span></div>
      <a class="wd-chip" href="https://williamsdigital.io">Concept by Williams Digital</a>
    </div>
    <div class="foot-note">
      Unsolicited design concept by <a href="https://williamsdigital.io">Williams Digital</a> — not affiliated with or endorsed by WCOPA. Categories, divisions, rounds and judging emphasis drawn from <a href="https://www.wcopa.com/" target="_blank" rel="noopener">wcopa.com</a>. Photography: Unsplash. Explore the <a href="../../">homepage concept</a> or the <a href="../../dashboard/">Command Center</a>.
    </div>
  </div>
</footer>

<script>
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
</script>
<script src="../../nav.js" defer></script>
</body>
</html>
"""

IMG = {
    "mic": "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1800&q=70",
    "dancer": "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&w=1800&q=70",
    "theater": "https://images.unsplash.com/photo-1507924538820-ede94a04019d?auto=format&fit=crop&w=1800&q=70",
    "portrait": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1800&q=70",
    "piano": "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=1800&q=70",
    "breaker": "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?auto=format&fit=crop&w=1800&q=70",
    "crowd": "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1800&q=70",
}

def chips(items):
    return '<div class="chipcloud">' + "".join(f"<span>{i}</span>" for i in items) + "</div>"

def cards(items):
    return '<div class="catcard-grid">' + "".join(
        f'<div class="catcard"><h3>{t}</h3><p>{d}</p></div>' for t, d in items) + "</div>"

VOCAL_GENRES = ["Classical","Country &amp; Western","Contemporary","Gospel","Latin","Pop","R&amp;B / Soul / Jazz","Rap","Rock","World"]
DANCE_STYLES = ["Acrobatic / Gymnastic","Ballet","Ballroom","Cheer Dance","Clogging","Contemporary / Modern","Ethnic / Folkloric","Hip Hop / Funk","Jazz","Lyrical","Tap","Song &amp; Dance","Musical Theater"]

D = [
dict(slug="vocal", num="01", name="Vocal", name_lower="vocal",
     tag=' Let the World<br><span class="gold-foil">Hear You.</span>',
     about="From classical and gospel to pop, rap and world music — vocalists from 70+ countries take the WCOPA stage.",
     hero=IMG["mic"], hero_fx="", page_class="", theme="",
     cats_bg="bg-white", cats_head="Ten Genres.<br>Two Ways to Sing.",
     cats_lede='<p class="lede">Compete as a solo vocalist or accompany yourself — every genre carries its own category.</p>',
     cats=chips(VOCAL_GENRES) + '<div class="mono-note" style="margin-top:22px">Offered as Solo Vocal and Vocal with Self-Accompaniment</div>',
     extra="""
<section class="bg-navy on-dark" style="padding:130px 0;background:linear-gradient(rgba(7,20,38,.75),rgba(7,20,38,.92)),url('%s') center/cover fixed">
  <div class="wrap" style="text-align:center">
    <h2 class="h-display reveal" style="font-size:clamp(38px,6vw,84px)">One Voice Can Command<br><span class="gold-foil">the World Stage.</span></h2>
  </div>
</section>""" % IMG["crowd"],
     judge_intro="Range and technique matter — but WCOPA's judges score the complete vocalist: the voice, the presence, and the it-factor the industry signs.",
     cta_head="Sing for the World.", cta_sub="Your voice. Your country. One stage."),

dict(slug="dance", num="02", name="Dance", name_lower="dance",
     tag='Move<br><span class="gold-foil">the World.</span>',
     about="Thirteen styles. Solo, duo and troupe. The world's dancers meet on one floor.",
     hero=IMG["dancer"], hero_fx="", page_class="",
     theme=".d-hero .bg{background-attachment:fixed}@media(max-width:900px){.d-hero .bg{background-attachment:scroll}}\n.flowband{overflow:hidden;background:var(--navy);padding:36px 0;border-top:1px solid var(--line-d);border-bottom:1px solid var(--line-d)}\n.flow-track{display:inline-block;white-space:nowrap;animation:flow 26s linear infinite;font-family:var(--display);font-size:clamp(28px,4.4vw,54px);text-transform:uppercase;color:rgba(255,255,255,.9)}\n.flow-track b{color:var(--gold);margin:0 34px;font-weight:400}\n@keyframes flow{from{transform:translateX(0)}to{transform:translateX(-50%)}}",
     cats_bg="bg-white", cats_head="Thirteen Styles.<br>One Floor.",
     cats_lede='<p class="lede">Solo, duo or troupe — every style competes for its own title.</p>',
     cats=chips(DANCE_STYLES),
     extra="""
<div class="flowband"><div class="flow-track" id="flow"></div></div>
<script>
const seq="Precision <b>→</b> Technique <b>→</b> Musicality <b>→</b> Performance <b>→</b> ";
document.currentScript.previousElementSibling.firstElementChild.innerHTML=seq.repeat(6);
</script>""",
     judge_intro="Lines and technique open the door — but WCOPA's floor rewards musicality, performance and the presence that fills an arena.",
     cta_head="Own the Floor.", cta_sub="Solo. Duo. Troupe. The floor is yours."),

dict(slug="acting", num="03", name="Acting", name_lower="acting",
     tag='Your Next Role<br><span class="gold-foil">Starts Here.</span>',
     about="Camera or curtain — actors compete for the world title in front of industry professionals.",
     hero=IMG["theater"],
     hero_fx='<div class="spot-fx"></div>', page_class="",
     theme=".spot-fx{position:absolute;inset:0;z-index:1;background:radial-gradient(420px 640px at 68% 40%,rgba(242,213,138,.22),transparent 65%);animation:spoton 3.2s ease both}\n@keyframes spoton{from{opacity:0}60%{opacity:.4}to{opacity:1}}\n.cast-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;max-width:900px}\n@media(max-width:820px){.cast-grid{grid-template-columns:1fr}}\n.cast{background:var(--royal-card);border:1px solid var(--line-d);padding:30px;text-align:center}\n.cast .hs{width:92px;height:92px;border-radius:50%;margin:0 auto 18px;border:1.5px solid var(--gold);background:linear-gradient(135deg,#0C2140,#071426);display:grid;place-items:center;font-family:var(--display);color:rgba(214,168,75,.6);font-size:13px}\n.cast h4{font-family:var(--display);font-size:17px;text-transform:uppercase}\n.cast p{font-family:var(--mono);font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-top:7px}",
     cats_bg="bg-white", cats_head="Camera.<br>Curtain.",
     cats_lede='<p class="lede">Four categories span the craft — from on-camera work to the Broadway stage.</p>',
     cats=cards([
        ("Acting for Television — Comical","Timing, character and comedy, played for the camera."),
        ("Acting for Television — Dramatic","Scripted dramatic performance with on-camera discipline."),
        ("Acting for Television — Open","Your material, your choices — any on-camera style."),
        ("Broadway","Stage performance in the great theatrical tradition."),
     ]),
     extra="""
<section class="bg-navy on-dark">
  <div class="wrap">
    <div class="sec-head reveal" style="text-align:center;max-width:760px;margin-left:auto;margin-right:auto">
      <div class="kicker center">The Casting Call</div>
      <h2 class="h-display">Perform in Front of<br><span class="gold-foil">Industry Professionals</span></h2>
    </div>
    <div class="cast-grid reveal" style="margin:0 auto">
      <div class="cast"><div class="hs">PANEL</div><h4>Casting &amp; Talent</h4><p>Judge bios from WCOPA panel</p></div>
      <div class="cast"><div class="hs">PANEL</div><h4>Film &amp; Television</h4><p>Judge bios from WCOPA panel</p></div>
      <div class="cast"><div class="hs">PANEL</div><h4>Stage &amp; Theater</h4><p>Judge bios from WCOPA panel</p></div>
    </div>
    <div class="mono-note reveal" style="text-align:center;margin-top:26px">Placeholder cards — panelist names, headshots &amp; credits from WCOPA</div>
  </div>
</section>""",
     judge_intro="The scene is yours for one minute — judges watch for craft, character and the screen presence casting rooms remember.",
     cta_head="Take the Scene.", cta_sub="The panel is watching. Make them remember you."),

dict(slug="modeling", num="04", name="Modeling", name_lower="modeling",
     tag='Walk. Represent.<br><span class="gold-foil">Be Remembered.</span>',
     about="Three walks, multiple divisions — the runway comes to the World Championships.",
     hero=IMG["portrait"], hero_fx="", page_class="editorial",
     theme="body.editorial .d-hero{min-height:80vh}\nbody.editorial .d-hero .bg{opacity:.42;background-position:center 20%}\n.walks{display:flex;flex-direction:column;gap:0;border-top:1px solid var(--line-l)}\n.walk{display:grid;grid-template-columns:110px 1fr auto;align-items:center;gap:26px;padding:34px 6px;border-bottom:1px solid var(--line-l);transition:.25s}\n.walk:hover{padding-left:20px;background:rgba(214,168,75,.05)}\n.walk .wn{font-family:var(--mono);font-size:11px;letter-spacing:.24em;color:var(--gold-deep)}\n.walk h3{font-family:var(--display);font-size:clamp(30px,5vw,58px);text-transform:uppercase;color:var(--navy);line-height:1}\n.walk p{font-family:var(--mono);font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--slate);text-align:right}\n@media(max-width:680px){.walk{grid-template-columns:1fr}.walk p{text-align:left}}",
     cats_bg="bg-ivory", cats_head="The Walks",
     cats_lede='<p class="lede">Casual, formal and swimwear — each with commercial, petite, plus and open divisions.</p>',
     cats="""<div class="walks">
<div class="walk"><span class="wn">Walk 01</span><h3>Casual</h3><p>Commercial · Petite · Plus · JR/SR Open</p></div>
<div class="walk"><span class="wn">Walk 02</span><h3>Formal</h3><p>Commercial · Petite · Plus · JR/SR Open</p></div>
<div class="walk"><span class="wn">Walk 03</span><h3>Swimwear</h3><p>Commercial · Petite · Plus · JR/SR Open</p></div>
</div>""",
     extra="""
<section class="bg-black on-dark" style="padding:130px 0">
  <div class="wrap" style="text-align:center">
    <div class="kicker center reveal">The Runway</div>
    <h2 class="h-display reveal" style="font-size:clamp(40px,7vw,96px);margin-top:24px">Every Step<br><span class="gold-foil">Is Judged.</span></h2>
    <p class="lede reveal" style="margin:24px auto 0;color:rgba(255,255,255,.6)">Runway photography from WCOPA's archives fills this section in the production build.</p>
  </div>
</section>""",
     judge_intro="The walk is the work — presence, polish and the marketability agencies scout for.",
     cta_head="Own the Runway.", cta_sub="Three walks. One title. Your name on it."),

dict(slug="instrumental", num="05", name="Instrumental", name_lower="instrumental",
     tag='Play for<br><span class="gold-foil">the World.</span>',
     about="Any instrument. Four arenas. One stage under one spotlight.",
     hero=IMG["piano"], hero_fx="", page_class="",
     theme=".d-hero .bg{opacity:.42}\n.fam-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}\n@media(max-width:900px){.fam-grid{grid-template-columns:repeat(2,1fr)}}\n.fam{background:var(--royal-card);border:1px solid var(--line-d);padding:36px 30px;text-align:center;transition:.25s}\n.fam:hover{border-color:rgba(214,168,75,.5);transform:translateY(-4px)}\n.fam svg{width:44px;height:44px;color:var(--gold-hi);stroke-width:1.3}\n.fam h4{font-family:var(--display);font-size:19px;text-transform:uppercase;margin-top:16px}\n.fam p{font-family:var(--mono);font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-top:8px}",
     cats_bg="bg-white", cats_head="Four Arenas",
     cats_lede='<p class="lede">Whatever you play, there is a category built for it.</p>',
     cats=cards([
        ("Classical","Works by the traditional composers, performed for a world panel."),
        ("Contemporary","Modern instrumental pieces across every genre."),
        ("Jazz","Improvisation, feel and command of the form."),
        ("Open","Any instrumental style — your instrument, your rules."),
     ]),
     extra="""
<section class="bg-navy on-dark">
  <div class="wrap">
    <div class="sec-head reveal" style="text-align:center;max-width:760px;margin-left:auto;margin-right:auto">
      <div class="kicker center">Any Instrument</div>
      <h2 class="h-display">Any Instrument.<br><span class="gold-foil">One World Stage.</span></h2>
    </div>
    <div class="fam-grid reveal">
      <div class="fam"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="7" width="20" height="10" rx="1"/><path d="M6 7v6M10 7v6M14 7v6M18 7v6"/></svg><h4>Keys</h4><p>Piano · Keyboard</p></div>
      <div class="fam"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 21c-3 0-5-2-5-5 0-4 6-4 6-8l-1-5 6 1s-1 3-1 5c0 4 6 4 6 7 0 3-2 5-5 5z"/></svg><h4>Strings</h4><p>Violin · Guitar · Cello</p></div>
      <div class="fam"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 4l4 2v12a2 2 0 1 0 4 0V6l8-2"/></svg><h4>Wind</h4><p>Sax · Flute · Brass</p></div>
      <div class="fam"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><ellipse cx="12" cy="7" rx="9" ry="3"/><path d="M3 7v9c0 1.7 4 3 9 3s9-1.3 9-3V7"/></svg><h4>Percussion</h4><p>Drums · Mallets</p></div>
    </div>
  </div>
</section>""",
     judge_intro="Mastery is the entry fee — the title goes to the musician who turns technique into performance.",
     cta_head="Take the Spotlight.", cta_sub="Your instrument has a world title waiting."),

dict(slug="variety-arts", num="06", name="Variety Arts", name_lower="variety arts",
     tag='The Act They\'ll<br><span class="gold-foil">Never Forget.</span>',
     about="Some performers don't fit into a category. They create their own.",
     hero=IMG["breaker"],
     hero_fx='<div class="red-fx"></div>', page_class="",
     theme=".red-fx{position:absolute;inset:0;z-index:1;background:radial-gradient(560px 420px at 30% 30%,rgba(224,60,49,.22),transparent 65%),radial-gradient(480px 380px at 78% 66%,rgba(224,60,49,.12),transparent 60%)}\n.d-hero .bg{opacity:.55}",
     cats_bg="bg-white", cats_head="The Unforgettable<br>Acts",
     cats_lede='<p class="lede">Magic, circus skill and acts the audience can\'t explain — this is where they compete.</p>',
     cats=chips(["Magic","Juggling","Contortion","Hand Balancing","Tumbling","Manipulation &amp; Equilibristic"]),
     extra="""
<section class="bg-navy on-dark" style="padding:130px 0;background:linear-gradient(rgba(7,20,38,.7),rgba(7,20,38,.92)),url('%s') center/cover">
  <div class="wrap" style="text-align:center">
    <h2 class="h-display reveal" style="font-size:clamp(38px,6vw,84px)">If It Stops the Show,<br><span class="gold-foil">It Belongs Here.</span></h2>
  </div>
</section>""" % IMG["crowd"],
     judge_intro="There is no rubric for astonishment — judges score skill, danger, wonder and the entertainment value that stops a show.",
     cta_head="Stop the Show.", cta_sub="The world has never seen your act. Change that."),
]

ORDER = [(d["slug"], d["name"]) for d in D]

def explore(current):
    out = []
    for slug, name in ORDER:
        cls = ' class="now"' if slug == current else ""
        out.append(f'<a href="../{slug}/"{cls}>{name}</a>')
    return "".join(out)

here = os.path.dirname(os.path.abspath(__file__))
for d in D:
    html = TEMPLATE
    reps = {
        "{{NAME}}": d["name"], "{{NAME_LOWER}}": d["name_lower"], "{{NUM}}": d["num"],
        "{{TAG_HTML}}": d["tag"], "{{ABOUT}}": d["about"], "{{HERO_IMG}}": d["hero"],
        "{{HERO_FX}}": d["hero_fx"], "{{PAGE_CLASS}}": d["page_class"], "{{THEME_CSS}}": d["theme"],
        "{{CATS_BG}}": d["cats_bg"], "{{CATS_HEAD}}": d["cats_head"], "{{CATS_LEDE}}": d["cats_lede"],
        "{{CATS_HTML}}": d["cats"], "{{EXTRA_HTML}}": d["extra"],
        "{{JUDGE_INTRO}}": d["judge_intro"], "{{CTA_HEAD}}": d["cta_head"], "{{CTA_SUB}}": d["cta_sub"],
        "{{EXPLORE_HTML}}": explore(d["slug"]),
    }
    for k, v in reps.items():
        html = html.replace(k, v)
    outdir = os.path.join(here, d["slug"])
    os.makedirs(outdir, exist_ok=True)
    with open(os.path.join(outdir, "index.html"), "w") as f:
        f.write(html)
    print("wrote", d["slug"] + "/index.html")
