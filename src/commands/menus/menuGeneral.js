const sony = require("../../bot/client");
const logger = require("../utils/logger"); // Logger centralizado

const COMMANDS = ['/mgeneral'];

async function menuGeneral(message) {
    const lowercase = message.body.toLowerCase();

    if (!COMMANDS.includes(lowercase)) return; // Ignora mensajes que no son el comando

    try {
        await sony.sendMessage(
            message.from,
            `*🦊 TH BOT 🦊*

---------------->> 
| **COMANDOS GENERALES** |
---------------->>

|  🦊 > */info* - Información del Grupo |
|  🦊 > */welcome* - Mensaje de Bienvenida al grupo |
|  🦊 > */all* - Invocar a todo el grupo |
|  🦊 > */reglas* - Reglas del grupo de WSP |

---------------->> 

🅣🅗 ​ - ​ 🅑🅞🅣`
        );

        logger.info(`Menú general enviado a ${message.from}`);
    } catch (error) {
        logger.error('Error en menuGeneral.js al enviar el menú general', error);
    }
}

module.exports = menuGeneral;
