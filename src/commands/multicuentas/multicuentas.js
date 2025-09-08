const sony = require("../../bot/client");
const xlsx = require("xlsx");
const fs = require("fs");
const logger = require("../utils/logger"); // Logger centralizado

const filePath = "./src/assets/excel/multicuentas.xlsx";

// ========================
// 📂 Función para cargar base de datos
// ========================
function cargarBaseDatos() {
    if (!fs.existsSync(filePath)) return {};
    try {
        const workbook = xlsx.readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet, { defval: "" });
        let baseDatos = {};

        data.forEach(entry => {
            if (!entry["Nombre"] || !entry["Cuentas"]) return;
            baseDatos[entry["Nombre"].toLowerCase()] = {
                original: entry["Nombre"],
                cuentas: entry["Cuentas"].split(",").map(c => c.trim())
            };
        });

        return baseDatos;
    } catch (error) {
        logger.error("❌ Error al leer multicuentas:", error);
        return {};
    }
}

// ========================
// 💾 Guardar base de datos
// ========================
function guardarBaseDatos(baseDatos) {
    try {
        const data = Object.values(baseDatos).map(u => ({
            Nombre: u.original,
            Cuentas: u.cuentas.join(", ")
        }));
        const workbook = xlsx.utils.book_new();
        const sheet = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(workbook, sheet, "Multicuentas");
        xlsx.writeFile(workbook, filePath);
        logger.success("✅ Base de datos de multicuentas actualizada.");
    } catch (error) {
        logger.error("❌ Error al guardar multicuentas:", error);
    }
}

// ========================
// ⚡ Función principal de multicuentas
// ========================
async function multicuentas(message) {
    const comandoAdd = "/addcuentas ";
    const comandoEdit = "/editcuentas ";
    const comandoDelete = "/deletecuenta ";
    const comandoList = "/listcuentas";
    const comandoVer = "/vercuentas ";
    const comandoHelp = "/helpcuentas";

    const texto = message.body.trim();
    const lowercase = texto.toLowerCase();

    // ➕ Mostrar guía visual
    if (lowercase === comandoHelp) {
        const guia = `📚 *GUÍA DE MULTICUENTAS* 📚
────────────────────────────
👤 *Agregar usuario con cuentas (separadas por coma):*
\`/addcuentas Nombre Cuenta1, Cuenta2, Cuenta3\`
Ejemplo:
\`/addcuentas Axel sony 2, cuenta3, otra cuenta\`

✏️ *Editar cuentas de un usuario:*
\`/editcuentas Nombre Cuenta1, Cuenta2, Cuenta3\`
Ejemplo:
\`/editcuentas Axel sony 2, cuenta4\`

🗑 *Eliminar usuario:*
\`/deletecuenta Nombre\`
Ejemplo:
\`/deletecuenta Axel\`

📋 *Listar todos los usuarios:*
\`/listcuentas\`

🔍 *Ver detalle de un usuario:*
\`/vercuentas Nombre\`
Ejemplo:
\`/vercuentas Axel\`

⚠️ *Notas importantes:*
- Los nombres no distinguen mayúsculas/minúsculas.
- Puedes usar espacios dentro de las cuentas, solo separa con coma.
────────────────────────────
💡 Tip: Siempre puedes usar \`/helpcuentas\` para volver a ver esta guía.
`;

        try {
            await message.reply(guia);
            return logger.success("✅ Comando /helpcuentas ejecutado correctamente.");
        } catch (error) {
            logger.error("❌ Error al enviar la guía de multicuentas:", error);
            return message.reply("⚠️ Ocurrió un error al intentar mostrar la guía.");
        }
    }

    try {
        let baseDatosMulti = cargarBaseDatos();

        // ➕ Agregar multicuentas
        if (lowercase.startsWith(comandoAdd)) {
            const args = texto.substring(comandoAdd.length).trim().split(" ");
            if (args.length < 2) return message.reply("⚠️ Uso correcto: `/addcuentas Nombre Cuenta1, Cuenta2, ...`");

            const nombre = args[0].trim();
            // Unimos el resto y separamos por comas
            const cuentas = args.slice(1).join(" ").split(",").map(c => c.trim());

            if (baseDatosMulti[nombre.toLowerCase()]) {
                return message.reply(`⚠️ El nombre *${nombre}* ya existe.`);
            }

            baseDatosMulti[nombre.toLowerCase()] = { original: nombre, cuentas };
            guardarBaseDatos(baseDatosMulti);

            return message.reply(`✅ Usuario agregado:\n👤 Nombre: *${nombre}*\n💻 Cuentas: ${cuentas.join(", ")}`);
        }

        // ✏️ Editar multicuentas
        if (lowercase.startsWith(comandoEdit)) {
            const args = texto.substring(comandoEdit.length).trim().split(" ");
            if (args.length < 2) return message.reply("⚠️ Uso correcto: `/editcuentas Nombre Cuenta1, Cuenta2, ...`");

            const nombre = args[0].trim();
            const cuentas = args.slice(1).join(" ").split(",").map(c => c.trim());
            const key = nombre.toLowerCase();

            if (!baseDatosMulti[key]) return message.reply(`⚠️ El nombre *${nombre}* no está registrado.`);

            baseDatosMulti[key].cuentas = cuentas;
            guardarBaseDatos(baseDatosMulti);

            return message.reply(`✅ Usuario actualizado:\n👤 Nombre: *${baseDatosMulti[key].original}*\n💻 Cuentas: ${cuentas.join(", ")}`);
        }

        // 🗑 Eliminar multicuentas
        if (lowercase.startsWith(comandoDelete)) {
            const nombre = texto.substring(comandoDelete.length).trim();
            const key = nombre.toLowerCase();

            if (!baseDatosMulti[key]) return message.reply(`⚠️ El nombre *${nombre}* no está registrado.`);

            delete baseDatosMulti[key];
            guardarBaseDatos(baseDatosMulti);

            return message.reply(`✅ Usuario *${nombre}* eliminado correctamente.`);
        }

        // 📋 Listar nombres (ordenados alfabéticamente)
        if (lowercase === comandoList) {
            const nombres = Object.values(baseDatosMulti).map(obj => obj.original);

            if (nombres.length === 0) return message.reply("⚠️ No hay multicuentas registradas.");

            nombres.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

            let text = "📋 *Lista de usuarios registrados:*\n────────────────────────\n";
            nombres.forEach((n, i) => text += `📌 ${i + 1}. ${n}\n`);

            return message.reply(text);
        }

        // 🔍 Ver detalle de un usuario
        if (lowercase.startsWith(comandoVer)) {
            const nombre = texto.substring(comandoVer.length).trim();
            const key = nombre.toLowerCase();

            if (!baseDatosMulti[key]) return message.reply(`⚠️ El nombre *${nombre}* no está registrado.`);

            const user = baseDatosMulti[key];
            let text = `👤 *Detalle de multicuentas*\n────────────────────────\n📌 Nombre: *${user.original}*\n💻 Cuentas:\n`;
            user.cuentas.forEach((c, i) => text += `   ${i + 1}. ${c}\n`);

            return message.reply(text);
        }

    } catch (error) {
        logger.error("❌ Error en comandos de multicuentas:", error);
        return message.reply("⚠️ Ocurrió un error procesando tu solicitud.");
    }
}

module.exports = multicuentas;
