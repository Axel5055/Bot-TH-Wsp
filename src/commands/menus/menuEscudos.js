const sony = require("../../bot/client");
const logger = require("../utils/logger"); // Logger centralizado

const COMMANDS = ['/mescudos'];

async function menuEscudos(message) {
    const lowercase = message.body.toLowerCase();

    if (!COMMANDS.includes(lowercase)) return; // Ignora mensajes que no son el comando

    try {
        await sony.sendMessage(
            message.from,
            `*🦊 TH BOT 🦊*

---------------->> 
| **COMANDOS ESCUDOS** |
---------------->>

|  🦊 > */helpescudo* - Guía de cómo usar los comandos
|  🦊 > */addescudo [Nick] [Número]* - Si no estás registrado, úsalo
|  🦊 > */escudo [Nick]* - Avisar de escudo caído
|  🦊 > */list* - Lista de los usuarios registrados
|  🦊 > */editescudo [Nick Anterior] [Nick Nuevo] [Número]* - Edita un registro
|  🦊 > */deleteescudo [Nick]* - Elimina un registro

🅣🅗 ​ - ​ 🅑🅞🅣`
        );

        logger.info(`Menú de escudos enviado a ${message.from}`);
    } catch (error) {
        logger.error('Error en menuEscudos.js al enviar el menú de escudos', error);
    }
}

module.exports = menuEscudos;
