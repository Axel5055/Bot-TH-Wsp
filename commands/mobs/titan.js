const sony = require("../../src/client");
const { MessageMedia } = require('whatsapp-web.js');
const th = require("consola");

async function titan(message) {
    const lowercase = message.body.toLowerCase();
    const media = MessageMedia.fromFilePath('./img/mobs/titan.jpg');

    try {
        if (lowercase === '/titan') {
            sony.sendMessage(
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
        th.warn('⚠️ Error en menu.js al enviar la alineacion');
    }
}

module.exports = titan;
