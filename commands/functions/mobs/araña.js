const th = require("../../../src/client");
const { MessageMedia } = require('whatsapp-web.js');
const cx = require("consola");

async function araña(message) {
    const lowercase = message.body.toLowerCase();
    const media = MessageMedia.fromFilePath('./img/mobs/araña.jpg');

    try {
        if (lowercase === '/araña') {
            th.sendMessage(
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
        cx.warn('⚠️ Error en menu.js al enviar la alineacion');
    }
}

module.exports = araña;
