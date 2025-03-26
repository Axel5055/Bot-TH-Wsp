const th = require("../../../src/client");
const cx = require("consola");

async function menuCaza(message) {
    const lowercase = message.body.toLowerCase();

    try {
        if (lowercase === '/mcaceria') {
            th.sendMessage(
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
        cx.warn('⚠️ Error en menu.js al enviar el menuEventos');
    }
}

module.exports = menuCaza;
