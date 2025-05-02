const sony = require('./client');
const th = require('consola');
const fs = require('fs');
const path = require('path');

/**
 * Carga dinámica de módulos desde un directorio.
 * @param {string} directory - Ruta del directorio.
 * @returns {Function[]} - Lista de funciones cargadas.
 */
const loadModules = (directory) =>
    fs.existsSync(directory) 
        ? fs.readdirSync(directory)
            .filter(file => file.endsWith('.js'))
            .map(file => require(path.join(directory, file)))
        : [];

/**
 * Función principal para manejar los comandos en la aplicación.
 */
async function comandos() {
    const directories = [
        '../commands',
        //'../commands/fun18more',
        '../commands/armaduras',
        '../commands/menus',
        '../commands/mobs',
        '../commands/reportes',
        '../commands/menciones',
        '../commands/heroes',
    ];

    // Cargar todos los módulos de los directorios listados
    const allFunctions = directories.flatMap(dir => loadModules(path.join(__dirname, dir)));

    sony.on('message_create', async (message) => {
        try {
            for (const func of allFunctions) {
                if (typeof func === 'function') {
                    await func(message);
                } else {
                    th.warn(`Módulo no válido: uno de los comandos no es una función`, func);
                }
            }
        } catch (error) {
            th.error(`Hubo un error en comandos.js: ${error.message}`, error.stack);
        }
    });
    
}

module.exports = comandos;
