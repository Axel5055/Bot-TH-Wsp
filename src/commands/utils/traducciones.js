// utils/traducciones.js

const traduccionesManual = {
    watcher: 'Observador',
    research: 'Investigación',
    building: 'Construcción',
    merging: 'Pactos',
    hunting: 'Cacería',
    labyrinth: 'Laberinto',
    tycoon: 'Magnate',
    artifact: 'Artefactos',
    bright_talent_orb: 'Orbe Rojo',
    brilliant_talent_orb: 'Orbe Amarillo',
    chaos_dragon: 'Dragón del Caos',
    ancient_core: 'Núcleo Antiguo',
    chaos_core: 'Núcleo del Caos',
    merge_pacts: 'Fusionar Pactos',
    train_soldiers: 'Entrenar soldados',
    kingdom_tycoon: 'Magnate',
    queen_bee: 'Abeja Reina',
    mega_maggot: 'Megalarva',
    terrorthorn: 'Terrospín'
};

/**
 * Normaliza claves (ejemplo: "Red Orb" → "red_orb").
 * @param {string} str
 * @returns {string}
 */
function normalizarClave(str) {
    return str.trim().toLowerCase().replace(/\s+/g, '_');
}

/**
 * Traduce manualmente las palabras encontradas.
 * @param {string} texto
 * @returns {string[]}
 */
function traducirManual(texto) {
    return texto
        .split(/[\|,]/)
        .map(p => normalizarClave(p.trim()))
        .map(key => traduccionesManual[key] || key.replace(/_/g, ' '));
}

/**
 * Capitaliza un texto (primera letra en mayúscula).
 * @param {string} str
 * @returns {string}
 */
function capitalizar(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

module.exports = {
    traduccionesManual,
    normalizarClave,
    traducirManual,
    capitalizar
};
