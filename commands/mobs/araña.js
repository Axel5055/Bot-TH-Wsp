const sony = require("../../src/client");
const { MessageMedia } = require('whatsapp-web.js');
const th = require("consola");

async function araña(message) {
    const lowercase = message.body.toLowerCase();
    const media = MessageMedia.fromFilePath('./img/mobs/araña.jpg');

    try {
        if (lowercase === '/araña') {
            sony.sendMessage(
                message.from, 
                media, 
                {
                    caption: `*🕷️🔥 ¡Combinación de Héroes para Cazar al Mob Araña Infernal! 🔥🕸️*

💥 Prepárate para enfrentar a la temible Araña Infernal con esta alineación recomendada 💥

🅣🅗 ​ - ​ 🅑🅞🅣`
                }
            );
        }
    } catch (error) {
        th.warn('⚠️ Error en menu.js al enviar la alineacion');
    }
}

module.exports = araña;
