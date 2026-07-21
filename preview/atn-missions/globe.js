/* ===================================================================
   AMONG THE NATIONS — realistic documentary Earth (Three.js r128, MIT)
   https://github.com/mrdoob/three.js
   Scenes:
     1. Hero    — matte satellite Earth, warm sunlight, slow rotation,
                  cloud shell, almost no glow. "God's creation."
     2. Reach   — interactive globe with clickable partner pins
   Earthy palette · no neon · no glassmorphism.
   =================================================================== */
(function () {
  'use strict';
  if (typeof THREE === 'undefined') { console.warn('Three.js failed to load'); return; }

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const TEX = 'img/earth-satellite.jpg';
  const loader = new THREE.TextureLoader();

  function llToVec3(lat, lon, r) {
    const phi = (90 - lat) * Math.PI / 180;
    const theta = (lon + 180) * Math.PI / 180;
    return new THREE.Vector3(
      -r * Math.sin(phi) * Math.cos(theta),
       r * Math.cos(phi),
       r * Math.sin(phi) * Math.sin(theta)
    );
  }

  /* Build a lit, matte Earth mesh from the satellite texture.
     Warm key light + soft cool fill; no city-lights, no neon rim. */
  function makeEarth(radius, tex) {
    const geo = new THREE.SphereGeometry(radius, 96, 96);
    const mat = new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 1.0,
      metalness: 0.0,
      color: new THREE.Color(0xEAE3D4),   // warm sand tint -> matte, less vivid blue
    });
    if (tex) { tex.anisotropy = 8; }
    return new THREE.Mesh(geo, mat);
  }

  /* Very soft warm atmosphere — a whisper, not a glow. */
  function makeAtmosphere(radius, color, strength) {
    return new THREE.Mesh(
      new THREE.SphereGeometry(radius, 64, 64),
      new THREE.ShaderMaterial({
        transparent: true, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false,
        uniforms: { c: { value: new THREE.Color(color) }, s: { value: strength } },
        vertexShader: 'varying vec3 vN; void main(){ vN=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
        fragmentShader: 'varying vec3 vN; uniform vec3 c; uniform float s; void main(){ float i=pow(0.7-dot(vN,vec3(0,0,1.0)),3.0)*s; gl_FragColor=vec4(c,1.0)*max(i,0.0);}'
      })
    );
  }

  function commonLights(scene) {
    // warm sunrise key from the upper-right, cool soft fill, gentle ambient
    const key = new THREE.DirectionalLight(0xffe6c2, 2.15);
    key.position.set(3, 1.4, 2.2);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x8899aa, 0.35);
    fill.position.set(-3, -1, -1.5);
    scene.add(fill);
    scene.add(new THREE.AmbientLight(0x3b3a34, 0.9));
    return key;
  }

  /* =================================================================
     SCENE 1 — HERO EARTH
     ================================================================= */
  function initHero() {
    const canvas = document.getElementById('globe-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 2000);
    camera.position.set(0, 0, 320);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;

    commonLights(scene);

    const group = new THREE.Group();
    scene.add(group);
    const R = 100;

    let earth = null, clouds = null;
    loader.load(TEX, (tex) => {
      tex.encoding = THREE.sRGBEncoding;
      earth = makeEarth(R, tex);
      group.add(earth);
    }, undefined, () => {
      // fallback: plain earthy sphere if texture fails
      earth = new THREE.Mesh(new THREE.SphereGeometry(R, 64, 64),
        new THREE.MeshStandardMaterial({ color: 0x2f4633, roughness: 1 }));
      group.add(earth);
    });

    // subtle cloud shell (procedural soft noise via additive white sphere w/ low opacity fresnel)
    clouds = new THREE.Mesh(
      new THREE.SphereGeometry(R * 1.012, 64, 64),
      new THREE.ShaderMaterial({
        transparent: true, depthWrite: false, blending: THREE.NormalBlending,
        uniforms: { t: { value: 0 } },
        vertexShader: 'varying vec3 vP; varying vec3 vN; void main(){ vP=position; vN=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
        fragmentShader: [
          'varying vec3 vP; varying vec3 vN; uniform float t;',
          'float h(vec3 p){return fract(sin(dot(p,vec3(12.9898,78.233,37.719)))*43758.5453);}',
          'float n(vec3 p){vec3 i=floor(p);vec3 f=fract(p);f=f*f*(3.0-2.0*f);',
          ' float a=h(i),b=h(i+vec3(1,0,0)),c=h(i+vec3(0,1,0)),d=h(i+vec3(1,1,0));',
          ' float e=h(i+vec3(0,0,1)),g=h(i+vec3(1,0,1)),k=h(i+vec3(0,1,1)),m=h(i+vec3(1,1,1));',
          ' return mix(mix(mix(a,b,f.x),mix(c,d,f.x),f.y),mix(mix(e,g,f.x),mix(k,m,f.x),f.y),f.z);}',
          'float fbm(vec3 p){float v=0.0,a=0.5;for(int i=0;i<4;i++){v+=a*n(p);p*=2.1;a*=0.5;}return v;}',
          'void main(){',
          ' float c=fbm(vP*0.045+vec3(t*0.02,0.0,0.0));',
          ' c=smoothstep(0.55,0.9,c);',
          ' float lit=max(dot(vN,normalize(vec3(0.8,0.4,0.6))),0.0);',
          ' float rim=pow(1.0-abs(dot(vN,vec3(0,0,1.0))),1.5);',
          ' gl_FragColor=vec4(vec3(1.0,0.98,0.94), c*(0.35+0.5*lit)*(1.0-rim*0.6));',
          '}'
        ].join('\n')
      })
    );
    group.add(clouds);

    // faint warm atmosphere
    group.add(makeAtmosphere(R * 1.14, 0xE9CBA0, 0.5));

    group.rotation.x = 0.34;
    group.rotation.y = -0.5;

    let mx = 0, tx = 0, my = 0, ty = 0;
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
      group.position.x = (w > 960) ? R * 0.5 : 0;
    }

    let t = 0;
    function animate() {
      requestAnimationFrame(animate);
      resize();
      t += 0.016;
      if (!prefersReduced) {
        group.rotation.y += 0.00055;            // slow, cinematic
        if (clouds) { clouds.rotation.y += 0.0002; clouds.material.uniforms.t.value = t; }
      }
      mx += (tx - mx) * 0.04; my += (ty - my) * 0.04;
      group.rotation.y += mx * 0.0006;
      group.rotation.x = 0.34 + my * 0.12;
      renderer.render(scene, camera);
    }
    animate();
  }

  /* =================================================================
     SCENE 2 — INTERACTIVE REACH GLOBE (clickable partner pins)
     ================================================================= */
  const PARTNERS = [
    { lat: 27.7, lon: 85.3, country: 'Nepal',        name: 'The Sherpa Church Plant', role: 'Church Planting', story: 'A gathering of believers now meets in a remote Himalayan village where there was no church a year ago.' },
    { lat: -1.3, lon: 36.8, country: 'Kenya',        name: 'Jordan & Amani',          role: 'Discipleship',    story: 'Training local pastors and equipping the next generation of Kenyan church leaders.' },
    { lat: 14.6, lon: 121.0,country: 'Philippines',  name: 'Manila Outreach',         role: 'Mercy & Relief',  story: 'Serving families in the city while sharing the hope of the Gospel door to door.' },
    { lat: 9.0,  lon: 38.7, country: 'Ethiopia',     name: 'Highlands Fellowship',    role: 'Bible Translation', story: 'Bringing Scripture into the heart language of communities in the Ethiopian highlands.' },
    { lat: 23.6, lon: 85.3, country: 'India',        name: 'North India Team',        role: 'Church Planting', story: 'Planting churches and making disciples across unreached districts of North India.' },
    { lat: -6.2, lon: 106.8,country: 'Indonesia',    name: 'Java Church Network',     role: 'Leader Training', story: 'Strengthening a growing network of local churches across the islands of Indonesia.' },
    { lat: 33.5, lon: -86.8,country: 'United States', name: 'Home Base',              role: 'Sending',         story: 'Where it begins — mobilizing believers and resources to the ends of the earth.' },
  ];

  function initReachGlobe() {
    const holder = document.getElementById('reach-canvas');
    if (!holder) return;
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%'; canvas.style.height = '100%'; canvas.style.display = 'block';
    holder.appendChild(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 2000);
    camera.position.set(0, 0, 300);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;

    commonLights(scene);
    const group = new THREE.Group();
    scene.add(group);
    const R = 92;

    loader.load(TEX, (tex) => {
      tex.encoding = THREE.sRGBEncoding;
      group.add(makeEarth(R, tex));
    }, undefined, () => {
      group.add(new THREE.Mesh(new THREE.SphereGeometry(R, 64, 64), new THREE.MeshStandardMaterial({ color: 0x2f4633, roughness: 1 })));
    });
    group.add(makeAtmosphere(R * 1.15, 0xE9CBA0, 0.45));

    // pins
    const BRONZE = 0xC9A24B, SAND = 0xF5F3EE;
    const pinGroup = new THREE.Group();
    group.add(pinGroup);
    const pins = [];
    PARTNERS.forEach((p, i) => {
      const v = llToVec3(p.lat, p.lon, R + 1);
      const isHome = p.role === 'Sending';
      const core = new THREE.Mesh(
        new THREE.SphereGeometry(isHome ? 2.4 : 1.7, 12, 12),
        new THREE.MeshBasicMaterial({ color: isHome ? SAND : BRONZE })
      );
      core.position.copy(v);
      core.userData = { i };
      pinGroup.add(core);
      // pulse ring
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(2.4, 3.0, 24),
        new THREE.MeshBasicMaterial({ color: BRONZE, transparent: true, opacity: 0.7, side: THREE.DoubleSide })
      );
      ring.position.copy(v);
      ring.lookAt(v.clone().multiplyScalar(2));
      group.add(ring);
      pins.push({ core, ring, phase: i * 0.9, v });
    });

    group.rotation.x = 0.35;
    group.rotation.y = -1.2;

    // drag to rotate
    let dragging = false, lastX = 0, lastY = 0, velY = 0.0016, targetVX = 0, curVX = 0;
    canvas.addEventListener('pointerdown', (e) => { dragging = true; lastX = e.clientX; lastY = e.clientY; canvas.setPointerCapture(e.pointerId); });
    canvas.addEventListener('pointerup', (e) => { dragging = false; });
    canvas.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      lastX = e.clientX; lastY = e.clientY;
      group.rotation.y += dx * 0.006;
      group.rotation.x = Math.max(-0.9, Math.min(0.9, group.rotation.x + dy * 0.004));
      targetVX = dx * 0.0006;
    });

    // raycast for pin hover/click -> emit to DOM handler
    const ray = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    function pick(e) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      ray.setFromCamera(mouse, camera);
      const hits = ray.intersectObjects(pinGroup.children, false);
      return hits.length ? hits[0].object.userData.i : -1;
    }
    let hoverI = -1;
    canvas.addEventListener('pointermove', (e) => {
      if (dragging) return;
      const i = pick(e);
      canvas.style.cursor = i >= 0 ? 'pointer' : 'grab';
      if (i !== hoverI) { hoverI = i; if (window.__atnPinHover) window.__atnPinHover(i); }
    });
    canvas.addEventListener('click', (e) => {
      const i = pick(e);
      if (i >= 0 && window.__atnPinClick) window.__atnPinClick(i);
    });
    canvas.style.cursor = 'grab';

    // expose: rotate globe to a given partner (called when a list item is clicked)
    window.__atnFocusPartner = (i) => {
      const p = PARTNERS[i]; if (!p) return;
      // rotate so the pin faces the camera
      group.rotation.y = -(p.lon + 180) * Math.PI / 180 + Math.PI / 2 - 0.2;
      group.rotation.x = Math.max(-0.7, Math.min(0.7, p.lat * Math.PI / 180 * 0.9));
    };

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
      if (!dragging && !prefersReduced) group.rotation.y += 0.0011;
      pins.forEach((p) => {
        const s = 1 + (Math.sin(t * 1.6 + p.phase) * 0.5 + 0.5) * 1.4;
        p.ring.scale.setScalar(s);
        p.ring.material.opacity = Math.max(0, 0.8 - (s - 1) * 0.42);
        const isHover = pins.indexOf(p) === hoverI;
        p.core.scale.setScalar(isHover ? 1.6 : 1.0);
      });
      renderer.render(scene, camera);
    }
    animate();
  }

  /* =================================================================
     UI: nav solid-on-scroll, reveal-on-scroll, count-up, parallax,
         reach partner interaction, open-at-top
     ================================================================= */
  function initUI() {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    if (!window.location.hash) window.scrollTo(0, 0);

    const header = document.getElementById('header');
    if (header) {
      const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 30);
      window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    }

    // reveal
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.14 });
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

    // count-up
    const fmt = (n, raw) => {
      if (raw >= 1000000) return (n / 1000000).toFixed(n < raw ? 1 : 1).replace(/\.0$/, '') + 'M';
      if (raw >= 1000) return Math.round(n).toLocaleString();
      return Math.round(n);
    };
    const statIO = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target, target = +el.dataset.count, suffix = el.dataset.suffix || '';
        const dur = 1700, t0 = performance.now();
        function step(now) {
          const k = Math.min(1, (now - t0) / dur);
          const eased = 1 - Math.pow(1 - k, 3);
          el.textContent = fmt(target * eased, target) + (k === 1 ? suffix : '');
          if (k < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        statIO.unobserve(el);
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-count]').forEach((el) => statIO.observe(el));

    // gentle parallax on elements with data-parallax
    const parallaxEls = Array.from(document.querySelectorAll('[data-parallax]'));
    if (parallaxEls.length && !prefersReduced) {
      let ticking = false;
      const onScroll = () => {
        if (ticking) return; ticking = true;
        requestAnimationFrame(() => {
          const vh = window.innerHeight;
          parallaxEls.forEach((el) => {
            const r = el.getBoundingClientRect();
            const center = r.top + r.height / 2;
            const off = (center - vh / 2) / vh;      // -0.5..0.5-ish
            const amt = parseFloat(el.dataset.parallax) || 12;
            el.style.transform = `translate3d(0, ${(-off * amt).toFixed(1)}px, 0) scale(1.08)`;
          });
          ticking = false;
        });
      };
      window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    }

    // Reach partner interaction wiring
    const items = Array.from(document.querySelectorAll('.partner-item'));
    const cardWrap = document.getElementById('partner-card');
    function showPartner(i) {
      if (!cardWrap || !window.__ATN_PARTNERS) return;
      const p = window.__ATN_PARTNERS[i]; if (!p) return;
      cardWrap.innerHTML =
        '<span class="pc-country">' + p.country + '</span>' +
        '<h4>' + p.name + '</h4>' +
        '<span class="pc-role">' + p.role + '</span>' +
        '<p>' + p.story + '</p>' +
        '<a href="#" class="pc-link">Read the full story &rarr;</a>';
      cardWrap.classList.add('show');
      items.forEach((it) => it.classList.toggle('active', +it.dataset.i === i));
    }
    window.__atnPinHover = (i) => { if (i >= 0) showPartner(i); };
    window.__atnPinClick = (i) => { if (i >= 0) { showPartner(i); if (window.__atnFocusPartner) window.__atnFocusPartner(i); } };
    items.forEach((it) => {
      const i = +it.dataset.i;
      it.addEventListener('mouseenter', () => showPartner(i));
      it.addEventListener('click', () => { showPartner(i); if (window.__atnFocusPartner) window.__atnFocusPartner(i); });
    });
    // default: show home base
    if (items.length) showPartner(PARTNERS.findIndex((p) => p.role === 'Sending'));
  }

  window.__ATN_PARTNERS = PARTNERS;

  window.addEventListener('DOMContentLoaded', () => {
    initUI();
    try { initHero(); } catch (e) { console.warn('hero', e); }
    try { initReachGlobe(); } catch (e) { console.warn('reach', e); }
  });
})();
