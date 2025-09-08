const sony = require("../../bot/client");
const logger = require("../utils/logger"); // Logger centralizado

const COMMANDS = ['/mcaceria'];

async function menuCaza(message) {
    const lowercase = message.body.toLowerCase();

    if (!COMMANDS.includes(lowercase)) return; // Ignora mensajes que no son el comando

    try {
        await sony.sendMessage(
            message.from,
            `*🦊 TH BOT 🦊*

---------------->> 
| **COMANDOS CACERÍA** |
---------------->>

|  🦊 > */caza* - Reglas de cacería |
|  🦊 > */evento* - Evento Interno Cacería |
|  🦊 > */mobs* - Menú de mobs del juego |
|  🦊 > */stats [NICK]* - Stats de Cacería del jugador |
|  🦊 > */sgeneral* - Stats de Cacería general |

---------------->> 

🅣🅗 ​ - ​ 🅑🅞🅣`
        );

        logger.info(`Menú de cacería enviado a ${message.from}`);
    } catch (error) {
        logger.error('Error en menuCaza.js al enviar el menú de cacería', error);
    }
}

module.exports = menuCaza;
