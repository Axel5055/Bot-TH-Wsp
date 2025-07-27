const sony = require("../../bot/client");
const th = require("consola");

async function menuCaza(message) {
    const lowercase = message.body.toLowerCase();

    try {
        if (lowercase === '/mcaceria') {
            sony.sendMessage(
                message.from, 
                `*🦊 TH BOT 🦊*

---------------->> 
| **COMANDOS CACERÍA** |
---------------->>

|  🦊 > */caza* - Reglas de cacería |
|  🦊 > */evento* - Evento Interno Caceria |
|  🦊 > */mobs* - Menú de mobs del juego |
|  🦊 > */stats [NICK]* - Stats de Cacería del jugador |
|  🦊 > */sgeneral* - Stats de Cacería general |

---------------->> 

🅣🅗 ​ - ​ 🅑🅞🅣`
                
            );
        }
    } catch (error) {
        th.warn('⚠️ Error en menu.js al enviar el menuEventos');
    }
}

module.exports = menuCaza;
