const sony = require("../../bot/client");
const xlsx = require("xlsx");
const fs = require("fs");
const logger = require("../utils/logger"); // <-- Logger centralizado

const FILE_PATH = "./src/assets/excel/escudos.xlsx";
const USAGE_FILE = "./src/data/usage.json";

const MAX_USOS = 3;
const TIEMPO_BLOQUEO = 5 * 60 * 1000; // 5 minutos
const TIEMPO_VENTANA = 5 * 60 * 1000; // 5 minutos

// =================== Funciones Auxiliares ===================

function cargarBaseDatos() {
    if (!fs.existsSync(FILE_PATH)) return {};
    try {
        const wb = xlsx.readFile(FILE_PATH);
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet, { defval: "" });
        const db = {};
        data.forEach((entry, idx) => {
            if (entry["Nombre"] && entry["Numero"]) {
                db[entry["Nombre"].trim()] = entry["Numero"].toString();
            } else {
                logger.warn(`Fila inválida en Excel (fila ${idx + 2}): ${JSON.stringify(entry)}`);
            }
        });
        return db;
    } catch (err) {
        logger.error("Error al cargar Excel:", err);
        return {};
    }
}

function cargarHistorialUso() {
    if (!fs.existsSync(USAGE_FILE)) return {};
    try {
        return JSON.parse(fs.readFileSync(USAGE_FILE, "utf8"));
    } catch (err) {
        logger.error("Error al cargar historial:", err);
        return {};
    }
}

function guardarHistorialUso(historial) {
    try {
        fs.writeFileSync(USAGE_FILE, JSON.stringify(historial, null, 2));
    } catch (err) {
        logger.error("Error al guardar historial:", err);
    }
}

function delay(ms) {
    return new Promise(res => setTimeout(res, ms));
}

function esNumeroValido(numero) {
    return /^\d+$/.test(numero);
}

function actualizarExcel(data) {
    try {
        const wb = xlsx.utils.book_new();
        const sheet = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, sheet, "Escudos");
        xlsx.writeFile(wb, FILE_PATH);
        logger.success("Excel actualizado correctamente.");
    } catch (err) {
        logger.error("Error al actualizar Excel:", err);
    }
}

// =================== Comando Escudo ===================

async function escudo(message) {
    const body = message.body?.toLowerCase().trim();
    if (!body) return;

    const senderId = message.author || message.from;
    const historial = cargarHistorialUso();
    if (!historial[senderId]) historial[senderId] = { usos: [], bloqueadoHasta: 0 };
    historial[senderId].usos = historial[senderId].usos.filter(t => Date.now() - t < TIEMPO_VENTANA);

    const baseDatos = cargarBaseDatos();
    const chat = await message.getChat();

    try {
        // =================== /escudo ===================
        if (body.startsWith("/escudo ")) {
            if (Date.now() < historial[senderId].bloqueadoHasta) {
                const rest = Math.ceil((historial[senderId].bloqueadoHasta - Date.now()) / 1000);
                return message.reply(`⚠️ Estás bloqueado. Intenta en ${rest}s.`);
            }

            if (historial[senderId].usos.length >= MAX_USOS) {
                historial[senderId].bloqueadoHasta = Date.now() + TIEMPO_BLOQUEO;
                guardarHistorialUso(historial);
                return message.reply("⚠️ Límite de usos alcanzado. Espera 5 minutos.");
            }

            const nombre = message.body.substring(8).trim();
            if (!baseDatos[nombre]) return message.reply(`⚠️ "${nombre}" no está registrado.`);

            const numero = baseDatos[nombre];
            let mentions = [];
            let text = `🚨 *SIN ESCUDO - TE QUEMAN* 🚨\n\n`;

            for (let p of chat.participants || []) {
                const contact = await sony.getContactById(p.id._serialized);
                if (contact.number === numero) {
                    mentions.push(contact);
                    text += `┣➥ @${contact.number}\n\n`;
                }
            }

            if (!mentions.length) return message.reply(`⚠️ "${numero}" no pertenece a este grupo.`);

            text += `┣-----Fin del llamado-----┣\n\nＴＨ ​ - ​ ＢＯＴ`;
            await chat.sendMessage(text, { mentions });

            const alertMsg = `🚨 *Tu escudo cayó, entra al juego que te queman!* 🚨`;
            for (let i = 0; i < 5; i++) {
                await delay(2000);
                await sony.sendMessage(numero + "@c.us", alertMsg);
            }

            historial[senderId].usos.push(Date.now());
            guardarHistorialUso(historial);
            logger.success(`Comando /escudo usado por ${senderId} para ${nombre}`);
        }

        // =================== /list ===================
        if (body === "/list") {
            const nombres = Object.keys(baseDatos);
            if (!nombres.length) return message.reply("⚠️ No hay nombres registrados.");
            const lista = nombres.map((n, i) => `${i + 1}. ${n}`).join("\n");
            return message.reply("📋 *Nombres registrados:*\n\n" + lista);
        }

        // =================== /addescudo ===================
        if (body.startsWith("/addescudo ")) {
            const args = message.body.substring(11).trim().split(" ");
            if (args.length < 2) return message.reply("⚠️ Uso: /addescudo Nombre Número (con lada de pais sin el simbolo +");

            const nombre = args.slice(0, -1).join(" ");
            const numero = args[args.length - 1];

            if (!esNumeroValido(numero)) return message.reply("⚠️ Número inválido.");
            if (baseDatos[nombre]) return message.reply(`⚠️ "${nombre}" ya está registrado.`);

            baseDatos[nombre] = numero;
            const data = Object.entries(baseDatos).map(([Nombre, Numero]) => ({ Nombre, Numero }));
            actualizarExcel(data);
            return message.reply(`✅ Usuario agregado: ${nombre} - ${numero}`);
        }

        // =================== /deleteescudo ===================
        if (body.startsWith("/deleteescudo ")) {
            const nombre = message.body.substring(14).trim();
            if (!baseDatos[nombre]) return message.reply(`⚠️ "${nombre}" no existe.`);
            delete baseDatos[nombre];
            const data = Object.entries(baseDatos).map(([Nombre, Numero]) => ({ Nombre, Numero }));
            actualizarExcel(data);
            return message.reply(`✅ Escudo de "${nombre}" eliminado.`);
        }

        // =================== /editescudo ===================
        if (body.startsWith("/editescudo ")) {
            const args = message.body.substring(12).trim().split(" ");
            if (args.length < 2) return message.reply("⚠️ Uso: /editescudo Nombre NuevoNumero");

            const nombre = args.slice(0, -1).join(" ");
            const nuevoNumero = args[args.length - 1];

            if (!esNumeroValido(nuevoNumero)) return message.reply("⚠️ Número inválido.");
            if (!baseDatos[nombre]) return message.reply(`⚠️ "${nombre}" no existe.`);

            baseDatos[nombre] = nuevoNumero;
            const data = Object.entries(baseDatos).map(([Nombre, Numero]) => ({ Nombre, Numero }));
            actualizarExcel(data);
            return message.reply(`✅ Escudo de "${nombre}" actualizado a ${nuevoNumero}.`);
        }

        // =================== /helpescudo ===================
        if (body === "/helpescudo") {
            const guia = `
📖 *Guía del comando /escudo*

1️⃣ Para alertar de un escudo:
/escudo Nombre
*Ejemplo:* /escudo Axel

2️⃣ Para agregar un nuevo escudo:
/addescudo Nombre Número
*Ejemplo:* /addescudo Axel 521234567890
- El número debe incluir lada de país sin el símbolo +

3️⃣ Para eliminar un escudo:
/deleteescudo Nombre
*Ejemplo:* /deleteescudo Axel

4️⃣ Para editar el número de un escudo:
/editescudo Nombre NuevoNúmero
*Ejemplo:* /editescudo Axel 521098765432

5️⃣ Para ver todos los nombres registrados:
/list
`;
            return message.reply(guia);
        }

    } catch (err) {
        logger.error("Error procesando comando /escudo:", err);
        message.reply("⚠️ Ocurrió un error al procesar tu comando.");
    }
}

module.exports = escudo;
