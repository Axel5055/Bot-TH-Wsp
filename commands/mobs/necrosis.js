const sony = require("../../src/client");
const { MessageMedia } = require('whatsapp-web.js');
const th = require("consola");

async function necrosis(message) {
    const lowercase = message.body.toLowerCase();
    const media = MessageMedia.fromFilePath('./img/mobs/necrosis.jpg');

    try {
        if (lowercase === '/necrosis') {
            sony.sendMessage(
                message.from, 
                media, 
                {
                    caption: `*☠️🖤 ¡Combinación de Héroes para Cazar al Mob Necrosis! 🖤☠️*

💥 Para derrotar al temible Necrosis, un ser oscuro y mortal, utiliza esta poderosa alineación de héroes 💥

🅣🅗 ​ - ​ 🅑🅞🅣`
                }
            );
        }
    } catch (error) {
        th.warn('⚠️ Error en menu.js al enviar la alineacion');
    }
}

module.exports = necrosis;
