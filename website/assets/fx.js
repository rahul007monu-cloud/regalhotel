/* Regal Hotel website – 3D & motion effects
 * - Hero photo slideshow (Ken Burns) with a floating 3D brand crest
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

  // ---------------- hero slideshow + 3D crest ----------------
  const hero = $("#hero");
  if (hero) {
    const slides = $$(".slide", hero), dots = $$("#slideDots button"), cap = $("#slideCap");
    let cur = 0, timer = 0;
    const show = (i) => {
      cur = (i + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle("on", k === cur));
      dots.forEach((d, k) => d.classList.toggle("on", k === cur));
      if (cap) {
        cap.dataset.i18n = "cap." + cur;
        cap.classList.remove("swap"); void cap.offsetWidth; cap.classList.add("swap");
        if (window.__i18n) window.__i18n(cap);
      }
    };
    const start = () => { clearInterval(timer); if (!reduce) timer = setInterval(() => show(cur + 1), 6000); };
    dots.forEach((d, k) => d.addEventListener("click", () => { show(k); start(); }));
    start();

    const crest = $("#crest");
    if (crest && finePointer && !reduce) {
      let raf = 0;
      hero.addEventListener("pointermove", (e) => {
        const r = hero.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          crest.style.setProperty("--cx", `${x * 22}deg`);
          crest.style.setProperty("--cy", `${-y * 16}deg`);
          hero.style.setProperty("--px", `${x * -18}px`);
          hero.style.setProperty("--py", `${y * -12}px`);
        });
      });
      hero.addEventListener("pointerleave", () => {
        crest.style.setProperty("--cx", "0deg"); crest.style.setProperty("--cy", "0deg");
        hero.style.setProperty("--px", "0px"); hero.style.setProperty("--py", "0px");
      });
    }
  }
})();
