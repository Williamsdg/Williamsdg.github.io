/* Been There — signature designs: one-of-a-kind art per city (300 × 300 artboards).
   Core designs (Passport, Postmark) come from FAM in index.html; everything here is place-specific. */
(function(){
const INK='#16213A';
let seed=1;const rnd=()=>(seed=(seed*9301+49297)%233280)/233280;
const pol=(cx,cy,r,a)=>[cx+r*Math.cos(a*Math.PI/180),cy+r*Math.sin(a*Math.PI/180)];
const P2=(p)=>p.map(n=>n.toFixed(1)).join(' ');
// ring text: title across the top, subtitle upright along the bottom
function ring(cx,cy,r,top,bot,fT,fB,col,lsT){const a=uid('a'),b=uid('a'),rb=r+fB*.74;
  return `<defs><path id="${a}" d="M${cx-r},${cy} A${r},${r} 0 0 1 ${cx+r},${cy}"/><path id="${b}" d="M${cx-rb},${cy} A${rb},${rb} 0 0 0 ${cx+rb},${cy}"/></defs>
  <text font-family="Fraunces" font-weight="900" font-size="${fT}" letter-spacing="${lsT??3}" text-anchor="middle" fill="${col}"><textPath href="#${a}" startOffset="50%">${esc(top)}</textPath></text>
  <text font-family="Inter" font-weight="700" font-size="${fB}" letter-spacing="2.4" text-anchor="middle" fill="${col}"><textPath href="#${b}" startOffset="50%">${esc(bot)}</textPath></text>`}
const stars=(col,r,cy)=>`<text x="${150-r}" y="${(cy||150)+6}" text-anchor="middle" font-size="16" fill="${col}">★</text><text x="${150+r}" y="${(cy||150)+6}" text-anchor="middle" font-size="16" fill="${col}">★</text>`;
function balloon(x,y,r,c,c2){return `<g><path d="M${x-r} ${y} Q${x-r} ${y-r*1.35} ${x} ${y-r*1.35} Q${x+r} ${y-r*1.35} ${x+r} ${y} Q${x+r*.62} ${y+r*.82} ${x+r*.26} ${y+r*1.06} L${x-r*.26} ${y+r*1.06} Q${x-r*.62} ${y+r*.82} ${x-r} ${y}Z" fill="${c}"/>
  <path d="M${x} ${y-r*1.35} Q${x-r*.5} ${y-r*.2} ${x-r*.26} ${y+r*1.06} M${x} ${y-r*1.35} Q${x+r*.5} ${y-r*.2} ${x+r*.26} ${y+r*1.06}" fill="none" stroke="${c2}" stroke-width="${Math.max(1,r*.12)}"/>
  <path d="M${x-r*.96} ${y-r*.2} Q${x} ${y+r*.08} ${x+r*.96} ${y-r*.2}" fill="none" stroke="${c2}" stroke-width="${Math.max(1,r*.14)}"/>
  <path d="M${x-r*.24} ${y+r*1.06} L${x-r*.18} ${y+r*1.38} M${x+r*.24} ${y+r*1.06} L${x+r*.18} ${y+r*1.38}" stroke="#5A3A2A" stroke-width="${Math.max(.6,r*.05)}"/>
  <rect x="${x-r*.2}" y="${y+r*1.36}" width="${r*.4}" height="${r*.32}" rx="${r*.05}" fill="#6B4A34"/></g>`}
const lemon=(x,y,rx,ry,rot)=>`<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M${-rx-7} 0 Q${-rx} ${-ry} 0 ${-ry} Q${rx} ${-ry} ${rx+7} 0 Q${rx} ${ry} 0 ${ry} Q${-rx} ${ry} ${-rx-7} 0Z" fill="#F6C85F" stroke="#B8872A" stroke-width="2"/><ellipse cx="${-rx*.3}" cy="${-ry*.45}" rx="${rx*.35}" ry="${ry*.18}" fill="#FFF3C4" opacity=".7"/></g>`;
const leaf=(x,y,l,rot,c)=>`<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M0 0 Q${l*.5} ${-l*.32} ${l} 0 Q${l*.5} ${l*.32} 0 0Z" fill="${c||'#5E8A4A'}"/><path d="M2 0 H${l-3}" stroke="#3E6B3A" stroke-width="1"/></g>`;

const SIG={
/* ======================= SANTORINI ======================= */
santorini:[
 {id:'oia-sunset',name:'Oia Sunset',story:'Everyone on the island ends up on the same wall at the same hour. The sun sinks into the caldera, the domes go gold, and a thousand people clap. This is that moment.',best:'Heavyweight tee, crewneck, mug, sticker',apps:[['tee','#F2EBDD'],['crew','#EFE6D6'],['sticker']],
  render(){const c=uid('c'),g=uid('g');return `<defs><clipPath id="${c}"><circle cx="150" cy="150" r="104"/></clipPath><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5F63AE"/><stop offset=".45" stop-color="#C98FB8"/><stop offset=".8" stop-color="#F2A58E"/><stop offset="1" stop-color="#F7C878"/></linearGradient></defs>
   <circle cx="150" cy="150" r="142" fill="#F6F0E4" stroke="${INK}" stroke-width="6"/>
   <g clip-path="url(#${c})"><rect x="40" y="40" width="220" height="132" fill="url(#${g})"/>
    ${[[92,74,.8],[150,62,1.1],[206,86,.7]].map(([x,y,k])=>`<g transform="translate(${x} ${y}) scale(${k})" opacity=".8"><ellipse rx="22" ry="5" fill="#7C72A9"/><ellipse cx="6" cy="-4" rx="11" ry="6" fill="#7C72A9"/><ellipse cx="2" cy="3" rx="18" ry="1.8" fill="#F2A99F"/></g>`).join('')}
    <circle cx="136" cy="172" r="40" fill="#F9C05E"/><circle cx="136" cy="172" r="52" fill="#F9C05E" opacity=".25"/>
    <path d="M40 168 Q66 158 92 162 Q108 160 122 172 H40Z" fill="#3A3F63"/>
    <rect x="40" y="172" width="220" height="100" fill="#35518E"/>
    ${[[178,64],[188,48],[198,34],[209,22],[220,12]].map(([y,w])=>`<rect x="${136-w/2}" y="${y}" width="${w}" height="3" rx="1.5" fill="#F9C05E" opacity=".85"/>`).join('')}
    <path d="M262 100 Q232 104 220 120 Q206 140 200 172 Q195 214 192 272 H262Z" fill="#8E4A3A"/><path d="M214 150 Q206 170 204 200" stroke="#6E3A30" stroke-width="3" fill="none"/>
    <rect x="214" y="100" width="16" height="24" fill="#FBF7F0"/><rect x="226" y="92" width="18" height="30" fill="#F6ECDD"/><rect x="242" y="96" width="22" height="26" fill="#FBF7F0"/><rect x="208" y="112" width="12" height="16" fill="#F2C9A8"/>
    <rect x="230" y="80" width="22" height="16" fill="#FBF7F0"/><path d="M230 80 A11 11 0 0 1 252 80Z" fill="#1F5FC4"/>
    <rect x="212" y="80" width="10" height="22" fill="#FBF7F0"/><path d="M212 80 A5 6 0 0 1 222 80Z" fill="#1F5FC4"/><path d="M217 74 V68 M214.5 70.5 H219.5" stroke="#FFFFFF" stroke-width="1.4"/>
    ${[[218,106],[233,100],[248,104],[256,110],[240,112]].map(([x,y])=>`<rect x="${x}" y="${y}" width="3" height="4" rx="1" fill="#FFC96B"/>`).join('')}
   </g><circle cx="150" cy="150" r="104" fill="none" stroke="${INK}" stroke-width="3"/>
   ${ring(150,150,110,'OIA SUNSET','SANTORINI · GREECE',25,13,INK)}${stars('#1F5FC4',126)}`}},
 {id:'caldera',name:'Caldera Crest',story:'Santorini is the rim of a volcano that blew itself apart around 1600 BC — the sea you swim in is the crater. A school-crest for the island, with the still-smoking volcano in the middle.',best:'Crewneck, hoodie, cap (embroidered), tote',apps:[['crew','#EFE6D6'],['tee','#FFFFFF'],['tote','#EFE6D2']],
  render(){const cl=uid('c');const SH='M150 24 L252 48 V146 Q252 226 150 272 Q48 226 48 146 V48Z';
   const cx=150,cy=186,R=58,r=38;const o1=pol(cx,cy,R,200),o2=pol(cx,cy,R,160),i1=pol(cx,cy,r,160),i2=pol(cx,cy,r,200);
   const vill=[228,242,256,270,284,298,312,326].map(a=>{const [x,y]=pol(cx,cy,R-3,a);return `<rect x="${(x-3).toFixed(1)}" y="${(y-3).toFixed(1)}" width="6" height="5" fill="#FBF7F0"/>`}).join('');
   return `<defs><clipPath id="${cl}"><path d="${SH}"/></clipPath></defs>
   <path d="${SH}" fill="#F6F0E4" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
   <g clip-path="url(#${cl})"><rect x="40" y="112" width="220" height="170" fill="#35518E"/>
    ${[130,150,238,256].map((y,k)=>`<path d="M${60+k*8} ${y} q8 -4 16 0 t16 0" stroke="#F6F0E4" stroke-width="1.6" fill="none" opacity=".55"/><path d="M${190-k*6} ${y+8} q8 -4 16 0 t16 0" stroke="#F6F0E4" stroke-width="1.6" fill="none" opacity=".55"/>`).join('')}
    <path d="M${P2(o1)} A${R} ${R} 0 1 1 ${P2(o2)} L${P2(i1)} A${r} ${r} 0 1 0 ${P2(i2)}Z" fill="#8E4A3A" stroke="#5E2E24" stroke-width="2"/>${vill}
    <path d="M${o2[0]-10} ${o2[1]+14} q6 -8 16 -4 q-4 8 -16 4z" fill="#8E4A3A"/>
    <path d="M136 196 Q142 182 150 180 Q160 181 166 196Z" fill="#3B2F2A"/>
    <circle cx="154" cy="172" r="5" fill="#C9C3BB" opacity=".9"/><circle cx="160" cy="162" r="6.5" fill="#C9C3BB" opacity=".75"/><circle cx="168" cy="151" r="8" fill="#C9C3BB" opacity=".55"/>
    <path d="M48 112 H252" stroke="${INK}" stroke-width="3"/></g>
   <text x="150" y="78" text-anchor="middle" font-family="Fraunces" font-weight="900" font-size="34" letter-spacing="2" fill="${INK}">CALDERA</text>
   <text x="150" y="101" text-anchor="middle" font-family="Fraunces" font-style="italic" font-weight="500" font-size="16" fill="${INK}">c. 1600 BC</text>
   <path d="M34 232 H266 L252 251 L266 270 H34 L48 251Z" fill="#1F5FC4" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
   <text x="150" y="258" text-anchor="middle" font-family="Fraunces" font-weight="900" font-size="20" letter-spacing="3" fill="#FBF7F0">SANTORINI</text>`}},
 {id:'blue-door',name:'The Blue Door',story:'Every alley in Oia ends at a painted door under a spill of bougainvillea. The photo everyone takes — drawn, with the little house sign above it.',best:'Everyday Soft Tee, tote, print, ornament',apps:[['tee','#FFFFFF'],['print'],['tote','#EFE6D2']],
  render(){seed=5;const A=[150,124,92];let fl='';
   for(let a=196;a<=318;a+=7){const [x,y]=pol(A[0],A[1],A[2]+2,a);const n=3+Math.floor(rnd()*3);for(let k=0;k<n;k++){const dx=(rnd()-.5)*20,dy=(rnd()-.5)*16,rr=4+rnd()*4;fl+=`<circle cx="${(x+dx).toFixed(1)}" cy="${(y+dy).toFixed(1)}" r="${rr.toFixed(1)}" fill="${['#D93A8C','#E860A6','#F08CC0','#C42A7A'][Math.floor(rnd()*4)]}"/>`}
    fl+=leaf(x+(rnd()-.5)*18,y+(rnd()-.5)*14,11,rnd()*360,'#4E8A4A')}
   for(let y=150;y<230;y+=10){const x=58+Math.sin(y/9)*4;fl+=`<circle cx="${x+6}" cy="${y}" r="${4+rnd()*2.5}" fill="${rnd()<.5?'#E860A6':'#D93A8C'}"/>`+(rnd()<.5?leaf(x+8,y+4,9,60+rnd()*60,'#4E8A4A'):'')}
   return `<g transform="translate(15 2) scale(.9)"><path d="M58 290 V124 A92 92 0 0 1 242 124 V290Z" fill="#FBF7F0" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
   <path d="M96 290 V150 A54 54 0 0 1 204 150 V290Z" fill="#E4DCCD"/>
   <path d="M104 290 V152 A46 46 0 0 1 196 152 V290Z" fill="#1F5FC4" stroke="${INK}" stroke-width="2.5"/>
   <path d="M150 106 V290" stroke="#174A9A" stroke-width="2.5"/>
   ${[[114,166],[158,166],[114,228],[158,228]].map(([x,y])=>`<rect x="${x}" y="${y}" width="28" height="50" rx="2" fill="none" stroke="#6E9BE8" stroke-width="1.8"/>`).join('')}
   <circle cx="144" cy="222" r="3" fill="#E6C66A"/><circle cx="156" cy="222" r="3" fill="#E6C66A"/>
   <rect x="88" y="282" width="124" height="10" fill="#D9D1C4" stroke="${INK}" stroke-width="2"/>
   <rect x="124" y="70" width="52" height="20" rx="3" fill="#1F5FC4" stroke="${INK}" stroke-width="1.6"/><text x="150" y="85" text-anchor="middle" font-family="Fraunces" font-weight="900" font-size="13" letter-spacing="2" fill="#FBF7F0">OIA</text>
   ${fl}
   <path d="M216 290 L220 258 H250 L254 290Z" fill="#C4643B" stroke="${INK}" stroke-width="2"/>${leaf(224,256,14,-120)}${leaf(240,254,14,-60)}${leaf(232,250,12,-90)}<circle cx="228" cy="246" r="4" fill="#D9383A"/><circle cx="240" cy="244" r="4" fill="#D9383A"/></g>
   <text x="150" y="292" text-anchor="middle" font-family="Fraunces" font-weight="900" font-size="22" letter-spacing="7" fill="${INK}">SANTORINI</text>`}},
],
/* ======================= LISBON ======================= */
lisbon:[
 {id:'tram-28',name:'Tram 28',story:'The yellow tram that rattles up Lisbon’s hills, so steep and narrow you can touch the walls. Head-on, with its route number lit up.',best:'Heavyweight tee, mug, sticker, print',apps:[['tee','#F2EBDD'],['mug','#FFFFFF'],['sticker']],
  render(){const c=uid('c');return `<defs><clipPath id="${c}"><rect x="14" y="14" width="272" height="272" rx="26"/></clipPath></defs>
   <g clip-path="url(#${c})"><rect width="300" height="300" fill="#F6DDB3"/>
    <rect x="14" y="70" width="70" height="200" fill="#E58C7E"/><path d="M10 70 L49 52 L88 70Z" fill="#C4643B"/>${[0,1,2].map(r=>[0,1].map(k=>`<rect x="${24+k*32}" y="${84+r*40}" width="20" height="26" fill="#FBF3E4"/>`).join('')).join('')}
    <rect x="216" y="56" width="74" height="214" fill="#9CC3D5"/><path d="M212 56 L253 38 L294 56Z" fill="#C4643B"/>${[0,1,2,3].map(r=>[0,1].map(k=>`<rect x="${226+k*32}" y="${70+r*38}" width="20" height="24" fill="#FBF3E4"/>`).join('')).join('')}
    <path d="M0 30 L300 40" stroke="${INK}" stroke-width="2"/><path d="M150 58 L184 36" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>
    <rect x="0" y="244" width="300" height="60" fill="#B9A58A"/>${[256,268,280,292].map((y,k)=>`<path d="M0 ${y} Q150 ${y-6} 300 ${y}" stroke="#A08C70" stroke-width="1.2" fill="none"/>`).join('')}
    <path d="M112 244 L70 300 M188 244 L230 300" stroke="${INK}" stroke-width="3"/>
    <rect x="96" y="48" width="108" height="16" rx="6" fill="#F4EBDA" stroke="${INK}" stroke-width="3"/>
    <rect x="84" y="58" width="132" height="178" rx="22" fill="#E6A92A" stroke="${INK}" stroke-width="4"/>
    <rect x="102" y="70" width="96" height="32" rx="4" fill="${INK}"/><text x="150" y="95" text-anchor="middle" font-family="Fraunces" font-weight="900" font-size="26" fill="#F6D57A">28</text>
    <rect x="96" y="110" width="108" height="58" rx="8" fill="#BFD7E6" stroke="${INK}" stroke-width="3"/><path d="M150 110 V168" stroke="${INK}" stroke-width="3"/><path d="M106 150 L124 120 M164 150 L182 120" stroke="#FFFFFF" stroke-width="3" opacity=".7"/>
    <rect x="84" y="178" width="132" height="12" fill="#F4EBDA"/>
    <circle cx="150" cy="206" r="11" fill="#FFF3C4" stroke="${INK}" stroke-width="3"/><circle cx="106" cy="206" r="6" fill="#C8452F"/><circle cx="194" cy="206" r="6" fill="#C8452F"/>
    <rect x="80" y="226" width="140" height="12" rx="3" fill="${INK}"/><rect x="100" y="238" width="26" height="10" fill="${INK}"/><rect x="174" y="238" width="26" height="10" fill="${INK}"/>
    <rect x="14" y="252" width="272" height="34" fill="${INK}"/><text x="150" y="277" text-anchor="middle" font-family="Fraunces" font-weight="900" font-size="24" letter-spacing="10" fill="#F6D57A">LISBOA</text>
   </g><rect x="14" y="14" width="272" height="272" rx="26" fill="none" stroke="${INK}" stroke-width="5"/>`}},
 {id:'nata',name:'Pastel de Nata',story:'Blistered, burnt-sugar custard in flaky pastry, still warm, with cinnamon on top. You had three a day and don’t regret it. Served on a hand-painted blue plate.',best:'Mug, tee, tote, sticker',apps:[['mug','#FFFFFF'],['tee','#FFFFFF'],['sticker']],
  render(){seed=9;const sc=[...Array(30)].map((_,i)=>{const [x,y]=pol(150,150,62,i*12);return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="8.5" fill="#C9782F" stroke="#8B4A1E" stroke-width="1.5"/>`}).join('');
   const rim=[...Array(16)].map((_,i)=>{const a=i*22.5;if((a>35&&a<145)||(a>215&&a<325))return '';const [x,y]=pol(150,150,127,a);return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="3.5" ry="7" fill="#2E5FA8" transform="rotate(${a+90} ${x.toFixed(1)} ${y.toFixed(1)})"/>`}).join('');
   const spots=[[138,136,12,8,'#8B4A1E'],[163,157,10,6,'#A85A22'],[150,170,7,4.5,'#6B3514'],[128,160,8,5,'#A85A22'],[166,132,7,4.5,'#8B4A1E'],[148,149,5,3.5,'#6B3514'],[176,146,5,3,'#6B3514']];
   return `<circle cx="150" cy="150" r="140" fill="#F4F7FA" stroke="${INK}" stroke-width="5"/><circle cx="150" cy="150" r="116" fill="none" stroke="#2E5FA8" stroke-width="2"/>${rim}
   <circle cx="150" cy="150" r="62" fill="#D98E3F"/>${sc}<circle cx="150" cy="150" r="58" fill="#C9782F"/><circle cx="150" cy="150" r="54" fill="#F4D27A"/><circle cx="150" cy="150" r="54" fill="none" stroke="#E7B45C" stroke-width="3"/>
   ${spots.map(([x,y,a,b,c])=>`<ellipse cx="${x}" cy="${y}" rx="${a*1.5}" ry="${b*1.5}" fill="#E0A04A" opacity=".7"/><ellipse cx="${x}" cy="${y}" rx="${a}" ry="${b}" fill="${c}"/>`).join('')}
   ${[...Array(18)].map(()=>`<circle cx="${(126+rnd()*48).toFixed(1)}" cy="${(126+rnd()*48).toFixed(1)}" r=".9" fill="#6B3514"/>`).join('')}
   ${ring(150,150,120,'PASTEL DE NATA','LISBOA · PORTUGAL',14,10,INK,2)}`}},
],
/* ======================= KYOTO ======================= */
kyoto:[
 {id:'gates',name:'Thousand Gates',story:'The tunnel of vermilion gates that climbs the mountain, one after another until the light at the end. With 京都 — Kyoto — on the plaque.',best:'Tee, crewneck, print, tumbler',apps:[['tee','#FFFFFF'],['print'],['tumbler','#F4EFE4']],
  render(){const c=uid('c');let g='';for(let k=11;k>=0;k--){const s=Math.pow(.8,k),W=206*s,H=226*s,bot=118+132*s,top=bot-H,op=(.45+.55*s).toFixed(2);
    g+=`<g opacity="${op}"><rect x="${150-W*.42}" y="${top+H*.1}" width="${W*.075}" height="${H*.9}" fill="#E0452B"/><rect x="${150+W*.42-W*.075}" y="${top+H*.1}" width="${W*.075}" height="${H*.9}" fill="#E0452B"/>
     <rect x="${150-W*.43}" y="${bot-H*.05}" width="${W*.095}" height="${H*.05}" fill="#1E2230"/><rect x="${150+W*.43-W*.095}" y="${bot-H*.05}" width="${W*.095}" height="${H*.05}" fill="#1E2230"/>
     <rect x="${150-W*.47}" y="${top+H*.2}" width="${W*.94}" height="${H*.04}" fill="#E0452B"/><rect x="${150-W*.46}" y="${top+H*.085}" width="${W*.92}" height="${H*.04}" fill="#E0452B"/>
     <path d="M${150-W*.52} ${top+H*.04} Q150 ${top-H*.03} ${150+W*.52} ${top+H*.04} L${150+W*.49} ${top+H*.095} Q150 ${top+H*.035} ${150-W*.49} ${top+H*.095}Z" fill="#1E2230"/></g>`}
   return `<defs><clipPath id="${c}"><rect x="20" y="14" width="260" height="272" rx="16"/></clipPath></defs><g clip-path="url(#${c})">
    <rect width="300" height="300" fill="#3A2A26"/><path d="M20 250 L140 118 H160 L280 250Z" fill="#8C7A66"/><path d="M112 250 L146 118 H154 L188 250Z" fill="#B7A68F"/>
    <circle cx="150" cy="118" r="20" fill="#FFF2D6"/><circle cx="150" cy="118" r="34" fill="#FFF2D6" opacity=".25"/>${g}
    <rect x="139" y="${24+226*.13}" width="22" height="34" rx="2" fill="#1E2230" stroke="#C9A24B" stroke-width="1.5"/>
    <text x="150" y="${24+226*.13+15}" text-anchor="middle" font-family="'Noto Serif JP',serif" font-weight="700" font-size="12" fill="#F6E7C1">京</text><text x="150" y="${24+226*.13+29}" text-anchor="middle" font-family="'Noto Serif JP',serif" font-weight="700" font-size="12" fill="#F6E7C1">都</text>
    <rect x="20" y="250" width="260" height="40" fill="${INK}"/><text x="150" y="277" text-anchor="middle" font-family="Fraunces" font-weight="900" font-size="22" letter-spacing="12" fill="#F6E7C1">KYOTO</text></g>
    <rect x="20" y="14" width="260" height="272" rx="16" fill="none" stroke="${INK}" stroke-width="5"/>`}},
 {id:'matcha',name:'Matcha',story:'Whisked by hand in a rough ceramic bowl in a teahouse older than your country. Bright green foam, a bitter first sip, a quiet afternoon.',best:'Mug, tumbler, tee, tote',apps:[['mug','#FFFFFF'],['tumbler','#F4EFE4'],['tee','#F2EBDD']],
  render(){seed=3;return `<circle cx="150" cy="150" r="140" fill="#E9EDDC" stroke="${INK}" stroke-width="5"/>
   ${[118,150,182].map((x,i)=>`<path d="M${x} ${118-i%2*6} q-10 -14 0 -26 t0 -26" fill="none" stroke="#9AA58A" stroke-width="3" stroke-linecap="round" opacity=".7"/>`).join('')}
   <path d="M60 150 Q64 248 150 252 Q236 248 240 150Z" fill="#3D4250" stroke="${INK}" stroke-width="4"/>
   <path d="M64 170 Q70 184 78 176 Q88 196 98 182 Q108 200 120 186 Q134 202 146 188 Q160 204 172 188 Q186 200 196 184 Q208 198 218 180 Q228 188 236 170" fill="none" stroke="#7B8496" stroke-width="3"/>
   <rect x="118" y="250" width="64" height="9" rx="3" fill="#2A2E38" stroke="${INK}" stroke-width="2"/>
   <ellipse cx="150" cy="150" rx="90" ry="21" fill="#8DB85A" stroke="${INK}" stroke-width="4"/>
   <path d="M88 150 L100 144 L112 156 L124 143 L136 157 L148 143 L160 157 L172 143 L184 156 L196 144 L210 150" fill="none" stroke="#6E9A42" stroke-width="2"/>
   ${[...Array(22)].map(()=>`<ellipse cx="${(80+rnd()*140).toFixed(1)}" cy="${(142+rnd()*16).toFixed(1)}" rx="${(2+rnd()*3).toFixed(1)}" ry="1.4" fill="#C5E39A"/>`).join('')}
   <text x="150" y="92" text-anchor="middle" font-family="Fraunces" font-style="italic" font-weight="700" font-size="40" fill="#3E6B2E">Matcha</text>
   <text x="150" y="276" text-anchor="middle" font-family="Inter" font-weight="700" font-size="9.5" letter-spacing="2" fill="${INK}">KYOTO · JAPAN</text>`}},
],
/* ======================= BANFF ======================= */
banff:[
 {id:'swatch',name:'Glacier Blue',story:'Nobody believes the lake color until they see it — glacial silt turns the water a blue that looks photoshopped. So we made it a paint chip.',best:'Everyday Soft Tee, mug, tumbler, sticker',apps:[['tee','#FFFFFF'],['mug','#FFFFFF'],['sticker']],
  render(){return `<rect x="64" y="20" width="184" height="272" rx="8" fill="#000" opacity=".08"/><rect x="58" y="14" width="184" height="272" rx="8" fill="#FFFFFF" stroke="#CFC9BD" stroke-width="2"/>
   <rect x="72" y="28" width="156" height="150" rx="4" fill="#3FA7A0"/>
   <path d="M72 146 L106 96 L126 118 L154 72 L186 120 L204 102 L228 132 V146Z" fill="#FFFFFF" opacity=".92"/>
   <path d="M72 150 L106 196 L126 174 L154 220 L186 172 L204 190 L228 160 V150Z" fill="#FFFFFF" opacity=".22" transform="translate(0 -18) scale(1 .7) translate(0 64)"/>
   <path d="M72 148 H228" stroke="#FFFFFF" stroke-width="1.5" opacity=".7"/>
   <text x="72" y="202" font-family="Inter" font-weight="700" font-size="11" letter-spacing="3" fill="#7A8195">GLACIER LAKE</text>
   <text x="72" y="236" font-family="Fraunces" font-weight="900" font-size="32" fill="${INK}">Banff Blue</text>
   <text x="72" y="256" font-family="DM Mono" font-size="10" fill="${INK}">51.18°N · 115.57°W · ALBERTA</text>
   <rect x="72" y="266" width="50" height="10" fill="#2E7F7A"/><rect x="125" y="266" width="50" height="10" fill="#3FA7A0"/><rect x="178" y="266" width="50" height="10" fill="#8FD0C8"/>`}},
 {id:'patch',name:'Rocky Mountain Patch',story:'A felt camp patch for Canada’s first national park, set aside in 1885 — peaks, pines, a red canoe on still water.',best:'Crewneck, hoodie, cap, sticker',apps:[['crew','#EFE6D6'],['tee','#F2EBDD'],['sticker']],
  render(){const c=uid('c');const tree=(x,y,k)=>`<path d="M${x} ${y-k*3.4} L${x+k} ${y} L${x-k} ${y}Z" fill="#1E4436"/>`;return `<defs><clipPath id="${c}"><circle cx="150" cy="150" r="98"/></clipPath></defs>
   <circle cx="150" cy="150" r="142" fill="#2B5C4B"/><circle cx="150" cy="150" r="133" fill="none" stroke="#F3F2EA" stroke-width="2.5" stroke-dasharray="6 4"/>
   <g clip-path="url(#${c})"><rect x="40" y="40" width="220" height="220" fill="#D6E7EE"/><circle cx="190" cy="92" r="14" fill="#F2C14E"/>
    <path d="M40 176 L92 100 L118 132 L154 76 L196 138 L222 112 L260 160 V190 H40Z" fill="#8FA3B5"/>
    <path d="M144 90 L154 76 L164 90 L158 88 L154 94 L150 88Z M84 112 L92 100 L100 112 L95 110 L92 115 L89 110Z M216 120 L222 112 L228 120 L224 119 L222 123 L220 119Z" fill="#FFFFFF"/>
    <rect x="40" y="186" width="220" height="80" fill="#3FA7A0"/><path d="M40 184 H260" stroke="#1E4436" stroke-width="5"/>
    ${[[58,188,9],[74,190,12],[90,188,8],[210,188,10],[228,190,13],[246,188,8]].map(([x,y,k])=>tree(x,y,k)).join('')}
    <path d="M118 222 Q150 234 182 222 L176 230 Q150 238 124 230Z" fill="#C8452F"/><circle cx="150" cy="212" r="4" fill="#16213A"/><path d="M150 216 V226 M140 212 L166 232" stroke="#16213A" stroke-width="2.4"/>
    <path d="M96 246 q10 -4 20 0 M170 250 q10 -4 20 0" stroke="#FFFFFF" stroke-width="2" fill="none" opacity=".6"/></g>
   <circle cx="150" cy="150" r="98" fill="none" stroke="#F3F2EA" stroke-width="4"/>
   ${ring(150,150,104,'BANFF','ROCKY MOUNTAINS · EST. 1885',30,11,'#F3F2EA',6)}${stars('#F2C14E',120)}`}},
],
/* ======================= CINQUE TERRE ======================= */
'cinque-terre':[
 {id:'five',name:'Five Villages',story:'Monterosso, Vernazza, Corniglia, Manarola, Riomaggiore — you hiked between all five. One house for each, in the colors they’re painted.',best:'Tee, tote, print, mug',apps:[['tee','#FFFFFF'],['tote','#EFE6D2'],['print']],
  render(){const c=uid('c');const N=['MONTEROSSO','VERNAZZA','CORNIGLIA','MANAROLA','RIOMAGGIORE'],C=['#C24A3A','#F6C85F','#E88B4E','#E6A0A0','#9DBF8F'],H=[124,152,108,140,118];
   const hs=N.map((n,i)=>{const x=30+i*48,w=48,h=H[i],y=210-h;let win='';for(let yy=y+16;yy<205;yy+=30)win+=`<rect x="${x+10}" y="${yy}" width="7" height="14" fill="#3E6B3A"/><rect x="${x+18}" y="${yy}" width="12" height="14" fill="#2A3A4A"/><rect x="${x+31}" y="${yy}" width="7" height="14" fill="#3E6B3A"/>`;
     return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${C[i]}" stroke="${INK}" stroke-width="2"/><rect x="${x-2}" y="${y-7}" width="${w+4}" height="9" fill="#7A5A48" stroke="${INK}" stroke-width="2"/>${win}
      <text x="${x+w/2}" y="227" text-anchor="middle" font-family="Inter" font-weight="700" font-size="${n.length>9?5.8:6.6}" letter-spacing=".4" fill="#F6F0E4">${n}</text>`}).join('');
   return `<defs><clipPath id="${c}"><rect x="14" y="14" width="272" height="272" rx="24"/></clipPath></defs><g clip-path="url(#${c})">
    <rect width="300" height="300" fill="#D2E8F3"/><rect x="14" y="210" width="272" height="26" fill="#6E5242"/>${hs}
    <rect x="14" y="236" width="272" height="60" fill="#2C6E9E"/>${[248,262,276].map((y,k)=>`<path d="M${30+k*20} ${y} q8 -4 16 0 t16 0 M${150+k*14} ${y+4} q8 -4 16 0 t16 0" stroke="#FFFFFF" stroke-width="1.6" fill="none" opacity=".5"/>`).join('')}
    <path d="M222 262 h34 l-6 8 h-22z" fill="#C24A3A" stroke="${INK}" stroke-width="1.5"/><path d="M239 262 V248" stroke="${INK}" stroke-width="1.5"/>
    <text x="150" y="46" text-anchor="middle" font-family="Fraunces" font-weight="900" font-size="28" letter-spacing="2" fill="${INK}">CINQUE TERRE</text></g>
    <rect x="14" y="14" width="272" height="272" rx="24" fill="none" stroke="${INK}" stroke-width="5"/>`}},
 {id:'limoni',name:'Limoni',story:'Lemons the size of your fist growing on terraces above the sea — and the limoncello that came after. A crate label for the Ligurian coast.',best:'Mug, tote, tee, print',apps:[['mug','#FFFFFF'],['tote','#EFE6D2'],['tee','#F2EBDD']],
  render(){return `<rect x="18" y="40" width="264" height="220" rx="16" fill="#1F3F6E" stroke="${INK}" stroke-width="4"/><rect x="28" y="50" width="244" height="200" rx="9" fill="none" stroke="#F6E7C1" stroke-width="2"/>
   <text x="150" y="102" text-anchor="middle" font-family="Fraunces" font-style="italic" font-weight="700" font-size="46" fill="#F6E7C1">Limoni</text>
   <path d="M88 126 Q150 112 214 132" stroke="#6B4A34" stroke-width="3" fill="none"/>
   ${leaf(96,126,26,-160)}${leaf(206,132,28,-20)}${leaf(150,118,24,-80)}${leaf(176,124,22,20)}${leaf(120,122,22,200)}
   ${lemon(118,168,30,22,-14)}${lemon(186,172,30,22,16)}${lemon(152,150,28,20,4)}
   <text x="150" y="232" text-anchor="middle" font-family="Inter" font-weight="700" font-size="11" letter-spacing="3" fill="#F6E7C1">CINQUE TERRE · LIGURIA</text>`}},
],
/* ======================= CAPPADOCIA ======================= */
cappadocia:[
 {id:'balloons',name:'Worth the 5 a.m. Alarm',story:'Up before dawn, coffee in a paper cup, and then a hundred balloons lift over the fairy chimneys at once. You’ll never forget it — or the alarm.',best:'Tee, crewneck, print, mug',apps:[['tee','#F2EBDD'],['print'],['mug','#FFFFFF']],
  render(){const c=uid('c'),g=uid('g');const B=[[150,118,34,'#C8452F','#F6E27A'],[84,84,20,'#2E6FB5','#F6E7C1'],[222,78,18,'#F2B84B','#C8452F'],[110,150,13,'#2E8B6A','#F6E7C1'],[208,146,15,'#7A4FA8','#F2B84B'],[58,138,10,'#F2B84B','#2E6FB5'],[250,120,9,'#C8452F','#F6E7C1'],[176,58,11,'#E86A8F','#F6E7C1'],[122,48,8,'#2E6FB5','#F2B84B']];
   const cone=(x,b,h,w)=>`<path d="M${x-w/2} ${b} Q${x-w*.3} ${b-h*.5} ${x-w*.14} ${b-h} L${x+w*.14} ${b-h} Q${x+w*.3} ${b-h*.5} ${x+w/2} ${b}Z" fill="#C4643B"/><ellipse cx="${x}" cy="${b-h}" rx="${w*.26}" ry="4.5" fill="#5A3A2A"/>`;
   return `<defs><clipPath id="${c}"><rect x="14" y="14" width="272" height="272" rx="24"/></clipPath><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9FB8D8"/><stop offset=".55" stop-color="#F7CFA6"/><stop offset="1" stop-color="#FBE3C4"/></linearGradient></defs>
   <g clip-path="url(#${c})"><rect width="300" height="300" fill="url(#${g})"/><circle cx="60" cy="226" r="26" fill="#F6E27A" opacity=".9"/>
    ${[...B].sort((a,b)=>a[2]-b[2]).map(b=>balloon(...b)).join('')}
    <path d="M0 300 V236 Q150 222 300 238 V300Z" fill="#E0B98E"/>${cone(40,246,46,28)}${cone(76,250,66,32)}${cone(216,248,54,30)}${cone(252,252,40,24)}${cone(150,252,30,22)}
    <rect x="14" y="252" width="272" height="34" fill="${INK}"/><text x="150" y="275" text-anchor="middle" font-family="Fraunces" font-style="italic" font-weight="500" font-size="16" fill="#FBE3C4">Worth the 5 a.m. alarm</text>
    <text x="150" y="46" text-anchor="middle" font-family="Fraunces" font-weight="900" font-size="26" letter-spacing="3" fill="${INK}">CAPPADOCIA</text></g>
   <rect x="14" y="14" width="272" height="272" rx="24" fill="none" stroke="${INK}" stroke-width="5"/>`}},
 {id:'kilim',name:'Kilim',story:'The hand-woven rugs every shop in Göreme unrolls for you over tea — framing the fairy chimneys you slept inside.',best:'Tote, crewneck, print, tee',apps:[['tote','#EFE6D2'],['crew','#EFE6D6'],['print']],
  render(){const p=uid('p');return `<defs><pattern id="${p}" width="24" height="24" patternUnits="userSpaceOnUse"><rect width="24" height="24" fill="#B8323A"/><path d="M12 2 L22 12 L12 22 L2 12Z" fill="#1F3050"/><path d="M12 7 L17 12 L12 17 L7 12Z" fill="#F2B84B"/><circle cx="12" cy="12" r="2" fill="#F6EADA"/></pattern></defs>
   <rect x="14" y="14" width="272" height="272" rx="10" fill="url(#${p})" stroke="${INK}" stroke-width="4"/><rect x="42" y="42" width="216" height="216" fill="#F6EADA" stroke="#F6EADA" stroke-width="6"/><rect x="48" y="48" width="204" height="204" fill="none" stroke="#B8323A" stroke-width="2"/>
   <circle cx="198" cy="92" r="16" fill="#F2B84B"/>${balloon(96,92,14,'#C8452F','#F6E7C1')}
   <path d="M48 214 Q150 204 252 216 V252 H48Z" fill="#E9D3B4"/>
   ${[[104,216,78,40],[150,220,104,46],[198,216,70,38]].map(([x,b,h,w])=>`<path d="M${x-w/2} ${b} Q${x-w*.3} ${b-h*.5} ${x-w*.14} ${b-h} L${x+w*.14} ${b-h} Q${x+w*.3} ${b-h*.5} ${x+w/2} ${b}Z" fill="#C4643B" stroke="${INK}" stroke-width="2"/><ellipse cx="${x}" cy="${b-h}" rx="${w*.28}" ry="6" fill="#5A3A2A" stroke="${INK}" stroke-width="2"/><path d="M${x-4} ${b-h*.45} v-8 a4 4 0 0 1 8 0 v8z" fill="${INK}"/>`).join('')}
   <text x="150" y="240" text-anchor="middle" font-family="Fraunces" font-style="italic" font-weight="700" font-size="22" fill="${INK}">Cappadocia</text>`}},
],
/* ======================= TULUM ======================= */
tulum:[
 {id:'cenote',name:'Cenote',story:'Climbing down into a limestone cave, a single beam of sun hitting impossibly clear water, vines hanging from the hole above. Then you jump in.',best:'Tee, tumbler, sticker, tote',apps:[['tee','#F2EBDD'],['tumbler','#F4EFE4'],['sticker']],
  render(){seed=4;const c=uid('c'),g=uid('g');return `<defs><clipPath id="${c}"><circle cx="150" cy="150" r="104"/></clipPath><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FE3E0"/><stop offset="1" stop-color="#138080"/></linearGradient></defs>
   <circle cx="150" cy="150" r="142" fill="#2F2A26"/>${[...Array(14)].map(()=>{const [x,y]=pol(150,150,112+rnd()*22,rnd()*360);return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${(5+rnd()*8).toFixed(1)}" ry="${(3+rnd()*4).toFixed(1)}" fill="#3D3530"/>`}).join('')}
   <g clip-path="url(#${c})"><rect x="40" y="40" width="220" height="220" fill="#241F1C"/>
    <path d="M130 46 H170 L230 200 H70Z" fill="#FFF6D8" opacity=".22"/><path d="M140 46 H160 L196 200 H104Z" fill="#FFF6D8" opacity=".22"/>
    <ellipse cx="150" cy="46" rx="26" ry="8" fill="#FFF6D8"/>
    <ellipse cx="150" cy="222" rx="118" ry="44" fill="url(#${g})"/><ellipse cx="150" cy="206" rx="40" ry="8" fill="#FFFFFF" opacity=".3"/>
    ${[118,136,164,182].map((x,i)=>`<path d="M${x} 48 q${i%2?6:-6} 30 0 ${50+i*14}" stroke="#3F7A45" stroke-width="2" fill="none"/>${leaf(x,70+i*8,9,100)}${leaf(x,96+i*10,9,70)}`).join('')}
    <circle cx="168" cy="212" r="4" fill="#3A2A20"/><path d="M160 216 q8 -4 16 0" stroke="#3A2A20" stroke-width="2.4" fill="none"/><ellipse cx="168" cy="218" rx="12" ry="2.5" fill="#FFFFFF" opacity=".45"/></g>
   <circle cx="150" cy="150" r="104" fill="none" stroke="#C9B89C" stroke-width="3"/>
   ${ring(150,150,110,'CENOTE','TULUM · MÉXICO',26,13,'#F4E7CF',6)}${stars('#8FE3E0',126)}`}},
 {id:'playa',name:'Día de Playa',story:'A hammock strung between two palms, a hat on the sand, the Caribbean doing its thing. The whole plan for the day.',best:'Tee, tote, tumbler, towel',apps:[['tee','#FFFFFF'],['tote','#EFE6D2'],['tumbler','#F4EFE4']],
  render(){const c=uid('c');const palm=(x,y,h,l)=>{const tx=x+l,ty=y-h;return `<path d="M${x} ${y} Q${x+l*.4} ${y-h/2} ${tx} ${ty}" stroke="#7A5A3A" stroke-width="7" fill="none" stroke-linecap="round"/>`+[[-34,6],[-26,22],[32,8],[24,24],[-4,-18],[10,-16]].map(([dx,dy])=>`<path d="M${tx} ${ty} Q${tx+dx*.5} ${ty-12+dy*.2} ${tx+dx} ${ty+dy} Q${tx+dx*.5} ${ty-4+dy*.3} ${tx} ${ty}Z" fill="#2E6B4A"/>`).join('')};
   return `<defs><clipPath id="${c}"><rect x="14" y="14" width="272" height="272" rx="24"/></clipPath></defs><g clip-path="url(#${c})">
    <rect width="300" height="300" fill="#F8E2B8"/><circle cx="150" cy="150" r="72" fill="#F6B84B"/>${[0,1,2,3].map(i=>`<rect x="70" y="${156+i*11}" width="160" height="${2+i*1.5}" fill="#F8E2B8"/>`).join('')}
    <rect x="14" y="176" width="272" height="44" fill="#1D8A8A"/><rect x="14" y="190" width="272" height="5" fill="#46B3AE"/><rect x="14" y="204" width="272" height="4" fill="#46B3AE"/>
    <path d="M0 300 V214 Q150 204 300 216 V300Z" fill="#F1DDB5"/>
    ${palm(62,236,120,18)}${palm(238,236,120,-18)}
    <path d="M70 176 Q150 226 230 176" stroke="#C8452F" stroke-width="3" fill="none"/><path d="M70 176 Q150 214 230 176" stroke="#C8452F" stroke-width="3" fill="none"/>${[90,110,130,150,170,190,210].map(x=>`<path d="M${x} ${176+ (1-Math.pow((x-150)/80,2))*38} L${x} ${176+(1-Math.pow((x-150)/80,2))*50}" stroke="#F2B84B" stroke-width="2"/>`).join('')}
    <ellipse cx="116" cy="246" rx="18" ry="5" fill="#E4C27A"/><ellipse cx="116" cy="241" rx="9" ry="6" fill="#E4C27A"/><path d="M107 243 H125" stroke="#C8452F" stroke-width="2.5"/>
    <text x="150" y="56" text-anchor="middle" font-family="Fraunces" font-style="italic" font-weight="700" font-size="22" fill="#12302F">Día de playa</text>
    <text x="150" y="278" text-anchor="middle" font-family="Fraunces" font-weight="900" font-size="38" letter-spacing="6" fill="#1D8A8A" stroke="#12302F" stroke-width="1.5" paint-order="stroke">TULUM</text></g>
    <rect x="14" y="14" width="272" height="272" rx="24" fill="none" stroke="${INK}" stroke-width="5"/>`}},
],
/* ======================= CHEFCHAOUEN ======================= */
chefchaouen:[
 {id:'keyhole',name:'The Blue Pearl',story:'A keyhole arch in a wall painted every shade of blue, geraniums in tin pots, studs on the door. Chefchaouen’s nickname — the Blue Pearl — on the wall above.',best:'Tee, print, tote, ornament',apps:[['tee','#FFFFFF'],['print'],['tote','#EFE6D2']],
  render(){const c=uid('c');const cx=150,cy=150,R=52;const a1=pol(cx,cy,R,157),a2=pol(cx,cy,R,23),b1=pol(cx,cy,R+12,154),b2=pol(cx,cy,R+12,26);
   const pot=(x,y)=>`<path d="M${x-9} ${y} H${x+9} L${x+6} ${y+14} H${x-6}Z" fill="#C4643B" stroke="${INK}" stroke-width="1.5"/>${leaf(x-4,y-2,12,-150)}${leaf(x+4,y-2,12,-30)}<circle cx="${x-3}" cy="${y-8}" r="4" fill="#D9383A"/><circle cx="${x+4}" cy="${y-10}" r="4" fill="#E0505A"/>`;
   return `<defs><clipPath id="${c}"><rect x="14" y="14" width="272" height="272" rx="24"/></clipPath></defs><g clip-path="url(#${c})">
    <rect width="300" height="300" fill="#4F8FD8"/><rect x="60" y="14" width="180" height="290" fill="#7FB0EC"/>
    <path d="M${P2(b1)} A${R+12} ${R+12} 0 1 1 ${P2(b2)} V286 H${b1[0]}Z" fill="#F2F5FA" stroke="${INK}" stroke-width="2.5"/>
    <path d="M${P2(a1)} A${R} ${R} 0 1 1 ${P2(a2)} V286 H${a1[0]}Z" fill="#24539A" stroke="${INK}" stroke-width="2.5"/>
    <path d="M150 ${cy-R} V286" stroke="#183E78" stroke-width="2.5"/>
    ${[0,1,2,3,4].map(r=>[0,1,2,3].map(k=>`<circle cx="${118+k*21.3}" cy="${156+r*24}" r="2.4" fill="#F2B84B"/>`).join('')).join('')}
    <circle cx="150" cy="200" r="8" fill="none" stroke="#F2B84B" stroke-width="2.5"/>
    <rect x="80" y="272" width="140" height="14" fill="#DCE9F7" stroke="${INK}" stroke-width="2"/>
    ${pot(38,90)}${pot(38,150)}${pot(262,90)}${pot(262,150)}${pot(40,230)}${pot(260,230)}
    <text x="150" y="50" text-anchor="middle" font-family="Fraunces" font-weight="900" font-size="22" letter-spacing="2" fill="#FFFFFF">CHEFCHAOUEN</text>
    <text x="150" y="74" text-anchor="middle" font-family="Fraunces" font-style="italic" font-weight="500" font-size="16" fill="#FFFFFF">The Blue Pearl</text></g>
    <rect x="14" y="14" width="272" height="272" rx="24" fill="none" stroke="${INK}" stroke-width="5"/>`}},
 {id:'atay',name:'Atay',story:'Mint tea poured from a silver pot held high above the glass — the higher the pour, the better the foam. Offered everywhere, refused nowhere.',best:'Mug, tumbler, tee, tote',apps:[['mug','#FFFFFF'],['tumbler','#F4EFE4'],['tee','#F2EBDD']],
  render(){const g=uid('g');return `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E0B55A"/><stop offset="1" stop-color="#9A6A22"/></linearGradient></defs>
   <circle cx="150" cy="150" r="140" fill="#F2EAD8" stroke="${INK}" stroke-width="5"/>
   <g transform="translate(-8 0)"><path d="M58 96 Q52 64 80 56 Q108 52 112 84 Q116 112 86 118 Q60 120 58 96Z" fill="#B9BEC6" stroke="${INK}" stroke-width="3"/>
    <path d="M110 80 Q140 62 156 70" fill="none" stroke="#B9BEC6" stroke-width="7" stroke-linecap="round"/><path d="M110 80 Q140 62 156 70" fill="none" stroke="${INK}" stroke-width="1.5" opacity=".4"/>
    <path d="M68 58 Q84 36 100 58Z" fill="#B9BEC6" stroke="${INK}" stroke-width="3"/><circle cx="84" cy="40" r="5" fill="#B9BEC6" stroke="${INK}" stroke-width="2"/>
    <path d="M60 88 Q46 84 48 100" fill="none" stroke="#B9BEC6" stroke-width="6"/><path d="M68 70 H100 M64 104 H106" stroke="#8F959E" stroke-width="2"/></g>
   <path d="M148 70 Q156 112 162 150" fill="none" stroke="#C98A2E" stroke-width="3.5" stroke-linecap="round"/>
   <path d="M128 150 H196 L188 252 H136Z" fill="url(#${g})" stroke="${INK}" stroke-width="3"/><rect x="128" y="150" width="68" height="10" fill="#F6E3B0"/>
   <path d="M132 176 H192 M134 194 H190" stroke="#D8B04A" stroke-width="3"/>${[140,152,164,176].map(x=>`<path d="M${x} 178 l4 7 l4 -7 l-4 -1z" fill="#D8B04A"/>`).join('')}
   <path d="M136 156 L140 248" stroke="#FFFFFF" stroke-width="4" opacity=".35"/>
   ${leaf(136,150,20,-120,'#3F8A45')}${leaf(140,146,18,-80,'#4E9A50')}${leaf(132,152,16,-160,'#3F8A45')}
   <text x="226" y="100" text-anchor="middle" font-family="Fraunces" font-style="italic" font-weight="700" font-size="36" fill="#3F6B2E">Atay</text>
   <text x="226" y="120" text-anchor="middle" font-family="Inter" font-weight="700" font-size="9.5" letter-spacing="3" fill="${INK}">CHAOUEN</text>`}},
],
/* ======================= REYKJAVÍK ======================= */
reykjavik:[
 {id:'aurora',name:'Aurora Forecast',story:'Refreshing the aurora app at midnight, KP 5, standing in the cold until the sky finally turned green. Printed like the forecast that told you to go outside.',best:'Crewneck, hoodie, mug, tee',apps:[['crew','#2F3B52'],['mug','#1B2A4A'],['tee','#3A3A3A']],
  render(){seed=6;const c=uid('c'),g=uid('g');const bars=[2,3,3,4,5,5,4,3];return `<defs><clipPath id="${c}"><rect x="14" y="14" width="272" height="272" rx="24"/></clipPath><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6FE3B0" stop-opacity="0"/><stop offset=".6" stop-color="#6FE3B0" stop-opacity=".7"/><stop offset="1" stop-color="#9AF2C8" stop-opacity=".95"/></linearGradient></defs>
   <g clip-path="url(#${c})"><rect width="300" height="300" fill="#132235"/>${[...Array(26)].map(()=>`<circle cx="${(20+rnd()*260).toFixed(1)}" cy="${(20+rnd()*120).toFixed(1)}" r="${(.6+rnd()*1.1).toFixed(1)}" fill="#FFFFFF" opacity=".8"/>`).join('')}
    <path d="M14 120 Q70 40 140 88 Q200 128 286 60 L286 110 Q200 170 140 128 Q70 84 14 160Z" fill="url(#${g})"/>
    <path d="M14 96 Q90 30 170 70 Q230 100 286 40 L286 64 Q230 124 170 94 Q90 56 14 124Z" fill="#B58CF0" opacity=".22"/>
    ${[40,70,100,130,160,190,220,250].map((x,i)=>`<path d="M${x} ${100+Math.sin(i)*20} v${-30-i%3*10}" stroke="#C8FFE4" stroke-width="1.2" opacity=".35"/>`).join('')}
    <path d="M14 196 Q70 150 130 172 Q190 150 286 180 V214 H14Z" fill="#1F3550"/><path d="M110 168 l12 -6 10 6 M180 162 l12 -5 10 6" stroke="#DCE6EE" stroke-width="2.5" fill="none"/>
    <rect x="14" y="204" width="272" height="12" fill="#DCE6EE"/><rect x="196" y="186" width="22" height="18" fill="#C8452F"/><path d="M193 186 L207 176 L221 186Z" fill="#2A3242"/><rect x="204" y="192" width="6" height="6" fill="#F6D57A"/>
    <rect x="14" y="216" width="272" height="70" fill="#0E1A2A"/>
    <text x="34" y="238" font-family="Inter" font-weight="700" font-size="9.5" letter-spacing="2" fill="#9AF2C8">AURORA FORECAST</text><text x="34" y="52" font-family="Fraunces" font-weight="900" font-size="20" letter-spacing="2" fill="#F6F0E4">REYKJAVÍK</text>
    <text x="34" y="272" font-family="Fraunces" font-weight="900" font-size="30" fill="#F6F0E4">KP 5</text>
    <text x="266" y="238" text-anchor="end" font-family="DM Mono" font-size="8.5" letter-spacing="1" fill="#8EA3BB">TONIGHT</text>
    ${bars.map((h,i)=>`<rect x="${150+i*15}" y="${274-h*6}" width="11" height="${h*6}" rx="1.5" fill="${h>=5?'#F2C14E':'#6FE3B0'}"/>`).join('')}</g>
   <rect x="14" y="14" width="272" height="272" rx="24" fill="none" stroke="#F6F0E4" stroke-width="4"/>`}},
 {id:'yoke',name:'Lopapeysa',story:'The Icelandic wool sweater with the patterned yoke around the collar — every grandmother’s pattern a little different. Printed as a yoke that sits right at the neckline.',best:'Crewneck (neckline print), tote, mug, ornament',apps:[['crew','#E8E2D6'],['mug','#FFFFFF'],['tote','#EFE6D2']],
  render(){const C='#2A2F3A',R='#B8453A',O='#E8E2D6';let s='';
   s+=`<circle cx="150" cy="150" r="142" fill="${O}" stroke="${INK}" stroke-width="4"/>`;
   s+=`<circle cx="150" cy="150" r="128" fill="none" stroke="${C}" stroke-width="3"/><circle cx="150" cy="150" r="88" fill="none" stroke="${C}" stroke-width="3"/><circle cx="150" cy="150" r="62" fill="none" stroke="${C}" stroke-width="3"/>`;
   for(let i=0;i<28;i++){const a=i*360/28,b=a+360/56,e=a+360/28;s+=`<path d="M${P2(pol(150,150,64,a))} L${P2(pol(150,150,86,b))} L${P2(pol(150,150,64,e))}Z" fill="${C}"/>`}
   for(let i=0;i<20;i++){const a=i*18;const p=[pol(150,150,92,a),pol(150,150,108,a-5.5),pol(150,150,124,a),pol(150,150,108,a+5.5)];s+=`<path d="M${p.map(P2).join(' L')}Z" fill="${R}"/><circle cx="${pol(150,150,108,a)[0].toFixed(1)}" cy="${pol(150,150,108,a)[1].toFixed(1)}" r="2.4" fill="${O}"/>`;
     const q=pol(150,150,108,a+9);s+=`<circle cx="${q[0].toFixed(1)}" cy="${q[1].toFixed(1)}" r="2.2" fill="${C}"/>`}
   for(let i=0;i<48;i++){const a=i*7.5;s+=`<path d="M${P2(pol(150,150,130,a))} L${P2(pol(150,150,139,a+3.75))} L${P2(pol(150,150,130,a+7.5))}" fill="none" stroke="${C}" stroke-width="2"/>`}
   for(let i=0;i<40;i++){const a=i*9;s+=`<path d="M${P2(pol(150,150,52,a))} L${P2(pol(150,150,61,a))}" stroke="${C}" stroke-width="2.4"/>`}
   s+=`<circle cx="150" cy="150" r="50" fill="#F6F0E4" stroke="${C}" stroke-width="3"/><text x="150" y="152" text-anchor="middle" font-family="Fraunces" font-weight="900" font-size="18" letter-spacing="1" fill="${INK}">ÍSLAND</text><text x="150" y="168" text-anchor="middle" font-family="Inter" font-weight="700" font-size="7.5" letter-spacing="2" fill="${INK}">REYKJAVÍK</text>`;
   return s}},
],
};
window.SIG=SIG;

/* ---------------- page wiring ---------------- */
const CORE=['passport','postmark'];
const LIB=FAM.filter(F=>!CORE.includes(F.id));
function card(F,art,i,total,meta,apps){return `<article class="fam" id="f-${F.id}">
  <div class="art" style="background:${F.id==='poster'?'#E9DFCC':cur.P.tile}"><svg viewBox="0 0 300 300" role="img" aria-label="${esc(F.name)} design for ${esc(cur.city)}">${art}</svg></div>
  <div><span class="fnum">${String(i+1).padStart(2,'0')} / ${total}</span><h3>${F.name}</h3><p class="concept">${F.story||F.concept}</p>
   <dl class="meta">${meta}</dl>
   <div class="apps">${apps.map(([k,c])=>`<div class="app">${mock(k,F.render(cur),c)}<small>${APPNAME[k]}</small></div>`).join('')}</div></div></article>`}
window.drawFams=function(){
  const core=CORE.map(id=>FAM.find(F=>F.id===id));
  document.getElementById('coreList').innerHTML=core.map((F,i)=>card(F,F.render(cur),i,core.length,`<dt>Best on</dt><dd>${F.best}</dd><dt>Personalize</dt><dd>${F.persona}</dd><dt>Print</dt><dd>${F.print}</dd>`,APPS[F.id])).join('');
  const sig=SIG[cur.id]||[];
  document.querySelectorAll('.cityName').forEach(e=>e.textContent=cur.city);
  document.getElementById('sigList').innerHTML=sig.map((F,i)=>card(F,F.render(cur),i,sig.length,`<dt>Best on</dt><dd>${F.best}</dd><dt>Only for</dt><dd>${esc(cur.city)}, ${esc(cur.country)}</dd><dt>Rights</dt><dd><span class="rights"><i></i>Original art — clear to sell</span></dd>`,F.apps)).join('');
  document.getElementById('libList').innerHTML=LIB.map(F=>`<figure class="lib-tile"><div class="art" style="background:${F.id==='poster'?'#E9DFCC':cur.P.tile}"><svg viewBox="0 0 300 300">${F.render(cur)}</svg></div><figcaption><b>${F.name}</b><span>${F.best}</span></figcaption></figure>`).join('');
};
drawFams();
})();
