const { MessageMedia } = require("whatsapp-web.js");
const hispamemes = require("hispamemes");
const logger = require("../utils/logger");

/**
 * Maneja el comando !meme
 * @param {import("whatsapp-web.js").Message} message
 */
async function meme(message) {
    try {
        if (!message.body) return;

        const command = message.body.toLowerCase().trim();
        if (command !== "meme") return; // salir si no es el comando exacto

        const chat = await message.getChat();

        // Obtener meme
        let memeUrl;
        try {
            memeUrl = hispamemes.meme();

            // Validar que la URL sea de imagen
            const validUrl = /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i.test(memeUrl);
            if (!memeUrl || !validUrl) {
                throw new Error("URL de meme no válida");
            }
        } catch (err) {
            logger.warn("⚠️ No se pudo generar un meme válido:", err.message);
            await message.reply("❌ No pude conseguir un meme ahora mismo, inténtalo más tarde 🪷");
            return;
        }

        // Convertir a media de WhatsApp
        try {
            const media = await MessageMedia.fromUrl(memeUrl, { unsafeMime: true });
            await chat.sendMessage(media);
            logger.success(`✅ Meme enviado: ${memeUrl}`);
        } catch (err) {
            logger.error("❌ Error al enviar el meme:", err.message);
            await message.reply("⚠️ Hubo un problema enviando el meme. Intenta otra vez 🙏");
        }
    } catch (error) {
        // Captura errores inesperados
        logger.error("🔥 Error inesperado en el comando meme:", error);
    }
}

module.exports = meme;
