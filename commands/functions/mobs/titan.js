const th = require("../../../src/client");
const { MessageMedia } = require('whatsapp-web.js');
const cx = require("consola");

async function titan(message) {
    const lowercase = message.body.toLowerCase();
    const media = MessageMedia.fromFilePath('./img/mobs/titan.jpg');

    try {
        if (lowercase === '/titan') {
            th.sendMessage(
                message.from, 
                media, 
                {
                    caption: `*🌊⚔️ ¡Combinación de Héroes para Cazar al Mob Titan de Marea! ⚔️🌊*

💥 Para enfrentarte al imponente Titan de Marea, una criatura colossal con fuerza descomunal, utiliza esta alineación de héroes para asegurar tu victoria 💥

🅣🅗 ​ - ​ 🅑🅞🅣`
                }
            );
        }
    } catch (error) {
        cx.warn('⚠️ Error en menu.js al enviar la alineacion');
    }
}

module.exports = titan;
