const logger = require("../utils/logger");

async function infoGroup(message) {
    try {
        const body = message.body?.toLowerCase().trim();
        if (body !== "/info") return;

        const chat = await message.getChat();

        if (!chat.isGroup) {
            await message.reply("*⚠️ Este comando solo se puede usar en un grupo.*");
            return;
        }

        // Datos del propietario del grupo
        const ownerNumber = "525538901631" || "Desconocido";

        const response = `*🦊 INFORMACIÓN DEL GRUPO 🦊*

🦊 > *Nombre del grupo*: ${chat.name || "Desconocido"}

🦊 > *Creado el*: ${chat.createdAt ? chat.createdAt.toLocaleString() : "Desconocido"}

🦊 > *Bot Creado por*: wa.me/+${ownerNumber}

🦊 > *Número de participantes*: ${chat.participants?.length || 0}

🅣🅗 ​ - ​ 🅑🅞🅣`;

        await message.reply(response);

        logger.success(`✅ Comando /info usado en grupo: ${chat.name || chat.id._serialized}`);
    } catch (error) {
        logger.error("❌ Error en el comando /info:", error);
        await message.reply("*⚠️ Ocurrió un error al obtener la información del grupo.*");
    }
}

module.exports = infoGroup;
