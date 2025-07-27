const sony = require("../../bot/client");
const th = require("consola");

async function mobs(message) {
    const lowercase = message.body.toLowerCase();

    try {
        if (lowercase === '/mobs') {
            sony.sendMessage(
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
        }
    } catch (error) {
        th.warn('⚠️ Error en menu.js al enviar mobs');
    }
}

module.exports = mobs;
