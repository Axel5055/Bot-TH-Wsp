const sony = require("../../src/client");
const { MessageMedia } = require("whatsapp-web.js");
const th = require("consola");
const path = require("path");
const fs = require("fs");

// Lista de palabras clave y sus archivos de audio
const palabrasClave = ["suegra"]; // Agrega más palabras según necesites
const carpetaAudios = "./audios/"; // Ruta de la carpeta de audios

async function enviarAudio(message) {
    const lowercase = message.body.toLowerCase();

    try {
        // Buscar si alguna palabra clave está dentro del mensaje
        const palabraEncontrada = palabrasClave.find(palabra => lowercase.includes(palabra));

        if (palabraEncontrada) {
            const archivoAudio = path.join(carpetaAudios, `${palabraEncontrada}.mp3`);

            // Verificar si el archivo existe
            if (fs.existsSync(archivoAudio)) {
                const audio = MessageMedia.fromFilePath(archivoAudio);
                await sony.sendMessage(message.from, audio, { sendAudioAsVoice: true });
            } else {
                th.warn(`⚠️ No se encontró el archivo: ${archivoAudio}`);
            }
        }
    } catch (error) {
        th.warn(`⚠️ Error al enviar el audio para el mensaje: "${message.body}"`);
    }
}

module.exports = enviarAudio;
