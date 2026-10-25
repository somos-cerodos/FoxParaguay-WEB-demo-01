FOXPARAGUAY — DEMO DE SITIO WEB (01)
====================================

Maqueta multipágina para validar con FoxParaguay el brief de Cerodos
(Fox_Brief_Web_para_Mariano.pdf, 24/10/2026). Sitio estático: sin backend,
sin framework, sin build. Solo HTML, CSS y JavaScript, con rutas relativas.

Este repositorio es un prototipo aparte. No toca el sitio actual de
foxparaguay.com.py.


CÓMO PROBAR EN WEB Y MOBILE
---------------------------

En el navegador de la PC (lo más simple)
  Doble clic en index.html. Se abre en Chrome, Edge o Firefox y se navega
  entre todas las páginas sin instalar nada. Los enlaces apuntan a
  index.html de forma explícita justamente para que esto funcione.

En el navegador del celular
  El celular no puede abrir archivos de la PC, así que la PC tiene que
  servir la carpeta:
  1. Doble clic en probar-local.bat (necesita Python: python.org, marcar
     "Add Python to PATH" al instalar).
  2. En la PC también queda en http://localhost:8000
  3. En el celular, con el mismo Wi-Fi: http://<IPv4 de la PC>:8000
     La IPv4 aparece en la ventana negra al arrancar (por ejemplo
     192.168.0.15). Si Windows pregunta por el firewall, permitir en
     "Redes privadas".

  Sin Python: arrastrar la carpeta entera a https://app.netlify.com/drop
  da una dirección pública temporal que abre en cualquier celular.

Qué revisar
  · Inicio en el celular: hero, selector "¿Cuál es tu rubro?", tienda.
  · Zoom con dos dedos (el viewport no lo bloquea).
  · Cupón de demo: completar y enviar. El pedido aparece en leads-demo/.
  · Chat: tocar "Tengo una farmacia" y seguir los pasos hasta el final.
    El pedido queda en leads-demo/ con fuente "Chat".
  · Botones de WhatsApp de ventas y soporte.

Ojo: en modo demo cada navegador guarda sus propios pedidos
(localStorage). Lo que se carga desde el celular se ve en leads-demo/ del
celular, no en el de la PC.


MAPA DEL SITIO
--------------

index.html                         Inicio (software primero, tienda después)
sistemas/index.html                Sistemas por rubro + selector de rubro
sistemas/farmafox.html             FarmaFox, sistema para farmacias
facturacion-electronica/index.html Facturación electrónica SIFEN
demo/index.html                    Pedí tu demo (cupón + descarga)
tienda/index.html                  Tienda: 19 categorías (las 15 de la tienda
                                   actual + punto de venta), 84 productos,
                                   enlace por categoría (#c=impresoras)
contacto/index.html                Contacto: primero el chat de atención (24/7),
                                   después canales y redes, y el mapa
agente/index.html                  Asistente: el webchat como página, para
                                   conversar con el agente de FoxParaguay
soporte/index.html                 Soporte para clientes (AnyDesk, canales)
leads-demo/index.html              Panel de pedidos de la maqueta. noindex.

assets/css/fox.css                 Hoja única, mobile first.
assets/js/fox.js                   JavaScript compartido por todas las páginas.
assets/js/fox-motion.js            Fondos animados, entrada de textos, cursor.
assets/js/productos.js             Catálogo de la tienda (generado).
assets/js/tienda.js                Filtros, búsqueda y ficha de la tienda.
assets/js/cart.js                  Carrito (todas las páginas) y finalizar compra.
assets/js/fox-config.js            Números, destino de formularios, chat y
                                   descarga. Es el único lugar donde están.
assets/img/logo/                   Logo color y negativo (de la extracción).
assets/img/marcas/                 FarmaFox y PuntoShop (originales); VeterFox y
                                   MotorFox (nuevos, misma familia: SVG).
assets/img/capturas/               Pantallas reales de los sistemas.
assets/img/fotos/                  Foto del farmacéutico del sitio actual.
assets/img/productos/              Productos de la tienda con stock.
assets/img/icons/                  Favicon PNG, icono 192 y apple-touch-icon,
                                   hechos con el isotipo flecha.
assets/img/og-foxparaguay.jpg      Imagen para compartir (1200 × 630).
favicon.ico                        16, 32 y 48 px.

_partials.html                     Referencia del header, el footer y el chat.
                                   NO es una página del sitio.
probar-local.bat                   Servidor local para PC y celular.


CONVENCIONES
------------

Rutas
  Siempre relativas. Desde la raíz: assets/… y sistemas/…
  Desde una página de nivel 1: ../assets/… y ../sistemas/…
  Los enlaces apuntan a index.html de forma explícita (soporte/index.html),
  para que el sitio funcione abierto con doble clic. Si después se publica
  con nginx y URLs limpias, se puede volver a soporte/.
  <body data-root="./"> o "../" le dice a fox.js dónde está la raíz.

Profundidad
  Máximo un nivel de carpetas.

Header, footer y chat
  Duplicados en cada página a propósito. La referencia es _partials.html:
  si cambian, se actualiza primero ese archivo y después las diez páginas.

Metadatos
  Cada página tiene su <title>, meta description, canonical, Open Graph,
  lang="es-PY", favicon y un único H1. JSON-LD: LocalBusiness en todas y
  SoftwareApplication en FarmaFox. Sin noindex, salvo leads-demo/.

CSS
  Una sola hoja, mobile first. Corte principal en 900 px, más 640 y 1024
  para la grilla de sistemas. Tokens en :root (papel, tinta, fox, tostado,
  carbón). Texto sobre naranja siempre en carbón (7,7:1); blanco sobre
  naranja no pasa contraste.

JavaScript
  fox.js se carga en todas las páginas. Cada módulo se auto-protege: si su
  HTML no está en la página, no hace nada. Módulos: menú móvil, WhatsApp,
  descarga de la demo, selector de rubro, pedidos de demo, chat y panel.

Fondo y bloques
  Un solo fondo animado (líneas en canvas, .pagebg) fijo detrás de toda la
  página; cambia de ondulación según la página. La información va en
  bloques translúcidos (cada .gut > .max) y el encabezado es de vidrio.
  Tres niveles de vidrio según la información del bloque: liviano
  (encabezados, hero, cifras), normal (lectura) y denso (formularios,
  tienda, chat). Tarjetas internas en blanco translúcido; campos, botones,
  mockups y documentos de ejemplo quedan sólidos.
  Sin migas de pan.

Versión de caché
  Los <link> y <script> llevan ?v=20261024. Al cambiar fox-config.js o
  fox.js, subir esa fecha en las diez páginas.


CONTACTO Y CANALES
------------------

Todo en assets/js/fox-config.js:

  whatsapp.ventas    595984112789 (+595 984 112 789)
  whatsapp.soporte   VACÍO. El brief pide separar ventas y soporte; falta
                     que FoxParaguay defina el número. Vacío = la web
                     muestra "Número a confirmar" sin romperse.
  descargas.demo     VACÍO. Enlace https al instalador. Vacío = el botón
                     "Descargar la demo" pide el enlace por WhatsApp.

Todo elemento con data-whatsapp="ventas" o "soporte" toma el enlace de ahí.
Con data-whatsapp-num además muestra el número formateado.


FORMULARIOS Y CRM
-----------------

El cupón de demo pide nombre, negocio, rubro, ciudad y WhatsApp. El rubro
se precarga con ?rubro= (por ejemplo demo/?rubro=farmacia) o desde el
selector del Inicio.

Modo demo (leads.endpoint vacío)
  El pedido se guarda en localStorage del navegador (clave fox_leads_demo)
  y se ve en leads-demo/: filtros por estado, nota interna, descarga CSV y
  borrado con doble toque.

Modo conectado (leads.endpoint con una URL)
  Además de guardarlo, fox.js hace POST JSON a esa URL con:
  nombre, negocio, rubro, ciudad, whatsapp, origen, fuente, nota, estado,
  creado.
  Esa URL tiene que ser NUESTRA (por ejemplo un webhook de n8n o una
  función serverless) y desde el servidor reenviar a
  POST /api/v1/leads del CRM de Cerodos. El token del CRM nunca va en el
  navegador ni en este repositorio.


CHAT Y WHATSAPP
---------------

Igual que en la web de Cerodos:
  · Botón verde de WhatsApp abajo a la derecha, en todas las páginas
    (menos el panel de pedidos). Toma el número de whatsapp.ventas.
  · Asistente abajo a la izquierda, para que no se tapen.
  · agente/ es el chat como página: el chat ocupa la pantalla, el botón
    flotante del asistente no aparece ahí para no abrir dos charlas.

Qué asistente se usa, en este orden (assets/js/fox-config.js, chat):

  1. chat.conversa.websiteToken cargado → el agente de IA de FoxParaguay
     en Cerodos Conversa. En todas las páginas carga la burbuja del
     widget a la izquierda ("Consultá a nuestro asistente"), y en agente/
     el mismo widget embebido, abierto directo en el formulario para
     escribir de entrada. Las consultas caen en la bandeja de Conversa,
     junto con WhatsApp, Instagram y Messenger. Para obtener el token:
     en Conversa, crear la bandeja "FoxParaguay Web" (tipo sitio web) y
     copiar el website_token del código de instalación.
  2. chat.iframeUrl cargado (y sin token) → la URL pública de un chat de
     otra plataforma (Dify, Apibot) dentro del panel y de agente/.
  3. Nada cargado → asistente guiado local, sin IA: detecta el rubro
     ("tengo una farmacia"), recomienda el sistema, ofrece la demo y pide
     nombre, negocio, ciudad y WhatsApp. Guarda el pedido igual que el
     formulario, con fuente "chat". En agente/ se marca "Modo demo".

Al cambiar el token subir la versión ?v= de los scripts (ver Versión de
caché).


SOPORTE: LLAVE DEL AGENTE (PARA TONY)
-------------------------------------

soporte/ está pensada para clientes: abrir tickets por el WhatsApp de
soporte, no para ventas. Todo se conecta en assets/js/fox-config.js:

  whatsapp.soporte.numero    WhatsApp donde atiende el agente de soporte.
                             Vacío = la página muestra "Número a confirmar"
                             y el ticket queda guardado en leads-demo/.
  soporte.ticketsEndpoint    URL que recibe cada ticket en JSON:
                             ticket, nombre, negocio, sistema, problema,
                             descripcion, urgencia, creado.
  soporte.agente             Webchat del agente de soporte (websiteToken de
                             Conversa o iframeUrl). Con datos aparece la
                             sección "Chat con soporte" en soporte/.

El formulario genera un número de ticket (T-AAMMDD-XXXX) y arma el mensaje
de WhatsApp con sistema, problema, descripción y urgencia.


CONTACTO: CHAT DE ATENCIÓN
--------------------------

contacto/ abre con la ventana de chat de atención (abierta 24/7) como
primer bloque. Debajo: WhatsApp, teléfono, correo, soporte y redes;
al final, el mapa. Sin formulario de mensaje.
Usa chat.atencion (websiteToken de Conversa o iframeUrl). Vacío = usa el
agente general (chat.conversa) o, si tampoco hay, el asistente local.


VIDEOS DEMO
-----------

En el Inicio, cada sistema tiene "Ver video demo". Los enlaces de YouTube
se pegan en assets/js/fox-config.js, videos (farmafox, puntoshop, veterfox,
motorfox). El video se abre en una ventana sobre la página. Vacío = aviso
de "video en preparación" con acceso a pedir la demo de ese sistema.


TIENDA Y CARRITO
----------------

Categorías plegables por grupo (Punto de venta, Computación, Accesorios y
redes). Cada producto tiene "Agregar" (carrito) y consulta por WhatsApp.
El carrito vive en el navegador y está en todas las páginas (ícono del
encabezado). Finalizar compra: datos, entrega y forma de pago; genera el
pedido P-XXXXX, lo guarda en leads-demo/ y lo envía por WhatsApp de ventas.
tienda.checkoutEndpoint: URL que recibe el pedido en JSON, para conectar
una pasarela de pago. No se cobra nada en la demo.


MEDICIÓN
--------

fox.js define window.foxTrackLead(rubro): si existe window.fbq dispara
fbq('track', 'Lead'). Falta pegar el código base del Meta Pixel en el
<head> de cada página (hay un comentario marcando el lugar) y armar la
Conversions API del lado del servidor, en el mismo webhook de los leads.


PENDIENTES CON FOXPARAGUAY
--------------------------

· Número de WhatsApp de soporte.
· Enlace https del instalador de la demo.
· Logos de clientes para la cinta del Inicio (nombre, rubro, ciudad y logo,
  con permiso de cada cliente). El sitio actual no publica ninguno. Se
  cargan en fox-config.js, clientes; los archivos van en
  assets/img/clientes/. Mientras tanto la cinta muestra espacios
  reservados por rubro.
· Testimonios con nombre, negocio y ciudad (priorizando farmacias). El
  sitio actual no publica ninguno; la sección "Lo que dicen nuestros
  clientes" usa lo que FoxParaguay sí publica: 100 % de recomendación en
  Facebook (7 opiniones), 260+ clientes, 180 farmacias, y enlaza a las
  opiniones de Facebook y a las reseñas de Google. Cuando lleguen citas
  reales, se suman ahí.
· Aprobar los logos nuevos de VeterFox y MotorFox.
· Enlaces de YouTube de los videos demo de FarmaFox, PuntoShop, VeterFox
  y MotorFox (fox-config.js, videos).
· ID del Meta Pixel y acceso para la Conversions API.
· URL del widget de Apibot / Dify.
· Confirmar precios y stock de la tienda (vienen de la extracción del
  24/10/2026).


PUBLICACIÓN
-----------

No hay build: lo que está en la carpeta es lo que se publica. Sirve
cualquier hosting estático. Antes de publicar, cargar fox-config.js y
quitar el enlace "Panel de pedidos (solo demo)" del pie.
