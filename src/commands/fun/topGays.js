const sony = require("../../bot/client");
const path = require("path");
const fs = require("fs");
const { MessageMedia } = require("whatsapp-web.js");
const logger = require("../utils/logger");

const carpetaAudios = path.resolve("./src/assets/audios");
const audioTopGay = path.join(carpetaAudios, "gay.mp3");

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

function seleccionarTop(miembros, cantidad = 10) {
    const mezclados = [...miembros].sort(() => 0.5 - Math.random());
    return mezclados.slice(0, cantidad);
}

async function topGays(message) {
    try {
        const body = message.body?.toLowerCase().trim();
        if (!body || !body.startsWith("/topgay")) return;

        const chat = await sony.getChatById(message.from);

        if (!chat.isGroup) {
            return sony.sendMessage(message.from, "⚠️ *Este comando solo puede usarse en grupos.*");
        }

        const miembros = await obtenerMiembros(chat);

        if (miembros.length < 2) {
            return sony.sendMessage(message.from, "⚠️ *No hay suficientes miembros para generar un Top.*");
        }

        const seleccionados = seleccionarTop(miembros, 10);

        const medallas = [
            "🌈🥇", "🌈🥈", "🌈🥉",
            "🌈🏅", "🌈🏅", "🌈🏅",
            "🌈🏅", "🌈🏅", "🌈🏅", "🌈🏅"
        ];

        let response = `🌈 *TOP 10 MÁS GAY DEL GRUPO* 🌈\n\n`;
        response += `📊 Según estudios muy serios... estos son los más gay esta semana 🏳️‍🌈😂\n\n`;

        const mentions = [];

        seleccionados.forEach((item, index) => {
            response += `${index + 1}. ${medallas[index]} *@${item.numero}*\n`;
            mentions.push(item.contacto);
        });

        response += `\n🏳️‍🌈 Esto fue calculado científicamente por la *Gay Machine 3000™*.\n\n🅣🅗 ​- ​🅑🅞🅣`;

        await sony.sendMessage(message.from, response, { mentions });

        // 🎵 Enviar audio extra si existe
        if (fs.existsSync(audioTopGay)) {
            const audio = await MessageMedia.fromFilePath(audioTopGay);
            await sony.sendMessage(message.from, audio, { sendAudioAsVoice: true });
        } else {
            logger.warn("⚠️ El archivo gay.mp3 no se encontró en la carpeta audios.");
        }
    } catch (error) {
        logger.error("❌ Error al generar el Top Gay:", error);
        await sony.sendMessage(
            message.from,
            "⚠️ *Ocurrió un error al procesar el comando. Intenta nuevamente.*"
        );
    }
}

module.exports = topGays;
