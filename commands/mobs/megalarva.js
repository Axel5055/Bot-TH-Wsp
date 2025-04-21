const sony = require("../../src/client");
const { MessageMedia } = require('whatsapp-web.js');
const th = require("consola");

async function megalarva(message) {
    const lowercase = message.body.toLowerCase();
    const media = MessageMedia.fromFilePath('./img/mobs/megalarva.jpg');

    try {
        if (lowercase === '/megalarva') {
            sony.sendMessage(
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
        th.warn('⚠️ Error en menu.js al enviar la alineacion');
    }
}

module.exports = megalarva;
