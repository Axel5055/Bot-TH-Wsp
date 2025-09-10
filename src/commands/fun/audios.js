const sony = require("../../bot/client");
const { MessageMedia } = require("whatsapp-web.js");
const fs = require("fs").promises;
const path = require("path");
const logger = require("../utils/logger");

// 📂 Carpeta de audios
const carpetaAudios = path.resolve("./src/assets/audios");

// 🎯 Mapeo de palabras clave -> archivo de audio
const palabrasClave = {
    // Coincidencia parcial
    suegra: "suegra.mp3",
    queman: "queman.mp3",
    cariñosas: "cariñosas.mp3",
    "dejen dormir": "dejen dormir.mp3",
    "mucho mensaje": "mucho mensaje.mp3",
    borojojo: "borojojo.mp3",
    "no te vayas": "no te vayas.mp3",
    siuu: "siuu.mp3",
    sapo: "sapo.mp3",
    bañate: "banate.mp3",
    ricco: "ricco.mp3",
    "pal bot": "pal bot.mp3",
    veneca: "veneca.mp3",
    "habla bien": "habla bien.mp3",
    pelea: "pelea.mp3",
    
    // Coincidencia exacta
    alv: "alv.mp3",
    putos: "putos.mp3",
    jijiji: "jijiji.mp3",
    abuela: "abuela.mp3",
    "maldita fdg": "maldita fdg.mp3",
    hdp: "hdp.mp3",
    r4: "r4.mp3",
    boo: "boo.mp3",
};

// 🔧 Normalizador
function normalizarTexto(texto) {
    return texto.toLowerCase().trim();
}

// 🔍 Buscar palabra clave
function detectarPalabraClave(mensaje) {
    const msg = normalizarTexto(mensaje);

    // Primero revisamos coincidencias exactas
    const exactas = ["alv","putos","jijiji","abuela","maldita fdg","hdp","r4","boo"];
    const exactaEncontrada = exactas.find(clave => msg === clave);
    if (exactaEncontrada) return exactaEncontrada;

    // Luego coincidencias parciales
    const parciales = Object.keys(palabrasClave).filter(clave => !exactas.includes(clave));
    return parciales.find(clave => msg.includes(clave));
}

// 📲 Enviar audio
async function enviarAudio(message) {
    try {
        const clave = detectarPalabraClave(message.body);
        if (!clave) return;

        const archivoAudio = path.join(carpetaAudios, palabrasClave[clave]);

        try {
            await fs.access(archivoAudio);
            const audio = MessageMedia.fromFilePath(archivoAudio);

            await sony.sendMessage(message.from, audio, { sendAudioAsVoice: true });
            logger.success(`🎵 Audio enviado: "${palabrasClave[clave]}" (clave: "${clave}") a ${message.from}`);
        } catch {
            logger.warn(`⚠️ No se encontró el archivo: ${archivoAudio}`);
        }
    } catch (error) {
        logger.error(`❌ Error al procesar mensaje "${message.body}": ${error.message}`);
    }
}

module.exports = enviarAudio;
