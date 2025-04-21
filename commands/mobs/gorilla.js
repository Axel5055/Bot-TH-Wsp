const sony = require("../../src/client");
const { MessageMedia } = require('whatsapp-web.js');
const th = require("consola");

async function gorilla(message) {
    const lowercase = message.body.toLowerCase();
    const media = MessageMedia.fromFilePath('./img/mobs/gorilla.jpg');

    try {
        if (lowercase === '/gorila') {
            sony.sendMessage(
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
        th.warn('⚠️ Error en menu.js al enviar la alineacion');
    }
}

module.exports = gorilla;
