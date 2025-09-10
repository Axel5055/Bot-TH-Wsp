// traductor.js
require('dotenv').config();
const consola = require("consola");
const OpenAI = require("openai");
const sony = require("../bot/client"); // Ajusta la ruta según tu proyecto

const BOT_NAME = "Sony";
const PREFIX_RESPONSE = `🦊 *${BOT_NAME}* 🦊`;

// Mapeo de emojis de bandera a código de idioma ISO
const FLAG_LANG = {
    "🇦🇫": "fa", // Afganistán - Persa/Dari
    "🇦🇱": "sq", // Albania
    "🇩🇿": "ar", // Argelia
    "🇦🇸": "sm", // Samoa Americana
    "🇦🇩": "ca", // Andorra - Catalán
    "🇦🇴": "pt", // Angola
    "🇦🇬": "en", // Antigua y Barbuda
    "🇦🇮": "en", // Anguila
    "🇦🇷": "es", // Argentina
    "🇦🇲": "hy", // Armenia
    "🇦🇺": "en", // Australia
    "🇦🇹": "de", // Austria
    "🇧🇸": "en", // Bahamas
    "🇧🇭": "ar", // Bahréin
    "🇧🇩": "bn", // Bangladés
    "🇧🇧": "en", // Barbados
    "🇧🇾": "be", // Bielorrusia
    "🇧🇪": "nl", // Bélgica (neerlandés)
    "🇧🇿": "es", // Belice
    "🇧🇯": "fr", // Benín
    "🇧🇲": "en", // Bermudas
    "🇧🇹": "dz", // Bután
    "🇧🇴": "es", // Bolivia
    "🇧🇷": "pt", // Brasil
    "🇧🇬": "bg", // Bulgaria
    "🇨🇫": "fr", // República Centroafricana
    "🇨🇴": "es", // Colombia
    "🇨🇷": "es", // Costa Rica
    "🇭🇷": "hr", // Croacia
    "🇨🇺": "es", // Cuba
    "🇨🇾": "el", // Chipre
    "🇨🇿": "cs", // República Checa
    "🇩🇰": "da", // Dinamarca
    "🇩🇯": "fr", // Yibuti
    "🇩🇲": "en", // Dominica
    "🇩🇴": "es", // República Dominicana
    "🇪🇨": "es", // Ecuador
    "🇪🇬": "ar", // Egipto
    "🇸🇻": "es", // El Salvador
    "🇪🇷": "ti", // Eritrea
    "🇪🇪": "et", // Estonia
    "🇪🇹": "am", // Etiopía
    "🇫🇯": "en", // Fiyi
    "🇫🇮": "fi", // Finlandia
    "🇫🇷": "fr", // Francia
    "🇬🇦": "fr", // Gabón
    "🇬🇲": "en", // Gambia
    "🇬🇪": "ka", // Georgia
    "🇩🇪": "de", // Alemania
    "🇬🇭": "en", // Ghana
    "🇬🇷": "el", // Grecia
    "🇬🇩": "en", // Granada
    "🇬🇹": "es", // Guatemala
    "🇬🇳": "fr", // Guinea
    "🇬🇼": "pt", // Guinea-Bisáu
    "🇬🇾": "en", // Guyana
    "🇭🇹": "ht", // Haití
    "🇭🇳": "es", // Honduras
    "🇭🇺": "hu", // Hungría
    "🇮🇸": "is", // Islandia
    "🇮🇳": "hi", // India
    "🇮🇩": "id", // Indonesia
    "🇮🇪": "en", // Irlanda
    "🇮🇱": "he", // Israel
    "🇮🇹": "it", // Italia
    "🇯🇲": "en", // Jamaica
    "🇯🇵": "ja", // Japón
    "🇯🇴": "ar", // Jordania
    "🇰🇿": "kk", // Kazajistán
    "🇰🇪": "sw", // Kenia
    "🇰🇼": "ar", // Kuwait
    "🇰🇬": "ky", // Kirguistán
    "🇱🇦": "lo", // Laos
    "🇱🇻": "lv", // Letonia
    "🇱🇧": "ar", // Líbano
    "🇱🇸": "en", // Lesoto
    "🇱🇷": "en", // Liberia
    "🇱🇹": "lt", // Lituania
    "🇱🇺": "fr", // Luxemburgo
    "🇲🇰": "mk", // Macedonia del Norte
    "🇲🇬": "mg", // Madagascar
    "🇲🇼": "en", // Malaui
    "🇲🇾": "ms", // Malasia
    "🇲🇻": "dv", // Maldivas
    "🇲🇱": "fr", // Malí
    "🇲🇹": "mt", // Malta
    "🇲🇷": "ar", // Mauritania
    "🇲🇺": "en", // Mauricio
    "🇲🇽": "es", // México
    "🇫🇲": "en", // Micronesia
    "🇲🇩": "ro", // Moldavia
    "🇲🇨": "fr", // Mónaco
    "🇲🇳": "mn", // Mongolia
    "🇲🇪": "sr", // Montenegro
    "🇲🇦": "ar", // Marruecos
    "🇲🇿": "pt", // Mozambique
    "🇲🇲": "my", // Myanmar
    "🇳🇦": "en", // Namibia
    "🇳🇷": "na", // Nauru
    "🇳🇵": "ne", // Nepal
    "🇳🇱": "nl", // Países Bajos
    "🇳🇿": "en", // Nueva Zelanda
    "🇳🇮": "es", // Nicaragua
    "🇳🇪": "fr", // Níger
    "🇳🇬": "en", // Nigeria
    "🇰🇵": "ko", // Corea del Norte
    "🇳🇴": "no", // Noruega
    "🇴🇲": "ar", // Omán
    "🇵🇰": "ur", // Pakistán
    "🇵🇼": "en", // Palaos
    "🇵🇦": "es", // Panamá
    "🇵🇬": "en", // Papúa Nueva Guinea
    "🇵🇾": "es", // Paraguay
    "🇵🇪": "es", // Perú
    "🇵🇭": "fil", // Filipinas
    "🇵🇱": "pl", // Polonia
    "🇵🇹": "pt", // Portugal
    "🇶🇦": "ar", // Qatar
    "🇷🇴": "ro", // Rumanía
    "🇷🇺": "ru", // Rusia
    "🇷🇼": "rw", // Ruanda
    "🇰🇳": "en", // San Cristóbal y Nieves
    "🇱🇨": "en", // Santa Lucía
    "🇻🇨": "en", // San Vicente y las Granadinas
    "🇼🇸": "sm", // Samoa
    "🇸🇲": "it", // San Marino
    "🇸🇹": "pt", // Santo Tomé y Príncipe
    "🇸🇦": "ar", // Arabia Saudita
    "🇸🇳": "fr", // Senegal
    "🇷🇸": "sr", // Serbia
    "🇸🇨": "fr", // Seychelles
    "🇸🇱": "en", // Sierra Leona
    "🇸🇬": "en", // Singapur
    "🇸🇰": "sk", // Eslovaquia
    "🇸🇮": "sl", // Eslovenia
    "🇸🇧": "en", // Islas Salomón
    "🇸🇴": "so", // Somalia
    "🇿🇦": "af", // Sudáfrica
    "🇰🇷": "ko", // Corea del Sur
    "🇸🇸": "en", // Sudán del Sur
    "🇪🇸": "es", // España
    "🇱🇰": "si", // Sri Lanka
    "🇸🇩": "ar", // Sudán
    "🇸🇷": "nl", // Surinam
    "🇸🇪": "sv", // Suecia
    "🇨🇭": "de", // Suiza
    "🇸🇾": "ar", // Siria
    "🇹🇼": "zh", // Taiwán
    "🇹🇯": "tg", // Tayikistán
    "🇹🇿": "sw", // Tanzania
    "🇹🇭": "th", // Tailandia
    "🇹🇱": "pt", // Timor Oriental
    "🇹🇬": "fr", // Togo
    "🇹🇰": "tk", // Tokelau
    "🇹🇴": "en", // Tonga
    "🇹🇹": "en", // Trinidad y Tobago
    "🇹🇳": "ar", // Túnez
    "🇹🇷": "tr", // Turquía
    "🇹🇲": "tk", // Turkmenistán
    "🇹🇻": "en", // Tuvalu
};

// Inicializar OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 🔧 Función para traducir a cualquier idioma
async function traducir(texto, idioma) {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4.1",
            messages: [
                { role: "system", content: `Eres un traductor profesional. Traduce el texto al idioma ${idioma} sin agregar nada más.` },
                { role: "user", content: `Traduce este texto al idioma ${idioma}: "${texto}"` }
            ],
            temperature: 0.2
        });
        return completion.choices[0]?.message?.content?.trim() || null;
    } catch (error) {
        consola.error("❌ Error al traducir:", error);
        return null;
    }
}

// 🔧 Función para manejar cualquier reacción
async function manejarReaccion(reaction) {
    try {
        console.log("🔔 Entró a manejarReaccion");
        console.log("🚨 Reacción detectada:", reaction);

        const emoji = reaction.reaction; // emoji de la reacción
        const idioma = FLAG_LANG[emoji];

        if (!idioma) {
            console.log(`⚠️ Emoji ${emoji} no está mapeado a un idioma, se ignora`);
            return;
        }

        // Obtener el mensaje usando msgId._serialized
        const message = await sony.getMessageById(reaction.msgId._serialized);
        if (!message?.body) {
            console.log("❌ No se pudo obtener el mensaje o está vacío");
            return;
        }

        console.log(`✏️ Traduciendo mensaje al idioma ${idioma}:`, message.body);

        const traduccion = await traducir(message.body, idioma);
        if (!traduccion) {
            console.log("❌ Traducción falló o no se obtuvo texto");
            return;
        }

        // Enviar la traducción como respuesta al mensaje original
        await sony.sendMessage(
            message.id.remote,
            `${traduccion}`,
            { quotedMessageId: message.id._serialized }
        );

        consola.success(`✅ Traducción enviada correctamente al idioma ${idioma}`);

    } catch (error) {
        consola.error("🔥 Error en manejarReaccion:", error);
    }
}

// 🌐 Inicializar módulo
function traductor() {
    if (global.traductorInitialized) return;
    global.traductorInitialized = true;

    consola.info("🔄 Traductor de reacciones inicializado.");

    // Escuchar cualquier reacción
    sony.on("message_reaction", manejarReaccion);

    process.on('unhandledRejection', (reason) => consola.error('❌ Rechazo no manejado:', reason));
}

module.exports = traductor;
