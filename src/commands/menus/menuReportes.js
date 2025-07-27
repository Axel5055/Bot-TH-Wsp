const sony = require("../../bot/client");
const th = require("consola");

async function menuReportes(message) {
    const lowercase = message.body.toLowerCase();

    try {
        if (lowercase === '/mreportes') {
            sony.sendMessage(
                message.from, 
                `*🦊 TH BOT 🦊*

---------------->> 
| **COMANDOS DE REPORTES** |
---------------->>

|  🦊 > */stats [Nick]* - Stats de caceria del jugador |
|  🦊 > */sgeneral* - Stats de caceria del gremio |
|  🦊 > */top10* - Top 10 mejores cazadores de la semana |
|  🦊 > */ranking* - Ranking de los mejores cazadores del mes |

---------------->> 

🅣🅗 ​ - ​ 🅑🅞🅣`
                
            );
        }
    } catch (error) {
        th.warn('⚠️ Error en menu.js al enviar el menuReportes');
    }
}

module.exports = menuReportes;
