const sony = require("../../src/client");
const { MessageMedia } = require('whatsapp-web.js');
const th = require("consola");

async function serpiente(message) {
    const lowercase = message.body.toLowerCase();
    const media = MessageMedia.fromFilePath('./img/mobs/serpiente.jpg');

    try {
        if (lowercase === '/serpiente') {
            sony.sendMessage(
                message.from, 
                media, 
                {
                    caption: `*🐍⚔️ ¡Combinación de Héroes para Cazar al Mob Serpiente! ⚔️🐍*

💥 Para derrotar a la astuta y venenosa Serpiente, esta es la alineación de héroes que te permitirá tener éxito 💥

🅣🅗 ​ - ​ 🅑🅞🅣`
                }
            );
        }
    } catch (error) {
        th.warn('⚠️ Error en menu.js al enviar la alineacion');
    }
}

module.exports = serpiente;
