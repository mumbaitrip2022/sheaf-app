// Sheaf site motion: reveals, header glass, hero camera, action story, pinned collage, FAQ, wordmark.
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // Play each [data-play] block once it scrolls into view (the hero plays on load).
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.dataset.play = "on"; io.unobserve(e.target); }
  }), { rootMargin: "0px 0px -12% 0px" });
  $$("[data-play]").forEach(el => io.observe(el));
  requestAnimationFrame(() => { const h = $(".hero .intro"); if (h) h.dataset.play = "on"; });

  // Header: over the first 150 px of scroll the bar squeezes (gap 96 → 48 px) and turns into frosted glass.
  const pill = $(".pill");
  if (pill) {
    let shown = 0, raf = 0;
    const paint = k => {
      const narrow = innerWidth <= 720;
      pill.style.gap = narrow ? `${24 - 8 * k}px` : `${96 - 48 * k}px`;
      pill.style.setProperty("--glass", k.toFixed(3));
      pill.style.backgroundColor = `rgba(0,0,0,${(0.5 * k).toFixed(3)})`;
      const f = `saturate(${100 + 80 * k}%) blur(${(16 * k).toFixed(2)}px)`;
      pill.style.backdropFilter = f; pill.style.webkitBackdropFilter = f;
      pill.style.boxShadow = `0 ${22 * k}px ${48 * k}px -18px rgba(0,0,0,${(0.75 * k).toFixed(3)}), 0 ${4 * k}px ${12 * k}px -6px rgba(0,0,0,${(0.6 * k).toFixed(3)})`;
    };
    const step = () => {
      const target = Math.min(1, Math.max(0, scrollY / 150));
      shown += (target - shown) * (reduce ? 1 : 0.6);
      if (Math.abs(target - shown) < 0.002) shown = target;
      paint(shown);
      raf = shown === target ? 0 : requestAnimationFrame(step);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(step); };
    addEventListener("scroll", kick, { passive: true }); addEventListener("resize", kick);
    shown = Math.min(1, scrollY / 150); paint(shown);
  }

  // Header becomes a glass pill after a little scroll; the hero demo leans in slightly; collage assembles.
  const root = document.documentElement, cols = $(".demo .dm-frame"), beyond = $(".beyond"), collage = $(".collage");
  let ticking = false;
  function onScroll() {
    ticking = false;
    const y = scrollY;
    if (cols && !reduce) cols.style.setProperty("--camera", (1 + Math.min(y, 700) / 700 * 0.035).toFixed(4));
    if (beyond && collage) {
      const r = beyond.getBoundingClientRect(), span = r.height - innerHeight;
      const p = span > 0 ? Math.min(1, Math.max(0, -r.top / span * 1.25 + 0.05)) : 1;
      collage.style.setProperty("--p", reduce ? 1 : p.toFixed(4));
    }
  }
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  // "Choose what happens": scrolling through the pinned section steps through the five actions.
  const ax = $(".ax-track");
  if (ax) {
    const btns = $$(".ax-list button", ax), scenes = $$(".sc", ax), panel = $(".ax-panel", ax), canvas = $(".ax-canvas", ax), now = $(".ax-now", ax);
    const tints = panel.dataset.tints.split(","), n = scenes.length;
    let active = -1, raf = 0;
    const fit = () => canvas.style.setProperty("--s", (panel.clientWidth / 640).toFixed(4));
    // Sizes count down on their own clock once a scene starts.
    const count = sc => $$("[data-from]", sc).forEach(el => {
      const a = +el.dataset.from, b = +el.dataset.to, at = +el.dataset.at * 1000, dur = 1300, t0 = performance.now();
      if (reduce) { el.textContent = b.toFixed(1); return; }
      el.textContent = a.toFixed(1);
      const tick = t => {
        if (!sc.classList.contains("on")) return;
        const k = Math.min(1, Math.max(0, (t - t0 - at) / dur)), e = k < .5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2;
        el.textContent = (a + (b - a) * e).toFixed(1);
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    const show = i => {
      if (i === active) return;
      active = i;
      scenes.forEach((s, k) => { s.classList.toggle("on", k === i); s.setAttribute("aria-hidden", k !== i); });
      btns.forEach((b, k) => { b.classList.toggle("on", k === i); b.setAttribute("aria-current", k === i ? "step" : "false"); });
      panel.style.setProperty("--tint", tints[i]);
      if (now) now.textContent = $(".ax-desc span", btns[i]).textContent;
      count(scenes[i]);
      const list = btns[i].closest("ol"); if (list.scrollWidth > list.clientWidth) list.scrollTo({ left: btns[i].parentElement.offsetLeft - 24, behavior: "smooth" });
    };
    const span = () => ax.offsetHeight - innerHeight;
    const update = () => {
      raf = 0;
      const p = Math.min(.9999, Math.max(0, -ax.getBoundingClientRect().top / span())), f = p * n, i = Math.floor(f);
      show(i);
      btns.forEach((b, k) => b.style.setProperty("--q", k < i ? 1 : k > i ? 0 : (f - i).toFixed(3)));
    };
    const top = () => ax.getBoundingClientRect().top + scrollY;
    btns.forEach((b, k) => b.addEventListener("click", () => scrollTo({ top: top() + span() * (k + .08) / n, behavior: reduce ? "auto" : "smooth" })));
    addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(update); }, { passive: true });
    addEventListener("resize", () => { fit(); update(); });
    fit(); update();
  }

  // "Why people leave": both lanes run on one clock (8× real time) when the race scrolls into view.
  const race = $("[data-race]");
  if (race) {
    const total = +race.dataset.total, speed = 8, lanes = $$(".rc-lane", race).map(l => ({
      el: l, segs: $$(".rc-seg", l).map(s => ({ s, a: +s.dataset.a, b: +s.dataset.b })), time: $(".rc-time", l), say: $(".rc-say", l),
      steps: $(".rc-say", l).dataset.steps.split("|").map(x => { const i = x.indexOf(":"); return [+x.slice(0, i), x.slice(i + 1)]; }),
      end: +$(".rc-time", l).dataset.end, done: $(".rc-say", l).dataset.done, key: l.classList.contains("me") ? "me-done" : "web-done",
    }));
    let t0 = 0, raf = 0;
    const fmt = t => t < 10 ? `${t.toFixed(1)} s` : `${Math.round(t)} s`;
    const paint = t => lanes.forEach(L => {
      L.segs.forEach(({ s, a, b }) => s.style.setProperty("--k", Math.min(1, Math.max(0, (t - a) / (b - a))).toFixed(4)));
      const tt = Math.min(t, L.end), fin = t >= L.end;
      L.time.textContent = fmt(tt);
      race.classList.toggle(L.key, fin);
      if (fin) L.say.textContent = L.done;
      else { const st = L.steps.filter(([a]) => a <= t).pop(); const up = L.segs[0];
        L.say.textContent = st[1] + (L.key === "web-done" && t < up.b ? `… ${Math.floor(t / up.b * 100)}%` : "…"); }
    });
    const tick = now => { const t = (now - t0) / 1000 * speed; paint(Math.min(t, total)); raf = t < total ? requestAnimationFrame(tick) : 0; };
    const run = () => { cancelAnimationFrame(raf); if (reduce) { paint(total); return; } t0 = performance.now(); raf = requestAnimationFrame(tick); };
    paint(0); lanes.forEach(L => L.say.textContent = "Ready");
    const seen = new IntersectionObserver(([e]) => { if (e.isIntersecting) { run(); seen.disconnect(); } }, { threshold: .5 });
    seen.observe(race);
    $(".rc-again", race).addEventListener("click", run);
  }

  // Hero: the quoted search phrase rolls through what Sheaf does, letter by letter.
  const win = $(".roll-win");
  if (win && !reduce) {
    const words = JSON.parse(win.dataset.words);
    let i = 0, timer = 0, cur = $(".roll-w", win);
    const make = w => { const el = document.createElement("span"); el.className = "roll-w";
      [...w].forEach((c, k) => { const s = document.createElement("span"); s.className = "ch"; s.style.setProperty("--k", k); s.textContent = c; el.append(s); }); return el; };
    const widthOf = el => { el.style.visibility = "hidden"; win.append(el); const w = el.getBoundingClientRect().width; el.remove(); el.style.visibility = ""; return w; };
    // Swap the plain first word for split letters, and pin the window to its width.
    const first = make(words[0][0]); win.style.width = widthOf(first) + "px"; cur.replaceWith(first); cur = first;
    const next = () => {
      i = (i + 1) % words.length;
      const [w, c] = words[i], el = make(w), old = cur;
      const wNew = widthOf(el);
      old.classList.remove("in"); old.classList.add("out");
      setTimeout(() => old.remove(), 900);
      win.style.setProperty("--c", c);
      win.style.width = wNew + "px";
      el.classList.add("in"); win.append(el); cur = el;
    };
    const start = () => { if (!timer) timer = setInterval(next, 2300); }, stop = () => { clearInterval(timer); timer = 0; };
    new IntersectionObserver(([e]) => e.isIntersecting && !document.hidden ? start() : stop()).observe(win);
    document.addEventListener("visibilitychange", () => document.hidden ? stop() : start());
    addEventListener("resize", () => { win.style.width = widthOf(make(words[i][0])) + "px"; });
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

// Hero demo: drag three PDFs out of Finder, pause, the circle opens, aim at Compress, pick Smallest, drop.
// Positions are in the 1040×650 screen; the bloom images are Sheaf's real interface.
(() => {
  const demo = document.querySelector("[data-demo]");
  if (!demo) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const vp = demo.querySelector(".dm-viewport"), screen = demo.querySelector(".dm-screen");
  const cursor = demo.querySelector(".dm-cursor"), ghost = demo.querySelector(".dm-ghost"), seed = demo.querySelector(".dm-seed");
  const bloom = demo.querySelector(".bloomer"), steps = [...demo.querySelectorAll(".dm-steps li")];
  const W = 1040, H = 650, FOCUS = 690;  // on narrow screens, keep the circle in view
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const LOOP = 9600;
  const FILE = [323, 190], MID = [690, 360], COMPRESS = [785, 277], SMALLEST = [885, 237];
  // [time ms, x, y]: where the pointer is, eased between stops.
  const path = [[0, ...FILE], [550, ...FILE], [1750, ...MID], [2950, ...MID], [3550, ...COMPRESS], [4000, ...COMPRESS], [4500, ...SMALLEST], [8300, ...SMALLEST], [9200, ...FILE], [LOOP, ...FILE]];
  const at = t => {
    let i = 0; while (i < path.length - 2 && t >= path[i + 1][0]) i++;
    const [t0, x0, y0] = path[i], [t1, x1, y1] = path[i + 1];
    const k = ease(Math.min(1, Math.max(0, (t - t0) / (t1 - t0 || 1))));
    return [x0 + (x1 - x0) * k, y0 + (y1 - y0) * k];
  };
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const set = (el, k, v) => el.style.setProperty(k, v);

  function fit() {
    const w = vp.clientWidth, narrow = w < 700;
    const s = narrow ? w / 700 : w / W;
    set(demo, "--s", s.toFixed(4));
    set(screen, "--s", s.toFixed(4));
    set(screen, "--shift", narrow ? Math.min(0, w / 2 - FOCUS * s).toFixed(1) + "px" : "0px");
    vp.style.height = (H * s).toFixed(1) + "px";
  }
  fit(); addEventListener("resize", fit);

  function paint(t) {
    const [x, y] = at(t);
    set(cursor, "--cx", x + "px"); set(cursor, "--cy", y + "px");
    const pressed = t > 350 && t < 4700;
    set(cursor, "--cs", pressed ? .9 : 1);
    // The drag image rides under the pointer until the drop.
    const g = t < 450 ? 0 : t < 4700 ? Math.min(1, (t - 450) / 150) : Math.max(0, 1 - (t - 4700) / 120);
    ghost.style.opacity = g; set(ghost, "--gx", (x - 30) + "px"); set(ghost, "--gy", (y - 20) + "px");
    // Slowing down: the tag beside the pointer fills its ring, then the circle opens.
    const seedOn = t > 1650 && t < 2300;
    seed.style.opacity = seedOn ? 1 : 0; set(seed, "--ss", seedOn ? 1 : .9);
    set(seed, "--ring", clamp((t - 1800) / 450).toFixed(3));
    set(seed, "--sx", (x + 22) + "px"); set(seed, "--sy", (y - 50) + "px");
    const open = t >= 2250 && t < 8700;
    bloom.style.opacity = open ? (t > 8300 ? Math.max(0, 1 - (t - 8300) / 400) : 1) : 0;
    const pop = clamp((t - 2250) / 340);
    set(bloom, "--bs", (open ? .9 + .1 * (1 - Math.pow(1 - pop, 3)) + Math.sin(pop * Math.PI) * .018 : .9).toFixed(4));
    bloom.dataset.k = t < 3480 ? "bloom" : t < 4380 ? "bloom-aim" : t < 4750 ? "bloom-option" : t < 5650 ? "bloom-running" : "bloom-result";
    // Steps under the screen follow along.
    const bounds = [[0, 1750], [1750, 3480], [3480, 8700]];
    const active = t < 1750 ? 0 : t < 3480 ? 1 : t < 8700 ? 2 : -1;
    steps.forEach((li, i) => {
      li.classList.toggle("on", i === active);
      const [a, b] = bounds[i]; set(li, "--p", clamp((t - a) / (b - a)).toFixed(3));
    });
  }

  const frozen = new URLSearchParams(location.search).get("demo-t");  // for reviewing one moment
  if (reduce || frozen) { demo.classList.add("still"); paint(frozen ? +frozen : 4500); return; }
  let start = 0, raf = 0, visible = false, offset = 0;
  const tick = now => { if (!start) start = now - offset; paint((now - start) % LOOP); raf = requestAnimationFrame(tick); };
  const play = () => { if (!raf && visible && !document.hidden) { start = 0; raf = requestAnimationFrame(tick); } };
  const stop = () => { if (raf) { cancelAnimationFrame(raf); raf = 0; offset = (performance.now() - start) % LOOP; } };
  paint(0);
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? play() : stop(); }, { threshold: .25 }).observe(demo);
  document.addEventListener("visibilitychange", () => document.hidden ? stop() : play());
})();
