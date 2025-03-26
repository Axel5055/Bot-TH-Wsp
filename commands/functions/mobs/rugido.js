const th = require("../../../src/client");
const { MessageMedia } = require('whatsapp-web.js');
const cx = require("consola");

async function rugido(message) {
    const lowercase = message.body.toLowerCase();
    const media = MessageMedia.fromFilePath('./img/mobs/rugido.jpg');

    try {
        if (lowercase === '/rugido') {
            th.sendMessage(
                message.from, 
                media, 
                {
                    caption: `*🐾💥 ¡Combinación de Héroes para Cazar al Mob Rugido Feroz! 💥🐾*

💥 Para enfrentarte al imponente Rugido Feroz, una bestia salvaje con una fuerza descomunal, usa esta alineación de héroes 💥

🅣🅗 ​ - ​ 🅑🅞🅣`
                }
            );
        }
    } catch (error) {
        cx.warn('⚠️ Error en menu.js al enviar la alineacion');
    }
}

module.exports = rugido;
