const th = require("consola");
const chalk = require('chalk');
const cyan = chalk.cyan;
const green = chalk.green;
const blue = chalk.italic.blue;
const yellow = chalk.yellow;

async function logmsg(message) {
    try {
        const mensajeporcaracteres = message.body?.length || 0; // Evitar errores si message.body es undefined
        
        let chat;
        try {
            chat = await message.getChat();
        } catch (err) {
            th.warn("Error obteniendo el chat:", err.message);
            return; // Salir si no se puede obtener el chat
        }

        const notifyName = message._data?.notifyName || "Desconocido";

        if (message.hasMedia && message.from === 'status@broadcast' && !message.body) {
            th.info(cyan(`Estado sin texto de ${notifyName}\n`));
        } else if (message.hasMedia && message.from === 'status@broadcast') {
            th.info(cyan(`Estado de: ${notifyName}\n`) + green(`Mensaje: ${message.body} \n`));
        } else if (message.from === 'status@broadcast') {
            th.info(cyan(`Estado de: ${notifyName}\n`) + green(`Mensaje: ${message.body}\n`));
        } else if (chat.isGroup && message.hasMedia && message.type === 'image' && mensajeporcaracteres < 1999) {
            th.info(`Imagen de grupo\n` +
                cyan(`Grupo: ${chat.name}\n`) +
                green(`Número: ${message.author}\n`) +
                blue(`Usuario: ${notifyName}\n`) +
                yellow(`Mensaje: ${message.body}\n`));
        } else if (chat.isGroup && mensajeporcaracteres < 1999) {
            th.info(cyan(`Grupo: ${chat.name}\n`) +
                green(`Número: ${message.author}\n`) +
                blue(`Usuario: ${notifyName}\n`) +
                yellow(`Mensaje: ${message.body}\n`));
        } else if (mensajeporcaracteres < 1999) {
            th.info(green(`Usuario: ${notifyName}\n`) + blue(`Mensaje: ${message.body}\n`));
        } else {
            th.warn('Estos son mensajes no declarados o inválidos\n');
        }
    } catch (error) {
        th.error('Hay un error en logmsg.js:', error.message);
    }
}

module.exports = logmsg;