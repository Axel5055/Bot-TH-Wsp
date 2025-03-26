const th = require("../../../src/client");
const { MessageMedia } = require('whatsapp-web.js');
const cx = require("consola");

async function buho(message) {
    const lowercase = message.body.toLowerCase();
    const media = MessageMedia.fromFilePath('./img/mobs/buho.jpg');

    try {
        if (lowercase === '/buho') {
            th.sendMessage(
                message.from, 
                media, 
                {
                    caption: `*🦉✨ ¡Combinación de Héroes para Cazar al Mob Búho Carroñero! ✨⚔️*

💥 ¡Enfréntate al astuto Mob Búho Carroñero con esta estrategia de héroes infalible! 💥

🅣🅗 ​ - ​ 🅑🅞🅣`
                }
            );
        }
    } catch (error) {
        cx.warn('⚠️ Error en menu.js al enviar la alineacion');
    }
}

module.exports = buho;
