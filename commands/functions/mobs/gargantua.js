const th = require("../../../src/client");
const { MessageMedia } = require('whatsapp-web.js');
const cx = require("consola");

async function gargantua(message) {
    const lowercase = message.body.toLowerCase();
    const media = MessageMedia.fromFilePath('./img/mobs/gargantua.jpg');

    try {
        if (lowercase === '/gargantua') {
            th.sendMessage(
                message.from, 
                media, 
                {
                    caption: `*💥🦖 ¡Combinación de Héroes para Cazar al Mob Gargantua! 🦖💥*

💥 ¡Prepárate para enfrentar a la imponente Gargantua con esta poderosa alineación de héroes! 💥

🅣🅗 ​ - ​ 🅑🅞🅣`
                }
            );
        }
    } catch (error) {
        cx.warn('⚠️ Error en menu.js al enviar la alineacion');
    }
}

module.exports = gargantua;
