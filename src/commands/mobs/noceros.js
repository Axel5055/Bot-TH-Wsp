const sony = require("../../bot/client");
const { MessageMedia } = require('whatsapp-web.js');
const th = require("consola");

async function noceros(message) {
    const lowercase = message.body.toLowerCase();
    const media = MessageMedia.fromFilePath('./src/assets/img/mobs/noceros.jpg');

    try {
        if (lowercase === '/noceros') {
            sony.sendMessage(
                message.from, 
                media, 
                {
                    caption: `*🦏⚔️ ¡Combinación de Héroes para Cazar al Mob Noceros! ⚔️🦏*

💥 Para enfrentarte al imponente Noceros, una bestia feroz, esta es la combinación de héroes que te ayudará a derrotarlo 💥

🅣🅗 ​ - ​ 🅑🅞🅣`
                }
            );
        }
    } catch (error) {
        th.warn('⚠️ Error en menu.js al enviar la alineacion');
    }
}

module.exports = noceros;
