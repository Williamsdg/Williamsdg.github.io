/* ===================================================================
   ATN Missions — 3D scenes with Three.js (r128, MIT license)
   Open-source: https://github.com/mrdoob/three.js
   Three scenes:
     1. Hero  — point-cloud earth + animated gospel-arc connections
     2. Movement — wireframe globe + pulsing location pins
     3. Join  — drifting light particles ("prayers rising")
   =================================================================== */
(function () {
  'use strict';
  if (typeof THREE === 'undefined') { console.warn('Three.js failed to load'); return; }

  const GOLD = 0xe0a94b;
  const GOLD_BRIGHT = 0xf4c56a;
  const BLUE = 0x2c4a7a;
  const LIGHT = 0x9fc0ff;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- lat/long -> vec3 on a sphere of radius r ---- */
  function llToVec3(lat, lon, r) {
    const phi = (90 - lat) * Math.PI / 180;
    const theta = (lon + 180) * Math.PI / 180;
    return new THREE.Vector3(
      -r * Math.sin(phi) * Math.cos(theta),
       r * Math.cos(phi),
       r * Math.sin(phi) * Math.sin(theta)
    );
  }

  /* Real Earth land mask (incl. ice caps), derived from a NASA Blue Marble
     equirectangular map at 360x180 (1 deg/cell), packed 1 bit/cell (land=1),
     base64-encoded. Sampling it gives accurate continent coastlines with no
     runtime network dependency. */
  const MASK_W = 360, MASK_H = 180;
  const MASK_B64 = '////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wA//////////////////////////////////////////////8PhPj///8AAAAAAAf////////////////////////////////////////////xIAH//wAAAAAAAAB8P/4H////////////////////////////////////////BgAP4ADwAAAAAAAAA/4B///////////////////////////////8///////+H4AAAADgAAAAAAAAAAAAf////////////////////////////+/gA//////+CQAAAACAAAAAAAAAAAAD/5///4P//////////////////////n4AAAP////8AAAAAAAAAAAAAAAAAAAAP////wBH///////////////////P/n4AAAH////BkAAAAAAAAAAAAAAAAAAf////4AAzHH////////7////////+8AAAAAD////gAAAAAAAAAAAAAEAAAAH/8/yIAAAAAAP/////n/7/H//////8eIAAAAB////AAAAAAAAAAAAAAQAAAA///+OYCAAAAAP///wAAAMAf/8fP//OAZ4AAABf//8AAAAAAAAAAAAABgAHAD///////4AEAAAf//wAAAAAAAAAP/5AQN/4AAAH//8AgAAAAAAAAAAABwAPJ9///////4AP/AAOAAAAAPwAAAAAAP/44D+9AAAD//4AAAAAAAAA+AAAAAAfP/////////////4AAAAAB///4A+GA/uAOBgH4AAD//AAAAAAAAA//4AAAAYPP/////////////8wH4gAH///////+AACPxwB4AAH/8AAAAAAAAD///wABO/nm/////////////////8AD////////O//fzwA/AAf/gAAAAAAAAH///+I////H/////////////////+4A//////8f////4ABs4Af/AAAAAAAAAf//88P//////////////////////Dwf//////4/////4AD8AAP+AAAP8AAAA/8f+D///////////////////////AAAf///////////zgB+AAH+AAAPwAAAB/4/+f//////////////////////8AAAf//////////+AAAdgAH8AAAAAAAAH/j/////////////////////////+AAH///////////4AAAAAAB4AAAAAAAAf/H///////////////////////v/wAAH///////8f//wAA/AAAAAAAAAAAAB/+H/O////////////////////DP+AAAD//x////////gAAfwAAAAAAAAAAAB//D5n///////////////////+AeIAAAA/wAB///////gAA/wQAAAAAAAAAAA//g7//////////////////+McBgAAAAADwAAf//////4AA/84AAAAAAAAAAA5+A///////////////////4AAHAAAAAACIAAP//////4AAf/8AAAAAAAAA8AA+C///////////////////gAAfgAAAAAAAAAD///////wAP/8AAAAAAAAA4AMcH///////////////////AAA/gAAAAAAAAAB///////8Af//AAAAAAAAAcANQH//////////////////8AAA/AAAAAAAAAAAP///////x///wAAAAAAAHGAGBv//////////////v///8AAA8AAAAAAAAAAAP////7//x///8AAAAAAAPHA////////////////+f////6AA8AAAAAAAAAAAH////5//5///8AAAAAAAPPx//////////////////////+AAwAAAAAAAAAAAD///////9///0AAAAAAAAPn//////////////////////6AAAAAAAAAAAAAAD///////////EAAAAAAAAAf//////////////////////zAAAAAAAAAAAAAAA/////////+AOAAAAAAAAA///////////////////////zAAAAAAAAAAAAAAAf/////j///gfAAAAAAAAP///////////////////////yAAAAAAAAAAAAAAAP////+B///gDgAAAAAAAH///////////////////////iAAAAAAAAAAAAAAAP/////7///wAAAAAAAAAD//////P/x//////////////AAAAAAAAAAAAAAAAP/////5D//8AAAAAAAAAB/////Gf/D+////////////+AAAAAAAAAAAAAAAAP/////zn/8wAAAAAAAAAB//H/+AP+H+////////////8CAAAAAAAAAAAAAAAP/////zvfwAAAAAAAAADj9jj/8AD/H/////////////4HgAAAAAAAAAAAAAAP/////zz/gAAAAAAAAAH/4Bwf8AA/B////////////+AKAAAAAAAAAAAAAAAP////////gAAAAAAAAAH/wAcf8PB/g////////////8AAAAAAAAAAAAAAAAAP///////8AAAAAAAAAAH/AEGPP///x///////////v4AMAAAAAAAAAAAAAAAP///////8AAAAAAAAAAH/AACOP///g//////////+JwAMAAAAAAAAAAAAAAAH///////4AAAAAAAAAAH/AAAHH///g//////////8BwAIAAAAAAAAAAAAAAAD///////wAAAAAAAAAAH8AAYCH///w//////////+w4AYAAAAAAAAAAAAAAAD///////wAAAAAAAAAAAgP+AABM//////////////g4D4AAAAAAAAAAAAAAAB///////wAAAAAAAAAAAh/+AAAA//////////////A4fwAAAAAAAAAAAAAAAA///////gAAAAAAAAAAA//8AAAA//////////////AA+AAAAAAAAAAAAAAAAAP/////+AAAAAAAAAAAD//+AAAB//////////////gDQAAAAAAAAAAAAAAAAAH/////8AAAAAAAAAAAH///4GAB//////////////gDAAAAAAAAAAAAAAAAAAG/////4AAAAAAAAAAAP///8Pwz//////////////wAAAAAAAAAAAAAAAAAAACf////4AAAAAAAAAAAP////P////////////////wAAAAAAAAAAAAAAAAAAABP//jAYAAAAAAAAAAAP/////////H///////////wAAAAAAAAAAAAAAAAAAAAv//AAYAAAAAAAAAAAf/////////H///////////wAAAAAAAAAAAAAAAAAAAA3/+AAcAAAAAAAAAAB///////8//h///////////gAAAAAAAAAAAAAAAAAAAAT/+AAMAAAAAAAAAAD///////8//wH//////////AAAAAAAAAAAAAAAAAAAAAJ/+AAEAAAAAAAAAAH///////+f/4Ae////////+AAAAAAAAAAAAAAAAAAAAAI/8AAAAAAAAAAAAAH///////+P/84Af///////8QAAAAAAAAAAAAAAAAAAAAAf8AAAAAAAAAAAAAP///////+H//8AP///////4gAAAAAAAAAAAAAAAAAAAAAP8AAuAAAAAAAAAAP////////H//+AH///////AAAAAAAAAAAAAAAAAAAAAAAH8AYBgAAAAAAAAAf////////n//+AD//8P//YAAAAAAAAAAAAAAAAAAAAAAAH+B4A4AAAAAAAAAP////////j//8AAf/4H/+AAAAAAAAAAAAAAAAAAAAAAAAH/BwABwAAAAAAAAP////////h//8AAf/gD/8YAAAAAAAAAAAAAAAAAAAAAAAB/nwAB4AAAAAAAAP////////x//4AAf/AD/8QAAAAAAAAAAAAAAAAAAAAAAAAf/wAAAAAAAAAAAP////////4//gAAf+AB/+AAwAAAAAAAAAAAAAAAAAAAAAAH/wAAAAAAAAAAAP////////4f8AAAf8AD//AAwAAAAAAAAAAAAAAAAAAAAAAAH/AAAAAAAAAAAf////////8f8AAAPwAAP/gAwAAAAAAAAAAAAAAAAAAAAAAAD/gAAAAAAAAAAf////////+fgAAAPwAAP/gAQAAAAAAAAAAAAAAAAAAAAAAAAfAAAAAAAAAAAf/////////cAAAAHwAAP/gAAAAAAAAAAAAAAAAAAAAAAAAAAHAAAAAAAAAAAf/////////gAAAAHwAAM/gAAAAAAAAAAAAAAAAAAAAAAAAAADABoAAAAAAAAP/////////gIAAADwAAMfgAIAAAAAAAAAAAAAAAAAAAAAAAADgH/IAAAAAAAH/////////34AAADwAAIOAAEAAAAAAAAAAAAAAAAAAAAAAAAAgP/+AAAAAAAD//////////4AAADgAAIEAAAAAAAAAAAAAAAAAAAAAAAAAAAAd///AAAAAAAB//////////wAAABIAAMAAADAAAAAAAAAAAAAAAAAAAAAAAAAA///gAAAAAAB//////////wAAAAMAAEAAADAAAAAAAAAAAAAAAAAAAAAAAAAAf//4AAAAAAAf/////////gAAAAMAADAAMDAAAAAAAAAAAAAAAAAAAAAAAAAAf///gAAAAAAP/B///////gAAAAAAADgAOAAAAAAAAAAAAAAAAAAAAAAAAAAAf///wAAAAAACAA///////AAAAAAAAxgA8AAAAAAAAAAAAAAAAAAAAAAAAAAAf///4AAAAAAAAAD/////+AAAAAAAAZgB8AAAAAAAAAAAAAAAAAAAAAAAAAAA////4AAAAAAAAAD/////8AAAAAAAAPwH8AAAAAAAAAAAAAAAAAAAAAAAAAAB////8AAAAAAAAAD/////4AAAAAAAAHwf8AAAAAAAAAAAAAAAAAAAAAAAAAAD////8AAAAAAAAAH/////gAAAAAAAAHwf8AAAAAAAAAAAAAAAAAAAAAAAAAAH/////AAAAAAAAAH///z/AAAAAAAAADwf4AAgAAAAAAAAAAAAAAAAAAAAAAAH/////4AAAAAAAAH///z/AAAAAAAAAB4P5wBwAAAAAAAAAAAAAAAAAAAAAAAH/////+AAAAAAAAD////+AAAAAAAAAB8PxwAz4AAAAAAAAAAAAAAAAAAAAAAH//////4AAAAAAAB////8AAAAAAAAAA8AxQAf/AAAAAAAAAAAAAAAAAAAAAAH//////8AAAAAAAA////4AAAAAAAAAAcAAIAD/gAAAAAAAAAAAAAAAAAAAAAH///////gAAAAAAA////4AAAAAAAAAAMAAAAA/wgAAAAAAAAAAAAAAAAAAAAD///////gAAAAAAA////4AAAAAAAAAADgAAAA/4AAAAAAAAAAAAAAAAAAAAAB///////gAAAAAAAf///4AAAAAAAAAAB/AAAA/4AAAAAAAAAAAAAAAAAAAAAB///////gAAAAAAAf///4AAAAAAAAAAAAAAAAPMAAAAAAAAAAAAAAAAAAAAAA///////AAAAAAAAf///8AAAAAAAAAAAAACAAAGAAAAAAAAAAAAAAAAAAAAAA//////+AAAAAAAAP///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/////+AAAAAAAAP///+AAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAf/////8AAAAAAAAf///+AAAAAAAAAAAAAAB+CAAAAAAAAAAAAAAAAAAAAAAAP/////4AAAAAAAAf///+AwAAAAAAAAAAAAD8DAAAAAAAAAAAAAAAAAAAAAAAP/////4AAAAAAAA////+AwAAAAAAAAAAAA38HgAAAAAAAAAAAAAAAAAAAAAAH/////4AAAAAAAA////8DwAAAAAAAAAAAB/+HgAAAAAAAAAAAAAAAAAAAAAAB/////4AAAAAAAA////8PwAAAAAAAAAAAD//HwAAAAAAAAAAAAAAAAAAAAAAAf////4AAAAAAAA////wPwAAAAAAAAAAAP///wAAAAAAAAAAAAAAAAAAAAAAAP////wAAAAAAAA////gPgAAAAAAAAAAAP///wAAAAAAAAAAAAAAAAAAAAAAAP////wAAAAAAAAf//+APgAAAAAAAAAAAf///4AAAAAAAAAAAAAAAAAAAAAAAP////wAAAAAAAAf//+APgAAAAAAAAAAD////+AAAAAAAAAAAAAAAAAAAAAAAP////gAAAAAAAAP//+AfAAAAAAAAAAAf////+AAAAAAAAAAAAAAAAAAAAAAAP////AAAAAAAAAP///AfAAAAAAAAAAA//////gAAAAAAAAAAAAAAAAAAAAAAP///4AAAAAAAAAP//+APAAAAAAAAAAA//////gAAAAAAAAAAAAAAAAAAAAAAP///gAAAAAAAAAH//+AOAAAAAAAAAAA//////wAAAAAAAAAAAAAAAAAAAAAAP///AAAAAAAAAAH//4AAAAAAAAAAAAA//////4AAAAAAAAAAAAAAAAAAAAAAf//+AAAAAAAAAAH//4AAAAAAAAAAAAA//////4AAAAAAAAAAAAAAAAAAAAAAf//+AAAAAAAAAAD//4AAAAAAAAAAAAA//////4AAAAAAAAAAAAAAAAAAAAAAf//+AAAAAAAAAAD//wAAAAAAAAAAAAA//////4AAAAAAAAAAAAAAAAAAAAAAf//8AAAAAAAAAAB//gAAAAAAAAAAAAAf/////4AAAAAAAAAAAAAAAAAAAAAA///4AAAAAAAAAAB//gAAAAAAAAAAAAAf/////4AAAAAAAAAAAAAAAAAAAAAA///wAAAAAAAAAAA//AAAAAAAAAAAAAAP/////4AAAAAAAAAAAAAAAAAAAAAAf//wAAAAAAAAAAA/+AAAAAAAAAAAAAAP+AP//wAAAAAAAAAAAAAAAAAAAAAA///gAAAAAAAAAAA/4AAAAAAAAAAAAAAf8AH//gAAAAAAAAAAAAAAAAAAAAAA///AAAAAAAAAAAAQAAAAAAAAAAAAAAAOAAA//gAAAAAAAAAAAAAAAAAAAAAB//4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/AAAAAAAAAAAAAAAAAAAAAAB//4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/AAAAAAAAAAAAAAAAAAAAAAB//4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/AAAAQAAAAAAAAAAAAAAAAAB//wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABIAAAAcAAAAAAAAAAAAAAAAAB/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAD/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAD/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcAAADAAAAAAAAAAAAAAAAAAB/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcAAAGAAAAAAAAAAAAAAAAAAB/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAD+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB4AAAAAAAAAAAAAAAAAAH+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeAAAAAAAAAAAAAAAAAADwAAAAEB/wDAABwAAAAAAAAAAAAAAAAAAAAAAAAAA+AAAAAAAAAAAAAAAAAAP8AAAD/////m///+AAAAAAAAAAAAAAAAAAAAAAAAA+AAAAAAAAAAAAAAAAAf///4Af//////////4AAAAAAAAAAAAAAAAAAAAAAAD8AAAAAAAAABAAAAAUD/////4/////////////gAAAAAAAAAAAAAAAAAAAAD/+AAAAAAAAAD///4P//////v//////////////8AAAAAAAAAAAAAAAAAAAAB/+AAAAAAAAf////////////H///////////////eAAAAAAAAAAAAAAA/AAAA/+AAAAAAAH////////////+P///////////////+AAAAAAAAAAAAAAAf/8A//+AAAAAAD/////////////4P///////////////4AAAAAAAAAAD//AAf/////8AAAAAAP//////////////////////////////AAAAAAAAAB////4A//////+AAAAAA///////////////////////////////AAAAAAAAP//////////////4AAAAH//////////////////////////////+AAAAAAAB////////////////4AAB///////////////////////////////8AAAAAA////////////9//////Z/f//////////////////////////////////8/////////////////////8P/////////////////////////////////D///////////////////////////////////////////////////////////H///////////////////////////////////////////////////////////z/////////////////////////+f////////////////////////////////4f///////////////////////////////////////////////////////////8///////////////////////////////////////////////////////////4F/3/j/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////';
  const MASK_BITS = (function () {
    const bin = atob(MASK_B64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes; // MSB-first bit order within each byte, row-major
  })();
  function maskAt(col, row) {
    if (row < 0) row = 0; else if (row >= MASK_H) row = MASK_H - 1;
    col = ((col % MASK_W) + MASK_W) % MASK_W;
    const idx = row * MASK_W + col;
    return (MASK_BITS[idx >> 3] >> (7 - (idx & 7))) & 1;
  }
  /* lat -90..90, lon -180..180 -> is this point over real land? */
  function isLand(lat, lon) {
    const col = Math.floor((lon + 180) / 360 * MASK_W);
    const row = Math.floor((90 - lat) / 180 * MASK_H);
    return maskAt(col, row) === 1;
  }

  /* deterministic pseudo-random so scenes are stable */
  let seed = 1337;
  function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }

  /* =================================================================
     SCENE 1 — HERO GLOBE
     ================================================================= */
  function initHero() {
    const canvas = document.getElementById('globe-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 1000);
    camera.position.set(0, 0, 300);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const globe = new THREE.Group();
    scene.add(globe);
    const R = 90;

    // --- dot-matrix earth ---
    const positions = [];
    const colors = [];
    const cGold = new THREE.Color(GOLD_BRIGHT);
    const cBlue = new THREE.Color(0x38598f);
    for (let lat = -88; lat <= 88; lat += 1.8) {
      const circ = Math.cos(lat * Math.PI / 180);
      const step = 1.8 / Math.max(circ, 0.05);
      for (let lon = -180; lon < 180; lon += step) {
        if (isLand(lat, lon)) {
          const v = llToVec3(lat, lon, R);
          positions.push(v.x, v.y, v.z);
          const c = (rnd() > 0.9) ? cGold : cBlue;
          colors.push(c.r, c.g, c.b);
        }
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    const dotMat = new THREE.PointsMaterial({ size: 1.5, vertexColors: true, transparent: true, opacity: 0.95, sizeAttenuation: true });
    globe.add(new THREE.Points(geo, dotMat));

    // --- faint sphere shell + wire ---
    const shell = new THREE.Mesh(
      new THREE.SphereGeometry(R * 0.99, 40, 40),
      new THREE.MeshBasicMaterial({ color: 0x0a1a3a, transparent: true, opacity: 0.55 })
    );
    globe.add(shell);
    const wire = new THREE.Mesh(
      new THREE.SphereGeometry(R * 1.002, 24, 18),
      new THREE.MeshBasicMaterial({ color: BLUE, wireframe: true, transparent: true, opacity: 0.08 })
    );
    globe.add(wire);

    // --- atmosphere glow (backside sphere) ---
    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(R * 1.18, 40, 40),
      new THREE.ShaderMaterial({
        transparent: true, side: THREE.BackSide, blending: THREE.AdditiveBlending,
        uniforms: { c: { value: new THREE.Color(0x3a6bd0) } },
        vertexShader: 'varying vec3 vN; void main(){ vN=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
        fragmentShader: 'varying vec3 vN; uniform vec3 c; void main(){ float i=pow(0.62-dot(vN,vec3(0,0,1.0)),3.0); gl_FragColor=vec4(c,1.0)*i;}'
      })
    );
    globe.add(glow);

    // --- gospel arcs: from a US "home base" out to the nations ---
    const home = { lat: 33.5, lon: -86.8 }; // Birmingham-ish home base
    const targets = [
      [27.7, 85.3], [ -1.3, 36.8], [ 28.6, 77.2], [ -6.2, 106.8],
      [ 14.6, 121.0], [  9.0, 38.7], [ -15, -47], [ 51.5, -0.1],
      [ 35.7, 139.7], [ -33.9, 18.4], [ 40.4, -3.7], [ 6.5, 3.4]
    ];
    const arcs = [];
    const arcGroup = new THREE.Group();
    globe.add(arcGroup);

    function makeArc(a, b, delay) {
      const start = llToVec3(a.lat, a.lon, R);
      const end = llToVec3(b[0], b[1], R);
      const dist = start.distanceTo(end);
      const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(R + dist * 0.42);
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const pts = curve.getPoints(60);
      const g = new THREE.BufferGeometry().setFromPoints(pts);
      const m = new THREE.LineBasicMaterial({ color: GOLD_BRIGHT, transparent: true, opacity: 0.0 });
      const line = new THREE.Line(g, m);
      arcGroup.add(line);

      // traveling pulse
      const pulseGeo = new THREE.BufferGeometry();
      pulseGeo.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0], 3));
      const pulseMat = new THREE.PointsMaterial({ color: 0xffffff, size: 4.2, transparent: true, opacity: 0, sizeAttenuation: true });
      const pulse = new THREE.Points(pulseGeo, pulseMat);
      arcGroup.add(pulse);

      arcs.push({ curve, line, pulse, delay, dur: 2.6 + rnd() * 1.4, pts });
    }
    targets.forEach((t, i) => makeArc(home, t, i * 0.55));

    // destination pins
    const pinGroup = new THREE.Group();
    globe.add(pinGroup);
    [...targets, [home.lat, home.lon]].forEach((t, i) => {
      const v = llToVec3(t[0] !== undefined ? t[0] : home.lat, t[1] !== undefined ? t[1] : home.lon, R + 0.5);
      const isHome = i === targets.length;
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(isHome ? 2.4 : 1.4, 10, 10),
        new THREE.MeshBasicMaterial({ color: isHome ? 0xffffff : GOLD_BRIGHT })
      );
      dot.position.copy(v);
      pinGroup.add(dot);
    });

    // open facing the Atlantic — Americas at left, Africa/Europe at right —
    // so the home base and outgoing gospel arcs read clearly
    globe.rotation.x = 0.34;
    globe.rotation.y = -0.62;

    let mx = 0, my = 0, tx = 0, ty = 0;
    window.addEventListener('pointermove', (e) => {
      tx = (e.clientX / window.innerWidth - 0.5);
      ty = (e.clientY / window.innerHeight - 0.5);
    });

    function resize() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (canvas.width !== w || canvas.height !== h) {
        renderer.setSize(w, h, false);
        camera.aspect = w / h; camera.updateProjectionMatrix();
      }
      // push globe to the right on desktop; center it when layout stacks
      globe.position.x = (w > 960) ? R * 0.95 : 0;
    }

    let t = 0;
    function animate() {
      requestAnimationFrame(animate);
      resize();
      t += 0.016;
      if (!prefersReduced) globe.rotation.y += 0.0016;
      mx += (tx - mx) * 0.05; my += (ty - my) * 0.05;
      globe.rotation.y += mx * 0.001;
      globe.rotation.x = 0.32 + my * 0.25;

      // animate arcs
      arcs.forEach((a) => {
        const local = (t - a.delay) % (a.dur + 1.6);
        if (local < 0) { a.line.material.opacity = 0; a.pulse.material.opacity = 0; return; }
        const p = local / a.dur;
        if (p <= 1) {
          const drawn = Math.max(2, Math.floor(p * a.pts.length));
          a.line.geometry.setDrawRange(0, drawn);
          a.line.material.opacity = 0.55;
          const pos = a.curve.getPoint(Math.min(p, 1));
          a.pulse.geometry.attributes.position.setXYZ(0, pos.x, pos.y, pos.z);
          a.pulse.geometry.attributes.position.needsUpdate = true;
          a.pulse.material.opacity = 1;
        } else {
          // fade the full arc, hide pulse
          const fade = 1 - (local - a.dur) / 1.6;
          a.line.material.opacity = Math.max(0, fade * 0.55);
          a.pulse.material.opacity = 0;
          a.line.geometry.setDrawRange(0, a.pts.length);
        }
      });

      renderer.render(scene, camera);
    }
    animate();
  }

  /* =================================================================
     SCENE 2 — MOVEMENT GLOBE (wireframe + pins)
     ================================================================= */
  function initMovement() {
    const holder = document.getElementById('movement-canvas');
    if (!holder) return;
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%'; canvas.style.height = '100%';
    holder.appendChild(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.set(0, 0, 260);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const group = new THREE.Group();
    scene.add(group);
    const R = 78;

    // glowing wire globe
    group.add(new THREE.Mesh(
      new THREE.SphereGeometry(R, 30, 22),
      new THREE.MeshBasicMaterial({ color: 0x2f5296, wireframe: true, transparent: true, opacity: 0.22 })
    ));
    group.add(new THREE.Mesh(
      new THREE.SphereGeometry(R * 0.985, 40, 40),
      new THREE.MeshBasicMaterial({ color: 0x081428, transparent: true, opacity: 0.85 })
    ));

    // land dots
    const positions = [], colors = [];
    const cA = new THREE.Color(GOLD), cB = new THREE.Color(0x4a6fa8);
    for (let lat = -86; lat <= 86; lat += 2.3) {
      const circ = Math.cos(lat * Math.PI / 180);
      const step = 2.3 / Math.max(circ, 0.05);
      for (let lon = -180; lon < 180; lon += step) {
        if (isLand(lat, lon)) {
          const v = llToVec3(lat, lon, R + 0.4);
          positions.push(v.x, v.y, v.z);
          const c = rnd() > 0.88 ? cA : cB;
          colors.push(c.r, c.g, c.b);
        }
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    group.add(new THREE.Points(g, new THREE.PointsMaterial({ size: 1.4, vertexColors: true, transparent: true, opacity: 0.92 })));

    // pulsing pins across the map
    const pinSpots = [
      [40, -100], [34, -84], [19, -99], [-12, -50], [51, 0], [48, 12],
      [9, 8], [-1, 37], [-26, 28], [28, 77], [39, 116], [-6, 107], [35, 138], [-33, 151]
    ];
    const pins = [];
    pinSpots.forEach((s) => {
      const v = llToVec3(s[0], s[1], R + 0.6);
      const core = new THREE.Mesh(new THREE.SphereGeometry(1.3, 8, 8), new THREE.MeshBasicMaterial({ color: GOLD_BRIGHT }));
      core.position.copy(v); group.add(core);
      const ringGeo = new THREE.RingGeometry(2, 2.5, 20);
      const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0.8, side: THREE.DoubleSide }));
      ring.position.copy(v);
      ring.lookAt(v.clone().multiplyScalar(2));
      group.add(ring);
      pins.push({ ring, phase: rnd() * Math.PI * 2 });
    });

    // atmosphere
    group.add(new THREE.Mesh(
      new THREE.SphereGeometry(R * 1.2, 40, 40),
      new THREE.ShaderMaterial({
        transparent: true, side: THREE.BackSide, blending: THREE.AdditiveBlending,
        uniforms: { c: { value: new THREE.Color(0x3a6bd0) } },
        vertexShader: 'varying vec3 vN; void main(){ vN=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
        fragmentShader: 'varying vec3 vN; uniform vec3 c; void main(){ float i=pow(0.6-dot(vN,vec3(0,0,1.0)),3.0); gl_FragColor=vec4(c,1.0)*i;}'
      })
    ));

    group.rotation.x = 0.35;

    function resize() {
      const w = holder.clientWidth, h = holder.clientHeight;
      if (canvas.width !== w || canvas.height !== h) {
        renderer.setSize(w, h, false);
        camera.aspect = w / h; camera.updateProjectionMatrix();
      }
    }
    let t = 0;
    function animate() {
      requestAnimationFrame(animate);
      resize();
      t += 0.016;
      if (!prefersReduced) group.rotation.y += 0.0022;
      pins.forEach((p) => {
        const s = 1 + Math.sin(t * 2 + p.phase) * 0.6 + 0.6;
        p.ring.scale.setScalar(s);
        p.ring.material.opacity = Math.max(0, 0.9 - (s - 1) * 0.45);
      });
      renderer.render(scene, camera);
    }
    animate();
  }

  /* =================================================================
     SCENE 3 — JOIN PARTICLES ("prayers rising")
     ================================================================= */
  function initJoin() {
    const canvas = document.getElementById('join-canvas');
    if (!canvas) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    camera.position.z = 200;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const N = 380;
    const pos = new Float32Array(N * 3);
    const spd = new Float32Array(N);
    const colArr = [];
    const cG = new THREE.Color(GOLD_BRIGHT), cL = new THREE.Color(LIGHT);
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (rnd() - 0.5) * 420;
      pos[i * 3 + 1] = (rnd() - 0.5) * 300;
      pos[i * 3 + 2] = (rnd() - 0.5) * 220;
      spd[i] = 0.15 + rnd() * 0.5;
      const c = rnd() > 0.5 ? cG : cL;
      colArr.push(c.r, c.g, c.b);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colArr, 3));
    const mat = new THREE.PointsMaterial({ size: 2.4, vertexColors: true, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false });
    const pts = new THREE.Points(geo, mat);
    scene.add(pts);

    function resize() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (canvas.width !== w || canvas.height !== h) {
        renderer.setSize(w, h, false);
        camera.aspect = w / h; camera.updateProjectionMatrix();
      }
    }
    function animate() {
      requestAnimationFrame(animate);
      resize();
      const p = geo.attributes.position.array;
      if (!prefersReduced) {
        for (let i = 0; i < N; i++) {
          p[i * 3 + 1] += spd[i];
          if (p[i * 3 + 1] > 150) p[i * 3 + 1] = -150;
        }
        geo.attributes.position.needsUpdate = true;
        pts.rotation.y += 0.0004;
      }
      renderer.render(scene, camera);
    }
    animate();
  }

  /* =================================================================
     UI: nav scroll, reveal-on-scroll, counters
     ================================================================= */
  function initUI() {
    // Always open at the top of the page: stop the browser from restoring a
    // previous scroll position on reload. Honor an explicit #hash deep-link.
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    if (!window.location.hash) window.scrollTo(0, 0);

    const header = document.getElementById('header');
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll); onScroll();

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

    // count-up stats
    const fmt = (n) => n >= 1000 ? Math.round(n).toLocaleString() : Math.round(n);
    const statIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target, target = +el.dataset.count, suffix = el.dataset.suffix || '';
        const dur = 1600; const t0 = performance.now();
        function step(now) {
          const k = Math.min(1, (now - t0) / dur);
          const eased = 1 - Math.pow(1 - k, 3);
          el.textContent = fmt(target * eased) + (k === 1 ? suffix : '');
          if (k < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        statIO.unobserve(el);
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('.num[data-count]').forEach((el) => statIO.observe(el));
  }

  window.addEventListener('DOMContentLoaded', () => {
    initUI();
    try { initHero(); } catch (e) { console.warn('hero', e); }
    try { initMovement(); } catch (e) { console.warn('movement', e); }
    try { initJoin(); } catch (e) { console.warn('join', e); }
  });
})();
