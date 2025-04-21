const sony = require("../../src/client");
const { MessageMedia } = require('whatsapp-web.js');
const th = require("consola");

async function terrospin(message) {
    const lowercase = message.body.toLowerCase();
    const media = MessageMedia.fromFilePath('./img/mobs/terrospin.jpg');

    try {
        if (lowercase === '/terrospin') {
            sony.sendMessage(
                message.from, 
                media, 
                {
                    caption: `*🕷️⚔️ ¡Combinación de Héroes para Cazar al Mob Terrospin! ⚔️🕷️*

💥 Para derrotar al monstruoso Terrospin, una araña gigante y aterradora, utiliza esta alineación de héroes para obtener la victoria 💥

🅣🅗 ​ - ​ 🅑🅞🅣`
                }
            );
        }
    } catch (error) {
        th.warn('⚠️ Error en menu.js al enviar la alineacion');
    }
}

module.exports = terrospin;
