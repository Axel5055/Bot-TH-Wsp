const sony = require("../../bot/client");
const { MessageMedia } = require('whatsapp-web.js');
const th = require("consola");

async function bestia(message) {
    const lowercase = message.body.toLowerCase();
    const media = MessageMedia.fromFilePath('./src/assets/img/mobs/bestia.jpg');

    try {
        if (lowercase === '/bestia') {
            sony.sendMessage(
                message.from, 
                media, 
                {
                    caption: `*🐾❄️ ¡Combinación de Héroes para Cazar al Mob Bestia de las Nieves! ❄️⚔️*

💥 ¡Prepárate para enfrentar al imponente Mob Bestia de las Nieves con esta poderosa alineación de héroes! 💥

🅣🅗 ​ - ​ 🅑🅞🅣`
                }
            );
        }
    } catch (error) {
        th.warn('⚠️ Error en menu.js al enviar la alineacion');
    }
}

module.exports = bestia;
