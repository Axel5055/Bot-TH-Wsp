// config/imagenes.js

const path = require('path');

const IMAGENES_ALERTAS = {
    bright_talent_orb: 'red_orbe.jpg',
    brilliant_talent_orb: 'yellow_orb.jpg',
    watcher: 'watcher.jpg',
    ancient_core: 'ancient_core.jpg',
    chaos_core: 'chaos_core.jpg',
    chaos_dragon: 'chaos_dragon.jpg',
    queen_bee: 'abeja.jpg',
    mega_maggot: 'megalarva.jpg',
    Noceros: 'noceros.jpg', 
    bon_appeti: 'apetito.jpg',
    gawrilla: 'gorilla.jpg',
    necrosis: 'necrosis.jpg',
    gryphon: 'grifo.jpg',
    saberfang: 'saberfang.jpg',
    blackwing: 'alanegra.jpg',
    frostwing: 'alaescarcha.jpg',
    serpent_gladiator: 'serpiente.jpg',
    cottageroar: 'rugido.jpg'
};

/**
 * Devuelve la ruta absoluta de una imagen si existe en el mapa.
 * @param {string} key
 * @returns {string|null}
 */
function getImagenPath(key) {
    if (IMAGENES_ALERTAS[key]) {
        return path.join(__dirname, '../../assets/img/alertas', IMAGENES_ALERTAS[key]);
    }
    return null;
}

function getImagenPathMobs(key) {
    if (IMAGENES_ALERTAS[key]) {
        return path.join(__dirname, '../../assets/img/mobs', IMAGENES_ALERTAS[key]);
    }
    return null;
}

module.exports = {
    IMAGENES_ALERTAS,
    getImagenPath,
    getImagenPathMobs
};
