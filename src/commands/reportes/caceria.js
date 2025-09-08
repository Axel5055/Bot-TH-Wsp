const sony = require("../../bot/client");
const xlsx = require("xlsx");
const moment = require("moment-timezone");
const logger = require("../utils/logger");
require("moment/locale/es"); // Español

const FILE_PATH = './src/assets/excel/caza.xlsx';

async function caceria(message) {
    const body = message.body.trim();
    const lowercase = body.toLowerCase();

    try {
        if (lowercase.startsWith('/stats')) {
            await estadisticasIndividual(body, message);
        } else if (lowercase === '/sgeneral') {
            await estadisticasGeneral(message);
        } else if (lowercase === '/top10') {
            await top10Semanal(message);
        } else if (lowercase.startsWith('/ranking')) {
            await top10Mensual(message);
        }
    } catch (error) {
        logger.error("⚠️ Error al procesar comando de cacería:", error);
        await sony.sendMessage(message.from, '*⚠️ Ocurrió un error al procesar la solicitud. Intenta nuevamente.*');
    }
}

// ==========================
// 🧾 Estadísticas individuales
// ==========================
async function estadisticasIndividual(body, message) {
    await message.react('🦊');

    const searchTerm = body.substring(7).trim(); // Extrae el nombre después de '/stats'
    if (!searchTerm) {
        return sony.sendMessage(message.from, '*⚠️ Proporciona un nombre para buscar. Ejemplo: /stats Juan Pérez*');
    }

    const workbook = xlsx.readFile(FILE_PATH);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);
    const fechaReporte = sheet['L2']?.v || 'Fecha desconocida';

    const userData = data.find(row => String(row['Nombre']).toLowerCase() === searchTerm.toLowerCase());
    if (!userData) {
        return sony.sendMessage(message.from, `*⚠️ No se encontraron estadísticas para "${searchTerm}".*`);
    }

    const statusIcon = userData.Status === 'Cumplio' ? '✅' : '❌';
    let tipo = "General", puntos = userData.Puntos || 0;

    if (userData.Cuota?.includes("4lvl2")) {
        tipo = "Nivel 2";
        puntos = userData["Puntos Nvl 2"] || 0;
    } else if (userData.Cuota?.includes("4lvl1")) {
        tipo = "Nivel 1";
        puntos = userData["Puntos Nvl 1"] || 0;
    }

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

🅣🅗 ​ - ​ 🅑🅞🅣`;

    await sony.sendMessage(message.from, response);
    logger.success(`✅ Estadísticas individuales enviadas para ${userData.Nombre}`);
}

// ==========================
// 📊 Estadísticas generales
// ==========================
async function estadisticasGeneral(message) {
    const workbook = xlsx.readFile(FILE_PATH);
    const sheet = workbook.Sheets[workbook.SheetNames[2]]; // Hoja 3
    const totalCaza = sheet['D3']?.v || 0;
    const niveles = ['E3','F3','G3','H3','I3'].map(cell => sheet[cell]?.v || 0);
    const fechaReporte = sheet['L1']?.v || 'Fecha desconocida';

    const response = `👋 ¡Hola, cazadores! 👋
Aquí te dejo las *Estadísticas de Cacería General* 🤩
                
🧮 *Total de Caza:* ${totalCaza} Mobs

🔹 *L1:* ${niveles[0]} Mobs 🐰
🔹 *L2:* ${niveles[1]} Mobs 🐺
🔹 *L3:* ${niveles[2]} Mobs 🐲
🔹 *L4:* ${niveles[3]} Mobs 🐧
🔹 *L5:* ${niveles[4]} Mobs 🐯

*Fecha Reporte:* ${fechaReporte}

🅣🅗 ​ - ​ 🅑🅞🅣`;

    await sony.sendMessage(message.from, response);
    logger.success("✅ Estadísticas generales enviadas");
}

// ==========================
// 🏆 Top 10 semanal
// ==========================
async function top10Semanal(message) {
    const workbook = xlsx.readFile(FILE_PATH);
    const sheet = workbook.Sheets[workbook.SheetNames[1]]; // Hoja 2
    const data = xlsx.utils.sheet_to_json(sheet);
    const fechaReporte = sheet['E2']?.v || 'Fecha desconocida';

    const topCazadores = data
        .sort((a, b) => (b.Puntos || 0) - (a.Puntos || 0))
        .slice(0, 10);

    if (topCazadores.length === 0) {
        await sony.sendMessage(message.from, '*⚠️ No se encontraron suficientes datos para mostrar el Top 10.*');
        return logger.warn("⚠️ Top 10 semanal vacío");
    }

    let response = `👏 ¡Felicidades a los *10 Mejores Cazadores de la Semana*! 👏\n\n`;
    response += `Estos son los jugadores con *mejor puntaje de caza*. 🎮\n\n`;

    const medallas = ['🥇', '🥈', '🥉', '🏅', '🏅', '🏅', '🏅', '🏅', '🏅', '🏅'];
    topCazadores.forEach((cazador, index) => {
        const puntos = cazador.Puntos || 0;
        const totalMobs = cazador.Total || 0;
        const nombre = cazador.Nombre || 'Desconocido';
        response += `${index + 1}. ${medallas[index]} *${nombre}:* ${puntos} Pts */* ${totalMobs} Mobs ${getRandomIcono()}\n`;
    });

    response += `\n*Fecha Caza:* ${fechaReporte}`;
    response += `\n\n🅣🅗 ​ - ​ 🅑🅞🅣`;

    await sony.sendMessage(message.from, response);
    logger.success("✅ Top 10 semanal enviado");
}

// ==========================
// 🏆 Top 10 mensual
// ==========================
async function top10Mensual(message) {
    const workbook = xlsx.readFile(FILE_PATH);
    const sheet = workbook.Sheets[workbook.SheetNames[3]]; // Hoja 4
    const data = xlsx.utils.sheet_to_json(sheet);

    const topCazadores = data
        .sort((a, b) => (b.Total || 0) - (a.Total || 0))
        .slice(0, 10);

    if (topCazadores.length === 0) {
        await sony.sendMessage(message.from, '*⚠️ No se encontraron suficientes datos para mostrar el Ranking.*');
        return logger.warn("⚠️ Ranking mensual vacío");
    }

    moment.locale("es");
    const mesActual = moment().tz("America/Mexico_City").format("MMMM");
    const anioActual = moment().tz("America/Mexico_City").format("YYYY");
    const mesCapitalizado = mesActual.charAt(0).toUpperCase() + mesActual.slice(1);

    let response = `🏆 *¡Ranking de los 10 Mejores Cazadores del Mes!* 🏆\n\n`;
    response += `🎯 Estos son los jugadores con los *mejores puntajes de caza*. 🎮\n\n`;

    const medallas = ['🥇', '🥈', '🥉', '🏅', '🏅', '🏅', '🏅', '🏅', '🏅', '🏅'];
    topCazadores.forEach((cazador, index) => {
        const nombre = cazador.Nombre || 'Desconocido';
        const total = cazador.Total || 0;
        response += `${index + 1}. ${medallas[index]} *${nombre}:* ${total} Pts ${getRandomIcono()}\n`;
    });

    response += `\n🔥 ¡Sigan cazando y demostrando su habilidad! 💪\n`;
    response += `\n*Evento de Cacería - Mes de ${mesCapitalizado} ${anioActual}*`;
    response += `\n\n🅣🅗 ​ - ​ 🅑🅞🅣`;

    await sony.sendMessage(message.from, response);
    logger.success("✅ Ranking mensual enviado");
}

// ==========================
// 🔹 Iconos aleatorios
// ==========================
function getRandomIcono() {
    const iconos = ['🐉', '🦁', '🐺', '🐗', '🐻', '🐊', '🦄', '🐲', '🦌', '🕊️'];
    const randomIndex = Math.floor(Math.random() * iconos.length);
    return iconos[randomIndex];
}

module.exports = caceria;
