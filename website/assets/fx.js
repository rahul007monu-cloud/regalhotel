/* Regal Hotel website – 3D & motion effects
 * - Three.js hero scene (rotating 3D dargah, orbit rings, golden particles)
 * - 3D rotating room carousel (CSS 3D, drag / swipe / arrows)
 * - 3D tilt cards, flip cards, scroll reveal, number counters, scroll progress
 * Everything degrades gracefully: no WebGL or "reduce motion" → static design.
 */
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  document.documentElement.classList.add("fx");
  if (reduce) document.documentElement.classList.add("reduce");

  // ---------------- scroll progress ----------------
  const bar = document.createElement("div");
  bar.className = "scroll-progress";
  document.body.appendChild(bar);
  const onScroll = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---------------- scroll reveal ----------------
  const revealSel = ".sec-head, .room, .place, .review, .feature, .flip, .card, details, .banner, .dist, .split > div, .split > iframe, .page-hero .container > *, .booking > *";
  const groups = new Map();
  $$(revealSel).forEach((el) => {
    if (el.closest(".ring3d") || el.closest(".hero")) return;
    el.classList.add("reveal");
    const p = el.parentElement;
    const i = groups.get(p) || 0;
    groups.set(p, i + 1);
    el.style.setProperty("--d", `${Math.min(i, 6) * 90}ms`);
  });
  if (reduce || !("IntersectionObserver" in window)) {
    $$(".reveal").forEach((el) => el.classList.add("in"));
  } else {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    $$(".reveal").forEach((el) => io.observe(el));
  }

  // ---------------- counters ----------------
  const counters = $$("[data-count]");
  const runCount = (el) => {
    const target = +el.dataset.count;
    if (reduce) { el.textContent = target; return; }
    const t0 = performance.now(), dur = 1400;
    const step = (t) => {
      const k = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ("IntersectionObserver" in window) {
    const cio = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { runCount(e.target); cio.unobserve(e.target); } }), { threshold: 0.6 });
    counters.forEach((c) => cio.observe(c));
  } else counters.forEach(runCount);

  // ---------------- flip cards (tap support) ----------------
  $$(".flip").forEach((f) => {
    f.addEventListener("click", () => f.classList.toggle("flipped"));
    f.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); f.classList.toggle("flipped"); } });
  });

  // ---------------- 3D tilt ----------------
  if (finePointer && !reduce) {
    $$(".room, .place, .review, .banner, .tilt").forEach((el) => {
      el.classList.add("tiltable");
      let raf = 0;
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          const max = el.classList.contains("banner") ? 4 : 10;
          el.style.setProperty("--rx", `${(0.5 - y) * max}deg`);
          el.style.setProperty("--ry", `${(x - 0.5) * max}deg`);
          el.style.setProperty("--mx", `${x * 100}%`);
          el.style.setProperty("--my", `${y * 100}%`);
          el.classList.add("tilting");
        });
      });
      el.addEventListener("pointerleave", () => {
        cancelAnimationFrame(raf);
        el.classList.remove("tilting");
        el.style.setProperty("--rx", "0deg");
        el.style.setProperty("--ry", "0deg");
      });
    });
  }

  // ---------------- 3D carousel ----------------
  const ringWrap = $("#ring3d");
  if (ringWrap) {
    const ring = $("#ring", ringWrap);
    const panels = $$(".panel", ring);
    const N = panels.length, step = 360 / N;
    const dots = $("#ringDots");
    let angle = 0, target = 0, dragging = false, lastX = 0, moved = 0, idleAt = 0, radius = 0;
    panels.forEach((p, i) => {
      const d = document.createElement("button");
      d.setAttribute("aria-label", `Slide ${i + 1}`);
      d.addEventListener("click", () => goTo(i));
      dots.appendChild(d);
    });
    function layout() {
      const w = panels[0].offsetWidth;
      radius = Math.round(w / 2 / Math.tan(Math.PI / N) + (innerWidth < 640 ? 30 : 70));
      panels.forEach((p, i) => (p.style.transform = `rotateY(${i * step}deg) translateZ(${radius}px)`));
    }
    const activeIndex = () => ((Math.round(-angle / step) % N) + N) % N;
    function goTo(i) {
      const cur = Math.round(-target / step);
      let diff = ((i - cur) % N + N) % N;
      if (diff > N / 2) diff -= N;
      target = -(cur + diff) * step;
      idleAt = performance.now() + 4000;
    }
    $("#ringPrev").addEventListener("click", () => goTo(activeIndex() - 1));
    $("#ringNext").addEventListener("click", () => goTo(activeIndex() + 1));
    ringWrap.addEventListener("pointerdown", (e) => { dragging = true; lastX = e.clientX; moved = 0; ringWrap.setPointerCapture(e.pointerId); });
    ringWrap.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const dx = e.clientX - lastX; lastX = e.clientX; moved += Math.abs(dx);
      target += dx * 0.35; angle = target;
    });
    const end = () => {
      if (!dragging) return;
      dragging = false;
      target = Math.round(target / step) * step;
      idleAt = performance.now() + 4000;
    };
    ringWrap.addEventListener("pointerup", end);
    ringWrap.addEventListener("pointercancel", end);
    // a drag must not trigger the link
    panels.forEach((p) => p.addEventListener("click", (e) => { if (moved > 8) { e.preventDefault(); moved = 0; } }));
    ringWrap.addEventListener("keydown", (e) => { if (e.key === "ArrowLeft") goTo(activeIndex() - 1); if (e.key === "ArrowRight") goTo(activeIndex() + 1); });

    let visible = true;
    if ("IntersectionObserver" in window) new IntersectionObserver((es) => (visible = es[0].isIntersecting)).observe(ringWrap);
    let lastAuto = performance.now();
    function tick(t) {
      if (visible && !dragging) {
        if (!reduce && t > idleAt && t - lastAuto > 3200) { goTo(activeIndex() + 1); lastAuto = t; idleAt = 0; }
        angle += (target - angle) * 0.08;
      }
      ring.style.transform = `translateZ(${-radius}px) rotateY(${angle}deg)`;
      const a = activeIndex();
      panels.forEach((p, i) => {
        const rel = ((i * step + angle) % 360 + 360) % 360;
        const facing = Math.cos((rel * Math.PI) / 180); // 1 = front, -1 = back
        p.style.opacity = (0.25 + 0.75 * Math.max(0, (facing + 0.4) / 1.4)).toFixed(2);
        p.classList.toggle("active", i === a);
        p.tabIndex = i === a ? 0 : -1;
      });
      [...dots.children].forEach((d, i) => d.classList.toggle("on", i === a));
      requestAnimationFrame(tick);
    }
    layout();
    addEventListener("resize", layout);
    requestAnimationFrame(tick);
  }

  // ---------------- Three.js hero scene ----------------
  $$("canvas[data-scene]").forEach((canvas) => {
    if (reduce || !window.THREE) return;
    try { initScene(canvas); } catch (err) { console.warn("3D scene disabled:", err); }
  });

  function initScene(canvas) {
    const T = window.THREE;
    const full = canvas.dataset.scene === "full";
    const host = canvas.parentElement;
    const renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
    renderer.outputEncoding = T.sRGBEncoding;
    const scene = new T.Scene();
    scene.fog = new T.Fog(0x2a0d12, 14, 30);
    const camera = new T.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 1.4, 13);

    scene.add(new T.AmbientLight(0xffe2b8, 0.55));
    scene.add(new T.HemisphereLight(0xffd9a0, 0x3a0a12, 0.5));
    const key = new T.DirectionalLight(0xffe0a8, 1.25);
    key.position.set(5, 8, 6);
    scene.add(key);
    const rim = new T.PointLight(0xff7a3d, 2.2, 22);
    scene.add(rim);
    const cool = new T.PointLight(0x9fb7ff, 0.8, 20);
    cool.position.set(-6, 2, 4);
    scene.add(cool);

    const gold = new T.MeshStandardMaterial({ color: 0xd9a63a, metalness: 0.9, roughness: 0.25, emissive: 0x3a2400, emissiveIntensity: 0.25 });
    const ivory = new T.MeshStandardMaterial({ color: 0xf3e7d3, metalness: 0.05, roughness: 0.55 });
    const maroon = new T.MeshStandardMaterial({ color: 0x6d1622, metalness: 0.2, roughness: 0.6 });
    const glow = new T.MeshBasicMaterial({ color: 0xf5d27a, transparent: true, opacity: 0.85 });

    const world = new T.Group();
    scene.add(world);

    // onion dome profile
    const domeProfile = new T.SplineCurve([
      [1.0, 0], [1.2, 0.22], [1.3, 0.5], [1.24, 0.8], [1.06, 1.08], [0.8, 1.34], [0.5, 1.58], [0.24, 1.8], [0.08, 1.98], [0.0, 2.1],
    ].map(([x, y]) => new T.Vector2(x, y))).getPoints(60);
    const domeGeo = new T.LatheGeometry(domeProfile, 72);

    let dargah = null, cage = null;
    const rings = [];

    if (full) {
      dargah = new T.Group();
      const add = (geo, mat, x, y, z, parent = dargah) => { const m = new T.Mesh(geo, mat); m.position.set(x, y, z); parent.add(m); return m; };
      add(new T.BoxGeometry(4.6, 0.3, 4.6), ivory, 0, 0.15, 0);
      add(new T.BoxGeometry(4.9, 0.12, 4.9), gold, 0, 0.36, 0);
      add(new T.BoxGeometry(3.3, 1.7, 3.3), ivory, 0, 1.27, 0);
      add(new T.BoxGeometry(3.45, 0.12, 3.45), gold, 0, 2.14, 0);
      // arches on 4 sides
      const arch = new T.Shape();
      arch.moveTo(-0.38, 0); arch.lineTo(-0.38, 0.62); arch.absarc(0, 0.62, 0.38, Math.PI, 0, true); arch.lineTo(0.38, 0); arch.lineTo(-0.38, 0);
      const archGeo = new T.ExtrudeGeometry(arch, { depth: 0.06, bevelEnabled: false });
      const smallArchGeo = archGeo.clone().scale(0.55, 0.55, 1);
      for (let s = 0; s < 4; s++) {
        const face = new T.Group();
        face.rotation.y = (s * Math.PI) / 2;
        dargah.add(face);
        add(archGeo, maroon, 0, 0.42, 1.63, face);
        add(smallArchGeo, maroon, -1.05, 0.9, 1.63, face);
        add(smallArchGeo, maroon, 1.05, 0.9, 1.63, face);
      }
      add(new T.CylinderGeometry(1.05, 1.15, 0.55, 64), ivory, 0, 2.47, 0);
      const band = add(new T.TorusGeometry(1.1, 0.06, 12, 72), gold, 0, 2.74, 0);
      band.rotation.x = Math.PI / 2;
      add(domeGeo, gold, 0, 2.74, 0);
      add(new T.CylinderGeometry(0.035, 0.05, 0.7, 12), gold, 0, 5.15, 0);
      add(new T.SphereGeometry(0.11, 20, 20), gold, 0, 5.05, 0);
      add(new T.SphereGeometry(0.08, 20, 20), gold, 0, 5.4, 0);
      const crescent = add(new T.TorusGeometry(0.2, 0.04, 12, 40, Math.PI * 1.45), gold, 0, 5.72, 0);
      crescent.rotation.z = Math.PI * 0.78;
      // minarets
      const minDome = domeGeo.clone().scale(0.2, 0.22, 0.2);
      [[-2.05, -2.05], [2.05, -2.05], [-2.05, 2.05], [2.05, 2.05]].forEach(([x, z]) => {
        add(new T.CylinderGeometry(0.17, 0.23, 3.9, 24), ivory, x, 2.25, z);
        [1.6, 2.7, 3.7].forEach((y) => { const b = add(new T.TorusGeometry(0.25, 0.05, 10, 32), gold, x, y, z); b.rotation.x = Math.PI / 2; });
        add(new T.CylinderGeometry(0.2, 0.2, 0.12, 24), gold, x, 4.25, z);
        add(minDome, gold, x, 4.3, z);
      });
      dargah.scale.setScalar(0.82);
      world.add(dargah);

      // holographic cage
      cage = new T.LineSegments(
        new T.EdgesGeometry(new T.IcosahedronGeometry(4.3, 1)),
        new T.LineBasicMaterial({ color: 0xf5d27a, transparent: true, opacity: 0.16 })
      );
      cage.position.y = 2.1;
      world.add(cage);
    }

    // orbit rings with travelling "satellites"
    const ringDefs = full
      ? [{ r: 4.1, tilt: [1.25, 0, 0.25], speed: 0.5 }, { r: 4.7, tilt: [1.45, 0.4, -0.35], speed: -0.35 }, { r: 5.3, tilt: [1.1, -0.3, 0.1], speed: 0.22 }]
      : [{ r: 3.2, tilt: [1.2, 0, 0.3], speed: 0.4 }, { r: 4.0, tilt: [1.4, 0.4, -0.3], speed: -0.3 }];
    ringDefs.forEach((d) => {
      const g = new T.Group();
      g.rotation.set(...d.tilt);
      const ringMesh = new T.Mesh(new T.TorusGeometry(d.r, 0.012, 8, 160), new T.MeshBasicMaterial({ color: 0xf5d27a, transparent: true, opacity: 0.45 }));
      g.add(ringMesh);
      const sat = new T.Mesh(new T.SphereGeometry(0.08, 16, 16), glow);
      g.add(sat);
      g.position.y = full ? 2.1 : 0;
      world.add(g);
      rings.push({ g, sat, ...d, phase: Math.random() * Math.PI * 2 });
    });

    // particles
    const dot = document.createElement("canvas");
    dot.width = dot.height = 64;
    const dc = dot.getContext("2d");
    const grd = dc.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, "rgba(255,236,180,1)");
    grd.addColorStop(0.35, "rgba(245,210,122,.6)");
    grd.addColorStop(1, "rgba(245,210,122,0)");
    dc.fillStyle = grd;
    dc.fillRect(0, 0, 64, 64);
    const count = full ? 900 : 450;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 34;
      pos[i * 3 + 1] = (Math.random() - 0.35) * 16;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 18 - 2;
    }
    const pGeo = new T.BufferGeometry();
    pGeo.setAttribute("position", new T.BufferAttribute(pos, 3));
    const particles = new T.Points(pGeo, new T.PointsMaterial({ size: 0.16, map: new T.CanvasTexture(dot), transparent: true, depthWrite: false, blending: T.AdditiveBlending }));
    scene.add(particles);

    // layout
    function resize() {
      const w = host.clientWidth, h = host.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const narrow = w < 860;
      if (full) {
        world.position.set(narrow ? 0 : 4.1, narrow ? -1.2 : -2.6, narrow ? -6 : 0);
      } else {
        world.position.set(narrow ? 2.5 : 5.5, -0.2, -2);
      }
    }
    resize();
    if ("ResizeObserver" in window) new ResizeObserver(resize).observe(host);
    else addEventListener("resize", resize);

    // interaction
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    host.addEventListener("pointermove", (e) => {
      const r = host.getBoundingClientRect();
      pointer.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      pointer.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    });
    host.addEventListener("pointerleave", () => { pointer.tx = 0; pointer.ty = 0; });

    let visible = true;
    if ("IntersectionObserver" in window) new IntersectionObserver((es) => (visible = es[0].isIntersecting)).observe(canvas);
    const clock = new T.Clock();
    let spin = 0;
    function frame() {
      requestAnimationFrame(frame);
      if (!visible || document.hidden) { clock.getDelta(); return; }
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;
      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;
      const scrollK = Math.min(scrollY / Math.max(host.clientHeight, 1), 1);
      spin += dt * (0.28 + scrollK * 1.2);
      if (dargah) {
        dargah.rotation.y = spin + pointer.x * 0.5;
        dargah.position.y = Math.sin(t * 0.8) * 0.12 - scrollK * 1.5;
      }
      if (cage) { cage.rotation.y = -t * 0.12; cage.rotation.x = t * 0.05; }
      world.rotation.x = 0.08 + pointer.y * 0.12;
      world.rotation.z = -pointer.x * 0.04;
      rings.forEach((r) => {
        r.g.rotation.z += dt * r.speed * 0.6;
        const a = t * r.speed * 1.6 + r.phase;
        r.sat.position.set(Math.cos(a) * r.r, Math.sin(a) * r.r, 0);
      });
      particles.rotation.y = t * 0.025 + pointer.x * 0.08;
      particles.position.y = Math.sin(t * 0.3) * 0.2;
      rim.position.set(Math.cos(t * 0.7) * 7, 4 + Math.sin(t) * 1.5, Math.sin(t * 0.7) * 7);
      camera.position.x = pointer.x * 0.6;
      camera.position.y = 1.4 - pointer.y * 0.4;
      camera.lookAt(0, full ? 0.6 : 0, 0);
      renderer.render(scene, camera);
    }
    canvas.classList.add("ready");
    host.classList.add("has-3d");
    frame();
  }
})();
