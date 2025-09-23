const sony = require("../../bot/client");
const xlsx = require("xlsx");
const logger = require("../utils/logger");

const FILE_PATH = './src/assets/excel/caza.xlsx';

// ==========================
// 📋 Lista de números permitidos
// ==========================
const ALLOWED_NUMBERS = [
    "5215538901631", // Tu número
    "5215587654321", // Otro admin
    // agrega más si quieres
];

async function avisos(message) {
    const body = message.body.trim().toLowerCase();

    try {
        if (body === '/enviaravisos') {
            const sender = await message.getContact();

            // Validar si el número está permitido
            if (!ALLOWED_NUMBERS.includes(sender.number)) {
                const chat = await message.getChat();
                const warningMsg = `🚫 El número *${sender.pushname || "Desconocido"}* (${sender.number}) intentó usar el comando *"/enviaravisos"* sin permiso.`;

                logger.warn(warningMsg);
                await sony.sendMessage(message.from, `⚠️ *No tienes permisos para usar este comando.*`);
                await sony.sendMessage(message.from, warningMsg); // Notificar en el grupo/chat
                return;
            }

            // Log de quién ejecutó
            const chat = await message.getChat();
            logger.success(`🛡️ El autorizado "${sender.pushname}" (${sender.number}) ejecutó /enviaravisos en "${chat.name || 'chat privado'}"`);

            await enviarAvisos(message);
        }
    } catch (error) {
        logger.error("⚠️ Error al procesar comando de avisos:", error);
        await sony.sendMessage(message.from, '*⚠️ Ocurrió un error al enviar los avisos. Intenta nuevamente.*');
    }
}

// ==========================
// 📢 Enviar avisos individuales
// ==========================
async function enviarAvisos(message) {
    await message.react('📢');

    const workbook = xlsx.readFile(FILE_PATH);
    const sheet = workbook.Sheets["Avisos"];
    const data = xlsx.utils.sheet_to_json(sheet);

    if (data.length === 0) {
        return sony.sendMessage(message.from, '*⚠️ No se encontraron registros en la hoja Avisos.*');
    }

    for (const userData of data) {
        try {
            const nombre = userData['Nombre'] || 'Desconocido';
            const cuota = userData['Cuota Diaria'] || '';
            const totalSemanal = userData['Total Semanal'] || 0;
            const mob1 = userData['Mob1'] || 0;
            const mob2 = userData['Mob2'] || 0;
            const mob3 = userData['Mob3'] || 0;
            const mob4 = userData['Mob4'] || 0;
            const mob5 = userData['Mob5'] || 0;
            const puntosNvl2 = userData['Puntos Nvl 2'] || 0;
            const puntosNvl1 = userData['Puntos Nvl 1'] || 0;
            const debe = userData['Debe'] || 0;
            const numero = userData['Numero'];

            // Elegir puntaje según la cuota
            let tipo = "General";
            let puntos = 0;

            if (String(cuota).toLowerCase().includes("4lvl2")) {
                tipo = "Nivel 2";
                puntos = puntosNvl2;
            } else if (String(cuota).toLowerCase().includes("4lvl1")) {
                tipo = "Nivel 1";
                puntos = puntosNvl1;
            }

            const metaSemanal = 28;
            const totalProximaSemana = metaSemanal + debe;

            const response = `📢 *Aviso de Cacería* 📢

👋 ¡Hola, *${nombre}*! 👋

⚠️ Tu *status* esta semana fue: ❌ *NO CUMPLIÓ*  

🎯 *Tipo de Caza:* ${tipo}
🎯 *Total de Caza Semanal:* ${totalSemanal} Mobs
🧮 *Total de Puntos:* ${puntos} Puntos

📊 *Detalle de mobs realizados:*
🔹 *L1*: ${mob1} Mobs 🐰
🔹 *L2*: ${mob2} Mobs 🐺
🔹 *L3*: ${mob3} Mobs 🐲
🔹 *L4*: ${mob4} Mobs 🐧
🔹 *L5*: ${mob5} Mobs 🐯

❌ Te faltaron *${debe} puntos* para llegar a la meta mínima de *${metaSemanal}*.

📌 Recuerda que tienes *1 semana para reponer esos ${debe} puntos* más los ${metaSemanal} de la nueva semana.

➡️ En total deberás cumplir: *${totalProximaSemana} puntos*.

🅣🅗 ​ - ​ 🅑🅞🅣`;

            if (numero) {
                await sony.sendMessage(numero + "@c.us", response);
                logger.success(`✅ Aviso enviado a ${nombre} (${numero})`);
            } else {
                logger.warn(`⚠️ No se encontró número para ${nombre}`);
            }

        } catch (err) {
            logger.error(`⚠️ Error enviando aviso a un usuario:`, err);
        }
    }

    await sony.sendMessage(message.from, '✅ *Avisos enviados a todos los jugadores con status "No Cumplió".*');
}

module.exports = avisos;
