require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const sony = require('../src/client');
const th = require('consola');

const axios = require('axios');
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Variables de entorno
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

async function traducirConGPT(texto) {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'Eres un traductor de inglés a español y toma en cuenta que el contexto del texto es de lords mobile' },
                    { role: 'user', content: `Traduce al español: ${texto}` }
                ],
                temperature: 0.3
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data.choices[0].message.content.trim();
    } catch (error) {
        th.error('❌ Error al traducir con GPT:', error);
        return texto; // Si falla, retorna el texto original
    }
}



let messageHandlerRegistered = false; // bandera para evitar múltiples registros

function discord () {
    discordClient.once('ready', () => {
        th.success(`🤖 Bot de Discord conectado como ${discordClient.user.tag}`);
    });

    if (!messageHandlerRegistered) {
        discordClient.on('messageCreate', async (message) => {
            if (message.channel.id !== TARGET_CHANNEL_ID || !message.author.bot) return;

            let content = '';

            // Si tiene texto directo
            if (message.content) {
                const textoTraducido = await traducirConGPT(message.content);
                content += textoTraducido + '\n';
            }

            if (!content.trim()) return;

            const whatsappMsg = `📢 *Alerta desde Discord:*\n${content}`;

            try {
                await sony.sendMessage(WHATSAPP_GROUP_ID, whatsappMsg);
                th.success('✅ Alerta reenviada a WhatsApp.');
            } catch (error) {
                th.error('❌ Error al enviar mensaje a WhatsApp:', error);
            }

            // Log en consola para depuración
            const logContent = message.content || message.embeds[0]?.description || '[Embed sin descripción]';
            console.log(`[Discord] ${message.author.username}: ${logContent} en canal ${message.channel.id}`);
        });

        messageHandlerRegistered = true; // marcar como registrado
    }

    discordClient.login(DISCORD_BOT_TOKEN);
}



module.exports = discord;

