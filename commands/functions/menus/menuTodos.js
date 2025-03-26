const th = require("../../../src/client");
const cx = require("consola");

async function menuTodos(message) {
    const lowercase = message.body.toLowerCase();

    try {
        if (lowercase === '/mall') {
            th.sendMessage(
                message.from, 
                `*🦊 TH BOT 🦊*

---------------->> 
| **COMANDOS PARA INVOAR AL GRUPO Y ESCUDOS** |
---------------->>

|  🦊 > */rally* - Invocando Fillers |
|  🦊 > */forta* - Invocando todas las T4 |
|  🦊 > */escudo [nick-name]* - Avisar de escudo caído

✨ ¡No olvides usarlo para mantener a todos informados! 🦊|

---------------->> 

🅣🅗 ​ - ​ 🅑🅞🅣`
                
            );
        }
    } catch (error) {
        cx.warn('⚠️ Error en menu.js al enviar el menuEventos');
    }
}

module.exports = menuTodos;
