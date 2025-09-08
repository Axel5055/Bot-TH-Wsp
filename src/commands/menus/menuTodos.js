const sony = require("../../bot/client");
const logger = require("../utils/logger"); // Logger centralizado

const COMMANDS = ['/matodos'];

async function menuTodos(message) {
    const lowercase = message.body.toLowerCase();

    if (!COMMANDS.includes(lowercase)) return; // Ignora mensajes que no son el comando

    try {
        await sony.sendMessage(
            message.from,
            `*🦊 TH BOT 🦊*

---------------->> 
| **COMANDOS PARA INVOCAR AL GRUPO Y ESCUDOS** |
---------------->>

|  🦊 > */rally* - Invocando Fillers |
|  🦊 > */forta* - Invocando todas las T4 |
|  🦊 > */escudo [nick-name]* - Avisar de escudo caído

✨ ¡No olvides usarlo para mantener a todos informados! 🦊|

---------------->> 

🅣🅗 ​ - ​ 🅑🅞🅣`
        );

        logger.info(`Menú de invocación y escudos enviado a ${message.from}`);
    } catch (error) {
        logger.error('Error en menuTodos.js al enviar el menú de invocación y escudos', error);
    }
}

module.exports = menuTodos;
