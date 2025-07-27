const sony = require("../../bot/client");
const th = require("consola");

async function menuGeneral(message) {
    const lowercase = message.body.toLowerCase();

    try {
        if (lowercase === '/mgeneral') {
            sony.sendMessage(
                message.from, 
                `*🦊 TH BOT 🦊*

---------------->> 
| **COMANDOS GENERALES** |
---------------->>

|  🦊 > */info* - Información del Grupo |
|  🦊 > */welcome* - Mensaje de Bienvenida al grupo |
|  🦊 > */all* - Invocar a todo el grupo |
|  🦊 > */reglas* - Reglas del grupo de WSP |

---------------->> 

🅣🅗 ​ - ​ 🅑🅞🅣`
                
            );
        }
    } catch (error) {
        th.warn('⚠️ Error en menu.js al enviar el menuGeneral');
    }
}

module.exports = menuGeneral;
