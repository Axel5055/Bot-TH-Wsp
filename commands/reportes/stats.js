const sony = require("../../src/client");
const xlsx = require("xlsx");

async function leerEstadisticas(message) {
    const { body, from } = message;
    const lowercase = body.toLowerCase();
    const filePath = './commands/excel/caza.xlsx';

    if (!lowercase.startsWith('/stats')) return;

    try {
        await message.react('🦊');

        const searchTerm = body.substring(7).trim(); // Extrae el nombre después de '/stats'
        if (!searchTerm) {
            return sony.sendMessage(from, '*⚠️ Por favor, proporciona un nombre para buscar. Ejemplo: /stats Juan Pérez*');
        }

        // Leer el archivo Excel
        const workbook = xlsx.readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet);
        const fechaReporte = sheet['L2']?.v || 'Fecha desconocida';

        // Buscar usuario
        const userData = data.find(row => String(row['Nombre']).toLowerCase() === searchTerm.toLowerCase());
        if (!userData) {
            return sony.sendMessage(from, `*⚠️ No se encontraron estadísticas para "${searchTerm}".*`);
        }

        // Determinar estado y puntos
        const statusIcon = userData.Status === 'Cumplio' ? '✅' : '❌';
        let tipo = "General", puntos = userData.Puntos || 0;

        if (userData.Cuota?.includes("4lvl2")) {
            tipo = "Nivel 2";
            puntos = userData["Puntos Nvl 2"] || 0;
        } else if (userData.Cuota?.includes("4lvl1")) {
            tipo = "Nivel 1";
            puntos = userData["Puntos Nvl 1"] || 0;
        }

        // Construir mensaje
        const response = `👋 ¡Hola, *${userData.Nombre}*! 👋
Aquí están tus *Estadísticas de Cacería* 🤩

🎯 *Tipo de Caza:* ${tipo}
🎯 *Total de Caza Semanal:* ${userData['Total Semanal'] || 0} Mobs
🧮 *Total de Puntos:* ${puntos} Puntos
*Status:* ${userData.Status} ${statusIcon}

🎯 *L1:* ${userData['Total Mobs lvl 1'] || 0} Mobs 🐰
🎯 *L2:* ${userData['Total Mobs lvl 2'] || 0} Mobs 🐺
🎯 *L3:* ${userData['Total Mobs lvl 3'] || 0} Mobs 🐲
🎯 *L4:* ${userData['Total Mobs lvl 4'] || 0} Mobs 🐧
🎯 *L5:* ${userData['Total Mobs lvl 5'] || 0} Mobs 🐯

📅 *Fecha Reporte:* ${fechaReporte}
---------------->> 
🅣🅗 ​ - ​ 🅑🅞🅣`;

        // Enviar el mensaje
        sony.sendMessage(from, response);
    } catch (error) {
        console.error('⚠️ Error al leer el archivo Excel:', error);
        sony.sendMessage(from, '*⚠️ Ocurrió un error al procesar la solicitud. Intenta nuevamente.*');
    }
}

module.exports = leerEstadisticas;
