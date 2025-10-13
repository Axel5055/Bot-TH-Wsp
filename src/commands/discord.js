// require('dotenv').config();
// const { Client, GatewayIntentBits } = require('discord.js');
// const sony = require('../bot/client');
// const fs = require('fs');
// const { MessageMedia } = require('whatsapp-web.js');

// // 🔧 Utils y Config
// const logger = require('./utils/logger');
// const { traducirManual, normalizarClave, capitalizar } = require('./utils/traducciones');
// const { getImagenPath } = require('./config/imagenes');

// // 🔐 Variables de entorno
// const {
//     DISCORD_BOT_TOKEN,
//     DISCORD_ALERT_CHANNEL_ID: TARGET_CHANNEL_ID,
//     WHATSAPP_GROUP_ID
// } = process.env;

// if (!DISCORD_BOT_TOKEN || !TARGET_CHANNEL_ID || !WHATSAPP_GROUP_ID) {
//     logger.error("❌ Faltan variables de entorno requeridas. Revisa tu archivo .env");
//     process.exit(1);
// }

// // 🤖 Cliente de Discord
// const discordClient = new Client({
//     intents: [
//         GatewayIntentBits.Guilds,
//         GatewayIntentBits.GuildMessages,
//         GatewayIntentBits.MessageContent
//     ]
// });

// // 📲 Enviar mensaje/imagen a WhatsApp
// async function enviarAlertaWhatsApp(tipoRaw, fuente, minutos, imagen) {
//     const tiposTraducidos = traducirManual(tipoRaw).map(capitalizar);
//     const fuenteTraducida = capitalizar(fuente);
//     const tiposTexto = tiposTraducidos.join(', ');

//     const esMedalla = tiposTraducidos.every(t =>
//         ['Observador', 'Dragón del Caos'].includes(t)
//     );

//     const recompensa = esMedalla
//         ? `🎖️ *Recompensa:* Medalla de ${tiposTexto}`
//         : `🎖️ *Recompensa:* ${tiposTexto}`;

//     const mensaje = 
// `🌐 *${tiposTexto}* 🌐
// ${recompensa}
// 🪐 *Fuente:* ${fuenteTraducida}
// ⏳ *Quedan:* ${minutos} minutos

// 🅣🅗 ​ - ​ 🅑🅞🅣`;

//     try {
//         if (imagen && fs.existsSync(imagen)) {
//             const media = await MessageMedia.fromFilePath(imagen);
//             await sony.sendMessage(WHATSAPP_GROUP_ID, media, { caption: mensaje });
//             logger.success(`✅ Imagen de ${tiposTexto} enviada con mensaje.`);
//         } else {
//             await sony.sendMessage(WHATSAPP_GROUP_ID, mensaje);
//             logger.success(`✅ Mensaje de ${tiposTexto} enviado sin imagen.`);
//         }
//     } catch (err) {
//         logger.error(`❌ Error al enviar mensaje de ${tiposTexto}: ${err.message}`);
//     }
// }

// // 📡 Inicialización del bot de Discord
// function discord() {
//     if (global.discordBotInitialized) return;
//     global.discordBotInitialized = true;

//     // 🚀 Eventos del cliente
//     discordClient.once('ready', () => {
//         logger.success(`🤖 Bot de Discord conectado como ${discordClient.user.tag}`);
//     });

//     discordClient.on('error', error =>
//         logger.error('❌ Error en el cliente de Discord:', error.message)
//     );

//     discordClient.on('shardError', error =>
//         logger.error('❌ Error de shard en Discord:', error.message)
//     );

//     process.on('unhandledRejection', reason =>
//         logger.error('❌ Rechazo no manejado:', reason)
//     );

//     // 📥 Manejo de mensajes
//     discordClient.on('messageCreate', async (message) => {
//         if (message.channel.id !== TARGET_CHANNEL_ID || !message.author.bot) return;

//         const content = message.content || message.embeds[0]?.title || '';
//         if (!content) return;

//         const partes = content.split('|').map(p => p.trim());
//         if (partes.length < 5) return;

//         const [, tipoRaw, fuenteRaw, tiempoRaw] = partes;

//         const fuente = traducirManual(fuenteRaw)[0] || fuenteRaw;
//         let minutos = parseInt(tiempoRaw.replace(/[^\d]/g, ''), 10) || 'poco';

//         // 🔎 Determinar imagen
//         let imagen = null;
//         const tipoKeys = tipoRaw.split(',').map(t => normalizarClave(t));

//         if (tipoKeys.includes('red_orb') && tipoKeys.includes('yellow_orb')) {
//             imagen = getImagenPath('yellow_orb'); // caso especial: combinación
//         } else {
//             for (const key of tipoKeys) {
//                 imagen = getImagenPath(key);
//                 if (imagen) break;
//             }
//         }

//         await enviarAlertaWhatsApp(tipoRaw, fuente, minutos, imagen);
//         logger.info(`[Discord] ${message.author.username}: ${content}`);
//     });

//     // 🔑 Login
//     discordClient.login(DISCORD_BOT_TOKEN).catch(err => {
//         logger.warn('⚠️ No se pudo conectar a Discord. Continuando sin el bot.');
//         logger.error(err.message);
//     });
// }

// module.exports = discord;
