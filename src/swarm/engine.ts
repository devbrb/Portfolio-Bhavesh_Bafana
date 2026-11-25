// "Built by my stack": a crew of skill-labelled cursors wireframes, writes and paints every [data-b]
// element as it comes on screen. React renders the page once; this runs imperatively on that DOM.
// Element kinds (data-b): region = layout box only · frame = card whose surface paints in ·
// box = appears on paint · type = typed out · reveal = wiped in left-to-right.

type El = HTMLElement & { _wf?: HTMLElement | null };
interface Cursor { el: HTMLElement; color: string; x: number; y: number }

export const CREW: [string, string][] = [
  ["React", "#61dafb"], ["Next.js", "#ffffff"], ["Redux", "#b18cff"], ["React Query", "#ff6b6b"],
  ["TypeScript", "#5b9dff"], ["SCSS", "#ff7eb6"], ["Jest + RTL", "#5ee08f"], ["a11y", "#ffc542"],
];
const ARROW = '<svg viewBox="0 0 16 18" aria-hidden="true"><path d="M1.5 1.5v13.2l3.6-3.4 2.5 5.4 2.3-1-2.5-5.3h5.1z"/></svg>';
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const rnd = (a: number, b: number) => a + Math.random() * (b - a);

/** Starts the crew on the page. Returns a cleanup (React StrictMode / HMR call it). */
export function startSwarm(): () => void {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = <T extends HTMLElement = HTMLElement>(s: string) => document.querySelector(s) as T;
  const page = $("#page"), layer = $("#layer"), ring = $("#ring"), bootEl = $("#boot");
  const ac = new AbortController(), on = { signal: ac.signal };
  let disposed = false;

  const els = Array.from(document.querySelectorAll<El>("[data-b]"));
  els.forEach((e) => { if (e.dataset.b === "type" && e.dataset.text == null) e.dataset.text = e.textContent || ""; });

  // the visitor gets a cursor label too
  if (matchMedia("(pointer: fine)").matches) {
    const you = $("#you");
    addEventListener("pointermove", (e) => { you.style.opacity = "1"; you.style.transform = `translate(${e.clientX}px,${e.clientY}px)`; }, { passive: true, ...on });
    document.addEventListener("pointerleave", () => (you.style.opacity = "0"), on);
  }
  if (reduce) { bootEl.classList.add("gone"); return () => ac.abort(); }

  /* ---------- cursors ---------- */
  const box = (el: Element) => {
    const p = page.getBoundingClientRect(), r = el.getBoundingClientRect();
    return { x: r.left - p.left, y: r.top - p.top, w: r.width, h: r.height };
  };
  const crew: Cursor[] = CREW.map(([name, color]) => {
    const el = document.createElement("div");
    el.className = "cur"; el.style.setProperty("--c", color); el.innerHTML = ARROW + `<span>${name}</span>`;
    layer.append(el);
    return { el, color, x: 0, y: 0 };
  });
  const place = (c: Cursor, x: number, y: number, d: number) => {
    c.x = x; c.y = y; c.el.style.setProperty("--d", d + "ms"); c.el.style.transform = `translate(${x}px,${y}px)`;
  };
  const move = async (c: Cursor, x: number, y: number, d = rnd(170, 280)) => { place(c, x, y, d); await sleep(d); };
  const toScreen = () => crew.forEach((c) => place(c, rnd(40, innerWidth - 160), scrollY + rnd(80, innerHeight - 120), 500));

  /* scrolling or jumping via a link: cursors ride along and keep their spot on screen; building waits until it settles */
  let lastY = scrollY, scrolling = false, scrollT = 0, booting = true, busy = false, swarmed = false;
  addEventListener("scroll", () => {
    const dy = scrollY - lastY; lastY = scrollY;
    scrolling = true; clearTimeout(scrollT);
    scrollT = window.setTimeout(() => { scrolling = false; pump(); }, 220);
    if (booting || !dy) return;
    crew.forEach((c) => place(c, c.x, c.y + dy, 550));
  }, { passive: true, ...on });

  /* ---------- the three jobs: wireframe → write → paint ---------- */
  const visible = new Set<Element>();
  async function draw(c: Cursor, el: El) {
    const b = box(el);
    await move(c, b.x, b.y);
    if (!visible.has(el) || disposed) return;
    const wf = document.createElement("div");
    wf.className = "wf" + (el.dataset.b === "region" ? " region" : "");
    Object.assign(wf.style, { left: b.x + "px", top: b.y + "px", width: b.w + "px", height: b.h + "px" });
    wf.innerHTML = `<b>${el.dataset.name || el.tagName.toLowerCase()} · ${Math.round(b.w)}×${Math.round(b.h)}</b>`;
    layer.append(wf); el._wf = wf; void wf.offsetWidth; wf.classList.add("in");
    c.el.classList.add("down");
    await move(c, b.x + b.w, b.y + b.h, 230);
    c.el.classList.remove("down");
  }
  async function write(c: Cursor, el: El) {
    const b = box(el);
    await move(c, b.x, b.y + Math.min(b.h, 60) / 2);
    if (!visible.has(el) || disposed) return;
    if (el.dataset.b === "type") {
      const t = el.dataset.text || "", step = Math.max(10, Math.min(40, 360 / t.length)), caret = document.createElement("i");
      caret.className = "caret"; el.style.minHeight = b.h + "px"; el.classList.add("writing");
      for (let i = 1; i <= t.length && visible.has(el) && !disposed; i++) { el.textContent = t.slice(0, i); el.append(caret); await sleep(step); }
      el.textContent = t; el.classList.remove("writing"); el.style.minHeight = "";
    } else {
      el.classList.add("revealing");
      const d = 380, t0 = performance.now(), go = move(c, b.x + b.w, b.y + b.h / 2, d);
      for (let k = 0; k < 1;) { // timer-driven so it can never stall waiting for a frame
        k = Math.min(1, (performance.now() - t0) / d); el.style.setProperty("--t", k * 106 + "%");
        if (k < 1) await sleep(16);
      }
      await go; el.classList.remove("revealing");
    }
    paint(null, el); // text is finished the moment it is written: no extra paint trip
  }
  async function paint(c: Cursor | null, el: El) {
    if (c && el.dataset.b !== "region") { const b = box(el); await move(c, b.x + b.w * rnd(0.3, 0.7), b.y + b.h * rnd(0.3, 0.7), rnd(130, 220)); }
    el.classList.remove("pending", "written");
    const wf = el._wf;
    if (wf) { wf.classList.add("out"); setTimeout(() => wf.remove(), 500); el._wf = null; }
  }
  async function team(list: El[], job: (c: Cursor, el: El) => Promise<void>) {
    let i = 0;
    await Promise.all(crew.map(async (c, k) => {
      await sleep(k * 25);
      while (i < list.length && !disposed) { const el = list[i++]; if (!visible.has(el)) continue; await job(c, el); await sleep(rnd(0, 40)); }
    }));
  }
  async function build(batch: El[]) {
    const kind = (e: El, ...k: string[]) => k.includes(e.dataset.b || "");
    await team(batch, draw);
    await team(batch.filter((e) => kind(e, "type", "reveal")), write);
    await team(batch.filter((e) => kind(e, "box", "frame")), paint);
    batch.filter((e) => kind(e, "region") && visible.has(e)).forEach((e) => paint(null, e));
  }

  /* ---------- build whatever is on screen right now ---------- */
  function unbuild(el: El) { // scrolled away mid-build: put it back so it builds when seen again
    el.classList.remove("written", "writing", "revealing"); el.classList.add("pending");
    if (el.dataset.b === "type") { el.textContent = el.dataset.text || ""; el.style.minHeight = ""; }
    if (el._wf) { el._wf.remove(); el._wf = null; }
    delete el.dataset.state;
  }
  async function pump() {
    if (busy || booting || scrolling || disposed) return;
    busy = true;
    let batch: El[];
    while (!scrolling && !disposed && (batch = els.filter((e) => visible.has(e) && !e.dataset.state)).length) {
      batch.forEach((e) => (e.dataset.state = "building"));
      await build(batch);
      let left = false;
      batch.forEach((e) => { if (e.classList.contains("pending")) { unbuild(e); left = true; } else e.dataset.state = "built"; });
      if (left) toScreen();
      const mail = $(".mailrow");
      if (!swarmed && mail && visible.has(mail) && !$("#contact").querySelector(".pending")) { swarmed = true; swarmFrom(mail, 320); }
    }
    busy = false;
  }
  const io = new IntersectionObserver((es) => {
    es.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
    pump();
  });

  /* ---------- finale: a burst of cursors from the contact row ---------- */
  function swarmFrom(target: Element, n = 240) {
    const b = box(target), x = b.x + b.w / 2, y = b.y + b.h / 2;
    for (let i = 0; i < n; i++) {
      const s = document.createElement("div");
      s.className = "mini"; s.style.setProperty("--c", CREW[i % CREW.length][1]); s.innerHTML = ARROW; layer.append(s);
      const a = Math.random() * Math.PI * 2, d = rnd(120, Math.max(innerWidth, 700) * 0.7);
      s.animate([
        { transform: `translate(${x}px,${y}px) scale(.3)`, opacity: 1 },
        { transform: `translate(${x + Math.cos(a) * d}px,${y + Math.sin(a) * d * 0.7}px) rotate(${rnd(-140, 140)}deg) scale(1.1)`, opacity: 0 },
      ], { duration: rnd(900, 2000), delay: rnd(0, 350), easing: "cubic-bezier(.2,.8,.2,1)", fill: "forwards" }).finished.then(() => s.remove(), () => s.remove());
    }
  }

  /* ---------- idle: when nothing is being built, the crew roams the visible screen ---------- */
  function roam() {
    crew.forEach(async (c) => {
      while (!disposed) {
        await sleep(rnd(300, 1400));
        if (busy || booting || disposed) continue;
        const d = rnd(1800, 3400);
        place(c, rnd(30, innerWidth - 150), scrollY + rnd(70, innerHeight - 110), d);
        await sleep(d * rnd(0.6, 1));
      }
    });
  }

  /* ---------- boot: loader → cursors spawn in a ring → scatter → build ---------- */
  CREW.forEach(([, c], i) => ring.insertAdjacentHTML("beforeend", `<i style="--a:${i * 45}deg;--c:${c}"></i>`));
  async function boot() {
    const dots = Array.from(ring.querySelectorAll("i"));
    document.documentElement.classList.add("booting");
    scrollTo(0, 0);
    await sleep(300);
    for (let n = 1; n <= CREW.length && !disposed; n++) { $("#bootN").textContent = String(n); dots[n - 1].classList.add("on"); await sleep(80); }
    if (disposed) return;
    const cx = innerWidth / 2, cy = scrollY + innerHeight / 2;
    crew.forEach((c, i) => { const a = (i / crew.length) * Math.PI * 2; place(c, cx + Math.cos(a) * 34 - 4, cy + Math.sin(a) * 34 - 4, 0); });
    await sleep(30);
    bootEl.classList.add("gone");
    crew.forEach((c) => c.el.classList.add("show"));
    await sleep(300);
    crew.forEach((c) => place(c, rnd(40, innerWidth - 160), scrollY + rnd(70, innerHeight - 110), rnd(450, 650)));
    await sleep(650);
    document.documentElement.classList.remove("booting");
    booting = false;
  }

  els.forEach((e) => e.classList.add("pending"));
  boot().then(() => { if (disposed) return; roam(); els.forEach((e) => io.observe(e)); });

  return () => {
    disposed = true;
    ac.abort(); io.disconnect(); clearTimeout(scrollT);
    layer.replaceChildren(); ring.querySelectorAll("i").forEach((i) => i.remove());
    bootEl.classList.remove("gone");
    document.documentElement.classList.remove("booting");
    els.forEach((e) => { e.classList.remove("pending", "written", "writing", "revealing"); if (e.dataset.b === "type") e.textContent = e.dataset.text || ""; delete e.dataset.state; e._wf = null; });
  };
}
