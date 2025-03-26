const th = require("../../../src/client");
const { MessageMedia } = require('whatsapp-web.js');
const cx = require("consola");

async function grifo(message) {
    const lowercase = message.body.toLowerCase();
    const media = MessageMedia.fromFilePath('./img/mobs/grifo.jpg');

    try {
        if (lowercase === '/grifo') {
            th.sendMessage(
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
        cx.warn('⚠️ Error en menu.js al enviar la alineacion');
    }
}

module.exports = grifo;
