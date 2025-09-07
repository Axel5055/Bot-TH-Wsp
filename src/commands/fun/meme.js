const { MessageMedia } = require('whatsapp-web.js');
const hispamemes = require("hispamemes");
const th = require("consola");

async function meme(message) {
    try {
        // Asegurarse que sea un mensaje de texto
        if (!message.body) return;

        const lowercase = message.body.toLowerCase();

        if (lowercase !== 'meme') return; // salir si no es el comando

        const chat = await message.getChat();

        // Obtener el meme y validar que sea URL
        let momo;
        try {
            momo = hispamemes.meme();
            if (!momo || !/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i.test(momo)) {
                throw new Error('URL no valida');
            }
        } catch (err) {
            th.warn('No se pudo generar un meme válido:', err.message);
            await message.reply('Ocurrió un error al generar el meme. Intenta nuevamente 🪷');
            return; // salir sin afectar al bot
        }

        const momazo = await MessageMedia.fromUrl(momo);
        await chat.sendMessage(momazo);

    } catch (error) {
        // Captura errores inesperados
        th.error('Error inesperado en el comando meme:', error);
        // Aquí no hacemos throw, así que el bot sigue corriendo
    }
}

module.exports = meme;
