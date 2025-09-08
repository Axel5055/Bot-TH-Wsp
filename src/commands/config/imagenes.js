// config/imagenes.js

const path = require('path');

const IMAGENES_ALERTAS = {
    red_orb: 'red_orbe.jpg',
    yellow_orb: 'yellow_orb.jpg',
    watcher: 'watcher.jpg',
    ancient_core: 'ancient_core.jpg',
    chaos_core: 'chaos_core.jpg',
    chaos_dragon: 'chaos_dragon.jpg',
};

/**
 * Devuelve la ruta absoluta de una imagen si existe en el mapa.
 * @param {string} key
 * @returns {string|null}
 */
function getImagenPath(key) {
    if (IMAGENES_ALERTAS[key]) {
        return path.join(__dirname, '../assets/img/alertas', IMAGENES_ALERTAS[key]);
    }
    return null;
}

module.exports = {
    IMAGENES_ALERTAS,
    getImagenPath
};
