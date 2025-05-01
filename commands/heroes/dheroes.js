const sony = require("../../src/client");
const { MessageMedia } = require('whatsapp-web.js');
const th = require("consola");

async function dheroes(message) {
    const lowercase = message.body.toLowerCase();
    const media = MessageMedia.fromFilePath('./img/heroes/dheroes.jpeg');

    try {
        if (lowercase === '/dheroes') {
            sony.sendMessage(
                message.from, 
                media, 
                {
                    caption: `*🐝 ¡Heroes de Fortaleza! 🏹✨*

💥 Aquí tienes a que tipo pertenece cada heroe en las fortalezas 💥

🅣🅗 ​ - ​ 🅑🅞🅣`
                }
            );
        }
    } catch (error) {
        th.warn('⚠️ Error en aheroes.js al enviar la alineacion');
    }
}

module.exports = dheroes;
