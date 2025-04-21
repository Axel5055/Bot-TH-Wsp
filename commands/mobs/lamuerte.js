const sony = require("../../src/client");
const { MessageMedia } = require('whatsapp-web.js');
const th = require("consola");

async function lamuerte(message) {
    const lowercase = message.body.toLowerCase();
    const media = MessageMedia.fromFilePath('./img/mobs/lamuerte.jpg');

    try {
        if (lowercase === '/lamuerte') {
            sony.sendMessage(
                message.from, 
                media, 
                {
                    caption: `*☠️💀 ¡Combinación de Héroes para Cazar al Mob La Muerte! 💀☠️*

💥 Para enfrentarte a La Muerte y salir victorioso, aquí tienes la combinación ideal de héroes 💥

🅣🅗 ​ - ​ 🅑🅞🅣`
                }
            );
        }
    } catch (error) {
        th.warn('⚠️ Error en menu.js al enviar la alineacion');
    }
}

module.exports = lamuerte;
