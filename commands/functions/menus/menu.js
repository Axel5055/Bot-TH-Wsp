const th = require("../../../src/client");
const { MessageMedia } = require('whatsapp-web.js');
const cx = require("consola");

async function menu(message) {
    const lowercase = message.body.toLowerCase();
    const media = MessageMedia.fromFilePath('./img/bot.jpg');

    try {
        if (lowercase === '/menu' || lowercase === '/menú' || lowercase === '/help') {
            th.sendMessage(
                message.from, 
                media, 
                {
                    caption: `*🦊 TH BOT 🦊*
---------------->> 
*MENUS DISPONIBLES:*
---------------->> 

|  🦊 > */mgeneral*  - Menú comandos generales |
|  🦊 > */meventos* - Menú de eventos (fdg, arena, etc.) |
|  🦊 > */mcaceria* - Menú Cacería/Evento Interno |
|  🦊 > */mall* - Menú Invocar/Escudos |
|  🦊 > */marmaduras* - Menú Armaduras |
|  🦊 > */mreportes* - Menú de Reportes |

---------------->> 
*ESCUDOS*
---------------->> 

|  🦊 > */escudo [Nick]* - Avisar de escudo caído
|  🦊 > */addescudo [Nombre] [Numero]* - Si no estas registrado usa este comando.
|  🦊 > */list* - Genera la lista de los usuarios registrados.


🅣🅗 ​ - ​ 🅑🅞🅣`
                }
            );
        }
    } catch (error) {
        cx.warn('⚠️ Error en menu.js al enviar el menú');
    }
}

module.exports = menu;
