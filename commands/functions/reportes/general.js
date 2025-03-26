const sony = require("../../../src/client");
const xlsx = require("xlsx");
const th = require("consola");

async function reporteCaceria(message) {
    const lowercase = message.body.toLowerCase();
    const filePath = './commands/functions/excel/caza.xlsx'; // Ruta del archivo Excel

    try {
        if (lowercase === '/sgeneral') {
            // Cargar el archivo Excel
            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[2]; // Primera hoja
            const sheet = workbook.Sheets[sheetName];

            // Leer celdas específicas
            const totalCaza = sheet['D3'] ? sheet['D3'].v : '0'; // Total de caza
            const nivel1 = sheet['E3'] ? sheet['E3'].v : '0';    // Nivel 1
            const nivel2 = sheet['F3'] ? sheet['F3'].v : '0';    // Nivel 2
            const nivel3 = sheet['G3'] ? sheet['G3'].v : '0';    // Nivel 3
            const nivel4 = sheet['H3'] ? sheet['H3'].v : '0';    // Nivel 4
            const nivel5 = sheet['I3'] ? sheet['I3'].v : '0';    // Nivel 5
            const fechaReporte = sheet['L1'] ? sheet['L1'].v : 'Fecha desconocida'; // Fecha del reporte

            // Construir el mensaje
            const response = `👋 ¡Hola, cazadores! 👋
Aquí te dejo las *Estadísticas de Cacería General* 🤩
                
🧮 *Total de Caza:* ${totalCaza} Mobs

🔹 *L1:* ${nivel1} Mobs 🐰
🔹 *L2:* ${nivel2} Mobs 🐺
🔹 *L3:* ${nivel3} Mobs 🐲
🔹 *L4:* ${nivel4} Mobs 🐧
🔹 *L5:* ${nivel5} Mobs 🐯

*Fecha Reporte:* ${fechaReporte}

---------------->> 
🅣🅗 ​ - ​ 🅑🅞🅣`;

            // Enviar el mensaje
            sony.sendMessage(message.from, response);
        }
    } catch (error) {
        th.warn('⚠️ Error al generar el reporte de cacería:', error);
        sony.sendMessage(
            message.from,
            '*⚠️ Ocurrió un error al procesar las estadísticas. Intenta nuevamente más tarde.*'
        );
    }
}

module.exports = reporteCaceria;
