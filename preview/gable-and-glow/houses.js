/* Gable & Glow demo: original SVG houses + bulb engine. All houses share a 640x410 box, ground line at y=352. */
(function(){
'use strict';
var NS='http://www.w3.org/2000/svg';
var W='#FFD98A',P='#F2F7FF',R='#F0303F',G='#35C759',B='#3B74FF',O='#FF8A1F',Y='#FFC21A',V='#A855F7';
var SCHEMES=[
 {id:'warm-white',name:'Warm White',desc:'The classic. Soft, golden and never out of style.',c:[W]},
 {id:'pure-white',name:'Pure White',desc:'Crisp and bright, like fresh snow.',c:[P]},
 {id:'candy-cane',name:'Candy Cane',desc:'Red and white, one after the other.',c:[R,P]},
 {id:'red-green',name:'Red & Green',desc:'The traditional Christmas pair.',c:[R,G]},
 {id:'icy-blue',name:'Icy Blue',desc:'Blue and white for a frosty look.',c:[B,P]},
 {id:'multi',name:'Classic Multicolor',desc:'Red, green, blue, gold and purple in turn.',c:[R,G,B,Y,V]},
 {id:'multi-pairs',name:'Multicolor Pairs',desc:'The same five colors, grouped two by two.',c:[R,R,G,G,B,B,Y,Y,V,V]},
 {id:'evergreen-gold',name:'Evergreen & Gold',desc:'Green with warm gold accents.',c:[G,G,Y]},
 {id:'harvest',name:'Harvest',desc:'Orange and warm white for October and November.',c:[O,W]},
 {id:'orchid-lime',name:'Orchid & Lime',desc:'Purple and green, for Halloween or just for fun.',c:[V,V,G]}
];
var WIN='#FFE2A8';
function win(x,y,w,h,o){return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="'+WIN+'" opacity="'+(o||.42)+'"/><path d="M'+(x+w/2)+' '+y+' v'+h+' M'+x+' '+(y+h/2)+' h'+w+'" stroke="#0B1222" stroke-width="1.5" opacity=".6"/>'}
function box(x,y,w,h){return 'M'+x+' '+y+' h'+w+' v'+h+' h'+(-w)+' Z'}
function shrub(cx,rx,ry){return '<ellipse cx="'+cx+'" cy="'+(352-ry*.35)+'" rx="'+rx+'" ry="'+ry+'" fill="#0F2A1E"/>'}
function arc(cx,rx,ry){return 'M'+(cx-rx*.9)+' '+(348-ry*.3)+' Q'+cx+' '+(346-ry*1.5)+' '+(cx+rx*.9)+' '+(348-ry*.3)}
var HOUSES={
 manor:{
  body:'<rect x="500" y="250" width="100" height="102" fill="#1A2238"/><polygon points="490,252 610,252 585,205 515,205" fill="#111829"/>'+
   '<rect x="110" y="212" width="400" height="140" fill="#1F2942"/><polygon points="92,214 528,214 462,122 158,122" fill="#141C30"/>'+
   '<polygon points="140,216 300,216 220,112" fill="#19223A"/><rect x="150" y="216" width="140" height="136" fill="#232E4A"/>'+
   '<polygon points="372,188 432,188 402,152" fill="#19223A"/><rect x="380" y="188" width="44" height="18" fill="#232E4A"/><rect x="392" y="170" width="20" height="18" fill="'+WIN+'" opacity=".5"/>'+
   win(196,150,48,40)+win(176,250,34,46)+win(232,250,34,46)+win(408,250,40,46)+win(530,278,40,36)+
   '<rect x="328" y="270" width="40" height="82" fill="#0B1222"/><rect x="333" y="276" width="30" height="76" fill="#3A1A1E"/>'+
   shrub(135,26,16)+shrub(300,22,13)+shrub(398,24,14)+shrub(478,24,15)+
   '<rect x="50" y="300" width="6" height="54" fill="#1B1A1A"/><circle cx="53" cy="282" r="34" fill="#0F2A1E"/>'+
   '<path d="M348 352 C348 372 330 384 300 408" stroke="#131C2C" stroke-width="30" fill="none"/>',
  g:[[1,'M92 214 L140 214'],[1,'M300 214 L528 214'],[1,'M140 216 L220 112 L300 216'],[1,'M372 188 L402 152 L432 188'],
     [2,'M92 214 L158 122 L190 122'],[2,'M252 122 L462 122 L528 214'],[2,'M490 252 L515 205 L585 205 L610 252'],[2,'M512 252 L610 252'],
     [3,box(196,150,48,40)],[3,box(176,250,34,46)],[3,box(232,250,34,46)],[3,box(408,250,40,46)],[3,'M328 352 L328 270 L368 270 L368 352'],
     [3,'M110 352 L110 222'],[3,'M510 248 L510 222'],[3,'M600 352 L600 258'],
     [3,arc(135,26,16)],[3,arc(300,22,13)],[3,arc(398,24,14)],[3,arc(478,24,15)],
     [3,'M25 290 Q30 250 53 248 Q78 250 82 290 Q70 312 53 314 Q34 312 25 290'],[3,'M38 280 Q53 262 68 282'],
     [3,'M330 356 C330 372 314 384 284 406'],[3,'M366 356 C366 378 346 392 318 408']],
  path:[[340,360],[328,374],[312,388],[292,402]]
 },
 ranch:{
  body:'<rect x="90" y="254" width="460" height="98" fill="#2A2438"/><polygon points="70,256 570,256 500,188 140,188" fill="#171320"/>'+
   '<polygon points="262,258 378,258 320,192" fill="#221C30"/><rect x="272" y="258" width="96" height="94" fill="#332B45"/>'+
   '<rect x="306" y="288" width="28" height="64" fill="#5A2A22"/>'+
   win(118,280,56,38)+win(198,280,44,38)+win(398,280,50,38)+
   '<rect x="470" y="276" width="72" height="76" fill="#1B1726"/><path d="M470 296 h72 M470 316 h72 M470 336 h72" stroke="#2A2438" stroke-width="2"/>'+
   shrub(140,30,15)+shrub(232,24,13)+shrub(420,26,14)+
   '<path d="M320 352 C320 370 322 388 330 408" stroke="#16131F" stroke-width="28" fill="none"/>',
  g:[[1,'M70 256 L262 256'],[1,'M378 256 L570 256'],[1,'M262 258 L320 192 L378 258'],
     [2,'M70 256 L140 188 L290 188'],[2,'M350 188 L500 188 L570 256'],
     [3,box(118,280,56,38)],[3,box(198,280,44,38)],[3,box(398,280,50,38)],[3,'M470 352 L470 276 L542 276 L542 352'],[3,'M306 352 L306 288 L334 288 L334 352'],
     [3,'M90 352 L90 264'],[3,'M550 352 L550 264'],
     [3,arc(140,30,15)],[3,arc(232,24,13)],[3,arc(420,26,14)],
     [3,'M304 358 C304 374 306 392 314 408'],[3,'M336 358 C336 374 338 392 346 408']],
  path:[[320,362],[321,376],[324,390],[328,404]]
 },
 farm:{
  body:'<rect x="300" y="238" width="44" height="114" fill="#C9C4B8" opacity=".5"/>'+
   '<polygon points="120,204 300,204 210,96" fill="#D8D3C6" opacity=".62"/><rect x="120" y="204" width="180" height="148" fill="#D8D3C6" opacity=".62"/>'+
   '<polygon points="340,224 510,224 425,124" fill="#CFCABD" opacity=".55"/><rect x="340" y="224" width="170" height="128" fill="#CFCABD" opacity=".55"/>'+
   '<path d="M110 210 L210 92 L310 210" fill="none" stroke="#0F1524" stroke-width="7" stroke-linejoin="round"/><path d="M330 230 L425 120 L520 230" fill="none" stroke="#0F1524" stroke-width="7" stroke-linejoin="round"/>'+
   '<polygon points="108,272 522,272 512,256 118,256" fill="#0F1524"/>'+
   '<g fill="#E8E3D6" opacity=".7"><rect x="126" y="272" width="6" height="80"/><rect x="214" y="272" width="6" height="80"/><rect x="298" y="272" width="6" height="80"/><rect x="398" y="272" width="6" height="80"/><rect x="500" y="272" width="6" height="80"/></g>'+
   win(186,140,48,54,.5)+win(404,166,42,46,.5)+win(148,288,44,50,.5)+win(236,288,44,50,.5)+win(424,288,52,50,.5)+
   '<rect x="318" y="290" width="30" height="62" fill="#1B1F2E"/>'+
   shrub(170,26,13)+shrub(262,22,12)+shrub(462,28,14)+
   '<rect x="566" y="296" width="6" height="58" fill="#1B1A1A"/><polygon points="569,210 600,300 538,300" fill="#0F2A1E"/>'+
   '<path d="M333 352 C333 372 340 390 356 408" stroke="#131C2C" stroke-width="28" fill="none"/>',
  g:[[1,'M108 212 L210 90 L312 212'],[1,'M328 232 L425 118 L522 232'],[1,'M108 272 L522 272'],
     [2,'M120 256 L120 212'],[2,'M300 256 L300 212'],[2,'M340 256 L340 232'],[2,'M510 256 L510 232'],[2,'M312 240 L328 240'],
     [3,box(186,140,48,54)],[3,box(404,166,42,46)],[3,box(148,288,44,50)],[3,box(236,288,44,50)],[3,box(424,288,52,50)],
     [3,'M129 352 L129 276'],[3,'M217 352 L217 276'],[3,'M301 352 L301 276'],[3,'M401 352 L401 276'],[3,'M503 352 L503 276'],
     [3,arc(170,26,13)],[3,arc(262,22,12)],[3,arc(462,28,14)],
     [3,'M569 214 L556 244 L582 252 L548 278 L590 286 L540 300'],
     [3,'M318 358 C318 374 326 392 342 408'],[3,'M350 358 C350 372 358 388 372 404']],
  path:[[336,362],[340,376],[347,390],[357,404]]
 },
 cottage:{
  body:'<rect x="450" y="270" width="104" height="82" fill="#232B3E"/><polygon points="446,252 566,278 566,286 446,270" fill="#10141F"/>'+
   '<rect x="392" y="118" width="28" height="70" fill="#3A2A2A"/>'+
   '<rect x="190" y="236" width="260" height="116" fill="#33405C"/><polygon points="190,238 450,238 320,96" fill="#2C3852"/>'+
   '<path d="M172 242 L320 86 L468 242" fill="none" stroke="#10141F" stroke-width="8" stroke-linejoin="round"/>'+
   '<path d="M298 352 V296 a22 22 0 0 1 44 0 V352 Z" fill="#6A2B25"/>'+
   '<circle cx="320" cy="180" r="20" fill="'+WIN+'" opacity=".45"/><path d="M300 180 h40 M320 160 v40" stroke="#0B1222" stroke-width="1.5" opacity=".6"/>'+
   win(214,270,50,52)+win(376,270,50,52)+win(478,292,44,40)+
   shrub(230,28,14)+shrub(408,26,14)+shrub(512,22,12)+
   '<rect x="92" y="290" width="7" height="64" fill="#1B1A1A"/><polygon points="95,170 136,296 54,296" fill="#0F2A1E"/>'+
   '<path d="M320 352 C320 372 312 390 298 408" stroke="#131C2C" stroke-width="28" fill="none"/>',
  g:[[1,'M170 244 L320 82 L470 244'],[1,'M446 252 L566 278'],
     [2,'M190 244 L190 352'],[2,'M450 248 L450 270'],[2,'M392 150 L392 118 L420 118 L420 178'],[2,'M554 352 L554 284'],
     [3,'M298 352 V296 a22 22 0 0 1 44 0 V352'],[3,'M300 180 a20 20 0 1 0 40 0 a20 20 0 1 0 -40 0'],
     [3,box(214,270,50,52)],[3,box(376,270,50,52)],[3,box(478,292,44,40)],
     [3,arc(230,28,14)],[3,arc(408,26,14)],[3,arc(512,22,12)],
     [3,'M95 176 L78 216 L112 226 L68 256 L122 266 L58 296'],
     [3,'M304 358 C304 374 298 392 284 408'],[3,'M336 358 C336 374 328 392 314 408']],
  path:[[320,362],[317,376],[311,390],[302,404]]
 }
};
function mount(el,type,opt){
  var h=HOUSES[type];opt=opt||{};
  el.setAttribute('data-house',type);
  el.innerHTML=(opt.noSky?'':'<g fill="#fff" opacity=".5"><circle cx="60" cy="40" r="1.2"/><circle cx="150" cy="70" r="1"/><circle cx="250" cy="28" r="1.3"/><circle cx="350" cy="55" r="1"/><circle cx="470" cy="32" r="1.2"/><circle cx="560" cy="66" r="1"/><circle cx="600" cy="24" r="1.3"/><circle cx="30" cy="110" r="1"/></g>')+
    (opt.noGround?'':'<rect x="0" y="352" width="640" height="58" fill="#0A1420"/>')+h.body+
    '<g class="guides" fill="none" stroke="none">'+h.g.map(function(p){return '<path data-tier="'+p[0]+'" d="'+p[1]+'"/>'}).join('')+'</g><g class="bulbs" filter="url(#glowF)"></g>';
}
function light(el,tier,colors,twinkle,spacing){
  var out='',k=0,sp=spacing||11;
  Array.prototype.forEach.call(el.querySelectorAll(':scope > .guides path'),function(p){
    if(+p.getAttribute('data-tier')>tier)return;
    var len=p.getTotalLength(),n=Math.max(2,Math.round(len/sp));
    for(var i=0;i<=n;i++){var pt=p.getPointAtLength(len*i/n);
      out+='<circle class="bulb'+(twinkle&&k%4===0?' tw':'')+'"'+(twinkle?' style="animation-delay:'+(k%9)*0.35+'s"':'')+' cx="'+pt.x.toFixed(1)+'" cy="'+pt.y.toFixed(1)+'" r="2.6" fill="'+colors[k%colors.length]+'"/>';k++}
  });
  el.querySelector(':scope > .bulbs').innerHTML=out;
}
function pathLights(el){
  var h=HOUSES[el.getAttribute('data-house')],out='';
  h.path.forEach(function(p,i){[-24,24].forEach(function(dx){var x=p[0]+dx+(i*dx/8),y=p[1];
    out+='<ellipse cx="'+x+'" cy="'+(y+4)+'" rx="20" ry="7" fill="#FFD98A" opacity=".16"/><rect x="'+(x-1)+'" y="'+(y-9)+'" width="2" height="9" fill="#6B5A3A"/><circle cx="'+x+'" cy="'+(y-10)+'" r="3" fill="#FFD98A"/>'})});
  [[150,300],[270,300],[450,300]].forEach(function(u){out+='<path d="M'+(u[0]-16)+' 352 L'+u[0]+' '+(u[1]-70)+' L'+(u[0]+16)+' 352 Z" fill="#FFD98A" opacity=".10"/><circle cx="'+u[0]+'" cy="350" r="2.6" fill="#FFD98A"/>'});
  el.querySelector(':scope > .bulbs').innerHTML+=out;
}
function pine(x,base,h){var w=h*.42,id='';return '<rect x="'+(x-3)+'" y="'+(base-12)+'" width="6" height="14" fill="#1B1A1A"/><polygon points="'+x+','+(base-h)+' '+(x+w)+','+(base-10)+' '+(x-w)+','+(base-10)+'" fill="#0C2219"/>'}
function hero(svg,colors){
  var s='<circle cx="1330" cy="92" r="40" fill="#FFF3D6" opacity=".9"/><circle cx="1330" cy="92" r="90" fill="#FFF3D6" opacity=".06"/>';
  var st='';for(var i=0;i<70;i++){st+='<circle cx="'+((i*229)%1600)+'" cy="'+((i*83)%300)+'" r="'+(0.6+(i%3)*0.4)+'"/>'}
  s+='<g fill="#fff" opacity=".55">'+st+'</g>';
  s+='<path d="M0 470 Q260 420 520 462 T1040 452 T1600 440 V560 H0 Z" fill="#0A1326"/>';
  s+=pine(40,498,150)+pine(520,498,120)+pine(1120,498,170)+pine(1560,498,140);
  s+='<path d="M0 498 Q400 486 800 496 T1600 492 V560 H0 Z" fill="#111C33"/>';
  s+='<svg class="hh" data-t="ranch" x="20" y="225" width="499" height="320" viewBox="0 0 640 410"></svg>';
  s+='<svg class="hh" data-t="manor" x="500" y="148" width="640" height="410" viewBox="0 0 640 410"></svg>';
  s+='<svg class="hh" data-t="farm" x="1090" y="218" width="512" height="328" viewBox="0 0 640 410"></svg>';
  svg.innerHTML=s;
  var set=[[1,['#FFD98A']],[3,colors],[2,['#F0303F','#F2F7FF']]];
  Array.prototype.forEach.call(svg.querySelectorAll('.hh'),function(el,i){mount(el,el.getAttribute('data-t'),{noSky:true,noGround:true});light(el,set[i][0],set[i][1],i===1)});
}
window.GGHouses={SCHEMES:SCHEMES,mount:mount,light:light,pathLights:pathLights,hero:hero};
})();
