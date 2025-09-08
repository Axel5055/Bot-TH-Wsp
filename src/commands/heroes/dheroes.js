const sony = require("../../bot/client");
const { MessageMedia } = require("whatsapp-web.js");
const logger = require("../utils/logger");
const path = require("path");
const fs = require("fs");

const MEDIA_PATH = path.resolve("./src/assets/img/heroes/dheroes.jpeg");
const CAPTION = `*🐝 ¡Héroes de Fortaleza! 🏹✨*

💥 Aquí tienes a qué tipo pertenece cada héroe en las fortalezas 💥

🅣🅗 ​ - ​ 🅑🅞🅣`;

// Función para cargar la imagen de forma segura
function loadMedia(filePath) {
    if (!fs.existsSync(filePath)) {
        logger.warn(`⚠️ No se encontró el archivo de imagen: ${filePath}`);
        return null;
    }
    return MessageMedia.fromFilePath(filePath);
}

async function dheroes(message) {
    try {
        const body = message.body?.toLowerCase().trim();
        if (body !== "/dheroes") return;

        const media = loadMedia(MEDIA_PATH);

        if (media) {
            await sony.sendMessage(message.from, media, { caption: CAPTION });
            logger.success(`✅ Enviado mensaje /dheroes a ${message.from}`);
        } else {
            await sony.sendMessage(message.from, CAPTION);
            logger.warn(`⚠️ Se envió solo el texto de /dheroes, imagen no encontrada.`);
        }
    } catch (error) {
        logger.error("❌ Error en el comando /dheroes:", error);
        await sony.sendMessage(message.from, "*⚠️ Ocurrió un error al enviar la alineación. Intenta nuevamente.*");
    }
}

module.exports = dheroes;
