/* FoxParaguay · Tienda de prueba. Lee FOX_PRODUCTOS y FOX_CATS (productos.js).
   Categorías plegables por grupo con enlace propio (#c=impresoras), búsqueda, con stock,
   orden por precio, ficha rápida, carrito (cart.js) y consulta por WhatsApp de ventas. */
(function () {
  "use strict";
  var grid = document.getElementById("shop-grid");
  var DATA = window.FOX_PRODUCTOS || [], CATS = window.FOX_CATS || [], GR = window.FOX_GRUPOS || {};
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var ROOT = document.body.getAttribute("data-root") || "./";
  var W = ((window.FOX_CONFIG || {}).whatsapp || {}).ventas || {};
  var CBY = {}; CATS.forEach(function (c) { CBY[c.k] = c; });
  var PBY = {}; DATA.forEach(function (p) { PBY[p.id] = p; });
  function gs(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "."); }
  function wa(text) { return W.numero ? "https://wa.me/" + W.numero + "?text=" + encodeURIComponent(text) : ROOT + "contacto/index.html"; }
  function waText(p) { return "Hola, quiero consultar por " + p.n + " (código " + p.sku + ")" + (p.s ? "." : ", que figura a pedido."); }
  function strip(s) { return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function icon(name, cls) { return '<svg class="' + (cls || "ic") + '" aria-hidden="true"><use href="#i-' + name + '"/></svg>'; }
  function addToCart(p, btn) {
    if (!window.FoxCart) return;
    window.FoxCart.add({ id: p.id, n: p.n, p: p.p, img: p.img, sku: p.sku, s: p.s });
    if (btn) { btn.classList.add("ok"); var l = $(".lbl", btn); if (l) { l.textContent = "Agregado"; setTimeout(function () { l.textContent = "Agregar"; btn.classList.remove("ok"); }, 1400); } }
  }

  /* Kits: arman el mensaje de WhatsApp con su lista. */
  $$("[data-wa-text]").forEach(function (a) { a.href = wa(a.getAttribute("data-wa-text")); a.target = "_blank"; a.rel = "noopener"; });
  if (!grid || !DATA.length) return;

  var q = $("#q"), only = $("#only-stock"), sort = $("#sort"), count = $("#shop-count"), empty = $("#shop-empty"), title = $("#cat-title");
  var tog = $("#cats-toggle"), panel = $("#cats-panel"), cur = $("#cats-current");
  var state = { c: "", q: "", only: false, sort: "rel" };

  function badges(p) {
    var b = [];
    if (p.dest) b.push('<span class="bd bd-dest">Destacado</span>');
    if (p.nov) b.push('<span class="bd bd-nov">Novedad</span>');
    if (p.used) b.push('<span class="bd bd-used">Usado</span>');
    return b.join("");
  }
  function card(p) {
    var el = document.createElement("article");
    el.className = "prod"; el.setAttribute("data-spot", "");
    var c = CBY[p.c] || {};
    el.innerHTML =
      '<button type="button" class="prod-open" aria-haspopup="dialog" aria-label="">' +
        '<span class="prod-im"><span class="prod-bd">' + badges(p) + '</span><img loading="lazy" alt=""><span class="prod-sh" aria-hidden="true"></span>' +
        '<span class="prod-eye" aria-hidden="true">' + icon("eye") + 'Ver ficha</span></span></button>' +
      '<div class="prod-tx"><span class="prod-c"></span><h3 class="prod-n"></h3>' +
        '<div class="prod-row"><span class="prod-p"><small>Gs.</small><b></b></span><span class="prod-st"></span></div></div>' +
      '<div class="prod-acts"><button type="button" class="prod-add">' + icon("cartb") + '<span class="lbl">Agregar</span></button>' +
        '<a class="prod-wa" target="_blank" rel="noopener">' + icon("chat") + '</a></div>';
    var img = $("img", el); img.src = ROOT + p.img; img.alt = p.n;
    $(".prod-open", el).setAttribute("aria-label", "Ver ficha: " + p.n);
    $(".prod-c", el).textContent = c.n || "";
    $(".prod-n", el).textContent = p.n;
    $(".prod-p b", el).textContent = gs(p.p);
    var st = $(".prod-st", el); st.textContent = p.s ? "En stock" : "A pedido"; if (!p.s) st.classList.add("off");
    var w = $(".prod-wa", el); w.href = wa(waText(p)); w.setAttribute("aria-label", "Consultar por WhatsApp: " + p.n); w.title = "Consultar por WhatsApp";
    $(".prod-open", el).addEventListener("click", function () { quick(p); });
    $(".prod-n", el).addEventListener("click", function () { quick(p); });
    var add = $(".prod-add", el); add.setAttribute("aria-label", "Agregar al carrito: " + p.n);
    add.addEventListener("click", function () { addToCart(p, add); });
    return el;
  }
  function score(p) { return (p.s ? 4 : 0) + (p.dest ? 2 : 0) + (p.nov ? 1 : 0); }
  function render(fromNav) {
    var t = strip(state.q.trim());
    var list = DATA.filter(function (p) {
      if (state.c && p.cs.indexOf(state.c) === -1) return false;
      if (state.only && !p.s) return false;
      if (t && strip(p.n + " " + (CBY[p.c] || {}).n + " " + p.d + " " + p.sku).indexOf(t) === -1) return false;
      return true;
    });
    if (state.sort === "asc") list.sort(function (a, b) { return a.p - b.p; });
    else if (state.sort === "desc") list.sort(function (a, b) { return b.p - a.p; });
    else list.sort(function (a, b) { return score(b) - score(a); });
    grid.textContent = "";
    list.forEach(function (p) { grid.appendChild(card(p)); });
    var c = CBY[state.c];
    title.textContent = c ? c.n : "Todos los productos";
    count.textContent = list.length + (list.length === 1 ? " producto" : " productos") + (c ? " · " + GR[c.g] : "");
    if (cur) cur.textContent = c ? c.n : "Todo";
    empty.hidden = list.length > 0;
    if (!list.length) {
      var catEmpty = c && !c.count;
      $("#empty-t").textContent = catEmpty ? c.n + ": a pedido." : "Sin resultados.";
      $("#empty-p").textContent = catEmpty ? "Ahora no hay productos publicados en esta categoría. Contanos qué necesitás y te lo conseguimos." : "Probá con otra palabra o escribinos: si no está en la lista, lo conseguimos.";
      $("#empty-wa").href = wa("Hola, busco " + (catEmpty ? c.n.toLowerCase() : "\"" + state.q + "\"") + " en la tienda."); $("#empty-wa").target = "_blank";
    }
    $$(".cat").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-c") === state.c)); });
    if (c) { var g = $('.cat-g[data-g="' + c.g + '"]'); if (g && !g.open) g.open = true; }
    if (window.FoxMotion) window.FoxMotion.refresh(grid);
    if (fromNav && window.innerWidth < 900) { var top = $(".shop-top").getBoundingClientRect().top + window.scrollY - 76; window.scrollTo({ top: top, behavior: "smooth" }); }
  }
  function setPanel(open) { if (!tog) return; tog.setAttribute("aria-expanded", String(open)); panel.classList.toggle("open", open); }
  function setCat(k, fromNav) {
    state.c = k || "";
    try { history.replaceState(null, "", state.c ? "#c=" + state.c : location.pathname + location.search); } catch (e) {}
    if (fromNav) setPanel(false);
    render(fromNav);
  }
  if (tog) tog.addEventListener("click", function () { setPanel(tog.getAttribute("aria-expanded") !== "true"); });
  $$(".cat").forEach(function (b) { b.addEventListener("click", function () { setCat(b.getAttribute("data-c"), true); }); });
  $("#empty-reset").addEventListener("click", function () { q.value = ""; state.q = ""; only.checked = false; state.only = false; setCat(""); });
  var tq; q.addEventListener("input", function () { clearTimeout(tq); tq = setTimeout(function () { state.q = q.value; render(); }, 120); });
  only.addEventListener("change", function () { state.only = only.checked; render(); });
  sort.addEventListener("change", function () { state.sort = sort.value; render(); });

  /* Ficha rápida */
  var dlg = $("#qv"), qvP = null;
  function quick(p) {
    qvP = p;
    var c = CBY[p.c] || {};
    $("#qv-img").src = ROOT + p.img; $("#qv-img").alt = p.n;
    $("#qv-b").innerHTML = '<span class="bd ' + (p.s ? "bd-ok" : "bd-off") + '">' + (p.s ? "En stock" : "A pedido") + "</span>" + badges(p);
    $("#qv-n").textContent = p.n;
    $("#qv-meta").textContent = (c.n || "") + " · Código " + p.sku;
    $("#qv-d").textContent = p.d || "Consultanos compatibilidad y plazo de entrega.";
    $("#qv-compat").hidden = c.g !== "pdv";
    $("#qv-p").innerHTML = "<small>Gs.</small> <b></b>"; $("#qv-p b").textContent = gs(p.p);
    var w = $("#qv-wa"); w.href = wa(waText(p)); w.target = "_blank"; w.rel = "noopener";
    var u = $("#qv-u"); if (p.u) { u.href = p.u; u.hidden = false; } else { u.hidden = true; }
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
  }
  $("#qv-add").addEventListener("click", function () { if (qvP) { addToCart(qvP); dlg.close(); if (window.FoxCart) window.FoxCart.open(); } });
  dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });

  function fromHash() { var hc = (location.hash.match(/^#c=([a-z]+)/) || [])[1]; state.c = hc && CBY[hc] ? hc : ""; }
  window.addEventListener("hashchange", function () { fromHash(); render(); });
  fromHash();
  render();
})();
