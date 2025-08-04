const sony = require("../../bot/client");
const th = require("consola");
const path = require("path");
const { MessageMedia } = require("whatsapp-web.js");
const fs = require("fs");

async function topGays(message) {
    try {
        const lowercase = message.body.toLowerCase();

        if (lowercase.startsWith('/topgay')) {
            const chat = await sony.getChatById(message.from);

            if (!chat.isGroup) {
                return sony.sendMessage(message.from, '*⚠️ Este comando solo puede usarse en grupos.*');
            }

            const participantes = chat.participants;

            // Crear lista de contactos con nombre y contacto
            const miembros = await Promise.all(participantes.map(async (p) => {
                const contacto = await sony.getContactById(p.id._serialized);
                return {
                    contacto,
                    nombre: contacto.pushname || contacto.name || contacto.number || 'Desconocido',
                };
            }));

            // Mezclar aleatoriamente y seleccionar top 10
            const mezclados = miembros.sort(() => 0.5 - Math.random()).slice(0, 10);

            const medallas = ['🌈🥇', '🌈🥈', '🌈🥉', '🌈🏅', '🌈🏅', '🌈🏅', '🌈🏅', '🌈🏅', '🌈🏅', '🌈🏅'];

            let response = `🌈 *TOP 10 MÁS GAY DEL GRUPO* 🌈\n\n`;
            response += `Según estudios muy serios... estos son los más gay esta semana 🏳️‍🌈😂\n\n`;

            const mentions = [];

            mezclados.forEach((item, index) => {
                response += `${index + 1}. ${medallas[index]} *@${item.contacto.number}*\n`;
                mentions.push(item.contacto); // Agregar contacto a la lista de menciones
            });

            response += `\n🏳️‍🌈 Esto fue calculado científicamente por la *Gay Machine 3000™*.\n\n🅣🅗 ​ - ​ 🅑🅞🅣`;

            await sony.sendMessage(message.from, response, {
                mentions: mentions
            });

             // 👉 Enviar audio "gay.mp3"
            const carpetaAudios = "./src/assets/audios";
            const audioPath = path.join(carpetaAudios, "gay.mp3");
            if (fs.existsSync(audioPath)) {
                const audio = await MessageMedia.fromFilePath(audioPath);
                await sony.sendMessage(message.from, audio, { sendAudioAsVoice: true }); // true = nota de voz, false = audio normal
            } else {
                th.warn('⚠️ El archivo amor.mp3 no se encontró en la carpeta audios.');
            }
        }
    } catch (error) {
        th.warn('⚠️ Error al generar el Top Gay:', error);
        await sony.sendMessage(
            message.from,
            '*⚠️ Ocurrió un error al procesar el comando. Intenta nuevamente.*'
        );
    }
}

module.exports = topGays;
