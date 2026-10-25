/* FoxParaguay · Carrito de prueba (todas las páginas).
   Guarda en el navegador (clave fox_cart_demo). Finalizar compra arma el pedido,
   lo guarda en el panel de la demo y lo envía por WhatsApp de ventas.
   FOX_CONFIG.tienda.checkoutEndpoint: URL que recibe el pedido en JSON (pasarela de pago). */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var ROOT = document.body.getAttribute("data-root") || "./";
  var CFG = window.FOX_CONFIG || {};
  var KEY = "fox_cart_demo";
  function gs(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "."); }
  function icon(n) { return '<svg class="ic" aria-hidden="true"><use href="#i-' + n + '"/></svg>'; }
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { return []; } }
  function keep(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} }
  var items = load();

  var dr = document.createElement("div");
  dr.className = "cart"; dr.id = "cart"; dr.hidden = true;
  dr.innerHTML =
    '<div class="cart-bg" data-close></div>' +
    '<aside class="cart-p" role="dialog" aria-modal="true" aria-labelledby="cart-h">' +
      '<header class="cart-hd"><h2 id="cart-h">Tu carrito</h2><button type="button" class="cart-x" data-close aria-label="Cerrar carrito">' + icon("x") + '</button></header>' +
      '<ol class="cart-steps" aria-hidden="true"><li data-s="1">Carrito</li><li data-s="2">Datos</li><li data-s="3">Listo</li></ol>' +
      '<div class="cart-body" data-step="1"><ul class="cart-list"></ul>' +
        '<div class="cart-empty" hidden>' + icon("cartb") + '<b>Tu carrito está vacío.</b><a class="btn line" href="' + ROOT + 'tienda/index.html">Ir a la tienda</a></div></div>' +
      '<form class="cart-body cart-form" data-step="2" hidden novalidate>' +
        '<div class="f"><label for="k-nombre">Nombre y apellido</label><input id="k-nombre" autocomplete="name" required><span class="err">Escribí tu nombre.</span></div>' +
        '<div class="f"><label for="k-wa">WhatsApp</label><input id="k-wa" type="tel" inputmode="tel" autocomplete="tel" placeholder="0981 123 456" required><span class="err">Revisá el número.</span></div>' +
        '<fieldset class="f opt"><legend>Entrega</legend>' +
          '<label><input type="radio" name="k-ent" value="Retiro en Asunción" checked><span>Retiro en el local</span><small>Dr. Mendez Paiva 1825</small></label>' +
          '<label><input type="radio" name="k-ent" value="Envío"><span>Envío</span><small>Costo según ciudad</small></label></fieldset>' +
        '<div class="f k-city" hidden><label for="k-ciudad">Ciudad y dirección</label><input id="k-ciudad" autocomplete="street-address"><span class="err">Escribí a dónde lo enviamos.</span></div>' +
        '<div class="f"><label for="k-pago">Forma de pago</label><select id="k-pago"><option>Transferencia bancaria</option><option>Efectivo al retirar</option><option>Tarjeta en el local</option></select></div>' +
        '<p class="cart-legal">Pedido de prueba: no se cobra nada. Precio final, stock y envío se confirman por WhatsApp.</p>' +
      '</form>' +
      '<div class="cart-body cart-ok" data-step="3" hidden>' + icon("check") + '<b class="ok-id"></b><p class="ok-p"></p><a class="btn demo ok-wa" target="_blank" rel="noopener">Enviar pedido por WhatsApp <span class="chev"></span></a></div>' +
      '<footer class="cart-ft"><div class="cart-tot"><span>Subtotal</span><b></b></div>' +
        '<button type="button" class="btn demo cart-go">Finalizar compra <span class="chev"></span></button>' +
        '<button type="button" class="cart-back" hidden>Volver al carrito</button></footer>' +
    '</aside>';
  document.body.appendChild(dr);

  var list = $(".cart-list", dr), emptyBox = $(".cart-empty", dr), tot = $(".cart-tot b", dr), go = $(".cart-go", dr), back = $(".cart-back", dr), form = $(".cart-form", dr);
  var step = 1, lastFocus = null;

  function count() { return items.reduce(function (a, i) { return a + i.q; }, 0); }
  function total() { return items.reduce(function (a, i) { return a + i.q * i.p; }, 0); }
  function badge(bump) {
    var n = count();
    $$(".cart-n").forEach(function (b) { b.textContent = n; b.hidden = !n; if (bump) { b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump"); } });
  }
  function draw() {
    list.textContent = "";
    items.forEach(function (it) {
      var li = document.createElement("li"); li.className = "ci";
      li.innerHTML = '<span class="ci-im"><img alt=""></span><div class="ci-tx"><b></b><span class="ci-p"></span>' +
        '<div class="ci-q"><button type="button" data-d="-1" aria-label="Quitar uno">' + icon("minus") + '</button><output></output><button type="button" data-d="1" aria-label="Agregar uno">' + icon("plus") + '</button>' +
        '<button type="button" class="ci-del" aria-label="Eliminar">' + icon("trash") + '</button></div></div>';
      $("img", li).src = ROOT + it.img; $("b", li).textContent = it.n;
      $(".ci-p", li).textContent = "Gs. " + gs(it.p * it.q) + (it.q > 1 ? "  (" + it.q + " × " + gs(it.p) + ")" : "");
      $("output", li).textContent = it.q;
      $$("[data-d]", li).forEach(function (b) { b.addEventListener("click", function () { it.q = Math.max(1, Math.min(99, it.q + Number(b.getAttribute("data-d")))); keep(items); draw(); badge(); }); });
      $(".ci-del", li).addEventListener("click", function () { items = items.filter(function (x) { return x !== it; }); keep(items); draw(); badge(); });
      list.appendChild(li);
    });
    emptyBox.hidden = items.length > 0;
    tot.textContent = "Gs. " + gs(total());
    $(".cart-ft", dr).hidden = !items.length && step === 1;
  }
  function show(s) {
    step = s;
    $$(".cart-body", dr).forEach(function (b) { b.hidden = Number(b.getAttribute("data-step")) !== s; });
    $$(".cart-steps li", dr).forEach(function (li) { li.classList.toggle("on", Number(li.getAttribute("data-s")) <= s); });
    go.hidden = s === 3; back.hidden = s !== 2;
    go.firstChild.textContent = s === 1 ? "Finalizar compra " : "Confirmar pedido ";
    $(".cart-tot", dr).hidden = s === 3;
    $("#cart-h").textContent = s === 3 ? "Pedido recibido" : s === 2 ? "Tus datos" : "Tu carrito";
    draw();
  }
  function open() {
    lastFocus = document.activeElement; dr.hidden = false; show(step === 3 ? 1 : step);
    requestAnimationFrame(function () { dr.classList.add("on"); });
    document.documentElement.classList.add("cart-lock");
    setTimeout(function () { var x = $(".cart-x", dr); if (x) x.focus(); }, 60);
  }
  function close() {
    dr.classList.remove("on"); document.documentElement.classList.remove("cart-lock");
    setTimeout(function () { dr.hidden = true; if (step === 3) show(1); }, 300);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  $$("[data-close]", dr).forEach(function (b) { b.addEventListener("click", close); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !dr.hidden) close(); });
  $$("#cart-btn").forEach(function (b) { b.addEventListener("click", open); });
  back.addEventListener("click", function () { show(1); });
  $$(".cart-form input", dr).forEach(function (i) { i.addEventListener("input", function () { i.parentElement.classList.remove("bad"); }); });
  $$("input[name=k-ent]", dr).forEach(function (r) { r.addEventListener("change", function () { $(".k-city", dr).hidden = r.value !== "Envío" || !r.checked; }); });

  go.addEventListener("click", function () {
    if (step === 1) { if (items.length) show(2); return; }
    var ok = true, waOk = String($("#k-wa").value).replace(/\D/g, "").length >= 9;
    var nom = $("#k-nombre"), ent = ($("input[name=k-ent]:checked", dr) || {}).value, ciu = $("#k-ciudad");
    nom.parentElement.classList.toggle("bad", !nom.value.trim()); if (!nom.value.trim()) ok = false;
    $("#k-wa").parentElement.classList.toggle("bad", !waOk); if (!waOk) ok = false;
    var needCity = ent === "Envío" && !ciu.value.trim(); ciu.parentElement.classList.toggle("bad", needCity); if (needCity) ok = false;
    if (!ok) { var x = $(".f.bad input", dr); if (x) x.focus(); return; }
    var id = "P-" + Date.now().toString(36).slice(-5).toUpperCase();
    var order = { pedido: id, nombre: nom.value.trim(), whatsapp: $("#k-wa").value.trim(), entrega: ent + (ent === "Envío" ? ": " + ciu.value.trim() : ""), pago: $("#k-pago").value,
      items: items.map(function (i) { return { id: i.id, sku: i.sku, nombre: i.n, cantidad: i.q, precio: i.p }; }), total: total(), creado: new Date().toISOString() };
    var lines = order.items.map(function (i) { return "• " + i.cantidad + " × " + i.nombre + " — Gs. " + gs(i.precio * i.cantidad); }).join("\n");
    if (window.FoxLeads) window.FoxLeads.save({ nombre: order.nombre, whatsapp: order.whatsapp, rubro: "", fuente: "compra", nota: id + " · Gs. " + gs(order.total) + " · " + order.entrega + " · " + order.pago + " · " + order.items.map(function (i) { return i.cantidad + "× " + i.nombre; }).join(", ") });
    var ep = (CFG.tienda || {}).checkoutEndpoint;
    if (ep) { try { fetch(ep, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(order) }); } catch (e) {} }
    var W = (CFG.whatsapp || {}).ventas || {};
    var msg = "Hola, quiero confirmar el pedido " + id + ":\n" + lines + "\nTotal: Gs. " + gs(order.total) + "\nEntrega: " + order.entrega + "\nPago: " + order.pago + "\n" + order.nombre;
    $(".ok-id", dr).textContent = "Pedido " + id;
    $(".ok-p", dr).textContent = "Total Gs. " + gs(order.total) + ". Envialo por WhatsApp y un vendedor te confirma stock, envío y datos de pago.";
    var a = $(".ok-wa", dr); if (W.numero) { a.href = "https://wa.me/" + W.numero + "?text=" + encodeURIComponent(msg); a.hidden = false; } else a.hidden = true;
    items = []; keep(items); badge(); show(3);
  });

  window.FoxCart = {
    add: function (p) {
      var f = items.filter(function (i) { return i.id === p.id; })[0];
      if (f) f.q = Math.min(99, f.q + 1); else items.push({ id: p.id, n: p.n, p: p.p, img: p.img, sku: p.sku, q: 1 });
      keep(items); badge(true); if (!dr.hidden) draw();
    },
    open: open, count: count
  };
  window.addEventListener("storage", function (e) { if (e.key === KEY) { items = load(); badge(); if (!dr.hidden) draw(); } });
  badge();
})();
