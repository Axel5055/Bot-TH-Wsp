const sony = require("../src/client");
const { MessageMedia } = require("whatsapp-web.js");
const th = require("consola");
const path = require("path");
const fs = require("fs");

// Listas de palabras clave
const palabrasClaveIncluidas = ["suegra", "boo", "queman", "cariñosas", "dejen dormir", "r4", "mucho mensaje" , "borojojo", "no te vallas"];
const palabrasClaveExactas = ["alv", "putos", "jijiji", "abuela", "maldita fdg", "hdp"]; // Define las palabras clave exactas
const carpetaAudios = "./audios/";

async function enviarAudio(message) {
    const lowercase = message.body.toLowerCase().trim();

    try {
        let palabraEncontrada = null;
        
        // Buscar si el mensaje es exactamente una de las palabras clave exactas
        if (palabrasClaveExactas.includes(lowercase)) {
            palabraEncontrada = lowercase;
        } else {
            // Buscar si alguna palabra clave está dentro del mensaje
            palabraEncontrada = palabrasClaveIncluidas.find(palabra => lowercase.includes(palabra));
        }

        if (palabraEncontrada) {
            const archivoAudio = path.join(carpetaAudios, `${palabraEncontrada}.mp3`);

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
