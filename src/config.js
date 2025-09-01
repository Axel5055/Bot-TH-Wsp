require("dotenv").config();

module.exports = {
    // ⚡ Configuración de Discord
    discord: {
        token: process.env.DISCORD_BOT_TOKEN || "", // token del bot de Discord
        channelId: process.env.DISCORD_ALERT_CHANNEL_ID || "", // canal donde escucha mensajes
    },
};
