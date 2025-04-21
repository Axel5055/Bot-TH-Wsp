const sony = require("../../src/client");
const { MessageMedia } = require('whatsapp-web.js');
const th = require("consola");

async function abeja(message) {
    const lowercase = message.body.toLowerCase();
    const media = MessageMedia.fromFilePath('./img/mobs/abeja.jpg');

    try {
        if (lowercase === '/abeja') {
            sony.sendMessage(
                message.from, 
                media, 
                {
                    caption: `*🐝 ¡Combinación de Héroes para Cazar al Mob Abeja Reina! 🏹✨*

💥 Aquí tienes la alineación perfecta para enfrentarte a este mob 💥

🅣🅗 ​ - ​ 🅑🅞🅣`
                }
            );
        }
    } catch (error) {
        th.warn('⚠️ Error en menu.js al enviar la alineacion');
    }
}

module.exports = abeja;
