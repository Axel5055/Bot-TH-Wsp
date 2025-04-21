const sony = require("../../src/client");
const { MessageMedia } = require('whatsapp-web.js');
const th = require("consola");

async function buho(message) {
    const lowercase = message.body.toLowerCase();
    const media = MessageMedia.fromFilePath('./img/mobs/buho.jpg');

    try {
        if (lowercase === '/buho') {
            sony.sendMessage(
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
        th.warn('⚠️ Error en menu.js al enviar la alineacion');
    }
}

module.exports = buho;
