const th = require("consola");
const chalk = require("chalk");

const c = {
    cyan: chalk.cyan,
    green: chalk.green,
    blue: chalk.italic.blue,
    yellow: chalk.yellow,
};

async function logmsg(message) {
    try {
        const body = message.body || "";
        const notifyName = message._data?.notifyName || "Desconocido";
        const charCount = body.length;

        // Obtener chat
        const chat = await message.getChat().catch(err => {
            th.warn("Error obteniendo el chat:", err.message);
            return null;
        });
        if (!chat) return;

        // Función auxiliar para formatear salida
        const formatLog = (data) =>
            Object.entries(data)
                .filter(([_, v]) => v) // solo mostrar si existe
                .map(([k, v]) => `${k}: ${v}\n`)
                .join("");

        // 🔹 Estados de WhatsApp
        if (message.from === "status@broadcast") {
            if (message.hasMedia && !body) {
                th.info(c.cyan(`Estado sin texto de ${notifyName}\n`));
                return;
            }

            th.info(
                formatLog({
                    Estado: c.cyan(notifyName),
                    Mensaje: c.green(body),
                })
            );
            return;
        }

        // 🔹 Mensajes en grupos
        if (chat.isGroup) {
            const baseData = {
                Grupo: c.cyan(chat.name),
                Número: c.green(message.author),
                Usuario: c.blue(notifyName),
                Mensaje: charCount < 1999 ? c.yellow(body) : "[Mensaje largo]",
            };

            th.info(
                (message.hasMedia && message.type === "image"
                    ? "📷 Imagen de grupo\n"
                    : "") + formatLog(baseData)
            );
            return;
        }

        // 🔹 Mensajes privados
        if (charCount < 1999) {
            th.info(
                formatLog({
                    Usuario: c.green(notifyName),
                    Mensaje: c.blue(body),
                })
            );
            return;
        }

        // 🔹 Casos no declarados
        th.warn("Estos son mensajes no declarados o inválidos\n");
    } catch (error) {
        th.error("Hay un error en logmsg.js:", error.message);
    }
}

module.exports = logmsg;
