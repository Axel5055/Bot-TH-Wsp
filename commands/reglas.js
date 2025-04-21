const sony = require("../src/client");

const REGLAS_GRUPO = `
*📜 REGLAMENTO DEL GRUPO 📜*

---------------->>
|  🦊 > Respeto ante todo.
|  🦊 > No usar stickers ni subir links +18.
|  🦊 > No hacer spam con los comandos del bot.
|  🦊 > No se tolera el racismo.
|  🦊 > No discriminar a nadie por sus preferencias de cualquier tipo.
|
---------------->>
| *¿QUÉ SI ESTÁ PERMITIDO?*
|
|  🦊 > Pedir ayuda sobre temas del juego y gremio. (spam, escudos, etc).
|  🦊 > Venta de sus cuentas sin hacer spam, solamente.
|  🦊 > Publicar eventos de cacería.
|
---------------->>

POR SU ATENCIÓN, GRACIAS.
🅣🅗 ​ - ​ 🅑🅞🅣
`;

async function reglas(message) {
    const lowercase = message.body.toLowerCase();

    if (lowercase === '/reglas') {
        const chat = await message.getChat();

        // Depuración: Verifica el ID del chat
        console.log("ID del chat:", chat.id);

        // Verifica si el chat es un grupo basado en el formato del ID
        if (chat.id.server === 'g.us') {  // Los chats de grupo en WhatsApp suelen tener 'g.us' como servidor
            await sony.sendMessage(message.from, REGLAS_GRUPO);
        } else {
            message.reply('*¡Este comando solo se puede usar en un grupo!*');
        }
    }
}

module.exports = reglas;
