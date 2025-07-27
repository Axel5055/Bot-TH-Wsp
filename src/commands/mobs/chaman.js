const sony = require("../../bot/client");
const { MessageMedia } = require('whatsapp-web.js');
const th = require("consola");

async function chaman(message) {
    const lowercase = message.body.toLowerCase();
    const media = MessageMedia.fromFilePath('./src/assets/img/mobs/chaman.jpg');

    try {
        if (lowercase === '/chaman') {
            sony.sendMessage(
                message.from, 
                media, 
                {
                    caption: `*🌀🔮 ¡Combinación de Héroes para Cazar al Mob Chaman Vudú! 🔮⚔️*

💥 Para derrotar al temible Chaman Vudú, esta combinación de héroes te proporcionará la ventaja que necesitas 💥

🅣🅗 ​ - ​ 🅑🅞🅣`
                }
            );
        }
    } catch (error) {
        th.warn('⚠️ Error en menu.js al enviar la alineacion');
    }
}

module.exports = chaman;
