/* Configuración del sitio. Es el único lugar donde se escriben los números,
   el destino de los formularios y el chat externo. Ver README.txt, CONTACTO Y CANALES. */
window.FOX_CONFIG = {
  whatsapp: {
    /* Solo dígitos, formato internacional. 595 = Paraguay. */
    ventas:  { numero: "595984112789", mensaje: "Hola, te escribo desde la web de FoxParaguay." },
    /* Pendiente: el brief propone un número aparte para soporte. Vacío = se muestra "a confirmar". */
    soporte: { numero: "", mensaje: "Hola, soy cliente de FoxParaguay y necesito soporte." }
  },
  leads: {
    /* URL que recibe los pedidos de demo (por ejemplo un webhook de n8n que
       los reenvía al CRM de Cerodos desde el servidor). Vacío = modo demo:
       el pedido se guarda solo en este navegador y se ve en leads-demo/. */
    endpoint: ""
  },
  descargas: {
    /* Enlace https al instalador de la demo. Vacío = el botón pide el enlace por WhatsApp. */
    demo: ""
  },
  chat: {
    /* Agente de IA de FoxParaguay en Cerodos Conversa (igual que en la web de Cerodos).
       Con websiteToken cargado: burbuja del agente a la izquierda en todas las
       páginas y el chat embebido en agente/. Vacío = asistente guiado local, sin IA. */
    conversa: { baseUrl: "https://conversa.cerodos.com.ar", websiteToken: "" },
    /* Alternativa: URL pública de un chat de otra plataforma (Dify, Apibot).
       Se usa solo si no hay websiteToken. */
    iframeUrl: "",
    titulo: "Consultá a nuestro asistente",
    /* Agente de atención al cliente (ventana de chat de la página Contacto).
       Vacío = usa el mismo agente de arriba o, si tampoco hay, el asistente local. */
    atencion: { conversa: { baseUrl: "https://conversa.cerodos.com.ar", websiteToken: "" }, iframeUrl: "" }
  },
  soporte: {
    /* LLAVE DEL AGENTE DE SOPORTE (para Tony). El WhatsApp donde atiende el agente
       va en whatsapp.soporte.numero, arriba. Acá se conecta el resto:
       - ticketsEndpoint: URL que recibe cada ticket en JSON (CRM o mesa de ayuda).
         Vacío = el ticket queda en el panel de la demo y se envía por WhatsApp.
       - agente: webchat del agente de soporte. Con datos cargados aparece la sección
         "Chat con soporte" en soporte/. */
    ticketsEndpoint: "",
    agente: { conversa: { baseUrl: "https://conversa.cerodos.com.ar", websiteToken: "" }, iframeUrl: "" }
  },
  /* CLIENTES de la cinta "Lo que dicen nuestros clientes" del Inicio.
     Un elemento por empresa: nombre, rubro y ciudad (texto) y logo (ruta desde la
     raíz, por ejemplo "assets/img/clientes/farmacia-central.png"; fondo blanco o
     transparente, idealmente 320 × 160). Vacío = la cinta muestra espacios
     reservados por rubro. Publicar solo logos con permiso del cliente. */
  clientes: [
    /* { nombre: "Farmacia Central", rubro: "Farmacia", ciudad: "Asunción", logo: "assets/img/clientes/farmacia-central.png" }, */
  ],
  /* VIDEOS DEMO de cada sistema en YouTube (botón "Ver video demo" del Inicio).
     Pegar el enlace del video tal cual (https://youtu.be/… o https://www.youtube.com/watch?v=…).
     Vacío = el botón abre un aviso de "video en preparación" con acceso a pedir la demo. */
  videos: {
    farmafox: "",
    puntoshop: "",
    veterfox: "",
    motorfox: ""
  },
  tienda: {
    /* URL que recibe cada pedido del carrito en JSON (por ejemplo, para crear el cobro
       en una pasarela de pago). Vacío = el pedido se guarda en el panel y se envía por WhatsApp. */
    checkoutEndpoint: ""
  }
};
