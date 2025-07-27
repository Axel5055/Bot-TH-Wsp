const sony = require("../../bot/client");
const th = require("consola");

async function pareja(message) {
    try {
        const lowercase = message.body.toLowerCase();

        if (lowercase.startsWith('/pareja')) {
            const chat = await sony.getChatById(message.from);

            if (!chat.isGroup) {
                return sony.sendMessage(message.from, '*⚠️ Este comando solo puede usarse en grupos.*');
            }

            const participantes = chat.participants;

            // Crear lista de contactos con nombre y número
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

            // Elegir 2 miembros aleatorios
            const mezclados = miembros.sort(() => 0.5 - Math.random());
            const pareja = mezclados.slice(0, 2);

            const response = `💘 *¡Tenemos una nueva pareja del grupo!* 💘\n\n` +
                `✨ Según el destino... hoy el amor ha unido a:\n\n` +
                `❤️ *@${pareja[0].numero}* + *@${pareja[1].numero}*\n\n` +
                `💞 ¡Que viva el amor! 💞\n\n🅣🅗 ​ - ​ 🅑🅞🅣`;

            await sony.sendMessage(message.from, response, {
                mentions: pareja.map(p => p.contacto)
            });
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
