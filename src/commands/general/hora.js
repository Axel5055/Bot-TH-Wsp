const moment = require("moment-timezone");
require("moment/locale/es");

// Mapa de países a zonas horarias, emojis y abreviaturas
const countries = {
    "argentina": { tz: "America/Argentina/Buenos_Aires", flag: "🇦🇷", abbr: ["ARG"] },
    "mexico": { tz: "America/Mexico_City", flag: "🇲🇽", abbr: ["MX"] },
    "colombia": { tz: "America/Bogota", flag: "🇨🇴", abbr: ["CO"] },
    "espana": { tz: "Europe/Madrid", flag: "🇪🇸", abbr: ["ES"] },
    "japon": { tz: "Asia/Tokyo", flag: "🇯🇵", abbr: ["JP"] },
    "china": { tz: "Asia/Shanghai", flag: "🇨🇳", abbr: ["CN"] },
    "estados unidos": { tz: "America/New_York", flag: "🇺🇸", abbr: ["US", "EEUU"] },
    "venezuela": { tz: "America/Caracas", flag: "🇻🇪", abbr: ["VEN"] }
    // Agrega más países/abreviaturas según necesites
};


// Crear un lookup para abreviaturas
const abbrMap = {};
for (const [name, info] of Object.entries(countries)) {
    if (info.abbr && info.abbr.length) {
        info.abbr.forEach(a => {
            abbrMap[a.toLowerCase()] = name;
        });
    }
}

/**
 * Maneja el comando /horaen
 * @param {import('whatsapp-web.js').Message} message
 */
async function handleHoraEn(message) {
    const body = message.body || "";
    const parts = body.trim().split(/\s+/);

    if (parts[0].toLowerCase() !== "/horaen") return;

    if (parts.length < 2) {
        message.reply("❌ Por favor indica un país o abreviatura. Ejemplo: /horaen Argentina o /horaen AR");
        return;
    }

    const input = parts.slice(1).join(" ").toLowerCase();

    // Buscar por nombre o abreviatura
    let countryName = input;
    if (!countries[input]) {
        if (abbrMap[input]) countryName = abbrMap[input];
        else {
            message.reply(`❌ No conozco la zona horaria de "${input}".`);
            return;
        }
    }

    const { tz, flag } = countries[countryName];

    const now = moment().tz(tz).locale("es");

    // Hora y fecha
    const hora = now.format("h:mm A");
    const fecha = now.format("dddd, D MMMM YYYY");
    const isDST = now.isDST() ? "Horario de Verano" : "Horario estándar";

    const reply = `🕒 Hora actual en ${flag} *${countryName.charAt(0).toUpperCase() + countryName.slice(1)}*:\n${fecha}, ${hora} (${isDST})`;

    message.reply(reply);
}

module.exports = handleHoraEn;
