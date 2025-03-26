const th = require("../../../src/client");
const cx = require("consola");

async function mobs(message) {
    const lowercase = message.body.toLowerCase();

    try {
        if (lowercase === '/mobs') {
            th.sendMessage(
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
        cx.warn('⚠️ Error en menu.js al enviar mobs');
    }
}

module.exports = mobs;
