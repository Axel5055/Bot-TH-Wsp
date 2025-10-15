const sony = require("../../bot/client");
const { MessageMedia } = require("whatsapp-web.js");
const logger = require("../utils/logger");
const path = require("path");
const fs = require("fs");

// Ruta de la imagen de bienvenida
const MEDIA_PATH = path.resolve("./src/assets/img/morada.jpg");

// Mensaje base de bienvenida
const MENSAJE_WELCOME = `*¡Bienvenido(a) al Chat de WhatsApp de T\\H!*  

Nos alegra tenerte con nosotros. Esperamos que te sientas cómodo(a) y disfrutes de la comunidad.

📝 Usa el comando [ */reglas* ] para conocer las normas del grupo. También puedes encontrarlas en la descripción del grupo.

🏆 Al mejor cazador del mes se le regalarán *499 diamantes*.

📝 Usa el comando [ */caza* ] para conocer las reglas de cacería.
🦊 Usa el comando [ */menu* ó */help* ] para ver todos los comandos disponibles.

🅣🅗 ​- 🅑🅞🅣`;

// Función para verificar que el archivo de imagen existe y cargarlo
function loadMedia(filePath) {
    if (!fs.existsSync(filePath)) {
        logger.warn(`⚠️ No se encontró el archivo de imagen: ${filePath}`);
        return null;
    }
    return MessageMedia.fromFilePath(filePath);
}

// Función para enviar mensaje de bienvenida
async function sendWelcomeMessage(chatId, caption, mentions = []) {
    try {
        const media = loadMedia(MEDIA_PATH);

        if (media) {
            await sony.sendMessage(chatId, media, { caption, mentions });
            logger.success(`✅ Mensaje de bienvenida enviado al chat ${chatId}`);
        } else {
            await sony.sendMessage(chatId, caption, { mentions });
            logger.warn(`⚠️ Se envió solo el mensaje de bienvenida (sin imagen) al chat ${chatId}`);
        }
    } catch (error) {
        logger.error("❌ Error al enviar el mensaje de bienvenida:", error);
    }
}

// Función para validar grupo permitido
function isAllowedGroup(chatId) {
    const allowedId = process.env.WHATSAPP_GROUP_ID?.trim();
    return allowedId && chatId === allowedId;
}

// Comando /welcome manual
async function welcomeCommand(message) {
    const body = message.body?.toLowerCase().trim();
    if (body !== "/welcome") return;

    try {
        const chat = await message.getChat();

        if (!chat.isGroup) {
            await message.reply("*⚠️ Este comando solo se puede usar en un grupo.*");
            return;
        }

        // Filtrar solo el grupo permitido
        if (!isAllowedGroup(chat.id._serialized)) {
            await message.reply("*⚠️ Este comando solo está habilitado en el grupo principal.*");
            return;
        }

        await sendWelcomeMessage(chat.id._serialized, MENSAJE_WELCOME);
    } catch (error) {
        logger.error("❌ Error al procesar el comando /welcome:", error);
        await message.reply("*⚠️ Ocurrió un error al procesar el comando. Intenta nuevamente.*");
    }
}

// Evento de ingreso al grupo
sony.on("group_join", async (notification) => {
    const chatId = notification.id.remote;

    // Solo enviar al grupo definido
    if (!isAllowedGroup(chatId)) return;

    const newParticipantId = notification.id.participant;

    try {
        const chat = await sony.getChatById(chatId);
        const newParticipant = await sony.getContactById(newParticipantId);

        if (chat.isGroup && newParticipant) {
            const personalizedCaption = `*¡Bienvenido(a) al Chat de WhatsApp de T\\H!*  

Nos alegra tenerte con nosotros, @${newParticipant.id.user}. Esperamos que te sientas cómodo(a) y disfrutes de la comunidad.

📝 Usa el comando [ */reglas* ] para conocer las normas del grupo. También puedes encontrarlas en la descripción del grupo.

🏆 Al mejor cazador del mes se le regalarán *499 diamantes*.

📝 Usa el comando [ */caza* ] para conocer las reglas de cacería.
🦊 Usa el comando [ */menu* ó */help* ] para ver todos los comandos disponibles.

🅣🅗 ​- 🅑🅞🅣`;

            await sendWelcomeMessage(chatId, personalizedCaption, [newParticipant]);
        }
    } catch (error) {
        logger.error("❌ Error en el evento 'group_join':", error);
    }
});

module.exports = welcomeCommand;
