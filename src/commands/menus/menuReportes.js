const sony = require("../../bot/client");
const logger = require("../utils/logger"); // Logger centralizado

const COMMANDS = ['/mreportes'];

async function menuReportes(message) {
    const lowercase = message.body.toLowerCase();

    if (!COMMANDS.includes(lowercase)) return; // Ignora mensajes que no son el comando

    try {
        await sony.sendMessage(
            message.from,
            `*🦊 TH BOT 🦊*

---------------->> 
| **COMANDOS DE REPORTES** |
---------------->>

|  🦊 > */stats [Nick]* - Stats de cacería del jugador |
|  🦊 > */sgeneral* - Stats de cacería del gremio |
|  🦊 > */top10* - Top 10 mejores cazadores de la semana |
|  🦊 > */ranking* - Ranking de los mejores cazadores del mes |

---------------->> 

🅣🅗 ​ - ​ 🅑🅞🅣`
        );

        logger.info(`Menú de reportes enviado a ${message.from}`);
    } catch (error) {
        logger.error('Error en menuReportes.js al enviar el menú de reportes', error);
    }
}

module.exports = menuReportes;
