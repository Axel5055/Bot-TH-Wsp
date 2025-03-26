const th = require("../../../src/client");
const { MessageMedia } = require('whatsapp-web.js');
const cx = require("consola");

async function jade(message) {
    const lowercase = message.body.toLowerCase();
    const media = MessageMedia.fromFilePath('./img/mobs/jade.jpg');

    try {
        if (lowercase === '/jade') {
            th.sendMessage(
                message.from, 
                media, 
                {
                    caption: `*🐉💎 ¡Combinación de Héroes para Cazar al Mob Guiverno de Jade! 💎🐉*

💥 Para derrotar al imponente Guiverno de Jade, utiliza esta alineación de héroes estratégicamente diseñada 💥

🅣🅗 ​ - ​ 🅑🅞🅣`
                }
            );
        }
    } catch (error) {
        cx.warn('⚠️ Error en menu.js al enviar la alineacion');
    }
}

module.exports = jade;
