const th = require("../../../src/client");
const { MessageMedia } = require('whatsapp-web.js');
const cx = require("consola");

async function megalarva(message) {
    const lowercase = message.body.toLowerCase();
    const media = MessageMedia.fromFilePath('./img/mobs/megalarva.jpg');

    try {
        if (lowercase === '/megalarva') {
            th.sendMessage(
                message.from, 
                media, 
                {
                    caption: `*🦠💥 ¡Combinación de Héroes para Cazar al Mob MegaLarva! 💥🦠*

💥 Para derrotar a la gigantesca MegaLarva, necesitas una alineación estratégica de héroes 💥

🅣🅗 ​ - ​ 🅑🅞🅣`
                }
            );
        }
    } catch (error) {
        cx.warn('⚠️ Error en menu.js al enviar la alineacion');
    }
}

module.exports = megalarva;
