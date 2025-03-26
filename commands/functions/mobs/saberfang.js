const th = require("../../../src/client");
const { MessageMedia } = require('whatsapp-web.js');
const cx = require("consola");

async function saberfang(message) {
    const lowercase = message.body.toLowerCase();
    const media = MessageMedia.fromFilePath('./img/mobs/saberfang.jpg');

    try {
        if (lowercase === '/saberfang') {
            th.sendMessage(
                message.from, 
                media, 
                {
                    caption: `*🐾⚔️ ¡Combinación de Héroes para Cazar al Mob Saberfang! ⚔️🐾*

💥 Para enfrentar a Saberfang, el feroz depredador, esta es la alineación de héroes ideal para maximizar tus posibilidades de éxito 💥

🅣🅗 ​ - ​ 🅑🅞🅣`
                }
            );
        }
    } catch (error) {
        cx.warn('⚠️ Error en menu.js al enviar la alineacion');
    }
}

module.exports = saberfang;
