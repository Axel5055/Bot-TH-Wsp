const sony = require("../../bot/client");
const xlsx = require("xlsx");
const fs = require("fs");
const th = require("consola");
const filePath = "./src/assets/excel/escudos.xlsx"; // Ruta del archivo Excel
const usageFilePath = "./src/data/usage.json"; // Ruta para almacenar el historial de uso

// Función para cargar la base de datos desde el Excel
function cargarBaseDatos() {
    if (!fs.existsSync(filePath)) {
        th.warn("⚠️ El archivo de base de datos no existe.");
        return {};
    }
    try {
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet, { defval: "" }); // Evitar valores undefined
        let baseDatos = {};
        data.forEach((entry, index) => {
            if (typeof entry["Nombre"] !== "string" || typeof entry["Numero"] !== "number") {
                th.warn(`⚠️ Fila inválida en el Excel (fila ${index + 2}): ${JSON.stringify(entry)}`);
                return;
            }
            baseDatos[entry["Nombre"].trim()] = entry["Numero"].toString(); // Convertimos el número a string
        });
        return baseDatos;
    } catch (error) {
        th.error("❌ Error al leer la base de datos:", error);
        return {};
    }
}

// Función para cargar el historial de uso
function cargarHistorialUso() {
    if (!fs.existsSync(usageFilePath)) {
        return {};
    }
    try {
        const data = fs.readFileSync(usageFilePath, "utf8");
        return JSON.parse(data);
    } catch (error) {
        th.error("❌ Error al cargar el historial de uso:", error);
        return {};
    }
}

// Función para guardar el historial de uso
function guardarHistorialUso(historial) {
    try {
        fs.writeFileSync(usageFilePath, JSON.stringify(historial, null, 2));
    } catch (error) {
        th.error("❌ Error al guardar el historial de uso:", error);
    }
}

// Función principal para manejar los comandos
async function escudo(message) {
    const comandoEscudo = "/escudo ";
    const comandoAdd = "/addescudo ";
    const comandoListaNombres = "/list"; // Nuevo comando
    const comandoDelete = "/deleteescudo "; // Comando para eliminar
    const comandoEdit = "/editescudo "; // Comando para editar
    const lowercase = message.body.toLowerCase();
    const senderId = message.author || message.from; // ID del usuario que envió el mensaje
    const maxUsos = 3; // Máximo de usos permitidos en 10 minutos
    const tiempoBloqueo = 5 * 60 * 1000; // 5 minutos en milisegundos
    const tiempoVentana = 5 * 60 * 1000; // Ventana de tiempo de 10 minutos

    try {
        let baseDatosEscudos = cargarBaseDatos(); // Cargar la base de datos antes de usarla
        let historialUso = cargarHistorialUso(); // Cargar el historial de uso

        // Inicializar el historial del usuario si no existe
        if (!historialUso[senderId]) {
            historialUso[senderId] = { usos: [], bloqueadoHasta: 0 };
        }

        // Validar que `usos` sea un array
        if (!Array.isArray(historialUso[senderId].usos)) {
            th.warn(`⚠️ Corrigiendo formato de 'usos' para el usuario ${senderId}`);
            historialUso[senderId].usos = [];
        }

        const ahora = Date.now();

        // Limpiar los usos antiguos (fuera de la ventana de 10 minutos)
        historialUso[senderId].usos = historialUso[senderId].usos.filter(
            (timestamp) => ahora - timestamp < tiempoVentana
        );

        // Comando para verificar escudos
        if (lowercase.startsWith(comandoEscudo)) {
            // Verificar si el usuario está bloqueado
            if (ahora < historialUso[senderId].bloqueadoHasta) {
                const tiempoRestante = Math.ceil((historialUso[senderId].bloqueadoHasta - ahora) / 1000);
                return message.reply(`⚠️ *Estás bloqueado. Intenta de nuevo en ${tiempoRestante} segundos.*`);
            }

            // Verificar límite de uso
            if (historialUso[senderId].usos.length >= maxUsos) {
                // Bloquear al usuario durante 5 minutos
                historialUso[senderId].bloqueadoHasta = ahora + tiempoBloqueo;
                guardarHistorialUso(historialUso);
                return message.reply(`⚠️ *Has excedido el límite de usos (5 en 10 minutos). Espera 5 minutos para usar este comando nuevamente.*`);
            }

            const nombre = message.body.substring(comandoEscudo.length).trim();
            if (baseDatosEscudos[nombre]) {
                const numero = baseDatosEscudos[nombre];
                const chat = await message.getChat();
                let text = `🚨 *SIN ESCUDO - TE QUEMAN* 🚨\n\n`;
                let mentions = [];
                let esMiembroDelGrupo = false;

                for (let participant of chat.participants || []) {
                    const contact = await sony.getContactById(participant.id._serialized);
                    if (contact.number === numero) {
                        esMiembroDelGrupo = true;
                        mentions.push(contact);
                        text += `┣➥ @${participant.id.user}\n\n`;
                    }
                }

                if (!esMiembroDelGrupo) {
                    return message.reply(`⚠️ *El número "${numero}" no pertenece a este grupo.*`);
                }

                text += `┣-----Fin del llamado-----┣\n\nＴＨ ​ - ​ ＢＯＴ`;
                await chat.sendMessage(text, { mentions });

                // Enviar alertas al número registrado
                for (let i = 0; i < 5; i++) { // Reduce a 5 alertas para evitar spam
                    const chatId = numero + "@c.us";
                    const alertMessage = `🚨 *Tu escudo cayó, entra al juego que te queman!* 🚨`;
                    await delay(2000);
                    await sony.sendMessage(chatId, alertMessage);
                }

                // Registrar el uso del comando
                historialUso[senderId].usos.push(ahora);
                guardarHistorialUso(historialUso);
            } else {
                message.reply(`⚠️ *El nombre "${nombre}" no está registrado en la base de datos.*`);
            }
        }

        // Comando para listar nombres registrados
        if (lowercase === comandoListaNombres) {
            const nombresRegistrados = Object.keys(baseDatosEscudos);
            if (nombresRegistrados.length === 0) {
                return message.reply("⚠️ *No hay nombres registrados en la base de datos.*");
            }
            let listaNombres = "📋 *Lista de nombres registrados:*\n\n";
            nombresRegistrados.forEach((nombre, index) => {
                listaNombres += `${index + 1}. ${nombre}\n`;
            });
            message.reply(listaNombres);
        }

        // Comando para agregar un nuevo usuario al Excel
        if (lowercase.startsWith(comandoAdd)) {
            const args = message.body.substring(comandoAdd.length).trim().split(" ");
            if (args.length < 2) {
                return message.reply('⚠️ *Uso correcto:* `/addescudo Nombre Número`\n📌 *Ejemplo:* `/addescudo Axel +52552556465416`\n🔹 *Nota:* Asegúrate de incluir el código de tu país al inicio del número. Ejemplo: 🇲🇽 *México = +52*');
            }
            const nombre = args.slice(0, -1).join(" ").trim(); // Todo menos el último argumento
            const numero = args[args.length - 1].trim(); // Último argumento como número
            if (!/^\d+$/.test(numero)) {
                return message.reply('⚠️ *El número debe contener solo dígitos.*');
            }
            if (baseDatosEscudos[nombre]) {
                return message.reply(`⚠️ *El nombre "${nombre}" ya está registrado con el número ${baseDatosEscudos[nombre]}.*`);
            }
            // Guardar en el archivo Excel
            agregarEscudoExcel(nombre, numero);
            message.reply(`✅ *Usuario agregado correctamente:*\n📌 *Nombre:* ${nombre}\n📌 *Número:* ${numero}`);
        }

        // Comando para eliminar un escudo
        if (lowercase.startsWith(comandoDelete)) {
            const nombre = message.body.substring(comandoDelete.length).trim();
            if (!baseDatosEscudos[nombre]) {
                return message.reply(`⚠️ *El nombre "${nombre}" no está registrado en la base de datos.*`);
            }
            eliminarEscudoExcel(nombre);
            message.reply(`✅ *Escudo de "${nombre}" eliminado correctamente.*`);
        }

        // Comando para editar un escudo
        if (lowercase.startsWith(comandoEdit)) {
            const args = message.body.substring(comandoEdit.length).trim().split(" ");
            if (args.length < 2) {
                return message.reply('⚠️ *Uso correcto:* `/editescudo Nombre NuevoNumero`\n📌 *Ejemplo:* `/editescudo Axel +52552556465416`');
            }
            const nombre = args.slice(0, -1).join(" ").trim();
            const nuevoNumero = args[args.length - 1].trim();
            if (!/^\d+$/.test(nuevoNumero)) {
                return message.reply('⚠️ *El número debe contener solo dígitos.*');
            }
            if (!baseDatosEscudos[nombre]) {
                return message.reply(`⚠️ *El nombre "${nombre}" no está registrado en la base de datos.*`);
            }
            editarEscudoExcel(nombre, nuevoNumero);
            message.reply(`✅ *Escudo de "${nombre}" editado correctamente a ${nuevoNumero}.*`);
        }
    } catch (error) {
        th.warn("⚠️ Error en los comandos.");
        th.error(error);
    }
}

// Función para agregar un nuevo escudo al archivo Excel
function agregarEscudoExcel(nombre, numero) {
    try {
        let workbook;
        let sheet;
        let data = [];

        // Leer el archivo Excel si existe, sino crear uno nuevo
        if (fs.existsSync(filePath)) {
            workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            sheet = workbook.Sheets[sheetName];
            data = xlsx.utils.sheet_to_json(sheet, { defval: "" });
        } else {
            workbook = xlsx.utils.book_new();
            sheet = xlsx.utils.json_to_sheet([]);
            xlsx.utils.book_append_sheet(workbook, sheet, "Escudos");
        }

        // Agregar el nuevo escudo
        data.push({ Nombre: nombre, Numero: Number(numero) });

        // Guardar los cambios en el archivo Excel
        const nuevaHoja = xlsx.utils.json_to_sheet(data);
        workbook.Sheets[workbook.SheetNames[0]] = nuevaHoja;
        xlsx.writeFile(workbook, filePath);
        th.success(`✅ Escudo agregado: ${nombre} - ${numero}`);
    } catch (error) {
        th.error("❌ Error al agregar escudo al Excel:", error);
    }
}


// Función para eliminar un escudo del archivo Excel
function eliminarEscudoExcel(nombre) {
    try {
        let workbook;
        let sheet;
        let data = [];

        // Leer el archivo Excel
        if (fs.existsSync(filePath)) {
            workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            sheet = workbook.Sheets[sheetName];
            data = xlsx.utils.sheet_to_json(sheet, { defval: "" });

            // Filtrar el registro a eliminar
            data = data.filter((entry) => entry.Nombre !== nombre);

            // Guardar los cambios en el archivo Excel
            const nuevaHoja = xlsx.utils.json_to_sheet(data);
            workbook.Sheets[workbook.SheetNames[0]] = nuevaHoja;
            xlsx.writeFile(workbook, filePath);
            th.success(`✅ Escudo de "${nombre}" eliminado.`);
        }
    } catch (error) {
        th.error("❌ Error al eliminar escudo del Excel:", error);
    }
}

// Función para editar un escudo en el archivo Excel
function editarEscudoExcel(nombre, nuevoNumero) {
    try {
        let workbook;
        let sheet;
        let data = [];

        // Leer el archivo Excel
        if (fs.existsSync(filePath)) {
            workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            sheet = workbook.Sheets[sheetName];
            data = xlsx.utils.sheet_to_json(sheet, { defval: "" });

            // Buscar el escudo a editar
            let escudo = data.find((entry) => entry.Nombre === nombre);
            if (escudo) {
                escudo.Numero = Number(nuevoNumero); // Modificar el número
            }

            // Guardar los cambios en el archivo Excel
            const nuevaHoja = xlsx.utils.json_to_sheet(data);
            workbook.Sheets[workbook.SheetNames[0]] = nuevaHoja;
            xlsx.writeFile(workbook, filePath);
            th.success(`✅ Escudo de "${nombre}" editado a ${nuevoNumero}.`);
        }
    } catch (error) {
        th.error("❌ Error al editar escudo en el Excel:", error);
    }
}

// Función para crear un retraso
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = escudo;
