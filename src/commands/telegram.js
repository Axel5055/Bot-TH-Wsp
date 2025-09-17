require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const sony = require('../bot/client'); // tu cliente de WhatsApp
const fs = require('fs');
const { MessageMedia } = require('whatsapp-web.js');

// 🔧 Utils y Config
const logger = require('./utils/logger');
const { traducirManual, capitalizar } = require('./utils/traducciones');
const { getImagenPath } = require('./config/imagenes');

// 🔐 Variables de entorno
const {
    TELEGRAM_BOT_TOKEN,
    TELEGRAM_GROUP_ID,
    WHATSAPP_GROUP_ID,
    TELEGRAM_CHANNEL_ID
} = process.env;

if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_GROUP_ID || !WHATSAPP_GROUP_ID || !TELEGRAM_CHANNEL_ID) {
    logger.error("❌ Faltan variables de entorno requeridas. Revisa tu archivo .env");
    process.exit(1);
}

// 🤖 Cliente de Telegram
const telegramBot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

// 📲 Enviar mensaje/imagen a WhatsApp
async function enviarAlertaWhatsApp(tipoTraducido, requisitoTraducido, mensajeTexto, tipoImagen, incluirMedalla = false) {
    let mensaje = `🌐 ${tipoTraducido} 🌐
📌 *Requisito*: ${requisitoTraducido}
🎖️ *Recompensa*: ${incluirMedalla ? 'Medalla de ' : ''}${tipoTraducido}
⏳ *Quedan*: 59 minutos

🅣🅗 ​ - ​ 🅑🅞🅣`;

    try {
        const imagen = getImagenPath(tipoImagen.toLowerCase());
        if (imagen && fs.existsSync(imagen)) {
            const media = await MessageMedia.fromFilePath(imagen);
            await sony.sendMessage(WHATSAPP_GROUP_ID, media, { caption: mensaje });
            logger.success(`✅ Imagen de ${tipoImagen} enviada con mensaje.`);
        } else {
            await sony.sendMessage(WHATSAPP_GROUP_ID, mensaje);
            logger.success(`✅ Mensaje de ${tipoImagen} enviado sin imagen.`);
        }
    } catch (err) {
        logger.error(`❌ Error al enviar mensaje de ${tipoImagen}: ${err.message}`);
    }
}

// 📡 Inicialización del bot de Telegram
function telegram() {
    if (global.telegramBotInitialized) return;
    global.telegramBotInitialized = true;

    telegramBot.on('message', async (msg) => {
        const chatId = msg.chat.id.toString();
        if (!msg.text) return;

        const lineas = msg.text.split('\n').map(l => l.trim()).filter(Boolean);
        if (lineas.length === 0) return;

        // 🔹 Quita números entre paréntesis y traduce todas las partes de la primera línea
        const primeraLinea = lineas[0].replace(/\([^\)]*\)/g, '').trim();
        const requisitosTraducidos = traducirManual(primeraLinea).map(capitalizar);
        const requisitoTraducido = requisitosTraducidos.join(' | ');

        // 🔹 Alertas específicas según palabras clave
        const alertas = [
            { palabra: 'watcher', imagen: 'watcher', incluirMedalla: true },
            { palabra: 'chaos dragon', imagen: 'chaos_dragon', incluirMedalla: true },
            { palabra: 'ancient core', imagen: 'ancient_core', incluirMedalla: false },
            { palabra: 'bright talent orb', imagen: 'bright_talent_orb', incluirMedalla: false }
            // Agrega más alertas si quieres
        ];

        const content = msg.text.toLowerCase();
        for (const alerta of alertas) {
            if (content.includes(alerta.palabra)) {
                // 🔹 Tipo traducido por defecto
                let tipoTraducido = capitalizar(traducirManual(alerta.imagen)[0]);
                let tipoImagen = alerta.imagen;

                // 🔹 Condición especial: Bright Talent Orb + Ancient Core
                if (content.includes('bright talent orb') && content.includes('ancient core')) {
                    tipoTraducido = `${capitalizar(traducirManual('bright_talent_orb')[0])} | ${capitalizar(traducirManual('ancient_core')[0])}`;
                    tipoImagen = 'bright_talent_orb'; // solo enviamos la imagen de Bright Talent Orb
                }else if(content.includes('brilliant talent orb') && content.includes('ancient core')){
                    tipoTraducido = `${capitalizar(traducirManual('brilliant_talent_orb')[0])} | ${capitalizar(traducirManual('ancient_core')[0])}`;
                    tipoImagen = 'brilliant_talent_orb'; // solo enviamos la imagen de Bright Talent Orb
                }

                await enviarAlertaWhatsApp(
                    tipoTraducido,
                    requisitoTraducido,
                    msg.text,
                    tipoImagen,
                    alerta.incluirMedalla
                );

                // Reenvío si viene del canal externo
                if (chatId === TELEGRAM_CHANNEL_ID) {
                    await telegramBot.sendMessage(TELEGRAM_GROUP_ID, msg.text);
                    logger.info(`[Telegram] Mensaje del canal reenviado al grupo y enviado a WhatsApp.`);
                } else if (chatId === TELEGRAM_GROUP_ID) {
                    logger.info(`[Telegram] Mensaje del grupo privado detectado y enviado a WhatsApp.`);
                }
                break; // solo una alerta por mensaje
            }
        }
    });

    logger.success(`🤖 Bot de Telegram escuchando en grupo ${TELEGRAM_GROUP_ID} y canal ${TELEGRAM_CHANNEL_ID}`);
}

module.exports = telegram;
