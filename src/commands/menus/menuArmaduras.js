const sony = require("../../bot/client");
const logger = require("../utils/logger"); // Logger centralizado

const COMMANDS = ['/marmaduras'];

async function menuArmaduras(message) {
    const lowercase = message.body.toLowerCase();

    if (!COMMANDS.includes(lowercase)) return; // Ignora mensajes que no son el comando

    try {
        await sony.sendMessage(
            message.from,
            `*🦊 TH BOT 🦊*

---------------->> 
| **COMANDOS ARMADURAS** |
---------------->>

|  🦊 > */mix* (Armadura mixta) |
|  🦊 > */infa* (Armadura de infantería) |
|  🦊 > */cab* (Armadura de caballería) |
|  🦊 > */art* (Armadura de artillería) |
|  🦊 > */joyas* (Joyas de armaduras) |

---------------->> 

🅣🅗 ​ - ​ 🅑🅞🅣`
        );

        logger.info(`Menú de armaduras enviado a ${message.from}`);
    } catch (error) {
        logger.error('Error en menuArmaduras.js al enviar el menú de armaduras', error);
    }
}

module.exports = menuArmaduras;
