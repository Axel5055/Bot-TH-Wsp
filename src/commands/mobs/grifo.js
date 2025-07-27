const sony = require("../../bot/client");
const { MessageMedia } = require('whatsapp-web.js');
const th = require("consola");

async function grifo(message) {
    const lowercase = message.body.toLowerCase();
    const media = MessageMedia.fromFilePath('./src/assets/img/mobs/grifo.jpg');

    try {
        if (lowercase === '/grifo') {
            sony.sendMessage(
                message.from, 
                media, 
                {
                    caption: `*🦅⚡ ¡Combinación de Héroes para Cazar al Mob Grifo! ⚡🦅*

💥 Para derrotar al majestuoso y peligroso Grifo, esta alineación de héroes te dará la ventaja que necesitas 💥

🅣🅗 ​ - ​ 🅑🅞🅣`
                }
            );
        }
    } catch (error) {
        th.warn('⚠️ Error en menu.js al enviar la alineacion');
    }
}

module.exports = grifo;
