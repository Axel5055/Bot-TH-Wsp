const sony = require("../../bot/client");
const logger = require("../utils/logger"); // Logger centralizado

const COMMANDS = ['/mobs'];

async function mobs(message) {
    const lowercase = message.body.toLowerCase();

    if (!COMMANDS.includes(lowercase)) return; // Ignora mensajes que no son el comando

    try {
        await sony.sendMessage(
            message.from,
            `*🦊 TH BOT 🦊*

---------------->> 
| **LISTA DE MOBS** |
---------------->>

|  🔰 > */abeja*
|  🔰 > */alaescarcha*
|  🔰 > */alanegra*
|  🔰 > */apetito*
|  🔰 > */ballena*
|  🔰 > */bestia*
|  🔰 > */buho*
|  🔰 > */chaman*
|  🔰 > */araña*
|  🔰 > */gargantua*
|  🔰 > */gorila*
|  🔰 > */grifo*
|  🔰 > */jade*
|  🔰 > */megalarva*
|  🔰 > */moai*
|  🔰 > */lamuerte*
|  🔰 > */necrosis*
|  🔰 > */noceros*
|  🔰 > */rugido*
|  🔰 > */saberfang*
|  🔰 > */serpiente*
|  🔰 > */terrospin*
|  🔰 > */titan*
|  🔰 > */caballo*

---------------->> 

🅣🅗 ​ - ​ 🅑🅞🅣`
        );

        logger.info(`Lista de mobs enviada a ${message.from}`);
    } catch (error) {
        logger.error('Error en mobs.js al enviar la lista de mobs', error);
    }
}

module.exports = mobs;
