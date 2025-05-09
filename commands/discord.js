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
    yellow_orb: 'Orbe Amarillo',
    chaos_dragon: 'Dragón del Caos',
    ancient_core: 'Núcleo Antiguo',
    chaos_core: 'Núcleo del Caos',
};

function normalizarClave(str) {
    return str.trim().toLowerCase().replace(/\s+/g, '_');
}

function traducirManual(texto) {
    const palabras = texto.split(/[\|,]/).map(p => normalizarClave(p.trim()));
    return palabras.map(palabra => traduccionesManual[palabra] || palabra.replace(/_/g, ' '));
}

function capitalizar(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

async function enviarAlertaWhatsApp(tipoRaw, fuente, minutos, imagen) {
    const tiposTraducidos = traducirManual(tipoRaw);
    const fuenteTraducida = capitalizar(fuente);
    const tiposTexto = tiposTraducidos.map(capitalizar).join(', ');

    const tiposConMedalla = ['watcher', 'chaos_dragon'];
    const tipoKeys = tiposTraducidos.map(t => normalizarClave(t));

    const esMedalla = tipoKeys.every(t => tiposConMedalla.includes(t));

    const recompensa = esMedalla
        ? `🎖️ *Recompensa:* Medalla de ${tiposTexto}`
        : `🎖️ *Recompensa:* ${tiposTexto}`;

    const mensaje =
`🌐 *${tiposTexto}* 🌐
${recompensa}
🪐 *Fuente:* ${fuenteTraducida}
⏳ *Quedan:* ${minutos} minutos

🅣🅗 ​ - ​ 🅑🅞🅣`;

    try {
        if (imagen && fs.existsSync(imagen)) {
            const media = await MessageMedia.fromFilePath(imagen);
            await sony.sendMessage(WHATSAPP_GROUP_ID, media, { caption: mensaje });
            th.success(`✅ Imagen de ${tiposTexto} enviada con mensaje.`);
        } else {
            await sony.sendMessage(WHATSAPP_GROUP_ID, mensaje);
            th.success(`✅ Mensaje de ${tiposTexto} enviado sin imagen.`);
        }
    } catch (err) {
        th.error(`❌ Error al enviar mensaje de ${tiposTexto}:`, err);
    }
}

let messageHandlerRegistered = false;

function discord() {
    if (global.discordBotInitialized) return;
    global.discordBotInitialized = true;

    try {
        discordClient.once('ready', () => {
            th.success(`🤖 Bot de Discord conectado como ${discordClient.user.tag}`);
        });

        discordClient.on('error', (error) => {
            th.error('❌ Error en el cliente de Discord:', error.message);
        });

        discordClient.on('shardError', (error) => {
            th.error('❌ Error de shard en Discord:', error.message);
        });

        process.on('unhandledRejection', (reason, promise) => {
            th.error('❌ Rechazo no manejado:', reason);
        });

        if (!messageHandlerRegistered) {
            discordClient.on('messageCreate', async (message) => {
                if (message.channel.id !== TARGET_CHANNEL_ID || !message.author.bot) return;

                const content = message.content || message.embeds[0]?.title || '';
                if (!content) return;

                const partes = content.split('|').map(p => p.trim());
                if (partes.length < 5) return;

                const [ , tipoRaw, fuenteRaw, tiempoRaw ] = partes;

                const fuente = traducirManual(fuenteRaw)[0] || fuenteRaw;

                let minutos = tiempoRaw.toLowerCase().replace('left', '').replace('m', '').trim();
                if (isNaN(minutos)) minutos = 'poco';

                const tiposRawNormalizados = tipoRaw.split(',').map(t => normalizarClave(t.trim()));
                const tipoSet = new Set(tiposRawNormalizados);

                let imagen = null;

                // Verifica combinaciones específicas primero
                if (tipoSet.has('red_orb') && tipoSet.has('yellow_orb')) {
                    imagen = path.join(__dirname, '../img/alertas/yellow_orb.jpg'); // Usa imagen combinada
                } else if (tipoSet.has('red_orb') && tipoSet.size === 1) {
                    imagen = path.join(__dirname, '../img/alertas/red_orbe.jpg');
                } else if (tipoSet.has('yellow_orb') && tipoSet.size === 1) {
                    imagen = path.join(__dirname, '../img/alertas/yellow_orb.jpg');
                } else if (tipoSet.has('watcher') && tipoSet.size === 1) {
                    imagen = path.join(__dirname, '../img/alertas/watcher.jpg');
                } else if (tipoSet.has('ancient_core') && tipoSet.size === 1) {
                    imagen = path.join(__dirname, '../img/alertas/ancient_core.jpg');
                } else if (tipoSet.has('chaos_core') && tipoSet.size === 1) {
                    imagen = path.join(__dirname, '../img/alertas/chaos_core.jpg');
                } else if (tipoSet.has('chaos_dragon') && tipoSet.size === 1) {
                    imagen = path.join(__dirname, '../img/alertas/chaos_dragon.jpg');
                }

                await enviarAlertaWhatsApp(tipoRaw, fuente, minutos, imagen);
                console.log(`[Discord] ${message.author.username}: ${content} en canal ${message.channel.id}`);
            });

            messageHandlerRegistered = true;
        }

        discordClient.login(DISCORD_BOT_TOKEN).catch(err => {
            th.warn('⚠️ No se pudo conectar a Discord. Continuando sin el bot.');
            th.error(err.message);
        });

    } catch (error) {
        th.warn('⚠️ Error al iniciar el cliente de Discord. Continuando sin conexión al bot.');
        th.error(error.message);
    }
}

module.exports = discord;
