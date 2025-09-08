// utils/logger.js
const consola = require('consola');

/**
 * Logger centralizado para toda la app
 * Permite cambiar librería de logs sin tocar todo el código
 */
const logger = {
    success: (msg, ...args) => consola.success(msg, ...args),
    info: (msg, ...args) => consola.info(msg, ...args),
    warn: (msg, ...args) => consola.warn(msg, ...args),
    error: (msg, ...args) => consola.error(msg, ...args),
    debug: (msg, ...args) => consola.debug(msg, ...args),
    log: (msg, ...args) => consola.log(msg, ...args),
};

module.exports = logger;
