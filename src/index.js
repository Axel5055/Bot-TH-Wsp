// ===============================
// 📌 Dependencias principales
// ===============================
const qrcode = require('qrcode-terminal');
const moment = require('moment-timezone');

// 📌 Archivos locales
const comandos = require('./bot/comandos');
const logger = require('./commands/utils/logger'); // <-- Logger centralizado
const discord = require('./commands/discord');
const sony = require('./bot/client');
const traductor = require("./commands/traductor");

// ===============================
// 🎨 Estilos de consola centralizados
// ===============================
const log = {
    info: (msg) => logger.info(msg),
    success: (msg) => logger.success ? logger.success(msg) : logger.info(msg),
    warn: (msg) => logger.warn(msg),
    error: (msg) => logger.error(msg),
    banner: () => {
        logger.info(`
================================================
         🚀  TH PROJECT - WhatsApp Bot 🚀
================================================
        `);
    }
};

// ===============================
// 🌎 Función utilitaria de fecha y hora en MX
// ===============================
const getHourMX = () => moment().tz("America/Mexico_City").format('HH:mm:ss');

// ===============================
// 📌 Inicializar Discord (se llama solo una vez)
// ===============================
discord();

// ===============================
// 📌 Eventos del cliente WhatsApp
// ===============================

// 🔑 Autenticación exitosa
sony.on('authenticated', () => {
    log.success(`✅ Autenticado correctamente a las ${getHourMX()}`);
});

// 📲 Generar QR para iniciar sesión
sony.on("qr", qr => {
    log.banner();
    log.warn("⚠️ Escanea este QR con tu WhatsApp para iniciar sesión:");
    qrcode.generate(qr, { small: true });
    log.banner();
});

// ✅ Cliente listo para usarse
sony.on("ready", async () => {
    log.success(`🤖 Cliente activo y listo a las ${getHourMX()}`);
    
    // Ejecuta logs personalizados si existen
    if (typeof require('./utils/log') === 'function') {
        require('./utils/log')();
    }

    // Mensajes automáticos a números definidos
    const send_message = ["5538901631"];
    for (const number of send_message) {
        const chatId = `${number}@c.us`;
        const message = `*_Come at me_*!! \n⏰ Tiempo MX: ${getHourMX()}\n_Sr. Courtesy_`;

        try {
            await sony.sendMessage(chatId, message);
            log.success(`📩 Mensaje enviado a ${number}`);
        } catch (error) {
            log.error(`❌ Error al enviar mensaje a ${number}: ${error}`);
        }
    }

    traductor();
});

// ⏳ Pantalla de carga
sony.on('loading_screen', (percent, message) => {
    if (percent === 100) {
        log.success(`🔄 Carga completa. Iniciando: ${message}`);
    } else {
        log.info(`⏳ Cargando: ${percent}% - ${message}`);
    }
});

// 🌐 Estado de conexión
sony.on('change_state', state => {
    log.info(`🌍 Estado de conexión: ${state}`);
});

// ❌ Cliente desconectado y reconexión automática
sony.on('disconnected', (reason) => {
    log.error(`⚠️ Cliente desconectado: ${reason}`);
    log.warn("🔄 Intentando reiniciar en 5 segundos...");
    setTimeout(() => sony.initialize(), 5000);
});

// ===============================
// 🚀 Iniciar cliente
// ===============================
sony.initialize();
comandos(); // Carga comandos personalizado
