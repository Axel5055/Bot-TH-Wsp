const sony = require("../../bot/client");
const xlsx = require("xlsx");
const fs = require("fs");
const logger = require("../utils/logger");

// Archivos
const fileCaza = "./src/assets/excel/caza.xlsx"; // Solo lectura
const fileMulticuentas = "./src/assets/excel/multicuentas.xlsx"; // Solo escritura

// Cargar datos de caza.xlsx
function cargarCaza() {
    if (!fs.existsSync(fileCaza)) return [];
    try {
        const workbook = xlsx.readFile(fileCaza);
        const sheet = workbook.Sheets["Caza"];
        if (!sheet) return [];
        return xlsx.utils.sheet_to_json(sheet, { defval: "" });
    } catch (error) {
        logger.error("❌ Error al leer caza.xlsx:", error);
        return [];
    }
}

// Cargar multicuentas.xlsx
function cargarMulticuentas() {
    if (!fs.existsSync(fileMulticuentas)) return {};
    try {
        const workbook = xlsx.readFile(fileMulticuentas);
        const sheetName = workbook.SheetNames.find(name => name.trim().toLowerCase() === "multicuentas");
        if (!sheetName) return {};

        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet, { defval: "" });

        let base = {};
        data.forEach(entry => {
            if (!entry["Nombre dado"]) return;
            base[entry["Nombre dado"].toLowerCase()] = {
                nombreDado: entry["Nombre dado"],
                ids: entry["ID"] || "",
                nombresDeCuentas: entry["Nombre de cuentas"] || ""
            };
        });
        return base;
    } catch (error) {
        logger.error("❌ Error al leer multicuentas.xlsx:", error);
        return {};
    }
}

// Guardar multicuentas.xlsx
function guardarMulticuentas(base) {
    try {
        const data = Object.values(base).map(u => ({
            "Nombre dado": u.nombreDado,
            "ID": u.ids,
            "Nombre de cuentas": u.nombresDeCuentas
        }));
        const workbook = xlsx.utils.book_new();
        const sheet = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(workbook, sheet, "Multicuentas");
        xlsx.writeFile(workbook, fileMulticuentas);
        logger.success("✅ Multicuentas guardadas correctamente.");
    } catch (error) {
        logger.error("❌ Error al guardar multicuentas.xlsx:", error);
    }
}

// Función principal
async function multicuentas(message) {
    const texto = message.body.trim();
    const lowercase = texto.toLowerCase();

    // Comando /addcuentas
    if (lowercase.startsWith("/addcuentas ")) {
        const input = texto.substring(12).trim();
        if (!input.includes(" ")) return message.reply("⚠️ Uso: /addcuentas Nombre ID1,ID2,...");

        const firstSpace = input.indexOf(" ");
        const nombreDado = input.substring(0, firstSpace).trim();
        const idsRaw = input.substring(firstSpace + 1).trim();
        const ids = idsRaw.split(",").map(i => i.trim()).filter(i => i);

        if (ids.length === 0) return message.reply("⚠️ No se proporcionaron IDs válidos.");

        const hojaCaza = cargarCaza();
        let nombresDeCuentas = [];
        let noEncontrados = [];

        ids.forEach(id => {
            const idNormalized = String(id).trim();
            const registro = hojaCaza.find(row => {
                const rowId = String(row["IGG ID"] || "").trim();
                return rowId === idNormalized;
            });
            if (!registro) {
                noEncontrados.push(id);
                return;
            }
            nombresDeCuentas.push(String(registro["Nombre"] || "Desconocido").trim());
        });

        if (nombresDeCuentas.length === 0) {
            return message.reply("⚠️ Ningún ID proporcionado existe en la hoja Caza.");
        }

        let base = cargarMulticuentas();

        if (base[nombreDado.toLowerCase()]) {
            return message.reply(`⚠️ El usuario *${nombreDado}* ya existe en Multicuentas.`);
        }

        base[nombreDado.toLowerCase()] = {
            nombreDado,
            ids: ids.join(", "),
            nombresDeCuentas: nombresDeCuentas.join(", ")
        };

        guardarMulticuentas(base);

        let respuesta = `✅ Registrado correctamente para *${nombreDado}*:\n`;
        respuesta += `🆔 IDs: ${ids.join(", ")}\n`;
        respuesta += `💻 Nombre de cuentas: ${nombresDeCuentas.join(", ")}`;
        if (noEncontrados.length > 0) respuesta += `\n⚠️ Los siguientes IDs no se encontraron: ${noEncontrados.join(", ")}`;

        return message.reply(respuesta);
    }

    // Comando /editcuentas
    if (lowercase.startsWith("/editcuentas ")) {
        const input = texto.substring(13).trim();
        if (!input.includes(" ")) return message.reply("⚠️ Uso: /editcuentas Nombre ID1,ID2,...");

        const firstSpace = input.indexOf(" ");
        const nombreDado = input.substring(0, firstSpace).trim();
        const idsRaw = input.substring(firstSpace + 1).trim();
        const ids = idsRaw.split(",").map(i => i.trim()).filter(i => i);

        if (ids.length === 0) return message.reply("⚠️ No se proporcionaron IDs válidos.");

        const hojaCaza = cargarCaza();
        let nombresDeCuentas = [];
        let noEncontrados = [];

        ids.forEach(id => {
            const idNormalized = String(id).trim();
            const registro = hojaCaza.find(row => {
                const rowId = String(row["IGG ID"] || "").trim();
                return rowId === idNormalized;
            });
            if (!registro) {
                noEncontrados.push(id);
                return;
            }
            nombresDeCuentas.push(String(registro["Nombre"] || "Desconocido").trim());
        });

        if (nombresDeCuentas.length === 0) {
            return message.reply("⚠️ Ningún ID proporcionado existe en la hoja Caza.");
        }

        let base = cargarMulticuentas();

        if (!base[nombreDado.toLowerCase()]) {
            return message.reply(`⚠️ El usuario *${nombreDado}* no existe en Multicuentas.`);
        }

        base[nombreDado.toLowerCase()] = {
            nombreDado,
            ids: ids.join(", "),
            nombresDeCuentas: nombresDeCuentas.join(", ")
        };

        guardarMulticuentas(base);

        // RESPUESTA DETALLADA similar a /addcuentas
        let respuesta = `✅ Usuario *${nombreDado}* actualizado correctamente:\n`;
        respuesta += `🆔 IDs: ${ids.join(", ")}\n`;
        respuesta += `💻 Nombre de cuentas: ${nombresDeCuentas.join(", ")}`;
        if (noEncontrados.length > 0) respuesta += `\n⚠️ Los siguientes IDs no se encontraron: ${noEncontrados.join(", ")}`;

        return message.reply(respuesta);
    }

    // Comando /deletecuenta
    if (lowercase.startsWith("/deletecuenta ")) {
        const nombreDado = texto.substring(14).trim();
        let base = cargarMulticuentas();

        if (!base[nombreDado.toLowerCase()]) {
            return message.reply(`⚠️ El usuario *${nombreDado}* no existe en Multicuentas.`);
        }

        delete base[nombreDado.toLowerCase()];
        guardarMulticuentas(base);

        return message.reply(`✅ Usuario *${nombreDado}* eliminado correctamente.`);
    }

    // Comando /listcuentas
    if (lowercase === "/listcuentas") {
        let base = cargarMulticuentas();
        const nombres = Object.values(base).map(u => u.nombreDado);
        if (nombres.length === 0) return message.reply("⚠️ No hay registros en Multicuentas.");

        nombres.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

        let respuesta = "📋 *Lista de usuarios registrados:*\n────────────────────────\n";
        nombres.forEach((n, i) => {
            respuesta += `${i + 1}. ${n}\n`;
        });

        return message.reply(respuesta);
    }

    // Comando /vercuentas
    if (lowercase.startsWith("/vercuentas ")) {
        const nombreDado = texto.substring(12).trim();
        let base = cargarMulticuentas();

        if (!base[nombreDado.toLowerCase()]) {
            return message.reply(`⚠️ El usuario *${nombreDado}* no existe en Multicuentas.`);
        }

        const user = base[nombreDado.toLowerCase()];
        let respuesta = `👤 *Detalles de ${user.nombreDado}*:\n────────────────────────\n`;
        respuesta += `🆔 IDs: ${user.ids}\n`;
        respuesta += `💻 Nombre de cuentas: ${user.nombresDeCuentas}`;

        return message.reply(respuesta);
    }

    // Dentro de la función multicuentas, agrega esto:

if (lowercase === "/helpcuentas") {
    const guia = `📚 *GUÍA DE MULTICUENTAS* 📚
────────────────────────────
👤 *Agregar usuario con IDs:*
\`/addcuentas Nombre ID1,ID2,...\`
Ejemplo:
\`/addcuentas Axel 123,456,789\`

✏️ *Editar un usuario existente:*
\`/editcuentas Nombre ID1,ID2,...\`
Ejemplo:
\`/editcuentas Axel 111,222\`

🗑 *Eliminar usuario:*
\`/deletecuenta Nombre\`
Ejemplo:
\`/deletecuenta Axel\`

🔍 *Ver detalle de un usuario:*
\`/vercuentas Nombre\`
Ejemplo:
\`/vercuentas Axel\`

📋 *Listar todos los usuarios:*
\`/listcuentas\`

⚠️ *Notas importantes:*
- Los nombres no distinguen mayúsculas/minúsculas.
- No usar espacios en el nombre.
- Los IDs se separan con coma.
────────────────────────────
💡 Tip: Siempre puedes usar \`/helpcuentas\` para volver a ver esta guía.`;

    try {
        await message.reply(guia);
        logger.success("✅ Comando /helpcuentas ejecutado correctamente.");
    } catch (error) {
        logger.error("❌ Error al enviar la guía de multicuentas:", error);
        await message.reply("⚠️ Ocurrió un error al intentar mostrar la guía.");
    }
    return;
}

}

module.exports = multicuentas;
