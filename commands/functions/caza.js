const th = require("../../src/client");

async function caza(message) {
    const lowercase = message.body.toLowerCase();

    if (lowercase === '/caza') {
        th.sendMessage(
            message.from,
            `*🏹 REGLAS DE CACERÍA 🏹*
            
---------------->>
¡Hola, chicos(as)! 👋😊

🎯 La cacería es una parte esencial del gremio y se llevará un *control semanal de domingo a domingo*. 📅

🔥 Los puntos requeridos son:

🔹*Nivel 2:* 21 puntos semanales (⚔️ 3 diarios recomendados).
🔹*Nivel 1:* 21 puntos semanales (*Solo castillos pequeños*, 🏹 3 diarios recomendados).

📌 Nota: No es necesario cazar exactamente 3 puntos al día; puedes acumularlos como prefieras, siempre y cuando al final de la semana alcances los 21 puntos. ✅

⚠️ Si no cumples con la cuota semanal, recibirás un aviso 🛑 y tendrás hasta el próximo reporte 📊 para ponerte al día. De no hacerlo, serás expulsado del gremio. 🚷

📩 Para dudas, contáctame:
🎮 En el juego (mensaje privado) 📨
📱 Por WhatsApp: +52 55 3890 1631 📲

---------------->>

🎯 Equivalencias de Puntos 🎯

🔥 Para los que cazan Nivel 2:

🔹 Nvl 2 ➝ 1 Punto
🔹 Nvl 3 ➝ 3 Puntos
🔹 Nvl 4 ➝ 9 Puntos
🔹 Nvl 5 ➝ 18 Puntos

🏰 Para los que cazan Nivel 1:

🔹 Nvl 1 ➝ 1 Punto
🔹 Nvl 2 ➝ 5 Puntos
🔹 Nvl 3 ➝ 15 Puntos
🔹 Nvl 4 ➝ 30 Puntos
🔹 Nvl 5 ➝ 70 Puntos

🎮 ¡Buen juego a todos! 🏹🔥

🅣🅗 ​ - ​ 🅑🅞🅣`
        );
    }
}

module.exports = caza;
