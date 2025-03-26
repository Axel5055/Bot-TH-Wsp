const th = require("../../../src/client");
const cx = require("consola");

async function menuEventos(message) {
    const lowercase = message.body.toLowerCase();

    try {
        if (lowercase === '/meventos') {
            th.sendMessage(
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
        cx.warn('⚠️ Error en menu.js al enviar el menuEventos');
    }
}

module.exports = menuEventos;
