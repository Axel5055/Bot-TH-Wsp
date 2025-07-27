const sony = require("../../bot/client");
const xlsx = require("xlsx");
const th = require("consola");

async function topCazadores(message) {
    const lowercase = message.body.toLowerCase();
    const filePath = './src/assets/excel/caza.xlsx'; // Ruta del archivo Excel

    try {
        if (lowercase.startsWith('/top10')) {
            // Leer y procesar el archivo Excel
            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[1]; // Primera hoja
            const sheet = workbook.Sheets[sheetName];
            const data = xlsx.utils.sheet_to_json(sheet); // Convertir hoja a JSON
            const fechaReporte = sheet['E2'] ? sheet['E2'].v : 'Fecha desconocida'; // Fecha del reporte

            // Ordenar los datos por puntaje (columna "Puntos") de mayor a menor
            const topCazadores = data
                .sort((a, b) => b.Puntos - a.Puntos) // Orden descendente por puntos
                .slice(0, 10); // Obtener los primeros 10

            if (topCazadores.length > 0) {
                // Construir el mensaje con los 10 mejores cazadores
                let response = `👏 ¡Felicidades a los *10 Mejores Cazadores de la Semana*! 👏\n\n`;
                response += `Estos son los Jugadores con *Mejor Puntaje de Caza*. 🎮\n\n`;

                const medallas = ['🥇', '🥈', '🥉', '🏅', '🏅', '🏅', '🏅', '🏅', '🏅', '🏅'];
                topCazadores.forEach((cazador, index) => {
                    response += `${index + 1}. ${medallas[index]} *${cazador.Nombre}:* ${cazador.Puntos} Pts */* ${cazador.Total} Mobs ${getRandomIcono()}\n`;
                });

                response += `\n*Fecha Caza:* ${fechaReporte}`;
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
