/* FoxParaguay · Movimiento.
   1. Fondo "papel térmico": matriz de puntos con una onda en forma de chevron que
      recorre la banda y una lupa que sigue al cursor.
   2. Entrada de textos: títulos palabra por palabra, bloques en cascada al aparecer.
   3. Contadores de cifras, luz que sigue al cursor en tarjetas, ticket con inclinación.
   Todo se apaga con prefers-reduced-motion: el contenido queda visible y quieto. */
(function () {
  "use strict";
  var doc = document.documentElement;
  var REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var FINE = matchMedia("(hover: hover) and (pointer: fine)").matches;
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var EASE = "cubic-bezier(.16,1,.3,1)";

  /* ---------- 1. Fondo: superficie de líneas ----------
     Una malla de líneas finas en perspectiva que ondula despacio, como una tela
     o una señal. Grafito sobre claro, blanco sobre oscuro; una línea de cada
     nueve en naranja con un brillo que la recorre. Se detiene fuera de pantalla. */
  function Surface(host) {
    var kind = host.getAttribute("data-bg"), dark = kind === "dark", hero = kind === "hero", page = kind === "page";
    /* Cada página tiene su propia ondulación: misma familia, distinto movimiento. */
    var P = { inicio: [1, 1, 1, 0.12, 9], sistemas: [1.35, 0.8, 1.2, 0.2, 7], farmafox: [0.8, 1.25, 0.9, 0.05, 11],
              facturacion: [1.15, 1.1, 0.7, 0.3, 8], tienda: [0.7, 0.9, 1.4, 0.16, 10], contacto: [1.25, 0.75, 1, 0.24, 9],
              soporte: [0.9, 1.3, 1.1, 0.1, 8], demo: [1.1, 0.95, 0.85, 0.2, 9], agente: [0.95, 1.15, 1.25, 0.28, 10] }[document.body.getAttribute("data-page")] || [1, 1, 1, 0.14, 9];
    var cv = document.createElement("canvas");
    cv.className = "bgfx-cv"; cv.setAttribute("aria-hidden", "true");
    host.insertBefore(cv, host.firstChild);
    var ctx = cv.getContext("2d"), dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0, t0 = performance.now() - Math.random() * 20000, running = false, visible = false, raf = 0, last = 0;
    var N = page ? 46 : hero ? 42 : 30, STEP = 14, EVERY = page ? P[4] : 9;
    var ink = dark ? "255,255,255" : "23,23,26", fox = "255,147,30";
    function size() {
      var r = host.getBoundingClientRect();
      W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height));
      cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + "px"; cv.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      STEP = W < 640 ? 10 : 14;
      draw(performance.now());
    }
    function hgt(x, z, t) {
      return Math.sin(x * 0.0062 * P[0] + t * 0.32 + z * 2.1) * 0.55 +
             Math.sin(x * 0.0115 * P[1] - t * 0.21 + z * 3.7) * 0.3 +
             Math.sin(x * 0.0029 * P[2] + t * 0.12 - z * 1.3) * 0.75;
    }
    function draw(now) {
      var t = (now - t0) / 1000;
      ctx.clearRect(0, 0, W, H);
      var top = H * (page ? P[3] : hero ? 0.18 : 0.08), span = H * (page ? 1.02 - P[3] * 0.4 : hero ? 0.95 : 1.05);
      for (var i = 0; i < N; i++) {
        var z = i / (N - 1);                       /* 0 = lejos, 1 = cerca */
        var pz = Math.pow(z, 1.65);
        var y0 = top + pz * span;
        var amp = (page ? Math.min(64, H * 0.07) : hero ? 46 : 34) * (0.25 + z * 0.95);
        var accent = i % EVERY === 4;
        ctx.beginPath();
        for (var x = -20; x <= W + 20; x += STEP) {
          var y = y0 + hgt(x, z, t) * amp;
          if (x === -20) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        var alpha = page ? 0.09 + z * 0.16 : (dark ? 0.06 : 0.07) + z * (dark ? 0.12 : 0.11);
        ctx.lineWidth = accent ? 1.4 : 1;
        ctx.strokeStyle = "rgba(" + (accent ? fox : ink) + "," + (accent ? Math.min(0.75, alpha * 3.2) : alpha) + ")";
        ctx.stroke();
        if (accent && !REDUCED) {
          /* destello que viaja por la línea naranja */
          var gx = ((t * 120 + i * 260) % (W + 400)) - 200;
          var g = ctx.createRadialGradient(gx, y0 + hgt(gx, z, t) * amp, 0, gx, y0 + hgt(gx, z, t) * amp, 90);
          g.addColorStop(0, "rgba(" + fox + ",.55)"); g.addColorStop(1, "rgba(" + fox + ",0)");
          ctx.save(); ctx.globalCompositeOperation = dark ? "lighter" : "source-over"; ctx.strokeStyle = g; ctx.lineWidth = 2.2;
          ctx.beginPath();
          for (var x2 = gx - 100; x2 <= gx + 100; x2 += 6) { var y2 = y0 + hgt(x2, z, t) * amp; if (x2 === gx - 100) ctx.moveTo(x2, y2); else ctx.lineTo(x2, y2); }
          ctx.stroke(); ctx.restore();
        }
      }
    }
    function loop(now) { if (!running) return; if (now - last > 30) { draw(now); last = now; } raf = requestAnimationFrame(loop); }
    function start() { if (running || REDUCED || !visible || document.hidden) return; running = true; raf = requestAnimationFrame(loop); }
    function stop() { running = false; cancelAnimationFrame(raf); }
    if (page) { visible = true; start(); }
    else new IntersectionObserver(function (es) { visible = es[0].isIntersecting; visible ? start() : stop(); }).observe(host);
    document.addEventListener("visibilitychange", function () { document.hidden ? stop() : start(); });
    var rt; window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(size, 150); });
    size();
  }
  $$("[data-bg]").forEach(function (h) { try { Surface(h); } catch (e) {} });

  /* Caja del inicio: escanea tres productos, suma, elige QR, cobra, SIFEN aprueba y
     el KuDE sale por WhatsApp. Sin JS o con menos movimiento queda en el paso 6 (todo visible). */
  (function () {
    var px = document.getElementById("pos");
    if (!px || !px.classList.contains("px")) return;
    var rig = px.querySelector(".px-rig"), scr = px.querySelector(".px-scr"), tap = px.querySelector(".px-tap");
    var sum = px.querySelector(".px-sum"), cnt = px.querySelector(".px-cnt"), day = px.querySelector(".px-day");
    var rows = $$(".px-i", px), vals = [33750, 12000, 9000], DAY = 3920000;
    /* inclinación con el cursor: el equipo y las tarjetas se mueven en capas */
    if (FINE && !REDUCED) {
      var stage = px.querySelector(".px-stage");
      stage.addEventListener("pointermove", function (e) {
        var r = stage.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        rig.style.setProperty("--ry", (-8 + x * 12).toFixed(2) + "deg"); rig.style.setProperty("--rx", (3 - y * 8).toFixed(2) + "deg");
      });
      stage.addEventListener("pointerleave", function () { rig.style.removeProperty("--ry"); rig.style.removeProperty("--rx"); });
    }
    if (REDUCED) return;
    function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "."); }
    function count(el, from, to, ms) {
      var t0 = performance.now();
      (function f(now) { var k = Math.min(1, (now - t0) / ms); k = 1 - Math.pow(1 - k, 3); el.textContent = fmt(Math.round(from + (to - from) * k)); if (k < 1) requestAnimationFrame(f); })(t0);
    }
    function aim(sel) {
      var t = px.querySelector(sel); if (!t) return;
      var a = scr.getBoundingClientRect(), b = t.getBoundingClientRect();
      tap.style.setProperty("--tx", ((b.left + b.width / 2 - a.left) / a.width * 100).toFixed(2) + "%");
      tap.style.setProperty("--ty", ((b.top + b.height / 2 - a.top) / a.height * 100).toFixed(2) + "%");
    }
    function hit() { tap.classList.remove("hit"); void tap.offsetWidth; tap.classList.add("hit"); }
    var timers = [];
    function at(ms, fn) { timers.push(setTimeout(fn, ms)); }
    function step(n) { px.setAttribute("data-step", String(n)); }
    function run() {
      timers.forEach(clearTimeout); timers = [];
      px.classList.add("fade");
      at(380, function () {
        step(0); px.classList.remove("fade", "beep"); sum.textContent = "0"; cnt.textContent = "0"; day.textContent = fmt(DAY);
        rows.forEach(function (r) { r.classList.remove("new"); });
      });
      var acc = 0;
      vals.forEach(function (v, i) {
        at(1000 + i * 1250, function () { px.classList.remove("beep"); void px.offsetWidth; px.classList.add("beep"); });
        at(1180 + i * 1250, function () { step(i + 1); rows[i].classList.add("new"); cnt.textContent = i + 1; count(sum, acc, acc + v, 520); acc += v; });
      });
      at(4900, function () { aim(".px-m.qr"); step(4); });
      at(5650, hit);
      at(6500, function () { aim(".px-btn"); });
      at(7100, function () { hit(); step(5); });
      at(8550, function () { step(6); count(day, DAY, DAY + 54750, 900); });
      at(14500, run);
    }
    var started = false;
    new IntersectionObserver(function (es) { if (es[0].isIntersecting && !started) { started = true; run(); } }).observe(px);
    document.addEventListener("visibilitychange", function () { if (!document.hidden && started) run(); });
  })();

  /* ---------- 2. Entrada de textos ---------- */
  function split(el) {
    if (el.getAttribute("data-split") === "1") return;
    el.setAttribute("data-split", "1");
    var n = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var parts = c.textContent.split(/(\s+)/), frag = document.createDocumentFragment();
          parts.forEach(function (p) {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(" ")); return; }
            var w = document.createElement("span"); w.className = "w";
            var i = document.createElement("span"); i.textContent = p; i.style.setProperty("--i", n++);
            w.appendChild(i); frag.appendChild(w);
          });
          node.replaceChild(frag, c);
        } else if (c.nodeType === 1 && c.tagName !== "BR" && c.tagName !== "svg") walk(c);
      });
    })(el);
  }
  var heads = $$("main h1, main h2").filter(function (h) { return !h.closest(".chatp, .kit-t, dialog"); });
  if (!REDUCED) heads.forEach(split);

  /* Bloques que entran en cascada: hijos directos de cada .max y elementos de grillas. */
  var SEL = [".hero > div", ".fhero > div", ".ehero > div", ".phead > *", ".facts > div", ".rub > div", ".sign",
    ".solves li", ".groups .grp", ".sys-strip > *", ".shop-cats", ".ct-grid > *", ".syslist > *", ".split > .box", ".rail > *", ".kits > *", ".gloss li", ".tl li",
    ".flow li", ".faq details", ".steps li", ".asks li", ".scene > *", ".req", ".kude", ".check", ".vs .box",
    ".coupon", ".demo-wrap > div:first-child", "section .sub", ".shop-bar", ".agent-main", ".agent-side > *", ".fe .grid > div",
    ".fe-strip .max > *", ".nums > div", ".slot", ".video", ".more", ".crm-head", ".kpis"].join(",");
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }) : null;
  function mark(root) {
    var groups = new Map();
    $$(SEL, root).forEach(function (el) {
      if (el.classList.contains("rv")) return;
      el.classList.add("rv");
      var p = el.parentElement, k = groups.get(p) || 0; groups.set(p, k + 1);
      el.style.setProperty("--d", Math.min(k, 8) * 70 + "ms");
      if (io) io.observe(el); else el.classList.add("in");
    });
    heads.forEach(function (h) { if (!h.classList.contains("rvh")) { h.classList.add("rvh"); if (io) io.observe(h); else h.classList.add("in"); } });
  }
  function markCards(root) {
    $$(".prod", root).forEach(function (el, i) {
      el.classList.add("rv"); el.style.setProperty("--d", Math.min(i % 12, 8) * 45 + "ms");
      if (io) io.observe(el); else el.classList.add("in");
    });
  }
  if (!REDUCED) { mark(document); markCards(document); }
  doc.classList.add("mo-ok");

  /* ---------- 3. Detalles ---------- */
  /* Cifras que cuentan hasta su valor (no los años). */
  $$(".facts b, .nums b").forEach(function (b) {
    var m = b.textContent.match(/^(\D*)([\d.]+)(\D*)$/); if (!m) return;
    var to = parseInt(m[2].replace(/\./g, ""), 10); if (!to || to > 1900 && to < 2100 || REDUCED) return;
    var done = false;
    var o = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting || done) return; done = true; o.disconnect();
      var t0 = performance.now(), D = 1300;
      (function f(now) { var k = Math.min(1, (now - t0) / D); k = 1 - Math.pow(1 - k, 4);
        b.textContent = m[1] + Math.round(to * k).toLocaleString("es-PY") + m[3]; if (k < 1) requestAnimationFrame(f); })(t0);
    }, { threshold: 0.6 });
    o.observe(b);
  });

  /* Luz que sigue al cursor dentro de tarjetas. */
  if (FINE) {
    document.addEventListener("pointermove", function (e) {
      var el = e.target.closest && e.target.closest("[data-spot]"); if (!el) return;
      var r = el.getBoundingClientRect();
      el.style.setProperty("--mx", (e.clientX - r.left) + "px"); el.style.setProperty("--my", (e.clientY - r.top) + "px");
    }, { passive: true });
  }

  /* Ticket y KuDE con leve inclinación 3D. */
  if (FINE && !REDUCED) {
    $$(".pos-dev, .req, .kit-t").forEach(function (el) {
      el.classList.add("tilt");
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty("--rx", (-y * 6).toFixed(2) + "deg"); el.style.setProperty("--ry", (x * 7).toFixed(2) + "deg");
      });
      el.addEventListener("pointerleave", function () { el.style.setProperty("--rx", "0deg"); el.style.setProperty("--ry", "0deg"); });
    });
  }

  /* Encabezado: línea de corte al bajar. */
  var hdr = document.querySelector(".hdr");
  if (hdr) { var on = false; var f = function () { var s = window.scrollY > 8; if (s !== on) { on = s; hdr.classList.toggle("scrolled", s); } }; window.addEventListener("scroll", f, { passive: true }); f(); }

  window.FoxMotion = { refresh: function (root) { if (!REDUCED) markCards(root); } };

  /* Contacto: "Abierto ahora" según la hora de Asunción (lunes a sábado, 9 a 18). */
  (function () {
    var el = document.querySelector("[data-open-now]");
    if (!el) return;
    try {
      var parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/Asuncion", weekday: "short", hour: "numeric", hour12: false }).formatToParts(new Date());
      var wd = "", h = 0;
      parts.forEach(function (p) { if (p.type === "weekday") wd = p.value; if (p.type === "hour") h = Number(p.value) % 24; });
      var idx = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(wd);
      var days = el.parentNode.querySelectorAll(".phv-days span");
      if (days[idx]) days[idx].classList.add("hoy");
      var open = idx > -1 && idx < 6 && h >= 9 && h < 18;
      el.classList.toggle("is-open", open);
      el.querySelector("b").textContent = open ? "Abierto ahora" : "Cerrado ahora";
      el.appendChild(document.createTextNode(open ? " · hasta las 18" : (idx === 5 && h >= 18) || idx === 6 ? " · abrimos el lunes a las 9" : h < 9 ? " · abrimos a las 9" : " · abrimos mañana a las 9"));
    } catch (e) {}
  })();

  /* Cinta de clientes: si fox-config.js trae logos, reemplaza los espacios reservados. */
  (function () {
    var box = document.querySelector("[data-logos]");
    var list = ((window.FOX_CONFIG || {}).clientes || []).filter(function (c) { return c && c.nombre; });
    if (!box || !list.length) return;
    var root = document.body.getAttribute("data-root") || "./", track = box.querySelector(".logos-track");
    function card(c, hidden) {
      var f = document.createElement("figure"); f.className = "lg"; if (hidden) f.setAttribute("aria-hidden", "true");
      var im = document.createElement("span"); im.className = "lg-im";
      if (c.logo) { var i = document.createElement("img"); i.src = /^https?:/.test(c.logo) ? c.logo : root + c.logo; i.alt = hidden ? "" : "Logo de " + c.nombre; i.loading = "lazy"; im.appendChild(i); }
      else { im.classList.add("is-empty"); im.textContent = c.nombre.charAt(0); }
      var fc = document.createElement("figcaption"), b = document.createElement("b"), sm = document.createElement("small");
      b.textContent = c.nombre; sm.textContent = [c.rubro, c.ciudad].filter(Boolean).join(" · ");
      fc.appendChild(b); fc.appendChild(sm); f.appendChild(im); f.appendChild(fc); return f;
    }
    track.textContent = "";
    var reps = Math.max(1, Math.ceil(8 / list.length));
    [false, true].forEach(function (hid) { for (var r = 0; r < reps; r++) list.forEach(function (c) { track.appendChild(card(c, hid || r > 0)); }); });
  })();

  /* Borde neón en naranja Fox (port sin librerías del "Neon Border" de Originkit).
     Dos arcos opuestos recorren el perímetro de esquina a esquina; cada arco es un
     conic-gradient enmascarado como anillo, con tres capas de brillo desenfocadas.
     Neon(contenedor) devuelve un motor que se puede apuntar a cualquier recuadro:
     el chat de Contacto (siempre encendido) y cada producto de la Tienda (al pasar el cursor). */
  function Neon(container, opt) {
    opt = opt || {};
    var COLOR = [255, 147, 30], THICK = opt.thick || 3, BORDER_SIZE = 50, GLOW = opt.glow || .65, SPEED = 16, DIM = opt.dim || 1;
    var GLOW_LAYERS = [{ blur: 6, opacity: .34 * DIM, reach: .3 }, { blur: 13, opacity: .2 * DIM, reach: .6 }, { blur: 44, opacity: .11 * DIM, reach: 1 }];
    var MAX_REACH = 36, MAX_BLUR = 44, G = 10 + MAX_REACH + MAX_BLUR * 2, SAMPLES = 24;
    function rgba(a) { return "rgba(" + COLOR[0] + "," + COLOR[1] + "," + COLOR[2] + "," + Math.max(0, Math.min(1, a)).toFixed(3) + ")"; }
    function pPoint(u, w, h) { var d = (((u % 1) + 1) % 1) * 2 * (w + h); if (d < w) return [d, 0]; if (d < w + h) return [w, d - w]; if (d < w * 2 + h) return [w - (d - w - h), h]; return [0, h - (d - w * 2 - h)]; }
    function pAngle(u, w, h) { var q = pPoint(u, w, h); return Math.atan2(q[0] - w / 2, h / 2 - q[1]) * 180 / Math.PI; }
    function cornerLap(k, w, h) { var p = 2 * (w + h), at = [0, w / p, (w + h) / p, (w * 2 + h) / p]; return Math.floor(k / 4) + at[((k % 4) + 4) % 4]; }
    function arc(lap, w, h) {
      var len = BORDER_SIZE / 100, span = Math.max(.015, len * .5), stops = [], base = 0, prev = 0, acc = 0;
      for (var i = 0; i <= SAMPLES; i++) {
        var f = i / SAMPLES, ang = pAngle(lap + (f - .5) * span, w, h);
        if (i === 0) base = ang; else { var d = ang - prev; while (d > 180) d -= 360; while (d < -180) d += 360; acc += d; }
        prev = ang;
        var t = Math.abs(f - .5) * 2, k = len >= 1 ? 1 : t <= len ? 1 : 1 - (t - len) / (1 - len);
        stops.push(rgba(k * k * (3 - 2 * k)) + " " + acc.toFixed(2) + "deg");
      }
      stops.push(rgba(0) + " " + acc.toFixed(2) + "deg", rgba(0) + " 360deg");
      return "conic-gradient(from " + base.toFixed(2) + "deg at 50% 50%, " + stops.join(", ") + ")";
    }
    function bez(pts) {
      var x1 = pts[0], y1 = pts[1], x2 = pts[2], y2 = pts[3];
      function B(a, b, t) { var u = 1 - t; return 3 * u * u * t * a + 3 * u * t * t * b + t * t * t; }
      return function (t) { var x = Math.max(0, Math.min(1, t)), s = x; for (var i = 0; i < 8; i++) { var cx = B(x1, x2, s) - x, u = 1 - s, dx = 3 * u * u * x1 + 6 * u * s * (x2 - x1) + 3 * s * s * (1 - x2); if (Math.abs(dx) < 1e-6) break; s = Math.max(0, Math.min(1, s - cx / dx)); } return B(y1, y2, s); };
    }
    var glide = bez([.65, 0, .35, 1]), beat = (30 + (4 - 30) * (SPEED - 1) / 19) / 4;
    var root = document.createElement("div"); root.className = "nb-root"; root.setAttribute("aria-hidden", "true");
    container.appendChild(root);
    var target = null, groups = [], W = 0, H = 0, R = 0;
    var lap = 0, corner = 0, stepT = 0, last = 0, raf = 0, running = false, prevPaint = 0;
    function band(r, offset) {
      var b = document.createElement("div"); b.className = "nb-band";
      b.style.inset = (offset - r) + "px"; b.style.padding = r + "px"; b.style.borderRadius = (R > 0 ? R + r : 0) + "px";
      return b;
    }
    function place() {
      if (!target) return;
      var c = container.getBoundingClientRect(), t = target.getBoundingClientRect();
      root.style.left = (t.left - c.left + container.scrollLeft - container.clientLeft) + "px";
      root.style.top = (t.top - c.top + container.scrollTop - container.clientTop) + "px";
    }
    function build() {
      if (!target) return;
      W = target.offsetWidth; H = target.offsetHeight; if (!W || !H) return;
      R = parseFloat(getComputedStyle(target).borderTopLeftRadius) || 0;
      root.style.width = W + "px"; root.style.height = H + "px"; place();
      root.textContent = ""; groups = [];
      for (var gi = 0; gi < 2; gi++) {
        var g = document.createElement("div"); g.className = "nb-group";
        GLOW_LAYERS.forEach(function (l) {
          var gl = document.createElement("div"); gl.className = "nb-glow";
          gl.style.inset = -G + "px"; gl.style.padding = G + "px"; gl.style.borderRadius = (R + G) + "px";
          gl.style.opacity = l.opacity; gl.style.filter = "blur(" + l.blur + "px)";
          gl.appendChild(band(THICK + GLOW * MAX_REACH * l.reach, G)); g.appendChild(gl);
        });
        var e = document.createElement("div"); e.className = "nb-edge"; e.appendChild(band(THICK, 0)); g.appendChild(e);
        root.appendChild(g); groups.push(g);
      }
      paint();
    }
    function paint() { if (groups.length) { groups[0].style.setProperty("--arc", arc(lap, W, H)); groups[1].style.setProperty("--arc", arc(lap + .5, W, H)); } }
    function frame(now) {
      if (!running) return;
      var dt = Math.min(.05, Math.max(0, (now - last) / 1000)); last = now;
      stepT += dt / beat; while (stepT >= 1) { stepT -= 1; corner += 1; }
      var from = cornerLap(corner, W || 100, H || 100), to = cornerLap(corner + 1, W || 100, H || 100);
      lap = from + (to - from) * glide(stepT);
      if (now - prevPaint > 30) { paint(); prevPaint = now; }
      raf = requestAnimationFrame(frame);
    }
    return {
      root: root,
      to: function (el) { if (el !== target) { target = el; build(); } else place(); },
      rebuild: function () { if (target && (target.offsetWidth !== W || target.offsetHeight !== H)) build(); else place(); },
      start: function () { if (running || REDUCED || document.hidden) return; running = true; last = performance.now(); raf = requestAnimationFrame(frame); },
      stop: function () { running = false; cancelAnimationFrame(raf); },
      reset: function (k) { corner = k || 0; stepT = 0; lap = cornerLap(corner, W || 100, H || 100); paint(); }
    };
  }

  /* Chat de atención (Contacto): siempre encendido mientras se ve. */
  (function () {
    var host = document.querySelector("[data-glow]");
    if (!host) return;
    var panel = host.querySelector(".chatp");
    if (!panel) return;
    var n = Neon(host);
    host.classList.add("glow-on");
    n.to(panel);
    if ("ResizeObserver" in window) new ResizeObserver(n.rebuild).observe(panel); else window.addEventListener("resize", n.rebuild);
    new IntersectionObserver(function (es) { es[0].isIntersecting ? n.start() : n.stop(); }).observe(host);
    document.addEventListener("visibilitychange", function () { document.hidden ? n.stop() : n.start(); });
  })();

  /* Tienda: cada producto enciende el mismo borde neón solo mientras el cursor está encima. */
  (function () {
    var grid = document.querySelector(".shop-grid");
    if (!grid || !FINE) return;
    var box = grid.parentElement, n = Neon(box, { thick: 2, glow: .4, dim: .6 }), cur = null, off = 0;
    box.classList.add("nb-host");
    grid.addEventListener("mouseover", function (e) {
      var card = e.target.closest && e.target.closest(".prod");
      if (!card || card === cur || !grid.contains(card)) return;
      clearTimeout(off);
      var fresh = !cur;
      cur = card; n.to(card);
      if (fresh || !n.root.classList.contains("on")) n.reset(Math.floor(Math.random() * 4));
      n.root.classList.add("on"); n.start();
    });
    grid.addEventListener("mouseleave", function () {
      cur = null; n.root.classList.remove("on");
      off = setTimeout(n.stop, 400);
    });
    window.addEventListener("resize", function () { if (cur) n.rebuild(); });
    /* si el catálogo se vuelve a dibujar (filtro, búsqueda) el neón se apaga */
    new MutationObserver(function () { if (cur && !grid.contains(cur)) { cur = null; n.root.classList.remove("on"); n.stop(); } }).observe(grid, { childList: true });
  })();

  /* Menú de categorías de Tienda: se abre al pasar el cursor (CSS); acá teclado, toque y cierre. */
  (function () {
    var box = document.querySelector("[data-shop]");
    if (!box) return;
    var link = box.querySelector(":scope > a"), t = 0;
    var touch = matchMedia("(hover: none)");
    function set(on) { box.classList.toggle("open", on); link.setAttribute("aria-expanded", on ? "true" : "false"); }
    box.addEventListener("mouseenter", function () { clearTimeout(t); link.setAttribute("aria-expanded", "true"); });
    box.addEventListener("mouseleave", function () { t = setTimeout(function () { set(false); }, 120); });
    box.addEventListener("focusin", function () { set(true); });
    box.addEventListener("focusout", function (e) { if (!box.contains(e.relatedTarget)) set(false); });
    link.addEventListener("click", function (e) { if (touch.matches && !box.classList.contains("open")) { e.preventDefault(); set(true); } });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && box.classList.contains("open")) { set(false); link.focus(); } });
    document.addEventListener("click", function (e) { if (!box.contains(e.target)) set(false); });
    box.querySelectorAll(".mega a").forEach(function (a) { a.addEventListener("click", function () { set(false); if (document.activeElement) document.activeElement.blur(); }); });
  })();

  /* Carrusel de productos del inicio: flechas en ambas direcciones y arrastre natural. */
  $$("[data-car]").forEach(function (car) {
    var tr = car.querySelector("[data-track]"), prev = car.querySelector(".prev"), next = car.querySelector(".next");
    if (!tr) return;
    function step() { var c = tr.querySelector(".tag"); return c ? (c.getBoundingClientRect().width + 18) * Math.max(1, Math.floor(tr.clientWidth / c.getBoundingClientRect().width)) : tr.clientWidth * .8; }
    function upd() { var max = tr.scrollWidth - tr.clientWidth - 2; prev.disabled = tr.scrollLeft <= 12; next.disabled = tr.scrollLeft >= max - 10; }
    prev.addEventListener("click", function () { tr.scrollBy({ left: -step(), behavior: REDUCED ? "auto" : "smooth" }); });
    next.addEventListener("click", function () { tr.scrollBy({ left: step(), behavior: REDUCED ? "auto" : "smooth" }); });
    tr.addEventListener("keydown", function (e) { if (e.key === "ArrowRight") { e.preventDefault(); next.click(); } if (e.key === "ArrowLeft") { e.preventDefault(); prev.click(); } });
    tr.addEventListener("scroll", function () { requestAnimationFrame(upd); }, { passive: true });
    window.addEventListener("resize", upd); upd();
  });

  /* Demo: cartel de rubros con letras que giran (split-flap). Recorre los rubros solo;
     si la persona elige un rubro en el formulario, el cartel lo muestra y se queda ahí. */
  (function () {
    var box = document.querySelector("[data-board]");
    if (!box) return;
    var data; try { data = JSON.parse(box.getAttribute("data-board")); } catch (e) { return; }
    var cells = $$(".fl", box), N = cells.length, card = box.querySelector(".df-card");
    var CH = " ABCDEFGHIJKLMNÑOPQRSTUVWXYZÁÉÍÓÚ";
    var cur = cells.map(function (c) { return c.querySelector(".fl-t").textContent; });
    function pad(t) { t = t.toUpperCase(); while (t.length < N) t += " "; return t.slice(0, N); }
    function flip(i, ch) {
      var c = cells[i], old = cur[i]; if (old === ch) return; cur[i] = ch;
      if (REDUCED) { c.querySelector(".fl-t").textContent = ch; c.querySelector(".fl-b").textContent = ch; return; }
      c.querySelectorAll(".fl-ft,.fl-fb").forEach(function (x) { x.remove(); });
      var ft = document.createElement("span"); ft.className = "fl-ft"; ft.textContent = old;
      var fb = document.createElement("span"); fb.className = "fl-fb"; fb.textContent = ch;
      c.querySelector(".fl-t").textContent = ch;
      c.appendChild(ft); c.appendChild(fb);
      setTimeout(function () { c.querySelector(".fl-b").textContent = ch; ft.remove(); fb.remove(); }, 330);
    }
    function show(r) {
      var target = pad(r.t);
      cells.forEach(function (c, i) {
        var from = CH.indexOf(cur[i]), to = CH.indexOf(target[i]);
        if (from < 0) from = 0; if (to < 0) to = 0;
        var steps = REDUCED ? [target[i]] : [];
        if (!REDUCED) { var n = (to - from + CH.length) % CH.length; n = Math.min(n, 3 + (i % 3)); for (var k = n - 1; k >= 1; k--) steps.push(CH[(to - k + CH.length) % CH.length]); steps.push(target[i]); }
        steps.forEach(function (ch, k) { setTimeout(function () { flip(i, ch); }, i * 45 + k * 340); });
      });
      card.classList.add("swap");
      setTimeout(function () {
        card.querySelector(".df-logo img").src = r.img;
        card.querySelector(".df-sys").textContent = r.s;
        var ul = card.querySelector(".df-chips"), tpl = ul.querySelector("li"); ul.textContent = "";
        r.f.forEach(function (x) { var li = tpl.cloneNode(true); li.querySelector("span").textContent = x; ul.appendChild(li); });
        card.classList.remove("swap");
      }, REDUCED ? 0 : 900);
    }
    var idx = 0, timer = 0, pinned = false;
    function next() { idx = (idx + 1) % data.length; show(data[idx]); }
    function auto() { clearInterval(timer); if (!pinned && !REDUCED) timer = setInterval(next, 4200); }
    var sel = document.getElementById("f-rubro");
    if (sel) {
      if (sel.value && sel.value !== data[0].k) { var m0 = data.filter(function (d) { return d.k === sel.value; })[0]; if (m0) { pinned = true; idx = data.indexOf(m0); show(m0); } }
      sel.addEventListener("change", function () {
        var m = data.filter(function (d) { return d.k === sel.value; })[0];
        if (m) { pinned = true; clearInterval(timer); idx = data.indexOf(m); show(m); }
        else { pinned = false; auto(); }
      });
    }
    new IntersectionObserver(function (es) { if (es[0].isIntersecting) auto(); else clearInterval(timer); }).observe(box);
  })();

  /* Facturación: el KuDE anotado se ilumina por partes junto con el glosario (1 SIFEN, 2 KuDE, 3 CDC).
     Al pasar el cursor por un término de la lista, se marca esa parte y la secuencia espera. */
  (function () {
    var sg = document.querySelector("[data-sg]"), list = document.querySelector("[data-sg-list]");
    if (!sg || !list) return;
    var items = $$("li", list), k = 0, t = 0, hold = false;
    function set(n) { k = n; sg.setAttribute("data-k", n); items.forEach(function (li, i) { li.classList.toggle("on", i === n); }); }
    function auto() { clearInterval(t); if (!REDUCED) t = setInterval(function () { if (!hold) set((k + 1) % items.length); }, 2600); }
    items.forEach(function (li, i) {
      li.addEventListener("mouseenter", function () { hold = true; set(i); });
      li.addEventListener("mouseleave", function () { hold = false; });
    });
    set(0);
    new IntersectionObserver(function (es) { es[0].isIntersecting ? auto() : clearInterval(t); }).observe(sg);
  })();

  /* Video demo de cada sistema: abre el video de YouTube en una ventana sobre la página.
     Los enlaces se cargan en fox-config.js, videos. Sin enlace, muestra que el video está en preparación. */
  (function () {
    var dlg = document.getElementById("vd");
    if (!dlg) return;
    var frame = dlg.querySelector(".vd-frame"), title = dlg.querySelector("#vd-t"), logo = dlg.querySelector(".vd-logo");
    var V = (window.FOX_CONFIG || {}).videos || {}, root = document.body.getAttribute("data-root") || "./", last = null;
    function ytId(u) { var m = String(u || "").match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/); return m ? m[1] : ""; }
    function open(b) {
      last = b; var id = ytId(V[b.getAttribute("data-video")]), name = b.getAttribute("data-name");
      title.textContent = "Video demo de " + name; logo.src = b.getAttribute("data-logo");
      frame.textContent = "";
      if (id) {
        var f = document.createElement("iframe");
        f.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
        f.title = "Video demo de " + name; f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen"; f.allowFullscreen = true;
        frame.appendChild(f); frame.classList.remove("vd-empty");
      } else {
        frame.classList.add("vd-empty");
        frame.innerHTML = '<div class="vd-soon"><span class="vd-big"><svg class="ic" aria-hidden="true"><use href="#i-play"/></svg></span><b></b><p>Mientras tanto, te lo mostramos en vivo por AnyDesk o en el local.</p><a class="btn demo"></a></div>';
        frame.querySelector("b").textContent = "El video de " + name + " se publica pronto.";
        var a = frame.querySelector("a"); a.href = root + "demo/index.html?rubro=" + b.getAttribute("data-rubro"); a.innerHTML = 'Pedí tu demo de ' + name + ' <span class="chev"></span>';
      }
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
      document.documentElement.classList.add("cart-lock");
    }
    function close() { frame.textContent = ""; if (dlg.open && dlg.close) dlg.close(); else dlg.removeAttribute("open"); }
    dlg.addEventListener("close", function () { frame.textContent = ""; document.documentElement.classList.remove("cart-lock"); if (last) last.focus(); });
    $$("[data-video]").forEach(function (b) { b.addEventListener("click", function () { open(b); }); });
    dlg.querySelector("[data-vd-close]").addEventListener("click", close);
    dlg.addEventListener("click", function (e) { if (e.target === dlg) close(); });
  })();

  /* Sistemas: cartel de LED rojo, compacto. Fuente de matriz 5×7 dibujada a mano (con tildes);
     cada rubro entra desde la derecha, se detiene centrado y sale por la izquierda. */
  (function () {
    var cv = document.querySelector("[data-led]");
    if (!cv) return;
    var words = cv.getAttribute("data-led").split("|"), foot = cv.closest(".led").querySelector(".led-n");
    var F = {
      A:["01110","10001","10001","11111","10001","10001","10001"],B:["11110","10001","10001","11110","10001","10001","11110"],
      C:["01110","10001","10000","10000","10000","10001","01110"],D:["11110","10001","10001","10001","10001","10001","11110"],
      E:["11111","10000","10000","11110","10000","10000","11111"],F:["11111","10000","10000","11110","10000","10000","10000"],
      G:["01110","10001","10000","10111","10001","10001","01111"],H:["10001","10001","10001","11111","10001","10001","10001"],
      I:["01110","00100","00100","00100","00100","00100","01110"],J:["00111","00010","00010","00010","00010","10010","01100"],
      K:["10001","10010","10100","11000","10100","10010","10001"],L:["10000","10000","10000","10000","10000","10000","11111"],
      M:["10001","11011","10101","10101","10001","10001","10001"],N:["10001","10001","11001","10101","10011","10001","10001"],
      O:["01110","10001","10001","10001","10001","10001","01110"],P:["11110","10001","10001","11110","10000","10000","10000"],
      Q:["01110","10001","10001","10001","10101","10010","01101"],R:["11110","10001","10001","11110","10100","10010","10001"],
      S:["01111","10000","10000","01110","00001","00001","11110"],T:["11111","00100","00100","00100","00100","00100","00100"],
      U:["10001","10001","10001","10001","10001","10001","01110"],V:["10001","10001","10001","10001","10001","01010","00100"],
      W:["10001","10001","10001","10101","10101","10101","01010"],X:["10001","10001","01010","00100","01010","10001","10001"],
      Y:["10001","10001","01010","00100","00100","00100","00100"],Z:["11111","00001","00010","00100","01000","10000","11111"],
      " ":["000","000","000","000","000","000","000"]
    };
    var ACC = { "Í": "I", "É": "E", "Á": "A", "Ó": "O", "Ú": "U" };
    var ROWS = 11, TOP = 3;               /* 2 filas para tildes + 7 de letra + márgenes */
    function bitmap(w) {
      var cols = [], i, ch, g, base, acc;
      for (i = 0; i < w.length; i++) {
        ch = w[i]; acc = !!ACC[ch]; base = ACC[ch] || ch; g = F[base] || F[" "];
        for (var x = 0; x < g[0].length; x++) {
          var col = new Array(ROWS).fill(0);
          for (var y = 0; y < 7; y++) col[TOP + y] = g[y][x] === "1" ? 1 : 0;
          if (acc && (x === 2 || x === 3)) col[x === 3 ? 0 : 1] = 1;   /* tilde inclinada */
          cols.push(col);
        }
        if (i < w.length - 1) cols.push(new Array(ROWS).fill(0));
      }
      return cols;
    }
    var maps = words.map(bitmap), ctx = cv.getContext("2d"), dpr = Math.min(window.devicePixelRatio || 1, 2);
    var COLS = Math.max.apply(null, maps.map(function (m) { return m.length; })) + 8;
    var W = 0, H = 0, P = 0, glow = document.createElement("canvas"), gx = glow.getContext("2d");
    var wi = 0, x = COLS, phase = "in", hold = 0, last = 0, raf = 0, run = false;
    function size() {
      var r = cv.getBoundingClientRect(); if (!r.width) return;
      P = r.width / COLS; W = r.width; H = P * ROWS;
      cv.style.setProperty("--ar", (COLS / ROWS).toFixed(4));
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); glow.width = cv.width; glow.height = cv.height;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); gx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    }
    function draw() {
      if (!P) return;
      var m = maps[wi], rr = P * .36;
      ctx.clearRect(0, 0, W, H); gx.clearRect(0, 0, W, H);
      for (var c = 0; c < COLS; c++) {
        var src = c - Math.round(x), col = m[((src % m.length) + m.length) % m.length];
        for (var y = 0; y < ROWS; y++) {
          var on = col && col[y], px = c * P + P / 2, py = y * P + P / 2;
          ctx.beginPath(); ctx.arc(px, py, rr, 0, 6.2832);
          if (on) {
            var g = ctx.createRadialGradient(px - rr * .3, py - rr * .3, 0, px, py, rr);
            g.addColorStop(0, "#FFD2C2"); g.addColorStop(.35, "#FF5A3C"); g.addColorStop(1, "#D81E0E");
            ctx.fillStyle = g; ctx.fill();
            gx.beginPath(); gx.arc(px, py, rr * 1.15, 0, 6.2832); gx.fillStyle = "#FF2A14"; gx.fill();
          } else { ctx.fillStyle = "#1C0B09"; ctx.fill(); }
        }
      }
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = "lighter";
      ctx.filter = "blur(" + Math.round(P * dpr * 1.3) + "px)"; ctx.globalAlpha = .85; ctx.drawImage(glow, 0, 0); ctx.restore();
    }
    /* cinta continua: todos los rubros seguidos, separados por un espacio, sin detenerse */
    var tape = [], GAP = 9;
    maps.forEach(function (m) { tape = tape.concat(m); for (var g = 0; g < GAP; g++) tape.push(new Array(ROWS).fill(0)); });
    maps = [tape]; wi = 0; x = COLS;
    function center(m) { return 0; }
    function tick(now) {
      if (!run) return;
      if (now - last > 17) { last = now; x -= 1; if (x < -tape.length + 0) x += tape.length; draw(); }
      raf = requestAnimationFrame(tick);
    }
    function start() { if (run) return; if (REDUCED) { x = center(maps[wi]); draw(); return; } run = true; raf = requestAnimationFrame(tick); }
    function stop() { run = false; cancelAnimationFrame(raf); }
    size(); if (REDUCED) { x = center(maps[0]); draw(); }
    new IntersectionObserver(function (es) { es[0].isIntersecting ? start() : stop(); }).observe(cv);
    var rt; window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(size, 150); });
    document.addEventListener("visibilitychange", function () { document.hidden ? stop() : start(); });
  })();
})();
