const sony = require("../../src/client");
const { MessageMedia } = require('whatsapp-web.js');
const th = require("consola");

async function ballena(message) {
    const lowercase = message.body.toLowerCase();
    const media = MessageMedia.fromFilePath('./img/mobs/ballena.jpg');

    try {
        if (lowercase === '/ballena') {
            sony.sendMessage(
                message.from, 
                media, 
                {
                    caption: `*🐋❄️ ¡Combinación de Héroes para Cazar al Mob Ballena Ártica! ❄️⚔️*

💥 Aquí tienes la alineación ideal para enfrentarte al majestuoso Mob Ballena Ártica 💥

🅣🅗 ​ - ​ 🅑🅞🅣`
                }
            );
        }
    } catch (error) {
        th.warn('⚠️ Error en menu.js al enviar la alineacion');
    }
}

module.exports = ballena;
