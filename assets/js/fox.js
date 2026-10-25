/* FoxParaguay · JavaScript compartido por todas las páginas.
   Cada módulo se auto-protege: si su HTML no existe en la página, no hace nada.
   La raíz relativa del sitio sale de <body data-root="./"> o "../". */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var ROOT = document.body.getAttribute("data-root") || "./";
  var PAGE = document.body.getAttribute("data-page") || "";
  var CFG = window.FOX_CONFIG || { whatsapp: {}, leads: {}, chat: {} };
  var LS_KEY = "fox_leads_demo";

  var RUBROS = {
    farmacia: { k: "Farmacia", img: "assets/img/marcas/farmafox.webp", alt: "FarmaFox", sys: "FarmaFox", p: "Listado de medicamentos con código de barras, precios oficiales DINAVISA y reporte de controlados. Lo usan 180 farmacias.", url: "sistemas/farmafox.html" },
    minimarket: { k: "Minimarket", img: "assets/img/marcas/puntoshop.webp", alt: "PuntoShop", sys: "PuntoShop", p: "Ventas, stock y lectura de balanza, con 25.000 productos del rubro cargados y facturación por kilo." },
    bodega: { k: "Bodega", img: "assets/img/marcas/puntoshop.webp", alt: "PuntoShop", sys: "PuntoShop", p: "Facturá en segundos, controlá el stock máximo y mínimo y recibí el arqueo de caja en tu celular." },
    ferreteria: { k: "Ferretería", img: "assets/img/marcas/puntoshop.webp", alt: "PuntoShop", sys: "PuntoShop", p: "Miles de artículos con código de barras, cuentas de clientes y proveedores y más de 300 reportes." },
    libreria: { k: "Librería", img: "assets/img/marcas/puntoshop.webp", alt: "PuntoShop", sys: "PuntoShop", p: "Stock por artículo, campañas de ofertas y reportes de ventas por período." },
    distribuidora: { k: "Distribuidora", img: "assets/img/marcas/puntoshop.webp", alt: "PuntoShop", sys: "PuntoShop", p: "Ventas mayoristas y minoristas, cuentas corrientes y libro de compras y ventas." },
    repuestos: { k: "Casa de repuestos", img: "assets/img/marcas/puntoshop.webp", alt: "PuntoShop", sys: "PuntoShop", p: "Búsqueda rápida de repuestos, stock y facturación con cuentas de clientes." },
    restaurante: { k: "Restaurante", img: "assets/img/marcas/puntoshop.webp", alt: "PuntoShop", sys: "PuntoShop Restaurantes", p: "Apertura de mesas, comandas en pantallas táctiles e impresión separada para barra, cocina y caja." },
    veterinaria: { k: "Veterinaria", img: "assets/img/marcas/veterfox.svg", alt: "VeterFox", sys: "VeterFox", p: "Historia clínica, recordatorios de vacunas por WhatsApp, guardería e internación, stock y facturación." },
    autos: { k: "Playa de autos", img: "assets/img/marcas/motorfox.svg", alt: "MotorFox", sys: "MotorFox", p: "Stock de vehículos, cuentas de clientes, emisión de pagarés y facturación." },
    otro: { k: "Otro rubro", txt: "A medida", sys: "", p: "Contanos qué vendés y te decimos si alguno de nuestros sistemas se adapta a tu negocio." }
  };

  function waLink(kind, msg) {
    var w = (CFG.whatsapp || {})[kind] || {};
    if (!w.numero) return "";
    return "https://wa.me/" + w.numero + "?text=" + encodeURIComponent(msg || w.mensaje || "");
  }
  function fmtNum(n) { // 595984112789 -> +595 984 112 789
    return n ? "+" + n.slice(0, 3) + " " + n.slice(3, 6) + " " + n.slice(6, 9) + " " + n.slice(9) : "";
  }

  /* 1. Menú móvil */
  (function () {
    var btn = $("#menu"), d = $("#drawer");
    if (!btn || !d) return;
    btn.addEventListener("click", function () { var o = d.hidden; d.hidden = !o; btn.setAttribute("aria-expanded", String(o)); });
    $$("a", d).forEach(function (a) { a.addEventListener("click", function () { d.hidden = true; btn.setAttribute("aria-expanded", "false"); }); });
  })();

  /* 2. WhatsApp: todo elemento con data-whatsapp="ventas|soporte" */
  (function () {
    $$("[data-whatsapp]").forEach(function (el) {
      var kind = el.getAttribute("data-whatsapp"), w = (CFG.whatsapp || {})[kind] || {};
      if (el.tagName === "A") {
        var href = waLink(kind);
        if (href) { el.href = href; el.target = "_blank"; el.rel = "noopener"; } else { el.removeAttribute("href"); el.setAttribute("aria-disabled", "true"); }
      }
      if (el.hasAttribute("data-whatsapp-num")) el.textContent = w.numero ? fmtNum(w.numero) : "Número a confirmar";
    });
  })();

  /* 2b. Descarga de la demo: [data-descarga="demo"] usa FOX_CONFIG.descargas.demo (https).
     Sin enlace cargado, el botón abre WhatsApp de ventas pidiendo el enlace. */
  (function () {
    $$("[data-descarga]").forEach(function (el) {
      var url = ((CFG.descargas || {})[el.getAttribute("data-descarga")] || "");
      if (/^https:\/\//.test(url)) { el.href = url; el.rel = "noopener"; return; }
      var wa = waLink("ventas", "Hola, quiero descargar la demo de FoxParaguay. ¿Me pasan el enlace?");
      if (wa) { el.href = wa; el.target = "_blank"; el.rel = "noopener"; el.textContent = "Pedir el enlace por WhatsApp"; }
      var n = $("[data-descarga-nota]"); if (n) n.hidden = false;
    });
  })();

  /* 3. Selector de rubro (Inicio) */
  var lastRubro = "farmacia";
  (function () {
    var box = $("#rubros");
    if (!box) return;
    function pick(v) {
      var r = RUBROS[v]; if (!r) return; lastRubro = v;
      $("#s-k").textContent = r.k; $("#s-p").textContent = r.p;
      var b = $("#s-brand"); b.textContent = "";
      if (r.img) { var i = document.createElement("img"); i.src = ROOT + r.img; i.alt = r.alt; b.appendChild(i); }
      else { var s = document.createElement("strong"); s.textContent = r.txt; b.appendChild(s); }
      var more = $("#s-more");
      if (more) { if (r.url) { more.hidden = false; more.href = ROOT + r.url; } else { more.hidden = true; } }
      var cta = $("#s-cta"); if (cta) cta.href = $("#f") ? "#demo" : ROOT + "demo/index.html?rubro=" + v;
      var sel = $("#f-rubro"); if (sel) sel.value = v;
    }
    $$("input", box).forEach(function (i) { i.addEventListener("change", function () { pick(i.value); }); });
    pick("farmacia");
  })();

  /* 4. Pedidos de demo (formularios y chat) */
  var Leads = {
    all: function () { try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); } catch (e) { return []; } },
    keep: function (rows) { try { localStorage.setItem(LS_KEY, JSON.stringify(rows)); return true; } catch (e) { return false; } },
    save: function (data) {
      var row = {
        id: "L" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        nombre: String(data.nombre || "").slice(0, 120), negocio: String(data.negocio || "").slice(0, 120),
        rubro: String(data.rubro || "").slice(0, 40), ciudad: String(data.ciudad || "").slice(0, 80),
        whatsapp: String(data.whatsapp || "").slice(0, 30), origen: data.origen || PAGE, fuente: data.fuente || "formulario",
        nota: String(data.nota || "").slice(0, 500), estado: "nuevo", creado: new Date().toISOString()
      };
      var rows = Leads.all(); rows.unshift(row); Leads.keep(rows);
      if (typeof window.foxTrackLead === "function") { try { window.foxTrackLead(row.rubro); } catch (e) {} }
      var url = (CFG.leads || {}).endpoint;
      if (!url) return Promise.resolve({ ok: true, demo: true, row: row });
      var ctl = window.AbortController ? new AbortController() : null;
      var t = setTimeout(function () { if (ctl) ctl.abort(); }, 8000);
      return fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(row), signal: ctl ? ctl.signal : undefined })
        .then(function (r) { clearTimeout(t); return { ok: r.ok, demo: false, row: row }; })
        .catch(function () { clearTimeout(t); return { ok: false, demo: false, row: row }; });
    }
  };
  window.FoxLeads = Leads;
  /* Gancho para el píxel de Meta: queda definido, se activa solo si existe window.fbq. */
  if (typeof window.foxTrackLead !== "function") {
    window.foxTrackLead = function (rubro) { if (window.fbq) window.fbq("track", "Lead", { content_category: rubro || "" }); };
  }
  function waValid(v) { var d = String(v || "").replace(/\D/g, ""); return d.length >= 9 && d.length <= 12; }

  (function () {
    var f = $("#f");
    if (!f) return;
    var sel = $("#f-rubro");
    var q = (location.search.match(/[?&]rubro=([a-z]+)/) || [])[1];
    if (sel && q && RUBROS[q]) sel.value = q;
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      ["f-nombre", "f-negocio", "f-ciudad"].forEach(function (id) { var el = $("#" + id), bad = !el.value.trim(); el.parentElement.classList.toggle("bad", bad); if (bad) ok = false; });
      var wa = $("#f-wa"), badWa = !waValid(wa.value); wa.parentElement.classList.toggle("bad", badWa); if (badWa) ok = false;
      if (!ok) { var x = $(".f.bad input", f); if (x) x.focus(); return; }
      var btn = $("button[type=submit]", f); btn.disabled = true;
      Leads.save({ nombre: $("#f-nombre").value, negocio: $("#f-negocio").value, rubro: sel ? sel.value : "", ciudad: $("#f-ciudad").value, whatsapp: wa.value, fuente: "formulario" })
        .then(function (r) {
          var done = $(".done");
          if (r.demo) done.innerHTML = "<b>Listo, recibimos tu pedido.</b>Modo demo: el pedido quedó guardado en este navegador. Lo ves en el panel de pedidos de la demo.";
          else if (!r.ok) done.innerHTML = "<b>No pudimos enviar el pedido.</b>Escribinos por WhatsApp al " + fmtNum(((CFG.whatsapp || {}).ventas || {}).numero || "") + " y te atendemos.";
          $("#coupon").classList.add("sent");
        });
    });
  })();

  /* 5. Chat con el asistente.
     Orden de preferencia (ver README.txt, CHAT):
       a) FOX_CONFIG.chat.conversa.websiteToken → agente de IA en Cerodos Conversa
          (burbuja a la izquierda en todas las páginas; embebido en agente/).
       b) FOX_CONFIG.chat.iframeUrl → chat público de otra plataforma (Dify, Apibot)
          dentro del mismo panel.
       c) Nada cargado → asistente guiado local, sin IA. */
  (function () {
    var open = $("#chat-open"), panel = $("#chatp");
    if (!panel) return;
    var inline = panel.hasAttribute("data-inline");
    var C = CFG.chat || {}, key = panel.getAttribute("data-chat-key"), K = key && C[key];
    if (K && ((K.conversa || {}).websiteToken || K.iframeUrl)) C = { conversa: K.conversa || {}, iframeUrl: K.iframeUrl || "", titulo: C.titulo };
    var cv = C.conversa || {};
    var base = String(cv.baseUrl || "").replace(/\/$/, "");
    var hasConversa = !!(base && cv.websiteToken);
    var frameUrl = C.iframeUrl || (hasConversa ? base + "/widget?website_token=" + encodeURIComponent(cv.websiteToken) + "#/prechat-form" : "");
    var mode = hasConversa ? "conversa" : (C.iframeUrl ? "iframe" : "local");
    document.documentElement.setAttribute("data-chat", mode);
    function frameInto(box) {
      box.textContent = "";
      var f = document.createElement("iframe");
      f.className = "agent-frame"; f.src = frameUrl; f.title = "Chat con el asistente de FoxParaguay"; f.loading = "lazy";
      f.setAttribute("allow", "clipboard-write; microphone");
      box.appendChild(f);
    }
    if (inline && frameUrl) {
      var hd = $("header", panel);
      $$("#log, #quick, #chatf", panel).forEach(function (n) { n.remove(); });
      var box = document.createElement("div"); box.className = "frame-box"; panel.appendChild(box); frameInto(box);
      if (hd) panel.insertBefore(hd, box);
      $$("[data-ask]").forEach(function (b) { b.disabled = true; });
      return;
    }
    if (!inline && hasConversa) {
      if (open) open.remove(); panel.remove();
      window.chatwootSettings = { position: "left", locale: "es", type: "expanded_bubble", launcherTitle: C.titulo || "Consultá a nuestro asistente", hideMessageBubble: true };
      var g = document.createElement("script"); g.src = base + "/packs/js/sdk.js"; g.async = true; g.defer = true;
      g.onload = function () {
        if (!window.chatwootSDK) return;
        window.chatwootSDK.run({ websiteToken: cv.websiteToken, baseUrl: base });
        /* Sin charla empezada, abrir directo en el formulario para escribir de entrada. */
        if (/(^|;\s*)cw_conversation=/.test(document.cookie)) return;
        var n = 0, t = setInterval(function () {
          var m = document.getElementById("chatwoot_live_chat_widget");
          if (m && m.src && m.src.indexOf("#") === -1) { m.src += "#/prechat-form"; clearInterval(t); }
          else if (++n > 60) clearInterval(t);
        }, 150);
      };
      document.body.appendChild(g);
      return;
    }
    if (!inline && frameUrl) {
      $$("#log, #quick, #chatf", panel).forEach(function (n) { n.remove(); });
      var fb = document.createElement("div"); fb.className = "frame-box"; panel.appendChild(fb);
      var loaded = false;
      open.addEventListener("click", function () { if (!loaded) { frameInto(fb); loaded = true; } panel.hidden = false; open.hidden = true; });
      $("#chat-x").addEventListener("click", function () { panel.hidden = true; open.hidden = false; open.focus(); });
      return;
    }
    var log = $("#log"), form = $("#chatf"), input = $("#chat-in"), quick = $("#quick");
    var st = { step: "rubro", rubro: "", data: {} };
    function say(kind, text) { var m = document.createElement("div"); m.className = "msg " + kind; m.textContent = text; log.appendChild(m); log.scrollTop = log.scrollHeight; }
    function bot(text) { setTimeout(function () { say("bot", text); }, 350); }
    function detect(t) {
      if (/farmac/.test(t)) return "farmacia";
      if (/mini ?market|super/.test(t)) return "minimarket";
      if (/bodega|despensa|almac/.test(t)) return "bodega";
      if (/ferret/.test(t)) return "ferreteria";
      if (/librer/.test(t)) return "libreria";
      if (/distrib|mayorist/.test(t)) return "distribuidora";
      if (/repuest/.test(t)) return "repuestos";
      if (/restau|bar|confiter|comida|pizz/.test(t)) return "restaurante";
      if (/veterin|mascota/.test(t)) return "veterinaria";
      if (/auto|vehic|playa/.test(t)) return "autos";
      return "";
    }
    function greet() {
      var hi = PAGE === "farmafox" ? "Hola. ¿Tenés una farmacia? Te cuento cómo te ayuda FarmaFox y coordinamos una demo gratis."
        : PAGE === "facturacion" ? "Hola. ¿Querés saber cuándo te toca la factura electrónica o cómo la emitís con PuntoShop o FarmaFox?"
        : PAGE === "contacto" ? "Hola, soy el asistente de atención de FoxParaguay. ¿En qué te ayudo? Puedo responder sobre horarios, pedidos, equipos y facturas."
        : PAGE === "agente" ? "Hola, soy el asistente de FoxParaguay. Preguntame por FarmaFox, PuntoShop, VeterFox, MotorFox, la factura electrónica o los equipos de la tienda. ¿Qué negocio tenés?"
        : PAGE === "soporte" ? "Hola. Si ya sos cliente y necesitás ayuda, contame qué pasa. Si querés conocer un sistema, decime qué negocio tenés."
        : "Hola, soy el asistente de FoxParaguay. ¿Qué negocio tenés?";
      say("bot", hi);
    }
    function askNext() {
      var d = st.data;
      if (!d.nombre) { st.step = "nombre"; bot("Para coordinar la demo, ¿cómo te llamás?"); return; }
      if (!d.negocio) { st.step = "negocio"; bot("Gracias, " + d.nombre + ". ¿Cómo se llama tu negocio?"); return; }
      if (!d.ciudad) { st.step = "ciudad"; bot("¿En qué ciudad está?"); return; }
      if (!d.whatsapp) { st.step = "whatsapp"; bot("Último dato: ¿a qué número de WhatsApp te escribimos?"); return; }
      st.step = "fin";
      Leads.save({ nombre: d.nombre, negocio: d.negocio, rubro: st.rubro || "otro", ciudad: d.ciudad, whatsapp: d.whatsapp, fuente: "chat", nota: "Pedido desde el chat" })
        .then(function (r) {
          say("sys", r.ok ? "Pedido de demo registrado" : "No se pudo enviar el pedido");
          bot(r.ok ? "Listo. Un comercial te escribe por WhatsApp en horario de atención, de lunes a sábado de 9 a 18." : "Hubo un problema al enviar. Escribinos por WhatsApp al " + fmtNum(((CFG.whatsapp || {}).ventas || {}).numero || "") + ".");
        });
    }
    function reply(text) {
      var t = text.toLowerCase();
      if (st.step === "nombre") { st.data.nombre = text.trim().slice(0, 60); askNext(); return; }
      if (st.step === "negocio") { st.data.negocio = text.trim().slice(0, 80); askNext(); return; }
      if (st.step === "ciudad") { st.data.ciudad = text.trim().slice(0, 60); askNext(); return; }
      if (st.step === "whatsapp") {
        if (!waValid(text)) { bot("Ese número no parece completo. Escribilo con el código de área, por ejemplo 0981 123 456."); return; }
        st.data.whatsapp = text.trim(); askNext(); return;
      }
      if (st.step === "fin") { bot("Ya tenemos tu pedido. Si querés agregar algo, contalo por WhatsApp cuando te escriba el comercial."); return; }
      if (/horario|abren|atienden|hora/.test(t)) { bot("Atendemos de lunes a sábado, de 9 a 18, en Dr. Mendez Paiva 1825 casi Nazareth, Asunción."); return; }
      if (/pedido|compra|envío|envio|entrega/.test(t) && !detect(t)) { bot("Para ver el estado de tu pedido decime tu nombre y el número de pedido (empieza con P-). Lo paso al equipo de ventas."); return; }
      if (/factura de mi|comprobante|recibo/.test(t)) { bot("Te enviamos la factura por correo o WhatsApp. Decime el número de pedido y a dónde te la mandamos."); return; }
      if (/precio|cuesta|cuánto|cuanto|costo|valor/.test(t)) { bot("El precio depende de tu negocio, así que te lo pasa un comercial junto con la demo. ¿Qué rubro tenés?"); return; }
      if (/soy cliente|soporte|no funciona|error|anydesk|problema/.test(t)) {
        var sp = ((CFG.whatsapp || {}).soporte || {}).numero;
        bot(sp ? "Para soporte escribinos al " + fmtNum(sp) + ". Tené a mano el nombre de tu negocio." : "Para soporte, en la página de Soporte tenés los canales y el acceso a AnyDesk. El número de soporte está por confirmarse."); return;
      }
      if (/factur|sifen|electr|kude|timbrado/.test(t) && !detect(t)) {
        bot("PuntoShop y FarmaFox ya emiten factura electrónica homologada por SIFEN, con FacturaSend. El próximo grupo designado por la DNIT arranca el 01/12/2026. ¿Qué negocio tenés, así te recomiendo el sistema?"); return;
      }
      var r = detect(t);
      if (r) {
        st.rubro = r; var R = RUBROS[r];
        bot("Para tu rubro está " + R.sys + ". " + R.p + " ¿Querés que te mostremos la demo sin costo?");
        st.step = "ofrecer"; return;
      }
      if (st.step === "ofrecer" && /^(s[ií]|dale|ok|bueno|claro|quiero|me interesa)/.test(t)) { askNext(); return; }
      if (st.step === "ofrecer" && /^no/.test(t)) { st.step = "rubro"; bot("Perfecto. Si tenés otra consulta, escribila acá."); return; }
      bot("Contame qué vende tu negocio (por ejemplo farmacia, minimarket o ferretería) y te digo qué sistema te conviene.");
    }
    function send(text) { text = String(text || "").trim(); if (!text) return; quick.hidden = true; say("me", text); reply(text); }
    if (inline) {
      greet();
      $$("[data-ask]").forEach(function (b) { b.addEventListener("click", function () { send(b.textContent); input.focus(); }); });
    }
    else {
      open.addEventListener("click", function () { panel.hidden = false; open.hidden = true; if (!log.children.length) greet(); input.focus(); });
      $("#chat-x").addEventListener("click", function () { panel.hidden = true; open.hidden = false; open.focus(); });
    }
    $$("button", quick).forEach(function (b) { b.addEventListener("click", function () { send(b.textContent); }); });
    form.addEventListener("submit", function (e) { e.preventDefault(); var v = input.value; input.value = ""; send(v); });
  })();

  /* 6. Panel de pedidos de la demo (leads-demo/) */
  (function () {
    var box = $("#leads");
    if (!box) return;
    var ESTADOS = ["nuevo", "contactado", "demo agendada", "cliente", "descartado"], filter = "todos";
    function render() {
      var rows = Leads.all(), counts = { todos: rows.length };
      ESTADOS.forEach(function (s) { counts[s] = rows.filter(function (r) { return r.estado === s; }).length; });
      $("#kpis").innerHTML = ["todos"].concat(ESTADOS).map(function (s) {
        return '<button type="button" data-f="' + s + '" aria-pressed="' + (filter === s) + '"><b>' + counts[s] + "</b>" + (s === "todos" ? "Todos" : s.charAt(0).toUpperCase() + s.slice(1)) + "</button>";
      }).join("");
      $$("#kpis button").forEach(function (b) { b.addEventListener("click", function () { filter = b.getAttribute("data-f"); render(); }); });
      var list = rows.filter(function (r) { return filter === "todos" || r.estado === filter; });
      box.textContent = "";
      if (!list.length) {
        box.innerHTML = '<div class="empty"><b>' + (rows.length ? "Ningún pedido en este estado." : "Todavía no hay pedidos en este navegador.") + "</b>" + (rows.length ? "Elegí otro filtro arriba." : "Completá el cupón de demo en cualquier página o conversá con el asistente: el pedido aparece acá.") + "</div>";
        return;
      }
      list.forEach(function (r) {
        var el = document.createElement("article"); el.className = "lcard";
        el.innerHTML = '<div class="top"><div><h3></h3><div class="meta"></div></div><span class="tagf"></span></div>' +
          '<dl><dt>Rubro</dt><dd data-k="rubro"></dd><dt>Ciudad</dt><dd data-k="ciudad"></dd><dt>WhatsApp</dt><dd data-k="whatsapp"></dd><dt>Página</dt><dd data-k="origen"></dd></dl>' +
          '<div class="row"><label class="meta" for="st-' + r.id + '">Estado</label><select id="st-' + r.id + '">' + ESTADOS.map(function (s) { return "<option" + (s === r.estado ? " selected" : "") + ">" + s + "</option>"; }).join("") + "</select></div>" +
          '<textarea aria-label="Nota interna" placeholder="Nota interna"></textarea>';
        $("h3", el).textContent = (r.negocio || "Sin negocio") + " · " + (r.nombre || "");
        $(".meta", el).textContent = r.creado ? new Date(r.creado).toLocaleString("es-PY", { dateStyle: "short", timeStyle: "short" }) : "";
        var tg = $(".tagf", el); tg.textContent = ({ chat: "Chat", contacto: "Mensaje", ticket: "Ticket", compra: "Compra" })[r.fuente] || "Formulario"; if (r.fuente === "chat") tg.classList.add("is-chat");
        ["rubro", "ciudad", "whatsapp", "origen"].forEach(function (k) { $('[data-k="' + k + '"]', el).textContent = r[k] || ""; });
        var ta = $("textarea", el); ta.value = r.nota || "";
        function patch(k, v) { var all = Leads.all(); all.forEach(function (x) { if (x.id === r.id) x[k] = v; }); Leads.keep(all); }
        $("select", el).addEventListener("change", function (e) { patch("estado", e.target.value); render(); });
        ta.addEventListener("change", function () { patch("nota", ta.value.slice(0, 500)); });
        box.appendChild(el);
      });
    }
    var exp = $("#leads-export");
    if (exp) exp.addEventListener("click", function () {
      var head = ["creado", "nombre", "negocio", "rubro", "ciudad", "whatsapp", "origen", "fuente", "estado", "nota"];
      var csv = [head.join(",")].concat(Leads.all().map(function (r) { return head.map(function (k) { return '"' + String(r[k] == null ? "" : r[k]).replace(/"/g, '""') + '"'; }).join(","); })).join("\n");
      var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" })); a.download = "pedidos-demo-foxparaguay.csv"; document.body.appendChild(a); a.click(); a.remove();
    });
    var clr = $("#leads-clear");
    if (clr) clr.addEventListener("click", function () {
      if (clr.getAttribute("data-armed") !== "1") { clr.setAttribute("data-armed", "1"); clr.textContent = "Tocá de nuevo para borrar"; return; }
      Leads.keep([]); clr.removeAttribute("data-armed"); clr.textContent = "Borrar pedidos"; render();
    });
    window.addEventListener("storage", function (e) { if (e.key === LS_KEY) render(); });
    render();
  })();
  /* 7. Contacto: mensaje (se guarda como pedido con fuente "contacto"), abrir chat y copiar datos. */
  (function () {
    var f = $("#fc");
    if (f) f.addEventListener("submit", function (e) {
      e.preventDefault(); var ok = true;
      ["c-nombre", "c-dato", "c-msg"].forEach(function (id) { var el = $("#" + id), bad = !el.value.trim(); el.parentElement.classList.toggle("bad", bad); if (bad) ok = false; });
      if (!ok) { var x = $(".f.bad input, .f.bad textarea", f); if (x) x.focus(); return; }
      var dato = $("#c-dato").value.trim();
      Leads.save({ nombre: $("#c-nombre").value, whatsapp: /@/.test(dato) ? "" : dato, nota: (/@/.test(dato) ? "Correo: " + dato + ". " : "") + $("#c-msg").value, rubro: "", fuente: "contacto" })
        .then(function () { $("#cmsg").classList.add("sent"); });
    });
    $$("[data-open-chat]").forEach(function (b) {
      b.addEventListener("click", function (e) {
        e.preventDefault();
        var o = $("#chat-open"); if (o && !o.hidden) { o.click(); return; }
        var il = $(".chatp.inline"); if (il) { il.scrollIntoView({ behavior: "smooth", block: "center" }); var ci = $("#chat-in"); if (ci) setTimeout(function () { ci.focus({ preventScroll: true }); }, 500); return; }
        var w = document.querySelector(".woot-widget-bubble"); if (w) { w.click(); return; }
        location.href = ROOT + "agente/index.html";
      });
    });
    $$("[data-copy]").forEach(function (b) {
      b.addEventListener("click", function () {
        var v = b.getAttribute("data-copy"), lbl = b.lastChild;
        function done() { lbl.textContent = "Copiado"; setTimeout(function () { lbl.textContent = "Copiar"; }, 1600); }
        if (navigator.clipboard) navigator.clipboard.writeText(v).then(done, done); else done();
      });
    });
  })();
  /* 8. Soporte: tickets por WhatsApp de soporte (llave en FOX_CONFIG.soporte). */
  (function () {
    var f = $("#ft");
    var S = CFG.soporte || {}, ws = ((CFG.whatsapp || {}).soporte || {}).numero || "";
    $$("[data-tk-direct]").forEach(function (a) { if (!ws) { a.href = "#ticket-form"; a.removeAttribute("aria-disabled"); a.removeAttribute("target"); a.firstChild.textContent = "Abrir un ticket "; a.addEventListener("click", function (e) { e.preventDefault(); var n = $("#t-nombre"); if (n) { n.scrollIntoView({ behavior: "smooth", block: "center" }); n.focus({ preventScroll: true }); } }); } });
    var ag = S.agente || {}, agc = ag.conversa || {}, box = $("#tk-chat");
    var agUrl = ag.iframeUrl || (agc.websiteToken && agc.baseUrl ? String(agc.baseUrl).replace(/\/$/, "") + "/widget?website_token=" + encodeURIComponent(agc.websiteToken) + "#/prechat-form" : "");
    if (box && agUrl) { var fr = document.createElement("iframe"); fr.className = "agent-frame"; fr.src = agUrl; fr.title = "Chat con soporte de FoxParaguay"; box.appendChild(fr); $("#chat-soporte").hidden = false; }
    if (!f) return;
    f.addEventListener("submit", function (e) {
      e.preventDefault(); var ok = true;
      ["t-nombre", "t-negocio", "t-desc"].forEach(function (id) { var el = $("#" + id), bad = !el.value.trim(); el.parentElement.classList.toggle("bad", bad); if (bad) ok = false; });
      if (!ok) { var x = $(".f.bad input, .f.bad textarea", f); if (x) x.focus(); return; }
      var d = new Date(), id = "T-" + String(d.getFullYear()).slice(2) + ("0" + (d.getMonth() + 1)).slice(-2) + ("0" + d.getDate()).slice(-2) + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();
      var urg = ($("input[name=t-urg]:checked", f) || {}).value || "Normal";
      var t = { ticket: id, nombre: $("#t-nombre").value.trim(), negocio: $("#t-negocio").value.trim(), sistema: $("#t-sis").value, problema: $("#t-prob").value, descripcion: $("#t-desc").value.trim(), urgencia: urg, creado: d.toISOString() };
      Leads.save({ nombre: t.nombre, negocio: t.negocio, rubro: t.sistema, nota: id + " · " + t.problema + " · " + urg + " · " + t.descripcion, fuente: "ticket" });
      if (S.ticketsEndpoint) { try { fetch(S.ticketsEndpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(t) }); } catch (er) {} }
      var msg = "Ticket " + id + (urg !== "Normal" ? " (URGENTE: no puedo vender)" : "") + "\nSistema: " + t.sistema + "\nProblema: " + t.problema + "\n" + t.descripcion + "\nNegocio: " + t.negocio + " · " + t.nombre;
      $("#tk-id").textContent = "Ticket " + id;
      var w = $("#tk-wa");
      if (ws) { w.href = "https://wa.me/" + ws + "?text=" + encodeURIComponent(msg); $("#tk-msg").textContent = "Envialo por WhatsApp para que soporte lo tome. Guardá el número para seguir el caso."; }
      else { w.hidden = true; $("#tk-msg").textContent = "Modo demo: el ticket quedó guardado en el panel. Falta cargar el WhatsApp de soporte en fox-config.js para enviarlo."; }
      $("#tkbox").classList.add("sent");
    });
  })();
})();
