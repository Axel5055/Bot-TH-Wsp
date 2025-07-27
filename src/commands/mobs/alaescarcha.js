const sony = require("../../bot/client");
const { MessageMedia } = require('whatsapp-web.js');
const th = require("consola");

async function alaescarcha(message) {
    const lowercase = message.body.toLowerCase();
    const media = MessageMedia.fromFilePath('./src/assets/img/mobs/alaescarcha.jpg');

    try {
        if (lowercase === '/alaescarcha') {
            sony.sendMessage(
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
        th.warn('⚠️ Error en menu.js al enviar la alineacion');
    }
}

module.exports = alaescarcha;
