const sony = require("../../src/client");
const { MessageMedia } = require('whatsapp-web.js');
const th = require("consola");

async function alanegra(message) {
    const lowercase = message.body.toLowerCase();
    const media = MessageMedia.fromFilePath('./img/mobs/alanegra.jpg');

    try {
        if (lowercase === '/alanegra') {
            sony.sendMessage(
                message.from, 
                media, 
                {
                    caption: `*🌑 ¡Combinación de Héroes para Cazar al Mob Alanegra! 🦅⚔️*

💥 Para enfrentarte al formidable Alanegra, utiliza esta poderosa alineación de héroes 💥

🅣🅗 ​ - ​ 🅑🅞🅣`
                }
            );
        }
    } catch (error) {
        th.warn('⚠️ Error en menu.js al enviar la alineacion');
    }
}

module.exports = alanegra;
