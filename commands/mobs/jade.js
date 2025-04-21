const sony = require("../../src/client");
const { MessageMedia } = require('whatsapp-web.js');
const th = require("consola");

async function jade(message) {
    const lowercase = message.body.toLowerCase();
    const media = MessageMedia.fromFilePath('./img/mobs/jade.jpg');

    try {
        if (lowercase === '/jade') {
            sony.sendMessage(
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
        th.warn('⚠️ Error en menu.js al enviar la alineacion');
    }
}

module.exports = jade;
