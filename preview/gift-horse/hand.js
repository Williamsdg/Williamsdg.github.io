/* ============================================================================
   GIFT HORSE — hand-lettering + sticker system
   ----------------------------------------------------------------------------
   Not a handwriting font. Every glyph below is drawn as SVG stroke paths on a
   shared baseline grid, then composed into words with per-letter jitter so no
   two renders of the same word are identical — the way real lettering isn't.

   Grid (y grows down):  ascender 18 · cap 28 · x-height 78 · baseline 150 ·
                         descender 196.  Stroke ~17. Everything round-capped.
   ============================================================================ */
(function(){
'use strict';

var G={};                    /* glyph -> {d:[paths], w:advance} */
function g(ch,w,d){ G[ch]={w:w,d:d} }

/* ---- lowercase ---------------------------------------------------------- */
g('a',80,['M62 96c-12-14-34-12-40 6c-7 21 8 40 26 38c8-1 14-6 16-12',
          'M64 78c-2 30-3 52 0 72']);
g('b',80,['M24 22c-3 46-3 96 0 128',
          'M24 100c12-16 38-14 44 8c6 24-16 46-44 28']);
g('c',74,['M64 98c-14-14-40-10-44 14c-4 26 26 40 48 22']);
g('d',82,['M66 20c3 46 1 96 2 130',
          'M66 100c-14-16-42-12-46 12c-4 26 22 44 46 26']);
g('e',78,['M20 120c16-4 32-9 46-16c-5-16-22-22-34-12c-15 12-13 38 4 46c11 5 23 2 32-5']);
g('f',68,['M62 26c-16-8-28 2-28 22c0 40 0 78-3 104',
          'M16 84h52']);
g('g',80,['M64 96c-14-14-40-10-44 14c-4 26 24 42 46 24',
          'M64 78c-1 42 4 76-3 94c-7 19-30 18-40 7']);
g('h',82,['M24 20c-3 46-3 96 0 130',
          'M24 102c12-18 40-18 44 4c2 17 0 30 0 44']);
g('i',54,['M40 86v64','M40 48v7']);
g('j',64,['M50 86c1 40 5 78-4 92c-7 11-22 10-30 4','M50 48v7']);
g('k',80,['M26 20c-3 46-3 96 0 130','M68 90L28 124','M42 114l30 36']);
g('l',56,['M40 20c-3 46-5 100 3 130']);
g('m',108,['M20 88v62','M20 106c8-18 30-20 34 0v44','M54 106c8-18 32-20 36 0v44']);
g('n',82,['M24 88v62','M24 108c10-20 38-20 42 2v40']);
g('o',86,['M44 86c-16 0-27 14-27 31s11 31 27 31s27-14 27-31s-11-31-27-31z']);
g('p',82,['M24 88c-1 42-2 76 0 108','M24 108c12-18 40-16 44 8c4 24-20 42-44 26']);
g('q',84,['M68 88c1 42 2 76 0 108','M68 108c-12-18-40-16-44 8c-4 24 20 42 44 26']);
g('r',72,['M26 88v62','M26 108c8-16 24-24 42-18']);
g('s',76,['M64 96c-12-10-36-10-40 6c-2 15 31 14 34 29c3 17-25 21-40 10']);
g('t',72,['M42 46c-3 44-5 82 0 96c4 12 17 14 26 8','M18 88h46']);
g('u',82,['M24 88c-1 24-3 42 2 52c9 18 35 13 40-7','M66 88v62']);
g('v',82,['M20 88l25 62l25-62']);
g('w',108,['M18 88l16 62l19-46l19 46l16-62']);
g('x',82,['M22 90l46 60','M68 90l-46 60']);
g('y',84,['M20 88l27 58','M70 88l-31 74c-6 15-19 21-31 15']);
g('z',84,['M22 92h46l-46 56h50']);

/* ---- the two capitals the copy actually needs ---------------------------- */
g('G',112,['M92 54C74 34 38 34 26 62c-13 30 2 74 34 78c20 3 34-8 36-24',
           'M96 116H72']);
g('J',80,['M66 30c1 60 5 96-4 112c-9 15-32 15-44 3']);

/* ---- punctuation --------------------------------------------------------- */
g('.',44,['M34 144v6']);
g(',',44,['M34 142c1 9-1 14-8 20']);
/* stem and dot need a real gap — at stroke 17 the round caps otherwise merge
   into one blob and "box!" reads as "boxi" */
g('!',46,['M36 78v42','M36 149v1']);
g('?',70,['M22 94c4-16 32-18 36-2c4 15-17 19-17 32','M41 149v1']);
g("'",38,['M34 62v18']);
g('’',38,['M34 62v18']);
g(':',42,['M34 100v6','M34 140v6']);
g('(',50,['M42 72c-15 22-15 62 0 84']);
g(')',50,['M28 72c15 22 15 62 0 84']);
g('-',64,['M16 118h34']);
g('&',96,['M74 150C46 120 26 104 30 82c3-16 26-18 30-2c4 18-30 30-36 48c-5 16 12 28 30 20c14-6 22-18 26-30']);
g(' ',42,[]);

/* ============================================================================
   word()  — compose a phrase into an <svg>
   ============================================================================ */
var seedN=1;
function rnd(s){ s=(s*9301+49297)%233280; return {v:s/233280,s:s} }

function word(text,opt){
  opt=opt||{};
  var seed=opt.seed||(seedN++*137);
  var sw=opt.stroke||17;
  var color=opt.color||'currentColor';
  var pad=sw;                       /* room for the round caps */
  var x=0, out=[], r={s:seed};
  for(var i=0;i<text.length;i++){
    var ch=text[i], gl=G[ch]||G[ch.toLowerCase()]||G[' '];
    if(gl.d.length){
      r=rnd(r.s); var dy=(r.v-.5)*7;          /* baseline wobble */
      r=rnd(r.s); var rot=(r.v-.5)*4.2;        /* letter tilt */
      r=rnd(r.s); var sc=.97+r.v*.07;          /* size drift */
      out.push('<g transform="translate('+(x+gl.w/2).toFixed(1)+','+(150+dy).toFixed(1)+') '+
               'rotate('+rot.toFixed(2)+') scale('+sc.toFixed(3)+') translate('+(-gl.w/2)+',-150)">'+
               gl.d.map(function(d){return '<path d="'+d+'"/>'}).join('')+'</g>');
    }
    r=rnd(r.s);
    x += gl.w + (r.v-.5)*5 - 4;                /* tightened, uneven tracking */
  }
  /* crop to the real ink extent (ascender 12 -> descender 200) so stacked
     lines don't inherit a pile of empty space */
  var top=12-pad, w=x+pad*2, h=(200-12)+pad*2;
  return '<svg class="hl" viewBox="'+(-pad)+' '+top+' '+w+' '+h+'" '+
    'preserveAspectRatio="xMidYMid meet" role="img" aria-label="'+
    String(text).replace(/"/g,'&quot;')+'">'+
    '<g fill="none" stroke="'+color+'" stroke-width="'+sw+'" stroke-linecap="round" stroke-linejoin="round">'+
    out.join('')+'</g></svg>';
}

/* multi-line lockup, each line its own svg so they scale independently */
function lines(arr,opt){
  return arr.map(function(t,i){
    var o={}; for(var k in opt) o[k]=opt[k];
    o.seed=(opt&&opt.seed?opt.seed:31)+i*57;
    return '<span class="hl-line" style="--i:'+i+'">'+word(t,o)+'</span>';
  }).join('');
}
window.HAND={word:word,lines:lines,glyphs:G};
})();

/* ============================================================================
   STICKERS — a small drawn vocabulary reused across the site.
   Every one is hand-wobbled: no true circles, no straight lines.
   ============================================================================ */
(function(){
'use strict';
function s(vb,body,extra){ return function(c,cls){
  return '<svg class="stk '+(cls||'')+'" viewBox="'+vb+'" aria-hidden="true" '+
    (extra||'')+'>'+body.replace(/CUR/g,c||'currentColor')+'</svg>';
}}
var ST={};

ST.star=s('0 0 100 100',
 '<path fill="CUR" d="M50 5c4 11 8 22 13 32c11 0 23 1 34 2c-9 8-19 14-28 21c3 11 7 22 10 33c-9-6-19-13-29-19c-9 6-19 13-28 19c3-11 6-22 9-33c-9-7-19-13-28-21c11-1 23-2 34-2c4-10 9-21 13-32z"/>');

ST.sparkle=s('0 0 100 100',
 '<path fill="CUR" d="M50 4c5 27 15 38 42 42c-27 5-37 15-42 42c-4-27-15-37-42-42c27-4 38-15 42-42z"/>');

ST.flower=s('0 0 100 100',
 '<g fill="CUR"><ellipse cx="50" cy="22" rx="15" ry="20"/><ellipse cx="76" cy="42" rx="20" ry="15"/>'+
 '<ellipse cx="66" cy="74" rx="15" ry="19"/><ellipse cx="34" cy="74" rx="15" ry="19"/>'+
 '<ellipse cx="24" cy="42" rx="20" ry="15"/></g>'+
 '<circle cx="50" cy="50" r="13" fill="#FFFDF6"/>');

ST.heart=s('0 0 100 100',
 '<path fill="CUR" d="M50 89C21 66 9 50 9 33C9 19 20 10 32 11c8 1 15 5 18 12c3-7 10-12 18-12c12-1 24 8 24 22c0 17-13 33-42 56z"/>');

ST.smiley=s('0 0 100 100',
 '<g fill="none" stroke="CUR" stroke-width="8" stroke-linecap="round">'+
 '<path d="M50 7C26 7 8 26 8 50s19 43 42 43s42-19 42-43S74 7 50 7z"/>'+
 '<path d="M34 62c9 9 23 9 32 0"/></g>'+
 '<ellipse cx="36" cy="40" rx="5" ry="7" fill="CUR"/><ellipse cx="64" cy="40" rx="5" ry="7" fill="CUR"/>');

ST.envelope=s('0 0 110 80',
 '<g fill="none" stroke="CUR" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">'+
 '<path d="M7 12c34-2 66-3 97-1c2 20 2 42-1 60c-32 2-64 2-95 0c-2-19-3-40-1-59z"/>'+
 '<path d="M8 14l47 32l47-33"/></g>');

ST.horseshoe=s('0 0 100 100',
 '<g fill="CUR"><path d="M50 12c-17 0-30 14-30 33c0 13 5 24 13 32c3 4 3 8 0 11s-8 3-11 0C10 76 3 60 3 43C3 18 24 -1 50 -1s47 19 47 44c0 17-7 33-19 45c-3 3-8 3-11 0s-3-7 0-11c8-8 13-19 13-32c0-19-13-33-30-33z"/>'+
 '<circle cx="20" cy="92" r="7"/><circle cx="80" cy="92" r="7"/></g>');

/* a stocky little pony, as one filled silhouette — line art read as a fence */
ST.horse=s('0 -6 132 112',
 '<path fill="CUR" d="M16 46C20 30 44 24 68 27C74 17 84 8 95 7C106 6 114 14 116 26'+
 'C118 36 116 44 110 48C106 51 100 51 97 47C93 42 88 39 82 40C74 42 70 50 69 60'+
 'L69 98L57 98L57 70C47 73 33 72 26 68L26 98L14 98L14 62C8 57 8 50 16 46Z"/>'+
 '<path fill="CUR" d="M94 10L88 -5L103 4Z"/>'+
 '<path fill="none" stroke="CUR" stroke-width="6" stroke-linecap="round" d="M15 49C4 55 3 71 10 84"/>'+
 '<circle cx="107" cy="27" r="3.1" fill="#FFFDF6"/>');

ST.arrow=s('0 0 120 70',
 '<g fill="none" stroke="CUR" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">'+
 '<path d="M6 16c34-9 71 3 96 40"/><path d="M104 22l-2 36-33-9"/></g>');

ST.arrowShort=s('0 0 80 40',
 '<g fill="none" stroke="CUR" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">'+
 '<path d="M5 20h64"/><path d="M53 6l17 14-17 14"/></g>');

ST.squiggle=s('0 0 160 40',
 '<path fill="none" stroke="CUR" stroke-width="7" stroke-linecap="round" '+
 'd="M6 26c12-22 25 20 38 0s26-22 39 0s26 20 38-2"/>');

ST.burst=s('0 0 120 120',
 '<path fill="CUR" d="M60 2l9 22 18-15-4 23 23-6-15 18 22 9-22 9 15 18-23-6 4 23-18-15-9 22-9-22-18 15 4-23-23 6 15-18-22-9 22-9-15-18 23 6-4-23 18 15z"/>');

ST.circleMark=s('0 0 200 120',
 '<path fill="none" stroke="CUR" stroke-width="6" stroke-linecap="round" '+
 'd="M112 10C56 4 12 26 8 58c-4 33 40 56 96 52c52-4 88-26 88-54C192 30 158 12 108 9"/>');

ST.tape=s('0 0 120 44',
 '<path fill="CUR" opacity=".55" d="M4 10l112-8 2 30-114 10z"/>'+
 '<path fill="none" stroke="CUR" stroke-width="2" opacity=".5" d="M22 3v36M46 2v37M70 1v37M94 0v37"/>');

ST.guitar=s('0 0 76 108',
 '<path fill="CUR" d="M34 4h8c2 0 3 1 3 3v4H31V7c0-2 1-3 3-3z"/>'+
 '<path fill="CUR" d="M34 12h8v34h-8z"/>'+
 '<path fill="CUR" d="M38 40c-11 0-18 7-18 16c0 5 2 9 4 12c-4 4-6 10-6 16c0 12 9 21 20 21s20-9 20-21c0-6-2-12-6-16c2-3 4-7 4-12c0-9-7-16-18-16z"/>'+
 '<circle cx="38" cy="66" r="6.5" fill="#FFFDF6"/>');

window.HAND.sticker=function(name,color,cls){ var f=ST[name]; return f?f(color,cls):'' };
window.HAND.stickerNames=Object.keys(ST);
})();
