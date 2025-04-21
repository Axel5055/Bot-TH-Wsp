const sony = require("../../src/client");
const th = require("consola");

async function menuEventos(message) {
    const lowercase = message.body.toLowerCase();

    try {
        if (lowercase === '/meventos') {
            sony.sendMessage(
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
        }
    } catch (error) {
        th.warn('⚠️ Error en menu.js al enviar el menuEventos');
    }
}

module.exports = menuEventos;
