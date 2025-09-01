// discord.js
const { Client, GatewayIntentBits, Events } = require("discord.js");
const sony = require("../bot/client");
const th = require("consola");
const path = require("path");
const fs = require("fs");
const { MessageMedia } = require("whatsapp-web.js");

const { traducirManual, normalizarClave, capitalizar } = require("../utils/traduccion.js");
const { discord, whatsapp } = require("../config"); // ← centralizamos configuración

// === Utilidades ===
function construirMensaje(tiposTexto, recompensa, fuenteTraducida, minutos) {
    return `🌐 *${tiposTexto}* 🌐
${recompensa}
🪐 *Fuente:* ${fuenteTraducida}
⏳ *Quedan:* ${minutos} minutos

🅣🅗 ​ - ​ 🅑🅞🅣`;
}

function obtenerImagen(tipoSet) {
    const imagenes = {
        red_orb: "red_orbe.jpg",
        yellow_orb: "yellow_orb.jpg",
        watcher: "watcher.jpg",
        ancient_core: "ancient_core.jpg",
        chaos_core: "chaos_core.jpg",
        chaos_dragon: "chaos_dragon.jpg",
    };

    if (tipoSet.has("red_orb") && tipoSet.has("yellow_orb")) {
        return path.join(__dirname, "../assets/img/alertas/yellow_orb.jpg");
    }

    for (const tipo of tipoSet) {
        if (imagenes[tipo]) {
            return path.join(__dirname, `../assets/img/alertas/${imagenes[tipo]}`);
        }
    }

    return null;
}

// === Envío de alertas ===
async function enviarAlertaWhatsApp(tipoRaw, fuente, minutos, imagen) {
    const tiposTraducidos = traducirManual(tipoRaw);
    const fuenteTraducida = capitalizar(fuente);
    const tiposTexto = tiposTraducidos.map(capitalizar).join(", ");

    const tiposConMedalla = ["observador", "dragon del caos"];
    const esMedalla = tiposTraducidos
        .map(normalizarClave)
        .every((t) => tiposConMedalla.includes(t));

    const recompensa = esMedalla
        ? `🎖️ *Recompensa:* Medalla de ${tiposTexto}`
        : `🎖️ *Recompensa:* ${tiposTexto}`;

    const mensaje = construirMensaje(tiposTexto, recompensa, fuenteTraducida, minutos);

    try {
        if (imagen && fs.existsSync(imagen)) {
            const media = await MessageMedia.fromFilePath(imagen);
            await sony.sendMessage(whatsapp.groupId, media, { caption: mensaje });
            th.withTag("WHATSAPP").success(`✅ Imagen de ${tiposTexto} enviada.`);
        } else {
            await sony.sendMessage(whatsapp.groupId, mensaje);
            th.withTag("WHATSAPP").success(`✅ Mensaje de ${tiposTexto} enviado.`);
        }
    } catch (err) {
        th.withTag("WHATSAPP").error(
            `❌ Error al enviar mensaje de ${tiposTexto}:`,
            process.env.NODE_ENV === "development" ? err : err.message
        );
    }
}

// === Manejador de Discord ===
let initialized = false;

function discordBot() {
    if (initialized) return;
    initialized = true;

    const discordClient = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
        ],
    });

    discordClient.once(Events.ClientReady, () => {
        th.withTag("DISCORD").success(`🤖 Bot conectado como ${discordClient.user.tag}`);
    });

    discordClient.on("error", (error) =>
        th.withTag("DISCORD").error("❌ Error en el cliente:", error.message)
    );

    discordClient.on("messageCreate", async (message) => {
        try {
            if (message.channel.id !== discord.channelId || !message.author.bot) return;

            const content = message.content || message.embeds[0]?.title || "";
            if (!content) return;

            const partes = content.split("|").map((p) => p.trim());
            if (partes.length < 5) return;

            const [, tipoRaw, fuenteRaw, tiempoRaw] = partes;
            const fuente = traducirManual(fuenteRaw)[0] || fuenteRaw;

            let minutos = parseInt(tiempoRaw.replace(/[^0-9]/g, ""), 10);
            if (isNaN(minutos)) minutos = "poco";

            const tipoSet = new Set(tipoRaw.split(",").map((t) => normalizarClave(t.trim())));
            const imagen = obtenerImagen(tipoSet);

            await enviarAlertaWhatsApp(tipoRaw, fuente, minutos, imagen);
            th.withTag("DISCORD").info(`[${message.author.username}]: ${content}`);
        } catch (err) {
            th.withTag("DISCORD").error(
                "❌ Error procesando mensaje:",
                process.env.NODE_ENV === "development" ? err : err.message
            );
        }
    });

    discordClient.login(discord.token).catch((err) => {
        th.withTag("DISCORD").warn("⚠️ No se pudo conectar.");
        th.withTag("DISCORD").error(err.message);
    });
}

module.exports = discordBot;
