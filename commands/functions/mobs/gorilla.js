const th = require("../../../src/client");
const { MessageMedia } = require('whatsapp-web.js');
const cx = require("consola");

async function gorilla(message) {
    const lowercase = message.body.toLowerCase();
    const media = MessageMedia.fromFilePath('./img/mobs/gorilla.jpg');

    try {
        if (lowercase === '/gorila') {
            th.sendMessage(
                message.from, 
                media, 
                {
                    caption: `*🦍💥 ¡Combinación de Héroes para Cazar al Mob Gorilla! 💥⚔️*

💥 Para enfrentarte a la poderosa bestia Gorilla, aquí tienes la alineación perfecta de héroes 💥

🅣🅗 ​ - ​ 🅑🅞🅣`
                }
            );
        }
    } catch (error) {
        cx.warn('⚠️ Error en menu.js al enviar la alineacion');
    }
}

module.exports = gorilla;
