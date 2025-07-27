const sony = require("../../bot/client");
const { MessageMedia } = require('whatsapp-web.js');
const th = require("consola");

async function joyas(message) {
    const lowercase = message.body.toLowerCase();
    const media = MessageMedia.fromFilePath('./src/assets/img/armaduras/joyas.jpeg');

    try {
        if (lowercase === '/joyas') {
            sony.sendMessage(
                message.from, 
                media, 
                {
                    caption: `*💎 JOYAS RECOMENDADAS PARA LAS ARMADURAS 💎*

✨ *¡Mejora tu armadura con las mejores joyas!* ✨

🅣🅗 ​ - ​ 🅑🅞🅣`
                }
            );
        }
    } catch (error) {
        th.warn('⚠️ Error en menu.js al enviar las joyas recomendadas');
    }
}

module.exports = joyas;
