const th = require("../../../src/client");
const { MessageMedia } = require('whatsapp-web.js');
const cx = require("consola");

async function moai(message) {
    const lowercase = message.body.toLowerCase();
    const media = MessageMedia.fromFilePath('./img/mobs/moai.jpg');

    try {
        if (lowercase === '/moai') {
            th.sendMessage(
                message.from, 
                media, 
                {
                    caption: `*🗿⚔️ ¡Combinación de Héroes para Cazar al Mob Moai Milenario! ⚔️🗿*

💥 Enfréntate al ancestral Moai Milenario con esta alineación estratégica de héroes 💥

🅣🅗 ​ - ​ 🅑🅞🅣`
                }
            );
        }
    } catch (error) {
        cx.warn('⚠️ Error en menu.js al enviar la alineacion');
    }
}

module.exports = moai;
