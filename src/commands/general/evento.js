const sony = require("../../bot/client");

async function evento(message) {
    const body = message.body?.toLowerCase().trim();

    if (body === "/evento") {
        const chat = await message.getChat();

        if (!chat.isGroup) {
            return message.reply("*⚠️ Este comando solo se puede usar en un grupo.*");
        }

        // 🔹 Datos configurables (fácil de cambiar)
        const eventoNombre = "EL MEJOR CAZADOR";
        const premio = "499 💎 DIAMANTES";
        const fechaFin = "6 de Octubre de 2025";
        const requisito = "Monstruos de nivel 2 en adelante";

        // 🔹 Mensaje del evento
        const mensajeEvento = `
*🎯 REGLAS DEL EVENTO INTERNO DE CACERÍA 🎯*

📅 Evento del mes: *${eventoNombre}*

🏆 Premio: *${premio}*

⚔️ Requisito: *${requisito}*

⏳ Vigencia: *Hasta el ${fechaFin}*

🔥 ¡Demuestra tu habilidad y conviértete en el mejor cazador! 🔥

❓ Para dudas o consultas pueden escribirme ✍️
📜 Consulta las reglas de cacería fácilmente con 👉 */caza*

*Gracias por su atención.*

🅣🅗 - 🅑🅞🅣
        `;

        await sony.sendMessage(message.from, mensajeEvento);
    }
}

module.exports = evento;
