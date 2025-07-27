const sony = require("../../bot/client");
const { MessageMedia } = require('whatsapp-web.js');
const th = require("consola");

async function moai(message) {
    const lowercase = message.body.toLowerCase();
    const media = MessageMedia.fromFilePath('./src/assets/img/mobs/moai.jpg');

    try {
        if (lowercase === '/moai') {
            sony.sendMessage(
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
        th.warn('⚠️ Error en menu.js al enviar la alineacion');
    }
}

module.exports = moai;
