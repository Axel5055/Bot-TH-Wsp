const sony = require("../../src/client");
const th = require("consola");

async function menuArmaduras(message) {
    const lowercase = message.body.toLowerCase();

    try {
        if (lowercase === '/marmaduras') {
            sony.sendMessage(
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
        th.warn('⚠️ Error en menu.js al enviar el menuEventos');
    }
}

module.exports = menuArmaduras;
