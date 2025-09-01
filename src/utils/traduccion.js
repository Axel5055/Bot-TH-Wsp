// ../utils/traduccion.js

/**
 * Traduce manualmente los tipos o fuentes de Discord a nombres más legibles en español.
 * @param {string|string[]} input - Tipo o fuente en inglés o clave.
 * @returns {string[]} - Array de traducciones.
 */
function traducirManual(input) {
    if (!input) return [];

    const traducciones = {
        watcher: "Observador",
        "chaos dragon": "Dragón del Caos",
        "red_orb": "Orbe Rojo",
        "yellow_orb": "Orbe Amarillo",
        "ancient_core": "Núcleo Antiguo",
        "chaos_core": "Núcleo del Caos",
        dragon: "Dragón del Caos",
        // agrega más traducciones según necesites
    };

    const arr = Array.isArray(input) ? input : input.split(",").map((s) => s.trim().toLowerCase());
    return arr.map((item) => traducciones[item.toLowerCase()] || item);
}

/**
 * Normaliza claves: convierte a minúsculas y reemplaza espacios por guiones bajos.
 * Útil para comparar tipos o nombres.
 * @param {string} str 
 * @returns {string}
 */
function normalizarClave(str) {
    return str.toLowerCase().replace(/\s+/g, "_").trim();
}

/**
 * Capitaliza la primera letra de cada palabra.
 * @param {string} str 
 * @returns {string}
 */
function capitalizar(str) {
    if (!str) return "";
    return str
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

module.exports = {
    traducirManual,
    normalizarClave,
    capitalizar,
};
