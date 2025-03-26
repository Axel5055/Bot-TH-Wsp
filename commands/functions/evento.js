const sony = require("../../src/client");

async function evento(message) {
    const lowercase = message.body.toLowerCase();

    if (lowercase === '/evento') {
        const chat = await message.getChat();

        if (chat.isGroup) {
            sony.sendMessage(
                message.from,
                `*🎯 REGLAS DE EVENTO INTERNO DE CACERÍA 🎯*
                
---------------->>
📅 El evento de este mes es: *"EL MEJOR CAZADOR"*

🎯 Las bases son simples: el mejor cazador de este mes recibirá *499 DIAMANTES*. Solo se toman en cuenta monstruos de *nivel 2* en adelante.

⏳ La vigencia del evento es hasta el *30 de Marzo*.

¡🏆 Suerte a todos y que gane el mejor! 🎉
---------------->>

❓ Para cualquier duda o consulta sobre la información, pueden escribirme ✍️

📜 Consulta las reglas de cacería fácilmente con el comando 👉 */caza*.

*Gracias por su atención.*
🅣🅗 ​ - ​ 🅑🅞🅣`
            );
        } else {
            message.reply('*⚠️ ¡Este comando solo se puede usar en un grupo! ⚠️*');
        }
    }
}

module.exports = evento;
