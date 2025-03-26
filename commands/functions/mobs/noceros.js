const th = require("../../../src/client");
const { MessageMedia } = require('whatsapp-web.js');
const cx = require("consola");

async function noceros(message) {
    const lowercase = message.body.toLowerCase();
    const media = MessageMedia.fromFilePath('./img/mobs/noceros.jpg');

    try {
        if (lowercase === '/noceros') {
            th.sendMessage(
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
        cx.warn('⚠️ Error en menu.js al enviar la alineacion');
    }
}

module.exports = noceros;
