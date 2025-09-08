const sony = require("../../bot/client");
const logger = require("../utils/logger"); // Logger centralizado

const COMMANDS = ['/meventos'];

async function menuEventos(message) {
    const lowercase = message.body.toLowerCase();

    if (!COMMANDS.includes(lowercase)) return; // Ignora mensajes que no son el comando

    try {
        await sony.sendMessage(
            message.from,
            `*🦊 TH BOT 🦊*

---------------->> 
| **COMANDOS EVENTOS** |
---------------->>

|  🦊 > */fdg* (Reglas del FDG) |
|  🦊 > */arena* (Reglas de Arena Dragon) |

---------------->> 

🅣🅗 ​ - ​ 🅑🅞🅣`
        );

        logger.info(`Menú de eventos enviado a ${message.from}`);
    } catch (error) {
        logger.error('Error en menuEventos.js al enviar el menú de eventos', error);
    }
}

module.exports = menuEventos;
