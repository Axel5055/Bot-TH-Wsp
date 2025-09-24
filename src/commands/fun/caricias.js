const sony = require("../../bot/client");
const logger = require("../utils/logger");

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function caricias(message) {
    const body = message.body.trim();

    if (body.toLowerCase().startsWith("/caricias")) {
        try {
            await message.react("💋");

            // Sacamos argumento después de /caricias
            const arg = body.substring(9).trim();

            // Obtenemos menciones reales (si las hay)
            const mentioned = message.mentionedIds || [];
            let targetText = null;
            let mentions = [];

            if (mentioned.length > 0) {
                // Caso 1: mención real con @
                const target = mentioned[0];
                targetText = `@${target.split("@")[0]}`;
                mentions = [target];
            } else if (arg) {
                // Caso 2: solo texto
                targetText = `@${arg}`;
            } else {
                return sony.sendMessage(
                    message.from,
                    "⚠️ *Debes indicar a quién van las caricias.*\n👉 Ejemplo: `/caricias @Toxic` o `/caricias Toxic`"
                );
            }

            // Generar stats random
            const besos = randomInt(0, 5);
            const buenosDias = randomInt(0, 5);
            const salidas = randomInt(0, 3);
            const hotel = randomInt(0, 2);
            const sexoViolento = randomInt(0, 4);

            const response = `👋 ¡Hola, *${targetText}*! 👋

⚠️ Tu *estatus de caricias y apapachos* está en rojo ⚠️

🛑 Debe colocarse al día

🔹 *Besos:* ${besos} 💋
🔹 *Mensajes de buenos días:* ${buenosDias} 🌞
🔹 *Salidas:* ${salidas} 🍹
🔹 *Hotel:* ${hotel} 🏨
🔹 *Sexo violento:* ${sexoViolento} 🔥
  
📌 *Mínimo 1 de cada una a la semana*

🅣🅗 ​ - ​ 🅑🅞🅣`;

            // Enviamos con o sin menciones según el caso
            if (mentions.length > 0) {
                await sony.sendMessage(message.from, response, { mentions });
            } else {
                await sony.sendMessage(message.from, response);
            }

            logger.success(`😂 Caricias stats enviados para ${targetText}`);
        } catch (err) {
            logger.error("⚠️ Error en comando /caricias:", err);
            await sony.sendMessage(
                message.from,
                "⚠️ Ocurrió un error al generar las caricias."
            );
        }
    }
}

module.exports = caricias;
