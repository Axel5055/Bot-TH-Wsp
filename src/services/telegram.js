require('dotenv').config();
const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const { NewMessage } = require('telegram/events');
const sony = require('../bot/client'); // Cliente de WhatsApp
const fs = require('fs');
const { MessageMedia } = require('whatsapp-web.js');
const { traducirManual, capitalizar } = require('../commands/utils/traducciones');
const { getImagenPath } = require('../commands/config/imagenes');
const { getImagenPathMobs } = require('../commands/config/imagenes');
const readline = require('readline');

const apiId = parseInt(process.env.TELEGRAM_API_ID, 10);
const apiHash = process.env.TELEGRAM_API_HASH;
const stringSession = new StringSession(process.env.TELEGRAM_SESSION || "");

// ✅ Ahora puede haber varios grupos separados por comas
const WHATSAPP_GROUP_ID = process.env.WHATSAPP_GROUP_ID
    ? process.env.WHATSAPP_GROUP_ID.split(',').map(id => id.trim())
    : [];

const TELEGRAM_CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;
const TELEGRAM_GROUP_ID = process.env.TELEGRAM_GROUP_ID;

// Helper: extraer texto de distintos tipos de Message
function extractTextFromMsg(msg) {
    if (!msg) return "";
    if (typeof msg.text === 'string' && msg.text.trim()) return msg.text;
    if (typeof msg.message === 'string' && msg.message.trim()) return msg.message;
    if (typeof msg.caption === 'string' && msg.caption.trim()) return msg.caption;
    if (msg.media && typeof msg.media.caption === 'string' && msg.media.caption.trim()) return msg.media.caption;
    return "";
}

// Función para enviar alerta a WhatsApp (a varios grupos)
async function enviarAlertaWhatsApp(tipoTraducido, requisitoTraducido, mensajeTexto, tipoImagen, incluirMedalla = false) {
    const mensaje = `🌐 ${tipoTraducido} 🌐
📌 *Requisito*: ${requisitoTraducido}
🎖️ *Recompensa*: ${incluirMedalla ? 'Medalla de ' : ''}${tipoTraducido}
⏳ *Status*: Próximo en *4 minutos*.

🅣🅗 ​ - ​ 🅑🅞🅣`;

    if (!WHATSAPP_GROUP_ID.length) {
        console.error("❌ WHATSAPP_GROUP_ID no definidos en .env");
        return;
    }

    const rutaImagen = tipoImagen ? getImagenPath(tipoImagen.toLowerCase()) : null;

    for (const groupId of WHATSAPP_GROUP_ID) {
        try {
            if (rutaImagen && fs.existsSync(rutaImagen)) {
                const media = await MessageMedia.fromFilePath(rutaImagen);
                await sony.sendMessage(groupId, media, { caption: mensaje });
                console.log(`✅ Imagen de ${tipoImagen} enviada al grupo ${groupId}.`);
            } else {
                await sony.sendMessage(groupId, mensaje);
                console.log(`⚡ Mensaje de texto enviado al grupo ${groupId} (sin imagen).`);
            }
        } catch (err) {
            console.error(`❌ Error al enviar mensaje a ${groupId}: ${err.message}`);
        }
    }
}

// Función para preguntar input en consola
function ask(question) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise(resolve => rl.question(question, ans => { rl.close(); resolve(ans); }));
}

// Inicializar cliente Telegram
(async () => {
    const client = new TelegramClient(stringSession, apiId, apiHash, { connectionRetries: 5 });
    await client.start({
        phoneNumber: async () => await ask("📱 Número de teléfono: "),
        password: async () => await ask("🔑 Password 2FA: "),
        phoneCode: async () => await ask("📩 Código SMS: "),
        onError: (err) => console.log(err),
    });

    console.log("✅ Cliente Telegram conectado");
    console.log("💾 Session String (guardar en .env):", client.session.save ? client.session.save() : '(no disponible)');

    // Event handler para nuevos mensajes
    client.addEventHandler(async (event) => {
        try {
            const msg = event.message;
            if (!msg) return;

            const chatIdStr = String(msg.chatId?.toString() || '');
            console.log("📩 Mensaje recibido de Chat ID:", chatIdStr);

            if (chatIdStr !== TELEGRAM_CHANNEL_ID && chatIdStr !== TELEGRAM_GROUP_ID) {
                console.log("ℹ️ Mensaje NO pertenece al canal ni al grupo configurado -> ignorando.");
                return;
            }

            const extractedText = extractTextFromMsg(msg);
            if (!extractedText) {
                console.log("⚠️ Mensaje sin texto para procesar.");
                return;
            }

            const lineas = extractedText.split('\n').map(l => l.trim()).filter(Boolean);
            if (lineas.length === 0) return;

            const primeraLinea = lineas[0].replace(/\([^\)]*\)/g, '').trim();

            // Extraer solo la fecha de la primera línea
            let fecha = 'Desconocida';
            const matchFecha = primeraLinea.match(/\d{1,2}\/\d{1,2}\/\d{4}/);
            if (matchFecha) fecha = matchFecha[0];

            const requisitosTraducidos = traducirManual(primeraLinea).map(capitalizar);
            const requisitoTraducido = requisitosTraducidos.join(' | ');

            // Detección de alertas individuales
            const alertas = [
                { palabra: 'watcher', imagen: 'watcher', incluirMedalla: true },
                { palabra: 'chaos dragon', imagen: 'chaos_dragon', incluirMedalla: true },
                { palabra: 'ancient core', imagen: 'ancient_core', incluirMedalla: false },
                { palabra: 'bright talent orb', imagen: 'bright_talent_orb', incluirMedalla: false },
                { palabra: 'brilliant talent orb', imagen: 'brilliant_talent_orb', incluirMedalla: false }
            ];

            const content = extractedText.toLowerCase();
            let alertaActivada = false;

            for (const alerta of alertas) {
                if (content.includes(alerta.palabra)) {
                    alertaActivada = true;
                    let tipoTraducido = capitalizar(traducirManual(alerta.imagen)[0]);
                    let tipoImagen = alerta.imagen;

                    // Combinaciones especiales
                    if (content.includes('bright talent orb') && content.includes('ancient core')) {
                        tipoTraducido = `${capitalizar(traducirManual('bright_talent_orb')[0])} | ${capitalizar(traducirManual('ancient_core')[0])}`;
                        tipoImagen = 'bright_talent_orb';
                    } else if (content.includes('brilliant talent orb') && content.includes('ancient core')) {
                        tipoTraducido = `${capitalizar(traducirManual('brilliant_talent_orb')[0])} | ${capitalizar(traducirManual('ancient_core')[0])}`;
                        tipoImagen = 'brilliant_talent_orb';
                    } else if (content.includes('brilliant talent orb') && content.includes('bright talent orb')) {
                        tipoTraducido = `${capitalizar(traducirManual('brilliant_talent_orb')[0])} | ${capitalizar(traducirManual('bright_talent_orb')[0])}`;
                        tipoImagen = 'brilliant_talent_orb';
                    }

                    console.log(`⚡ Alerta activada: ${alerta.palabra}`);
                    console.log(`📌 Tipo traducido: ${tipoTraducido}`);
                    console.log(`📌 Imagen: ${tipoImagen}`);

                    if (!sony.info || !sony.info.pushname) {
                        console.log("⏳ Esperando a que WhatsApp Web se conecte...");
                        sony.once("ready", async () => {
                            console.log("✅ Cliente WhatsApp listo, enviando mensaje...");
                            await enviarAlertaWhatsApp(tipoTraducido, requisitoTraducido, extractedText, tipoImagen, alerta.incluirMedalla);
                        });
                    } else {
                        await enviarAlertaWhatsApp(tipoTraducido, requisitoTraducido, extractedText, tipoImagen, alerta.incluirMedalla);
                    }

                    console.log(`💬 Mensaje enviado a todos los grupos de WhatsApp.`);
                    break;
                }
            }

            if (!alertaActivada) console.log("ℹ️ No se detectó ninguna alerta en este mensaje.");

            // Enviar mensaje de MOBS (sin laberinto)
            const mobsLine = lineas.find(l => l.toUpperCase().startsWith('MOBS:'));
            if (mobsLine) {
                const mobs = mobsLine.split(':')[1].split(',').map(m => m.trim());
                console.log(`🔹 MOBS detectados: ${mobs.join(', ')}`);

                let mensajeMobs = `🐉 Estos son los MOBS para el día: ${fecha}\n\n`;
                mobs.forEach(mob => {
                    mensajeMobs += `* *${capitalizar(traducirManual(mob)[0])}*\n`;
                });

                for (const groupId of WHATSAPP_GROUP_ID) {
                    await sony.sendMessage(groupId, mensajeMobs);
                    console.log(`⚡ Mensaje de texto enviado con MOBS a ${groupId}.`);

                    for (const mob of mobs) {
                        const claveImagen = mob.toLowerCase().replace(/\s+/g, '_');
                        const ruta = getImagenPathMobs(claveImagen);
                        if (ruta && fs.existsSync(ruta)) {
                            const media = await MessageMedia.fromFilePath(ruta);
                            await sony.sendMessage(groupId, media);
                            console.log(`✅ Imagen de ${mob} enviada a ${groupId}.`);
                        } else {
                            console.log(`⚠️ No se encontró imagen para: ${mob} (clave: ${claveImagen})`);
                        }
                    }
                }
            }

        } catch (err) {
            console.error("❌ Error en event handler:", err && err.message ? err.message : err);
        }
    }, new NewMessage({}));
})();
