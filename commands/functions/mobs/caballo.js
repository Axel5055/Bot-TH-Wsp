const th = require("../../../src/client");
const { MessageMedia } = require('whatsapp-web.js');
const cx = require("consola");

async function caballo(message) {
    const lowercase = message.body.toLowerCase();
    const media = MessageMedia.fromFilePath('./img/mobs/caballo.jpg');

    try {
        if (lowercase === '/caballo') {
            th.sendMessage(
                message.from, 
                media, 
                {
                    caption: `*🏇💥 ¡Combinación de Héroes para Cazar al Mob Caballo de Troya! 💥⚔️*

💥 Para derrotar al formidable Caballo de Troya, usa esta alineación estratégica de héroes 💥

🅣🅗 ​ - ​ 🅑🅞🅣`
                }
            );
        }
    } catch (error) {
        cx.warn('⚠️ Error en menu.js al enviar la alineacion');
    }
}

module.exports = caballo;
