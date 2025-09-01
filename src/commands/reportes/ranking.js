const sony = require("../../bot/client");
const xlsx = require("xlsx");
const th = require("consola");
const moment = require("moment-timezone");
require("moment/locale/es"); // 📌 Importar idioma español

async function topCazadores(message) {
    const lowercase = message.body.toLowerCase();
    const filePath = './src/assets/excel/caza.xlsx';

    try {
        if (lowercase.startsWith('/ranking')) {
            // Leer y procesar el archivo Excel
            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[3];
            const sheet = workbook.Sheets[sheetName];
            const data = xlsx.utils.sheet_to_json(sheet);

            // Ordenar los datos por puntaje (columna "Total") de mayor a menor
            const topCazadores = data
                .sort((a, b) => b.Total - a.Total)
                .slice(0, 10);

            if (topCazadores.length > 0) {
                // 📌 Forzar el idioma a español
                moment.locale("es");

                // Mes y año actual en español
                const mesActual = moment().tz("America/Mexico_City").format("MMMM");
                const anioActual = moment().tz("America/Mexico_City").format("YYYY");

                // Capitalizar primera letra del mes
                const mesCapitalizado = mesActual.charAt(0).toUpperCase() + mesActual.slice(1);

                // Construir el mensaje con los 10 mejores cazadores
                let response = `🏆 *¡Ranking de los 10 Mejores Cazadores del Mes!* 🏆\n\n`;
                response += `🎯 Estos son los jugadores con los *mejores puntajes de caza*. 🎮\n\n`;

                const medallas = ['🥇', '🥈', '🥉', '🏅', '🏅', '🏅', '🏅', '🏅', '🏅', '🏅'];
                topCazadores.forEach((cazador, index) => {
                    response += `${index + 1}. ${medallas[index]} *${cazador.Nombre}:* ${cazador.Total} Pts ${getRandomIcono()}\n`;
                });

                response += `\n🔥 ¡Sigan cazando y demostrando su habilidad, el premio está en juego! 💪\n`;
                response += `\n*Evento de Cacería - Mes de ${mesCapitalizado} ${anioActual}*`;
                response += `\n\n🅣🅗 ​ - ​ 🅑🅞🅣`;

                sony.sendMessage(message.from, response);
            } else {
                sony.sendMessage(
                    message.from,
                    '*⚠️ No se encontraron suficientes datos para mostrar el Top 10.*'
                );
            }
        }
    } catch (error) {
        th.warn('⚠️ Error al generar el Top 10 de cazadores:', error);
        sony.sendMessage(
            message.from,
            '*⚠️ Ocurrió un error al procesar la solicitud. Intenta nuevamente.*'
        );
    }
}

// Función para obtener un ícono aleatorio
function getRandomIcono() {
    const iconos = ['🐉', '🦁', '🐺', '🐗', '🐻', '🐊', '🦄', '🐲', '🦌', '🕊️'];
    const randomIndex = Math.floor(Math.random() * iconos.length);
    return iconos[randomIndex];
}

module.exports = topCazadores;
