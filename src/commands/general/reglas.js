const sony = require("../../bot/client");
const logger = require("../utils/logger");

const REGLAS_GRUPO = `
*📜 REGLAMENTO DEL GRUPO 📜*

---------------->>
|  🦊 > Respeto ante todo.
|  🦊 > No usar stickers ni subir links +18.
|  🦊 > No hacer spam con los comandos del bot.
|  🦊 > No se tolera el racismo.
|  🦊 > No discriminar a nadie por sus preferencias de cualquier tipo.
|
---------------->>
| *¿QUÉ SÍ ESTÁ PERMITIDO?*
|
|  🦊 > Pedir ayuda sobre temas del juego y gremio. (spam, escudos, etc).
|  🦊 > Venta de sus cuentas sin hacer spam, solamente.
|  🦊 > Publicar eventos de cacería.
|
---------------->>

POR SU ATENCIÓN, GRACIAS.
🅣🅗 ​ - ​ 🅑🅞🅣
`;

async function reglas(message) {
    try {
        const body = message.body?.toLowerCase().trim();
        if (body !== "/reglas") return;

        const chat = await message.getChat();

        // Depuración opcional
        logger.debug(`Comando /reglas recibido en chat: ${chat.id._serialized}`);

        // Verifica si es un grupo (los IDs de grupo suelen terminar con 'g.us')
        if (chat.id._serialized.endsWith("g.us")) {
            await sony.sendMessage(message.from, REGLAS_GRUPO);
            logger.success(`✅ Enviado reglamento al grupo ${chat.name || chat.id._serialized}`);
        } else {
            await message.reply("*⚠️ Este comando solo se puede usar en un grupo.*");
            logger.warn(`Intento de usar /reglas en chat privado: ${chat.id._serialized}`);
        }
    } catch (error) {
        logger.error("❌ Error al procesar el comando /reglas:", error);
        await message.reply("*⚠️ Ocurrió un error al procesar el comando. Intenta nuevamente.*");
    }
}

module.exports = reglas;
