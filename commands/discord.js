require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const sony = require('../src/client');
const th = require('consola');
const path = require('path');
const fs = require('fs');
const { MessageMedia } = require('whatsapp-web.js');


const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const TARGET_CHANNEL_ID = process.env.DISCORD_ALERT_CHANNEL_ID;
const WHATSAPP_GROUP_ID = process.env.WHATSAPP_GROUP_ID;

const discordClient = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const traduccionesManual = {
    watcher: 'Observador',
    research: 'Investigación',
    building: 'Construcción',
    merging: 'Pactos',
    hunting: 'Cacería',
    labyrinth: 'Laberinto',
    tycoon: 'Magnate',
    artifact: 'Artefactos',
    red_orb: 'Orbe Rojo',
    yellow_orb: 'Orbe Amarillo'
};

function traducirManual(texto) {
    const palabras = texto.split('|').map(p => p.trim().toLowerCase());
    return palabras.map(palabra => {
        return traduccionesManual[palabra] || palabra;
    });
}

let messageHandlerRegistered = false;

function discord() {
    discordClient.once('ready', () => {
        th.success(`🤖 Bot de Discord conectado como ${discordClient.user.tag}`);
    });

    if (!messageHandlerRegistered) {
        discordClient.on('messageCreate', async (message) => {
            if (message.channel.id !== TARGET_CHANNEL_ID || !message.author.bot) return;

            let content = message.content || message.embeds[0]?.title || '';
            if (!content) return;

            // Ejemplo esperado: "Hell | Watcher | Tycoon | 59m left | 128K"
            const partes = content.split('|').map(p => p.trim());
            if (partes.length < 5) return;

            const [, tipo, fuente, tiempo] = partes;
            const [tipoTraducido, fuenteTraducida] = traducirManual(`${tipo}|${fuente}`);

            let minutos = tiempo.toLowerCase().replace('left', '').replace('m', '').trim();
            if (isNaN(minutos)) minutos = 'poco';

            const mensajeWatcher = 
`🌐 *${capitalizar(tipoTraducido)}* 🌐
🪐 *Fuente:* ${capitalizar(fuenteTraducida)}
🎖️ *Recompensa:* Medalla de ${capitalizar(tipoTraducido)}
⏳ *Quedan:* ${minutos} minutos

🅣🅗 ​ - ​ 🅑🅞🅣`;

const mensajeRedOrb = 
`🌐 *${capitalizar(tipoTraducido)}* 🌐
🪐 *Fuente:* ${capitalizar(fuenteTraducida)}
🎖️ *Recompensa:* ${capitalizar(tipoTraducido)}
⏳ *Quedan:* ${minutos} minutos

🅣🅗 ​ - ​ 🅑🅞🅣`;

            try {
                if (tipo.toLowerCase() === 'watcher') {
                    const imagePath = path.join(__dirname, '../img/alertas/watcher.jpg'); // Ajusta ruta si es necesario
                    if (fs.existsSync(imagePath)) {
                        const media = await MessageMedia.fromFilePath(imagePath);
                        await sony.sendMessage(WHATSAPP_GROUP_ID, media, { caption: mensajeWatcher });
                        th.success('✅ Imagen de Watcher enviada con mensaje.');
                    } else {
                        th.warn('⚠️ Imagen de Watcher no encontrada. Enviando solo mensaje.');
                        await sony.sendMessage(WHATSAPP_GROUP_ID, mensajeWatcher);
                    }
                }else if (tipo.toLowerCase() === 'red_orb') {
                    const imagePath = path.join(__dirname, '../img/alertas/watcher.jpg'); // Ajusta ruta si es necesario
                    if (fs.existsSync(imagePath)) {
                        const media = await MessageMedia.fromFilePath(imagePath);
                        await sony.sendMessage(WHATSAPP_GROUP_ID, media, { caption: mensajeRedOrb });
                        th.success('✅ Imagen de Watcher enviada con mensaje.');
                    } else {
                        th.warn('⚠️ Imagen de Watcher no encontrada. Enviando solo mensaje.');
                        await sony.sendMessage(WHATSAPP_GROUP_ID, mensajeRedOrb);
                    }
                } 
                else {
                    await sony.sendMessage(WHATSAPP_GROUP_ID, mensajeWatcher);
                }
                th.success('✅ Alerta personalizada enviada a WhatsApp.');
            } catch (error) {
                th.error('❌ Error al enviar mensaje a WhatsApp:', error);
            }

            const logContent = message.content || message.embeds[0]?.title || '[Mensaje sin contenido]';
            console.log(`[Discord] ${message.author.username}: ${logContent} en canal ${message.channel.id}`);
        });

        messageHandlerRegistered = true;
    }

    discordClient.login(DISCORD_BOT_TOKEN);
}

function capitalizar(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = discord;
