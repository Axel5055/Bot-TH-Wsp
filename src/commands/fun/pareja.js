const sony = require("../../bot/client");
const path = require("path");
const fs = require("fs");
const { MessageMedia } = require("whatsapp-web.js");
const logger = require("../utils/logger");

const carpetaAudios = path.resolve("./src/assets/audios");
const audioPareja = path.join(carpetaAudios, "amor.mp3");

/**
 * Devuelve los miembros de un grupo con sus datos normalizados
 */
async function obtenerMiembros(chat) {
    const participantes = chat.participants;

    return Promise.all(
        participantes.map(async (p) => {
            const contacto = await sony.getContactById(p.id._serialized);
            return {
                contacto,
                nombre: contacto.pushname || contacto.name || contacto.number || "Desconocido",
                numero: contacto.number,
            };
        })
    );
}

/**
 * Selecciona aleatoriamente 2 miembros de un array
 */
function seleccionarPareja(miembros) {
    const mezclados = [...miembros].sort(() => 0.5 - Math.random());
    return mezclados.slice(0, 2);
}

async function pareja(message) {
    try {
        const body = message.body?.toLowerCase().trim();
        if (!body || !body.startsWith("/pareja")) return;

        const chat = await sony.getChatById(message.from);

        if (!chat.isGroup) {
            return sony.sendMessage(message.from, "⚠️ *Este comando solo puede usarse en grupos.*");
        }

        const miembros = await obtenerMiembros(chat);

        if (miembros.length < 2) {
            return sony.sendMessage(message.from, "⚠️ *No hay suficientes miembros para formar una pareja.*");
        }

        const parejaSeleccionada = seleccionarPareja(miembros);

        const response =
            `💘 *¡Tenemos una nueva pareja del grupo!* 💘\n\n` +
            `✨ Según el destino... hoy el amor ha unido a:\n\n` +
            `❤️ *@${parejaSeleccionada[0].numero}* + *@${parejaSeleccionada[1].numero}*\n\n` +
            `💞 ¡Que viva el amor! 💞\n\n🅣🅗 ​ - ​ 🅑🅞🅣`;

        await sony.sendMessage(message.from, response, {
            mentions: parejaSeleccionada.map((p) => p.contacto),
        });

        // 🎵 Enviar audio extra si existe
        if (fs.existsSync(audioPareja)) {
            const audio = await MessageMedia.fromFilePath(audioPareja);
            await sony.sendMessage(message.from, audio, { sendAudioAsVoice: true });
        } else {
            logger.warn("⚠️ El archivo amor.mp3 no se encontró en la carpeta audios.");
        }
    } catch (error) {
        logger.error("❌ Error al generar la pareja:", error);
        await sony.sendMessage(
            message.from,
            "⚠️ *Ocurrió un error al procesar el comando. Intenta nuevamente.*"
        );
    }
}

module.exports = pareja;
