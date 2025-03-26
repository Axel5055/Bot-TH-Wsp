const th = require("../../../src/client");
const cx = require("consola");

async function menuArmaduras(message) {
    const lowercase = message.body.toLowerCase();

    try {
        if (lowercase === '/marmaduras') {
            th.sendMessage(
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
        }
    } catch (error) {
        cx.warn('⚠️ Error en menu.js al enviar el menuEventos');
    }
}

module.exports = menuArmaduras;
