const sony = require("../../bot/client");
const logger = require("../utils/logger");

// Genera un número aleatorio entre 0 y 100
function randomPercent() {
    return Math.floor(Math.random() * 101);
}

async function gay(message) {
    const body = message.body.trim();

    if (body.toLowerCase().startsWith("/gay")) {
        try {
            await message.react("🌈");

            const arg = body.substring(4).trim(); // lo que viene después de /gay

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
                    "⚠️ *Debes indicar a quién calcular la gaydad.*\n👉 Ejemplo: `/gay @Ashb0rn` o `/gay Ashb0rn`"
                );
            }

            // Generar porcentaje random
            const porcentaje = randomPercent();

            const response = `🏳️‍🌈 *Asociación Internacional de la Gaydad* 🏳️‍🌈

📢 Se ha determinado que ${targetText} tiene un **${porcentaje}% de gaydad**.  

💡 Recuerda: la gaydad fluye, cambia y se celebra 🌈✨.`;

            // Enviamos con o sin menciones según el caso
            if (mentions.length > 0) {
                await sony.sendMessage(message.from, response, { mentions });
            } else {
                await sony.sendMessage(message.from, response);
            }

            logger.success(`😂 Gaydad calculada para ${targetText} = ${porcentaje}%`);
        } catch (err) {
            logger.error("⚠️ Error en comando /gay:", err);
            await sony.sendMessage(
                message.from,
                "⚠️ Ocurrió un error al calcular la gaydad."
            );
        }
    }
}

module.exports = gay;
