const sony = require("../../bot/client");
const { MessageMedia } = require('whatsapp-web.js');
const logger = require("../utils/logger"); // <- Logger centralizado

const MENU_IMAGE_PATH = './src/assets/img/bot.jpg';
const COMMANDS = ['/menu', '/menú', '/help'];

async function menu(message) {
    const lowercase = message.body.toLowerCase();

    if (!COMMANDS.includes(lowercase)) return; // Ignora mensajes que no son del menú

    try {
        const media = MessageMedia.fromFilePath(MENU_IMAGE_PATH);

        await sony.sendMessage(message.from, media, {
            caption: `*🦊 TH BOT 🦊*
---------------->> 
*MENUS DISPONIBLES:*
---------------->> 

|  🦊 > */mgeneral*  - Menú comandos generales |
|  🦊 > */meventos* - Menú de eventos (fdg, arena, etc.) |
|  🦊 > */mcaceria* - Menú Cacería/Evento Interno |
|  🦊 > */mtodos* - Menú de menciones |
|  🦊 > */marmaduras* - Menú Armaduras |
|  🦊 > */mreportes* - Menú de Reportes |
|  🦊 > */mescudos* - Menú de Escudos |
|  🦊 > */mcuentas* - Menú de Multicuentas |

🅣🅗 ​ - ​ 🅑🅞🅣`
        });

        logger.success(`Menú enviado a ${message.from}`); // Registro exitoso
    } catch (error) {
        logger.error('Error en menu.js al enviar el menú', error);
    }
}

module.exports = menu;
