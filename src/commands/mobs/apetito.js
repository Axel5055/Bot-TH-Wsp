const sony = require("../../bot/client");
const { MessageMedia } = require('whatsapp-web.js');
const th = require("consola");

async function apetito(message) {
    const lowercase = message.body.toLowerCase();
    const media = MessageMedia.fromFilePath('./src/assets/img/mobs/apetito.jpg');

    try {
        if (lowercase === '/apetito') {
            sony.sendMessage(
                message.from, 
                media, 
                {
                    caption: `*🍖 ¡Combinación de Héroes para Cazar al Mob Buen Apetito! 🐷✨*

💥 A continuación, la mejor alineación para derrotar al glotón Buen Apetito 💥

🅣🅗 ​ - ​ 🅑🅞🅣`
                }
            );
        }
    } catch (error) {
        th.warn('⚠️ Error en menu.js al enviar la alineacion');
    }
}

module.exports = apetito;
