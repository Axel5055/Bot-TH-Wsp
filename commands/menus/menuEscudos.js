const sony = require("../../src/client");
const th = require("consola");

async function menuEscudos(message) {
    const lowercase = message.body.toLowerCase();

    try {
        if (lowercase === '/mescudos') {
            sony.sendMessage(
                message.from, 
                `*🦊 TH BOT 🦊*

---------------->> 
| **COMANDOS ESCUDOS** |
---------------->>

|  🦊 > */addescudo [Nick] [Numero]* - Si no estas registrado usa este comando.
|  🦊 > */escudo [Nick]* - Avisar de escudo caído
|  🦊 > */list* - Lista de los usuarios registrados.
|  🦊 > */editescudo [Nick Anterior] [Nick Nuevo] [Número]* - Elimina el registro de la lista de escudos.
|  🦊 > */deleteescudo [Nick]* - Elimina el registro de la lista de escudos.

🅣🅗 ​ - ​ 🅑🅞🅣`
                
            );
        }
    } catch (error) {
        th.warn('⚠️ Error en menu.js al enviar el menuEventos');
    }
}

module.exports = menuEscudos;
