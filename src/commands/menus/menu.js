const sony = require("../../bot/client");
const { MessageMedia } = require("whatsapp-web.js");
const logger = require("../utils/logger");

// 📌 Configuración
const MENU_IMAGE_PATH = "./src/assets/img/bot.jpg";
const COMMANDS = ["/menu", "/menú", "/help"];

// 📌 Menú en formato legible
const MENU_TEXT = `
*🦊 TH BOT 🦊*
---------------->>  
*📜 MENÚS DISPONIBLES*  
---------------->>  

🦊 */mgeneral*   → Menú de comandos generales  
🦊 */meventos*  → Menú de eventos (FDG, arena, etc.)  
🦊 */mcaceria*  → Menú de Cacería/Evento Interno  
🦊 */mtodos*    → Menú de menciones  
🦊 */marmaduras* → Menú de Armaduras  
🦊 */mreportes* → Menú de Reportes  
🦊 */mescudos*  → Menú de Escudos  
🦊 */mcuentas*  → Menú de Multicuentas  

 
🅣🅗 - 🅑🅞🅣
`;

async function menu(message) {
    try {
        const body = message.body?.toLowerCase().trim();
        if (!COMMANDS.includes(body)) return; // Ignora mensajes que no son del menú

        // Cargar imagen
        const media = MessageMedia.fromFilePath(MENU_IMAGE_PATH);

        // Enviar menú con imagen + caption
        await sony.sendMessage(message.from, media, { caption: MENU_TEXT });

        logger.success(`✅ Menú enviado a ${message.from}`);
    } catch (error) {
        logger.error("❌ Error en menu.js al enviar el menú:", error);
        await message.reply("*⚠️ No se pudo mostrar el menú. Intenta nuevamente.*");
    }
}

module.exports = menu;
