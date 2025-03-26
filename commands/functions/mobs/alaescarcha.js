const th = require("../../../src/client");
const { MessageMedia } = require('whatsapp-web.js');
const cx = require("consola");

async function alaescarcha(message) {
    const lowercase = message.body.toLowerCase();
    const media = MessageMedia.fromFilePath('./img/mobs/alaescarcha.jpg');

    try {
        if (lowercase === '/alaescarcha') {
            th.sendMessage(
                message.from, 
                media, 
                {
                    caption: `*🌨️ ¡Combinación de Héroes para Cazar al Mob Alaescarcha! 🦅❄️*

💥 Aquí tienes la alineación ideal para enfrentarte al temible Alaescarcha 💥

🅣🅗 ​ - ​ 🅑🅞🅣`
                }
            );
        }
    } catch (error) {
        cx.warn('⚠️ Error en menu.js al enviar la alineacion');
    }
}

module.exports = alaescarcha;
