/* Hand-authored engravings ("cuts") for The Quarry Bend Record.
   Original SVG line-and-stipple work in a wide newspaper-cut proportion (400x150).
   No photographs are used anywhere on this concept, so no real image ever appears
   beneath an invented headline. */

const CUTS_SPRITE = `
<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style="position:absolute;width:0;height:0;overflow:hidden">
<defs>
  <pattern id="qbT1" width="3" height="3" patternUnits="userSpaceOnUse">
    <circle cx=".75" cy=".75" r=".55" fill="currentColor" opacity=".6"/>
  </pattern>
  <pattern id="qbT2" width="2.6" height="2.6" patternUnits="userSpaceOnUse">
    <circle cx=".7" cy=".7" r=".78" fill="currentColor" opacity=".7"/>
    <circle cx="1.95" cy="1.95" r=".38" fill="currentColor" opacity=".5"/>
  </pattern>
  <pattern id="qbT3" width="2.2" height="2.2" patternUnits="userSpaceOnUse">
    <circle cx=".6" cy=".6" r="1" fill="currentColor" opacity=".85"/>
    <circle cx="1.7" cy="1.7" r=".6" fill="currentColor" opacity=".7"/>
  </pattern>
  <pattern id="qbH" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(40)">
    <line x1="0" y1="0" x2="0" y2="3" stroke="currentColor" stroke-width=".75" opacity=".68"/>
  </pattern>
  <pattern id="qbHF" width="2.4" height="2.4" patternUnits="userSpaceOnUse">
    <line x1="0" y1="0" x2="2.4" y2="0" stroke="currentColor" stroke-width=".58" opacity=".58"/>
  </pattern>
  <pattern id="qbX" width="3.4" height="3.4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
    <line x1="0" y1="0" x2="0" y2="3.4" stroke="currentColor" stroke-width=".5" opacity=".55"/>
    <line x1="0" y1="0" x2="3.4" y2="0" stroke="currentColor" stroke-width=".5" opacity=".55"/>
  </pattern>
</defs>

<!-- ─── Ash Street bridge ─── -->
<symbol id="cut-bridge" viewBox="0 0 400 150">
  <rect x="0" y="0" width="400" height="44" fill="url(#qbT1)"/>
  <g stroke="currentColor" fill="none" stroke-width=".7" opacity=".45">
    <path d="M0 14 C40 10 62 18 104 14 M240 9 C280 5 306 13 348 9"/>
  </g>
  <path d="M0 44 C34 38 58 46 96 42 C140 37 168 46 214 42 C262 38 300 47 346 42 C372 39 388 44 400 41"
        fill="url(#qbT2)" stroke="currentColor" stroke-width=".9"/>
  <path d="M0 44 H400 V56 H0 Z" fill="url(#qbT1)"/>
  <g stroke="currentColor" fill="none" stroke-width=".8" opacity=".7">
    <path d="M18 44 V36 M26 44 V38 M34 44 V34 M300 44 V37 M310 44 V33 M320 44 V38 M330 44 V35"/>
  </g>
  <rect x="0" y="112" width="400" height="38" fill="url(#qbHF)"/>
  <path d="M0 112 H400" stroke="currentColor" stroke-width="1.1"/>
  <g stroke="currentColor" stroke-width=".85" opacity=".8">
    <path d="M14 121 H86 M110 128 H196 M226 119 H302 M328 133 H392 M40 140 H140 M196 145 H286 M310 124 H360"/>
  </g>
  <rect x="24" y="90" width="352" height="5.5" fill="currentColor"/>
  <rect x="24" y="97" width="352" height="2" fill="currentColor" opacity=".75"/>
  <g stroke="currentColor" fill="none" stroke-width="1.5">
    <path d="M78 47 H322"/>
    <path d="M30 90 L78 47 M370 90 L322 47"/>
    <path d="M78 47 V90 M126 47 V90 M174 47 V90 M222 47 V90 M270 47 V90 M322 47 V90"/>
  </g>
  <g stroke="currentColor" fill="none" stroke-width="1.15">
    <path d="M78 47 L126 90 M126 47 L174 90 M174 47 L222 90 M222 47 L174 90 M270 47 L222 90 M322 47 L270 90"/>
  </g>
  <g stroke="currentColor" fill="none" stroke-width=".6" opacity=".7">
    <path d="M78 58 H322 M78 79 H322"/>
  </g>
  <g stroke="currentColor" fill="none" stroke-width=".8" opacity=".85">
    <path d="M40 99 V106 M64 99 V106 M88 99 V106 M112 99 V106 M136 99 V106 M160 99 V106 M184 99 V106 M208 99 V106 M232 99 V106 M256 99 V106 M280 99 V106 M304 99 V106 M328 99 V106 M352 99 V106"/>
  </g>
  <g>
    <rect x="86" y="99" width="15" height="16" fill="url(#qbT3)"/>
    <rect x="86" y="99" width="15" height="16" fill="none" stroke="currentColor" stroke-width="1.1"/>
    <rect x="252" y="99" width="15" height="16" fill="url(#qbT3)"/>
    <rect x="252" y="99" width="15" height="16" fill="none" stroke="currentColor" stroke-width="1.1"/>
  </g>
  <g stroke="currentColor" stroke-width=".6" opacity=".45">
    <path d="M86 117 H101 M86 121 H101 M252 117 H267 M252 121 H267"/>
  </g>
</symbol>

<!-- ─── Quarry high wall ─── -->
<symbol id="cut-quarry" viewBox="0 0 400 150">
  <path d="M0 0 H400 V94 H262 V74 H188 V52 H112 V30 H0 Z" fill="url(#qbT1)"/>
  <g stroke="currentColor" fill="none" stroke-width=".9" opacity=".8">
    <path d="M0 30 L22 18 L38 26 L58 12 L76 24 L96 16 L112 30"/>
    <path d="M300 30 L318 20 L332 26 L350 14 L368 24 L384 18 L400 27"/>
  </g>

  <!-- rock face, stepping back and darkening with each bench -->
  <path d="M0 30 H112 V110 H0 Z"    fill="url(#qbT1)"/>
  <path d="M0 30 H112 V110 H0 Z"    fill="url(#qbT2)" opacity=".5"/>
  <path d="M112 52 H188 V110 H112 Z" fill="url(#qbT2)"/>
  <path d="M188 74 H262 V110 H188 Z" fill="url(#qbT2)"/>
  <path d="M188 74 H262 V110 H188 Z" fill="url(#qbT3)" opacity=".35"/>
  <path d="M262 94 H400 V110 H262 Z" fill="url(#qbT3)"/>

  <!-- the bench profile itself -->
  <g stroke="currentColor" fill="none" stroke-width="1.7">
    <path d="M0 30 H112 V52 H188 V74 H262 V94 H400"/>
  </g>

  <!-- strata -->
  <g stroke="currentColor" fill="none" stroke-width=".7" opacity=".55">
    <path d="M0 41 H112 M0 52 H112 M0 63 H112 M0 74 H112 M0 85 H112 M0 96 H112"/>
    <path d="M112 63 H188 M112 74 H188 M112 85 H188 M112 96 H188"/>
    <path d="M188 84 H262 M188 96 H262"/>
  </g>

  <!-- drill and blast lines on the faces -->
  <g stroke="currentColor" fill="none" stroke-width=".55" opacity=".7">
    <path d="M14 30 V52 M30 33 V52 M46 30 V52 M62 35 V52 M78 30 V52 M94 33 V52"/>
    <path d="M126 52 V74 M140 55 V74 M154 52 V74 M168 56 V74 M182 52 V74"/>
    <path d="M200 74 V94 M214 77 V94 M228 74 V94 M242 78 V94 M256 74 V94"/>
  </g>

  <!-- haul road cut into the second bench -->
  <g stroke="currentColor" fill="none" stroke-width="1" opacity=".85">
    <path d="M112 52 L150 60 L188 58"/>
    <path d="M112 56 L150 64 L188 62"/>
  </g>

  <!-- flooded pit -->
  <rect x="0" y="110" width="400" height="40" fill="url(#qbHF)"/>
  <path d="M0 110 H400" stroke="currentColor" stroke-width="1.4"/>
  <g stroke="currentColor" stroke-width=".85" opacity=".8">
    <path d="M16 119 H94 M120 127 H210 M236 117 H318 M340 131 H392 M44 138 H150 M190 144 H284 M300 141 H370"/>
  </g>
  <g stroke="currentColor" stroke-width=".6" opacity=".45">
    <path d="M266 114 H396 M272 118 H390"/>
  </g>

  <!-- conveyor stub and spoil heap on the floor -->
  <g stroke="currentColor" fill="none" stroke-width="1.1">
    <path d="M300 94 L316 82 M316 82 L334 94 M310 88 H326"/>
  </g>
  <path d="M344 94 L358 84 L374 94 Z" fill="url(#qbT3)" stroke="currentColor" stroke-width="1"/>
</symbol>

<!-- ─── Pell Valley Middle School ─── -->
<symbol id="cut-schoolhouse" viewBox="0 0 400 150">
  <rect x="0" y="0" width="400" height="118" fill="url(#qbT1)"/>
  <path d="M0 118 H400" stroke="currentColor" stroke-width="1.2"/>
  <rect x="0" y="118" width="400" height="32" fill="url(#qbHF)"/>
  <path d="M124 56 L200 22 L276 56 Z" fill="url(#qbT2)"/>
  <path d="M124 56 L200 22 L276 56 Z" fill="none" stroke="currentColor" stroke-width="1.5"/>
  <g stroke="currentColor" stroke-width=".55" opacity=".65">
    <path d="M136 50 L200 28 M150 44 L200 32 M164 38 L200 36"/>
  </g>
  <rect x="134" y="56" width="132" height="62" fill="none" stroke="currentColor" stroke-width="1.5"/>
  <rect x="134" y="56" width="132" height="62" fill="url(#qbT1)" opacity=".55"/>
  <g fill="url(#qbT3)" stroke="currentColor" stroke-width="1">
    <rect x="145" y="66" width="17" height="22"/>
    <rect x="171" y="66" width="17" height="22"/>
    <rect x="212" y="66" width="17" height="22"/>
    <rect x="238" y="66" width="17" height="22"/>
    <rect x="145" y="96" width="17" height="22"/>
    <rect x="238" y="96" width="17" height="22"/>
  </g>
  <g stroke="currentColor" stroke-width=".8" opacity=".85" fill="none">
    <path d="M153.5 66 V88 M145 77 H162 M179.5 66 V88 M171 77 H188 M220.5 66 V88 M212 77 H229 M246.5 66 V88 M238 77 H255"/>
  </g>
  <rect x="190" y="92" width="26" height="26" fill="url(#qbT2)" stroke="currentColor" stroke-width="1.2"/>
  <path d="M190 92 H216" stroke="currentColor" stroke-width="2"/>
  <path d="M184 118 H222 M178 124 H228 M172 130 H234" stroke="currentColor" stroke-width="1.2"/>
  <g stroke="currentColor" fill="none" stroke-width="1.1">
    <rect x="192" y="8" width="16" height="14" fill="url(#qbT1)"/>
    <path d="M189 8 L200 -1 L211 8"/>
  </g>
  <path d="M196 13 a4 5 0 0 1 8 0 z" fill="currentColor"/>
  <g stroke="currentColor" fill="none" stroke-width="1.1">
    <path d="M62 118 V88"/>
    <path d="M62 88 c-14 0 -19 -10 -11 -17 c-4 -10 8 -17 14 -11 c8 -8 19 0 17 9 c9 3 7 19 -9 19 z" fill="url(#qbT2)"/>
    <path d="M338 118 V94"/>
    <path d="M338 94 c-11 0 -15 -8 -9 -13 c-3 -8 7 -13 11 -9 c6 -6 15 0 13 7 c7 2 6 15 -7 15 z" fill="url(#qbT2)"/>
  </g>
  <g stroke="currentColor" stroke-width=".85" opacity=".8">
    <path d="M10 126 H92 M258 124 H344 M30 136 H126 M240 142 H336 M110 146 H206"/>
  </g>
  <g stroke="currentColor" fill="none" stroke-width="1.1">
    <path d="M100 118 V80 M100 80 H118"/>
  </g>
</symbol>

<!-- ─── Tannery Creek, revised flood bands ─── -->
<symbol id="cut-creek" viewBox="0 0 400 150">
  <rect x="0" y="0" width="400" height="150" fill="url(#qbT1)" opacity=".4"/>
  <g fill="none" stroke="currentColor" stroke-width=".55" opacity=".5">
    <path d="M-6 20 C54 12 96 34 152 28 C210 22 250 4 306 12 C342 17 372 10 406 4"/>
    <path d="M-6 36 C52 28 94 50 152 44 C212 38 252 20 308 28 C344 33 374 26 406 20"/>
    <path d="M-6 118 C54 112 94 130 150 124 C210 118 252 100 308 108 C344 113 374 106 406 100"/>
    <path d="M-6 134 C52 128 92 146 150 140 C210 134 254 116 310 124 C346 129 376 122 406 116"/>
  </g>
  <path d="M-6 58 C54 48 90 74 148 68 C208 62 250 42 306 50 C342 55 374 46 406 40
           L406 92 C374 100 342 110 306 104 C250 94 208 116 148 122 C90 128 54 100 -6 110 Z"
        fill="url(#qbH)"/>
  <path d="M-6 66 C52 56 92 80 150 74 C210 68 252 50 308 58 C344 63 374 55 406 48"
        fill="none" stroke="currentColor" stroke-width="1.5"/>
  <path d="M-6 100 C52 90 92 112 150 106 C210 100 254 82 310 90 C346 95 376 87 406 80"
        fill="none" stroke="currentColor" stroke-width="1.5"/>
  <path d="M-6 80 C52 70 94 94 152 88 C212 82 254 64 310 72 C346 77 376 69 406 62"
        fill="none" stroke="currentColor" stroke-width=".7" opacity=".8" stroke-dasharray="5 4"/>
  <g fill="none" stroke="currentColor" stroke-width=".85" opacity=".85">
    <rect x="22" y="24" width="20" height="13"/><rect x="48" y="18" width="20" height="13"/>
    <rect x="74" y="28" width="20" height="13"/><rect x="204" y="16" width="20" height="13"/>
    <rect x="230" y="10" width="20" height="13"/><rect x="256" y="18" width="20" height="13"/>
    <rect x="30" y="124" width="20" height="13"/><rect x="56" y="130" width="20" height="13"/>
    <rect x="278" y="116" width="20" height="13"/><rect x="304" y="110" width="20" height="13"/>
    <rect x="330" y="118" width="20" height="13"/>
  </g>
  <g fill="url(#qbT3)" stroke="currentColor" stroke-width=".9">
    <rect x="106" y="52" width="20" height="13"/><rect x="132" y="60" width="20" height="13"/>
    <rect x="158" y="56" width="20" height="13"/><rect x="196" y="98" width="20" height="13"/>
    <rect x="222" y="92" width="20" height="13"/><rect x="248" y="100" width="20" height="13"/>
    <rect x="92" y="104" width="20" height="13"/>
  </g>
  <g stroke="currentColor" stroke-width=".6" opacity=".55">
    <path d="M0 8 H400 M0 8" stroke-dasharray="2 6"/>
  </g>
  <g stroke="currentColor" fill="none" stroke-width="1">
    <path d="M368 146 V128 M368 128 L363 136 M368 128 L373 136"/>
  </g>
  <path d="M358 150 H382" stroke="currentColor" stroke-width=".8"/>
</symbol>

<!-- ─── The last rise at Ridge Farm ─── -->
<symbol id="cut-runner" viewBox="0 0 400 150">
  <rect x="0" y="0" width="400" height="104" fill="url(#qbT1)"/>
  <g stroke="currentColor" fill="none" stroke-width=".7" opacity=".45">
    <path d="M20 16 C56 10 78 20 116 14 M268 12 C304 6 328 16 366 10"/>
  </g>
  <path d="M-6 104 C70 94 120 70 200 62 C282 54 330 74 406 60 L406 150 L-6 150 Z" fill="url(#qbT2)"/>
  <path d="M-6 104 C70 94 120 70 200 62 C282 54 330 74 406 60" fill="none" stroke="currentColor" stroke-width="1.4"/>
  <g stroke="currentColor" stroke-width=".65" opacity=".6" fill="none">
    <path d="M6 118 C76 110 126 88 206 80 M6 132 C80 124 134 102 214 94 M40 146 C114 138 164 118 244 110"/>
  </g>
  <g fill="currentColor">
    <circle cx="196" cy="26" r="6.5"/>
    <path d="M192 33 L202 33 L207 52 L201 68 L191 67 L188 46 Z"/>
    <path d="M188 46 L172 36 L168 41 L185 55 Z"/>
    <path d="M204 42 L222 37 L223 43 L206 50 Z"/>
    <path d="M191 67 L184 90 L176 89 L182 66 Z"/>
    <path d="M201 68 L216 84 L221 94 L214 97 L207 85 L196 74 Z"/>
    <path d="M174 89 L165 94 L168 99 L181 95 Z"/>
    <path d="M214 97 L223 100 L222 105 L211 103 Z"/>
  </g>
  <g fill="currentColor" opacity=".55">
    <path d="M252 62 L256 56 L260 62 L258 76 L252 76 Z"/>
    <path d="M268 58 L272 52 L276 58 L274 72 L268 72 Z"/>
    <path d="M284 60 L288 55 L292 60 L290 73 L284 73 Z"/>
  </g>
  <g stroke="currentColor" stroke-width=".9" opacity=".75" fill="none">
    <path d="M228 34 L246 29 M232 44 L252 38 M236 54 L250 49"/>
  </g>
  <g stroke="currentColor" fill="none" stroke-width="1.1" opacity=".85">
    <path d="M56 98 V78 M56 78 L48 84 M56 78 L64 84"/>
    <path d="M340 84 V66 M340 66 L333 72 M340 66 L347 72"/>
  </g>
  <g stroke="currentColor" fill="none" stroke-width="1" opacity=".7">
    <path d="M96 92 V72 M96 72 c-9 0 -12 -7 -7 -11 c-2 -7 6 -11 10 -7 c5 -5 12 0 10 6 c6 2 5 12 -6 12 z"/>
  </g>
</symbol>

<!-- ─── The depot platform, cleared for winter stalls ─── -->
<symbol id="cut-awning" viewBox="0 0 400 150">
  <rect x="0" y="0" width="400" height="150" fill="url(#qbT1)" opacity=".45"/>
  <path d="M34 44 L200 12 L366 44 Z" fill="none" stroke="currentColor" stroke-width="1.4"/>
  <path d="M34 44 L200 12 L200 44 Z" fill="url(#qbT2)"/>
  <path d="M34 44 H366 L354 66 H46 Z" fill="none" stroke="currentColor" stroke-width="1.4"/>
  <g fill="url(#qbT3)">
    <path d="M46 66 L34 44 L74 44 L80 66 Z"/>
    <path d="M118 66 L116 44 L156 44 L156 66 Z"/>
    <path d="M194 66 L194 44 L234 44 L240 66 Z"/>
    <path d="M272 66 L268 44 L308 44 L316 66 Z"/>
  </g>
  <g stroke="currentColor" stroke-width="1.3" fill="none">
    <path d="M54 66 V124 M346 66 V124"/>
    <path d="M28 124 H372"/>
  </g>
  <rect x="0" y="124" width="400" height="26" fill="url(#qbHF)"/>
  <g stroke="currentColor" stroke-width="1.2" fill="url(#qbHF)">
    <rect x="96" y="88" width="62" height="34"/>
    <rect x="172" y="94" width="54" height="28"/>
    <rect x="244" y="90" width="58" height="32"/>
  </g>
  <g stroke="currentColor" stroke-width=".8" opacity=".8">
    <path d="M96 100 H158 M96 111 H158 M172 105 H226 M244 102 H302 M244 112 H302"/>
  </g>
  <g fill="url(#qbT3)" stroke="currentColor" stroke-width=".9">
    <circle cx="110" cy="80" r="7.5"/><circle cx="126" cy="79" r="7.5"/><circle cx="142" cy="81" r="7.5"/>
    <circle cx="118" cy="70" r="6.8"/><circle cx="134" cy="71" r="6.8"/>
  </g>
  <g stroke="currentColor" stroke-width="1.2" fill="url(#qbT2)">
    <path d="M254 90 c0 -11 7 -17 18 -17 c11 0 18 6 18 17 Z"/>
  </g>
  <g stroke="currentColor" stroke-width="1" fill="none">
    <path d="M264 73 c3 -8 10 -11 17 -8"/>
    <path d="M178 94 c0 -9 6 -14 14 -14 c8 0 14 5 14 14"/>
  </g>
  <g stroke="currentColor" stroke-width=".85" opacity=".75">
    <path d="M12 132 H88 M116 140 H222 M250 130 H340 M60 146 H180 M290 144 H382"/>
  </g>
  <path d="M28 124 H372" stroke="currentColor" stroke-width="1.6"/>
</symbol>
</svg>`;
