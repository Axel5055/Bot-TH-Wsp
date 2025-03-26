const th = require("../../../src/client");
const cx = require("consola");

async function menuGeneral(message) {
    const lowercase = message.body.toLowerCase();

    try {
        if (lowercase === '/mgeneral') {
            th.sendMessage(
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
        cx.warn('⚠️ Error en menu.js al enviar el menuGeneral');
    }
}

module.exports = menuGeneral;
