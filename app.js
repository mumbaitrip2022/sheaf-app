// Sheaf site motion: reveals, header glass, hero camera, action carousel, pinned collage, FAQ, wordmark.
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // Play each [data-play] block once it scrolls into view (the hero plays on load).
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.dataset.play = "on"; io.unobserve(e.target); }
  }), { rootMargin: "0px 0px -12% 0px" });
  $$("[data-play]").forEach(el => io.observe(el));
  requestAnimationFrame(() => { const h = $(".hero .intro"); if (h) h.dataset.play = "on"; });

  // Header becomes a glass pill after a little scroll; hero wall zooms slightly; collage assembles.
  const root = document.documentElement, cols = $(".cols"), beyond = $(".beyond"), collage = $(".collage");
  let ticking = false;
  function onScroll() {
    ticking = false;
    const y = scrollY;
    root.classList.toggle("scrolled", y > 24);
    if (cols && !reduce) cols.style.setProperty("--camera", (1 + Math.min(y, 900) / 900 * 0.08).toFixed(4));
    if (beyond && collage) {
      const r = beyond.getBoundingClientRect(), span = r.height - innerHeight;
      const p = span > 0 ? Math.min(1, Math.max(0, -r.top / span * 1.25 + 0.05)) : 1;
      collage.style.setProperty("--p", reduce ? 1 : p.toFixed(4));
    }
  }
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  // Action carousel: cards on a shallow arc, the front one plays; advances every 3 s.
  const cards = $$(".wheel .card"), caps = $$(".captions .caption"), n = cards.length;
  if (n) {
    let active = 0, timer = 0, visible = false;
    function layout() {
      const wide = innerWidth > 900;
      cards.forEach((c, i) => {
        let off = ((i - active) % n + n) % n; if (off > n / 2) off -= n;
        const a = Math.abs(off);
        const x = off * (wide ? 250 : 120), z = -a * (wide ? 170 : 120), ry = -off * 24, s = 1 - a * 0.06;
        c.style.transform = `translateX(${x}px) translateZ(${z}px) rotateY(${ry}deg) scale(${s})`;
        c.style.zIndex = 10 - a;
        c.style.opacity = a > 2 ? 0 : 1 - a * 0.12;
        c.style.filter = a ? `brightness(${1 - a * 0.22})` : "none";
        c.classList.toggle("front", off === 0 && visible);
      });
      caps.forEach((c, i) => c.classList.toggle("on", i === active && visible));
    }
    const go = i => { active = (i + n) % n; layout(); restart(); };
    const restart = () => { clearInterval(timer); if (!reduce && visible) timer = setInterval(() => go(active + 1), 3000); };
    cards.forEach((c, i) => c.addEventListener("click", () => go(i)));
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; layout(); restart(); }, { threshold: 0.35 }).observe($(".stage"));
    addEventListener("resize", layout); layout();
  }

  // FAQ: one smooth accordion.
  $$(".frow").forEach(row => {
    const b = $(".trig", row);
    b.addEventListener("click", () => {
      const open = !row.classList.contains("open");
      row.classList.toggle("open", open); b.setAttribute("aria-expanded", open);
    });
  });

  // Footer wordmark drawn in fine dots that drift, and part around the pointer.
  const cv = $(".wordmark canvas");
  if (cv) {
    const ctx = cv.getContext("2d"); let dots = [], W = 0, H = 0, mx = -1e4, my = -1e4, raf = 0, on = false;
    function build() {
      const dpr = Math.min(2, devicePixelRatio || 1); W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const off = document.createElement("canvas"); off.width = W; off.height = H; const o = off.getContext("2d");
      o.fillStyle = "#fff"; o.textAlign = "center"; o.textBaseline = "middle";
      o.font = `700 ${Math.min(H * 0.95, W / 3.1)}px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif`;
      o.fillText("Sheaf", W / 2, H / 2 + H * 0.04);
      const img = o.getImageData(0, 0, W, H).data, step = W < 640 ? 3 : 4; dots = [];
      for (let y = 0; y < H; y += step) for (let x = 0; x < W; x += step)
        if (img[(y * W + x) * 4 + 3] > 128 && Math.random() < 0.55) dots.push({ x, y, ox: x, oy: y, ph: Math.random() * 6.28, a: 0.35 + Math.random() * 0.65 });
    }
    function frame(t) {
      ctx.clearRect(0, 0, W, H);
      for (const d of dots) {
        const dx = d.x - mx, dy = d.y - my, dist = dx * dx + dy * dy;
        let tx = d.ox + Math.sin(t / 1400 + d.ph) * 0.8, ty = d.oy + Math.cos(t / 1700 + d.ph) * 0.8;
        if (dist < 4900) { const f = (4900 - dist) / 4900 * 18 / Math.sqrt(dist + 1); tx += dx * f; ty += dy * f; }
        d.x += (tx - d.x) * 0.12; d.y += (ty - d.y) * 0.12;
        ctx.globalAlpha = d.a * (0.75 + 0.25 * Math.sin(t / 900 + d.ph));
        ctx.fillStyle = "#f5f5f7"; ctx.fillRect(d.x, d.y, 1.15, 1.15);
      }
      raf = on && !reduce ? requestAnimationFrame(frame) : 0;
    }
    cv.addEventListener("pointermove", e => { const r = cv.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; });
    cv.addEventListener("pointerleave", () => { mx = my = -1e4; });
    new IntersectionObserver(([e]) => { on = e.isIntersecting; if (on && !raf) raf = requestAnimationFrame(frame); }).observe(cv);
    addEventListener("resize", build); build(); frame(0);
  }
})();
