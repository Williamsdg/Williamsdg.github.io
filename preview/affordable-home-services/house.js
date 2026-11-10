/* Affordable Home Services concept — illustrated house scene (clean / dirty / focus) */
window.AHS = (function () {
  const C = {
    navy: '#14298A', deep: '#0B1A5C', lime: '#C3F44C', white: '#FFFFFF',
    sky: '#E4EFFF', skyDirty: '#D3DAE4', lawn: '#B9DC80', lawnDirty: '#A3BC74', drive: '#DDE2EC', driveDirty: '#C9CDD6',
    glass: '#BFE0FF', trunk: '#7A5A3A', leaf: '#8CC63F', leaf2: '#A5D65A', garage: '#EEF2F8', siding: '#E3E9F5'
  };
  const S = 4; // outline width
  function sparkle(x, y, s) {
    return `<path d="M${x} ${y - s} L${x + s * .28} ${y - s * .28} L${x + s} ${y} L${x + s * .28} ${y + s * .28} L${x} ${y + s} L${x - s * .28} ${y + s * .28} L${x - s} ${y} L${x - s * .28} ${y - s * .28} Z" fill="${C.lime}" stroke="${C.navy}" stroke-width="2.5" stroke-linejoin="round"/>`;
  }
  function win(x, y, w, h) {
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${C.glass}" stroke="${C.navy}" stroke-width="${S}"/>
      <line x1="${x + w / 2}" y1="${y}" x2="${x + w / 2}" y2="${y + h}" stroke="${C.navy}" stroke-width="3"/>
      <line x1="${x}" y1="${y + h / 2}" x2="${x + w}" y2="${y + h / 2}" stroke="${C.navy}" stroke-width="3"/>
      <line x1="${x + 14}" y1="${y + h - 16}" x2="${x + 34}" y2="${y + 14}" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".85"/>`;
  }
  function leaves() {
    let d = '';
    for (let x = 290; x < 740; x += 36) d += `M${x} 250 q18 -24 36 0 `;
    let g = `<path d="${d}" fill="#8B6B3E" stroke="${C.navy}" stroke-width="2.5"/>`;
    for (let x = 300; x < 740; x += 54) g += `<ellipse cx="${x + 10}" cy="${236}" rx="9" ry="5" fill="#B6CF55" stroke="${C.navy}" stroke-width="2" transform="rotate(-25 ${x + 10} 236)"/>`;
    for (let x = 724; x < 900; x += 44) g += `<path d="M${x} 300 q18 -22 36 0" fill="#8B6B3E" stroke="${C.navy}" stroke-width="2.5"/>`;
    return g;
  }
  function grime() {
    const streak = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${w / 2}" fill="#7F8F7B" opacity=".5"/>`;
    return `<g class="grime">
      ${streak(308, 322, 16, 100)}${streak(438, 300, 12, 118)}${streak(572, 310, 14, 112)}${streak(684, 330, 14, 94)}${streak(728, 350, 12, 72)}${streak(878, 340, 12, 84)}
      <rect x="304" y="398" width="412" height="30" fill="#6F7B6B" opacity=".45"/><rect x="724" y="410" width="172" height="18" fill="#6F7B6B" opacity=".45"/>
      <ellipse cx="400" cy="214" rx="44" ry="12" fill="#6B8A3A" opacity=".85"/><ellipse cx="615" cy="236" rx="34" ry="10" fill="#6B8A3A" opacity=".85"/><ellipse cx="790" cy="282" rx="28" ry="8" fill="#6B8A3A" opacity=".85"/>
      <rect x="344" y="292" width="84" height="100" fill="#5B5B5B" opacity=".32"/><rect x="474" y="292" width="84" height="100" fill="#5B5B5B" opacity=".32"/>
      <line x1="352" y1="384" x2="420" y2="304" stroke="#3F3F3F" stroke-width="6" opacity=".35" stroke-linecap="round"/><line x1="486" y1="380" x2="548" y2="306" stroke="#3F3F3F" stroke-width="6" opacity=".35" stroke-linecap="round"/>
      <circle cx="510" cy="185" r="24" fill="#5B5B5B" opacity=".3"/>
      <path d="M776 440 L610 636" stroke="#8A8A8A" stroke-width="16" opacity=".6" stroke-linecap="round"/><path d="M858 440 L826 636" stroke="#8A8A8A" stroke-width="16" opacity=".6" stroke-linecap="round"/>
      <ellipse cx="690" cy="565" rx="88" ry="28" fill="#6E6E6E" opacity=".5"/><ellipse cx="880" cy="500" rx="56" ry="18" fill="#6E6E6E" opacity=".45"/><ellipse cx="560" cy="615" rx="60" ry="16" fill="#6E6E6E" opacity=".4"/>
      ${leaves()}
    </g>`;
  }
  function rings(focus) {
    const r = (s) => `<g class="ring">${s}</g>`;
    const shapes = {
      windows: r(`<rect x="328" y="276" width="116" height="132" rx="12"/><rect x="458" y="276" width="116" height="132" rx="12"/><circle cx="510" cy="185" r="42"/>`),
      pressure: r(`<polygon points="706,420 920,420 1022,636 404,636"/>`),
      housewash: r(`<rect x="288" y="240" width="624" height="202" rx="12"/>`),
      gutters: r(`<rect x="250" y="236" width="520" height="38" rx="12"/><rect x="692" y="286" width="236" height="36" rx="12"/><rect x="278" y="262" width="32" height="176" rx="12"/>`)
    };
    return shapes[focus] || '';
  }
  function scene(o) {
    o = o || {}; const d = !!o.dirty;
    const sky = d ? C.skyDirty : C.sky, lawn = d ? C.lawnDirty : C.lawn, drive = d ? C.driveDirty : C.drive;
    let sid = '';
    for (let y = 270; y < 428; y += 18) sid += `<line x1="303" y1="${y}" x2="717" y2="${y}" stroke="${C.siding}" stroke-width="2"/>`;
    for (let y = 320; y < 428; y += 18) sid += `<line x1="723" y1="${y}" x2="897" y2="${y}" stroke="${C.siding}" stroke-width="2"/>`;
    return `<g class="scene${d ? ' is-dirty' : ''}">
      <g class="p-env">
        <rect x="0" y="0" width="1200" height="640" fill="${sky}"/>
        <g fill="${C.white}" opacity="${d ? .7 : 1}"><ellipse cx="180" cy="110" rx="72" ry="26"/><ellipse cx="232" cy="92" rx="52" ry="30"/><ellipse cx="1010" cy="88" rx="80" ry="24"/><ellipse cx="1060" cy="72" rx="48" ry="26"/></g>
        <rect x="0" y="430" width="1200" height="210" fill="${lawn}"/>
        <rect x="0" y="600" width="1200" height="40" fill="${d ? '#93AA66' : '#A8CF6E'}"/>
        <rect x="140" y="330" width="26" height="110" rx="6" fill="${C.trunk}" stroke="${C.navy}" stroke-width="${S}"/>
        <circle cx="153" cy="300" r="74" fill="${C.leaf}" stroke="${C.navy}" stroke-width="${S}"/><circle cx="106" cy="334" r="46" fill="${C.leaf2}" stroke="${C.navy}" stroke-width="${S}"/><circle cx="204" cy="330" r="50" fill="${C.leaf2}" stroke="${C.navy}" stroke-width="${S}"/>
      </g>
      <g class="p-drive"><polygon points="720,430 905,430 1010,640 420,640" fill="${drive}" stroke="${C.navy}" stroke-width="${S}" stroke-linejoin="round"/><line x1="812" y1="432" x2="715" y2="638" stroke="${C.white}" stroke-width="3" opacity=".7"/></g>
      <g class="p-roof">
        <rect x="620" y="128" width="44" height="110" fill="${C.navy}"/><rect x="612" y="120" width="60" height="14" rx="3" fill="${C.deep}"/>
        <polygon points="708,304 810,228 912,304" fill="${C.navy}"/>
        <polygon points="266,254 510,98 754,254" fill="${C.navy}"/>
        <polyline points="266,254 510,98 754,254" fill="none" stroke="${C.lime}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>
      </g>
      <g class="p-siding">
        <rect x="300" y="250" width="420" height="180" fill="${C.white}" stroke="${C.navy}" stroke-width="${S}"/>
        <rect x="720" y="300" width="180" height="130" fill="${C.white}" stroke="${C.navy}" stroke-width="${S}"/>
        ${sid}
        <rect x="750" y="345" width="120" height="85" fill="${C.garage}" stroke="${C.navy}" stroke-width="${S}"/><line x1="750" y1="372" x2="870" y2="372" stroke="${C.navy}" stroke-width="2.5"/><line x1="750" y1="400" x2="870" y2="400" stroke="${C.navy}" stroke-width="2.5"/>
        <rect x="604" y="322" width="66" height="108" rx="3" fill="${C.lime}" stroke="${C.navy}" stroke-width="${S}"/><circle cx="658" cy="380" r="4" fill="${C.navy}"/>
        <rect x="594" y="430" width="86" height="12" fill="${drive}" stroke="${C.navy}" stroke-width="3"/>
      </g>
      <g class="p-windows">${win(340, 288, 92, 108)}${win(470, 288, 92, 108)}<circle cx="510" cy="185" r="28" fill="${C.glass}" stroke="${C.navy}" stroke-width="${S}"/><line x1="510" y1="157" x2="510" y2="213" stroke="${C.navy}" stroke-width="3"/><line x1="482" y1="185" x2="538" y2="185" stroke="${C.navy}" stroke-width="3"/></g>
      <g class="p-gutter"><rect x="262" y="246" width="496" height="16" rx="5" fill="${C.deep}"/><rect x="704" y="296" width="212" height="14" rx="4" fill="${C.deep}"/><rect x="286" y="262" width="12" height="170" fill="${C.deep}"/><rect x="280" y="426" width="26" height="10" rx="3" fill="${C.deep}"/></g>
      <g class="p-env"><ellipse cx="330" cy="434" rx="40" ry="22" fill="${C.leaf2}" stroke="${C.navy}" stroke-width="${S}"/><ellipse cx="560" cy="436" rx="34" ry="20" fill="${C.leaf}" stroke="${C.navy}" stroke-width="${S}"/><ellipse cx="690" cy="438" rx="24" ry="16" fill="${C.leaf2}" stroke="${C.navy}" stroke-width="${S}"/></g>
      ${d ? grime() : `<g class="spk">${sparkle(392, 300, 11)}${sparkle(548, 336, 8)}${sparkle(720, 560, 13)}${sparkle(528, 160, 7)}${sparkle(300, 240, 7)}</g>`}
      ${o.focus ? rings(o.focus) : ''}
    </g>`;
  }
  /* before/after scene: clean underneath, dirty clipped to the right of the handle */
  function sweep(id) {
    return `<svg class="house" viewBox="0 0 1200 640" role="img" aria-label="Illustration of a house: the left side clean, the right side still dirty. Drag the handle to clean it." preserveAspectRatio="xMidYMid slice">
      <defs><clipPath id="${id}-cp"><rect class="cp" x="420" y="0" width="780" height="640"/></clipPath></defs>
      ${scene({})}
      <g clip-path="url(#${id}-cp)">${scene({ dirty: true })}</g>
    </svg>`;
  }
  function diagram(o) {
    return `<svg class="house" viewBox="0 0 1200 640" role="img" aria-label="Illustration of a clean house showing windows, siding, driveway and gutters" preserveAspectRatio="xMidYMid meet"${o && o.focus ? ` data-focus="${o.focus}"` : ''}>${scene(o || {})}</svg>`;
  }
  const PINS = { windows: [516, 342], housewash: [810, 322], pressure: [700, 560], gutters: [510, 254] };
  return { scene, sweep, diagram, PINS };
})();
