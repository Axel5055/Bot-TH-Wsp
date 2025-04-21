const sony = require("../../src/client");
const xlsx = require("xlsx");
const th = require("consola");

async function topCazadores(message) {
    const lowercase = message.body.toLowerCase();
    const filePath = './commands/excel/caza.xlsx'; // Ruta del archivo Excel

    try {
        if (lowercase.startsWith('/ranking')) {
            // Leer y procesar el archivo Excel
            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[3]; // Primera hoja
            const sheet = workbook.Sheets[sheetName];
            const data = xlsx.utils.sheet_to_json(sheet); // Convertir hoja a JSON

            // Ordenar los datos por puntaje (columna "Total") de mayor a menor
            const topCazadores = data
                .sort((a, b) => b.Total - a.Total) // Orden descendente por puntos
                .slice(0, 10); // Obtener los primeros 10

            if (topCazadores.length > 0) {
                // Construir el mensaje con los 10 mejores cazadores
                let response = `🏆 *¡Ranking de los 10 Mejores Cazadores del Mes!* 🏆\n\n`;
                response += `🎯 Estos son los jugadores con los *mejores puntajes de caza*. 🎮\n\n`;
                response += `📢 *Recuerden:* ¡El primer lugar al final del mes será el ganador de 499 DIAMANTES! 🥇🎁\n\n`;

                const medallas = ['🥇', '🥈', '🥉', '🏅', '🏅', '🏅', '🏅', '🏅', '🏅', '🏅'];
                topCazadores.forEach((cazador, index) => {
                    response += `${index + 1}. ${medallas[index]} *${cazador.Nombre}:* ${cazador.Total} Pts ${getRandomIcono()}\n`;
                });

                response += `\n🔥 ¡Sigan cazando y demostrando su habilidad, el premio está en juego! 💪\n`;
                response += `\n*Evento de Caceria mes de Abril*`;
                response += `\n\n🅣🅗 ​ - ​ 🅑🅞🅣`;

                // Enviar el mensaje con los resultados
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
