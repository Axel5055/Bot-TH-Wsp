const sony = require("../../bot/client");
const th = require("consola");
const path = require("path");
const fs = require("fs");
const { MessageMedia } = require("whatsapp-web.js");

async function pareja(message) {
    try {
        const lowercase = message.body.toLowerCase();

        if (lowercase.startsWith('/pareja')) {
            const chat = await sony.getChatById(message.from);

            if (!chat.isGroup) {
                return sony.sendMessage(message.from, '*⚠️ Este comando solo puede usarse en grupos.*');
            }

            const participantes = chat.participants;

            const miembros = await Promise.all(participantes.map(async (p) => {
                const contacto = await sony.getContactById(p.id._serialized);
                return {
                    contacto,
                    nombre: contacto.pushname || contacto.name || contacto.number || 'Desconocido',
                    numero: contacto.number,
                };
            }));

            if (miembros.length < 2) {
                return sony.sendMessage(message.from, '*⚠️ No hay suficientes miembros para formar una pareja.*');
            }

            const mezclados = miembros.sort(() => 0.5 - Math.random());
            const pareja = mezclados.slice(0, 2);

            const response = `💘 *¡Tenemos una nueva pareja del grupo!* 💘\n\n` +
                `✨ Según el destino... hoy el amor ha unido a:\n\n` +
                `❤️ *@${pareja[0].numero}* + *@${pareja[1].numero}*\n\n` +
                `💞 ¡Que viva el amor! 💞\n\n🅣🅗 ​ - ​ 🅑🅞🅣`;

            await sony.sendMessage(message.from, response, {
                mentions: pareja.map(p => p.contacto)
            });

            // 👉 Enviar audio "amor.mp3"
            const carpetaAudios = "./src/assets/audios";
            const audioPath = path.join(carpetaAudios, "amor.mp3");
            if (fs.existsSync(audioPath)) {
                const audio = await MessageMedia.fromFilePath(audioPath);
                await sony.sendMessage(message.from, audio, { sendAudioAsVoice: true }); // true = nota de voz, false = audio normal
            } else {
                th.warn('⚠️ El archivo amor.mp3 no se encontró en la carpeta audios.');
            }
        }
    } catch (error) {
        th.warn('⚠️ Error al generar la pareja:', error);
        await sony.sendMessage(
            message.from,
            '*⚠️ Ocurrió un error al procesar el comando. Intenta nuevamente.*'
        );
    }
}

module.exports = pareja;
