const sony = require("../../bot/client");
const th = require("consola");

async function menuTodos(message) {
    const lowercase = message.body.toLowerCase();

    try {
        if (lowercase === '/mall') {
            sony.sendMessage(
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
        th.warn('⚠️ Error en menu.js al enviar el menuEventos');
    }
}

module.exports = menuTodos;
