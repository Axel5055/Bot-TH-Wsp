const sony = require("../../bot/client");
const logger = require("../utils/logger");

// 🔹 Texto del reglamento separado y ordenado
const REGLAS_GRUPO = `
*📜 REGLAMENTO DEL GRUPO 📜*

🔒 *Normas:*
🦊 Respeto ante todo.  
🦊 Prohibido stickers o links +18.  
🦊 Evita el spam con los comandos del bot.  
🦊 No se tolera el racismo.  
🦊 No discriminar a nadie por sus preferencias.  

✅ *Sí está permitido:*
🦊 Pedir ayuda sobre temas del juego y gremio (spam, escudos, etc).  
🦊 Venta de cuentas (sin spam).  
🦊 Publicar eventos de cacería.  

POR SU ATENCIÓN, GRACIAS.  
🅣🅗 - 🅑🅞🅣
`;

async function reglas(message) {
    try {
        const body = message.body?.toLowerCase().trim();
        if (body !== "/reglas") return;

        const chat = await message.getChat();
        const isGroup = chat.isGroup || chat.id._serialized.endsWith("g.us");

        if (isGroup) {
            await sony.sendMessage(message.from, { text: REGLAS_GRUPO });
            logger.success(`✅ Reglamento enviado al grupo: ${chat.name || chat.id._serialized}`);
        } else {
            await message.reply("*⚠️ Este comando solo se puede usar en un grupo.*");
            logger.warn(`⚠️ Intento de usar /reglas en privado: ${chat.id._serialized}`);
        }
    } catch (error) {
        logger.error("❌ Error en comando /reglas:", error);
        await message.reply("*⚠️ Ocurrió un error al procesar el comando. Intenta nuevamente.*");
    }
}

module.exports = reglas;
