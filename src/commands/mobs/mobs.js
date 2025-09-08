const sony = require("../../bot/client");
const { MessageMedia } = require('whatsapp-web.js');
const logger = require("../utils/logger"); // Logger centralizado

// Lista de mobs con sus imágenes y captions
const MOBS = {
    abeja: {
        image: './src/assets/img/mobs/abeja.jpg',
        caption: `*🐝 Abeja* - Estrategia recomendada para cazar este mob 🏹`
    },
    alaescarcha: {
        image: './src/assets/img/mobs/alaescarcha.jpg',
        caption: `*❄️ Ala Escarcha* - Estrategia recomendada para cazar este mob 🏹`
    },
    alanegra: {
        image: './src/assets/img/mobs/alanegra.jpg',
        caption: `*🖤 Ala Negra* - Estrategia recomendada para cazar este mob 🏹`
    },
    apetito: { image: './src/assets/img/mobs/apetito.jpg', caption: '*🍖 Apetito* - Estrategia para cazar este mob 🏹' },
    ballena: { image: './src/assets/img/mobs/ballena.jpg', caption: '*🐋 Ballena* - Estrategia para cazar este mob 🏹' },
    bestia: { image: './src/assets/img/mobs/bestia.jpg', caption: '*🦁 Bestia* - Estrategia para cazar este mob 🏹' },
    buho: { image: './src/assets/img/mobs/buho.jpg', caption: '*🦉 Búho* - Estrategia para cazar este mob 🏹' },
    chaman: { image: './src/assets/img/mobs/chaman.jpg', caption: '*🧙 Chaman* - Estrategia para cazar este mob 🏹' },
    araña: { image: './src/assets/img/mobs/araña.jpg', caption: '*🕷 Araña* - Estrategia para cazar este mob 🏹' },
    gargantua: { image: './src/assets/img/mobs/gargantua.jpg', caption: '*🗿 Gargantua* - Estrategia para cazar este mob 🏹' },
    gorila: { image: './src/assets/img/mobs/gorila.jpg', caption: '*🦍 Gorila* - Estrategia para cazar este mob 🏹' },
    grifo: { image: './src/assets/img/mobs/grifo.jpg', caption: '*🦅 Grifo* - Estrategia para cazar este mob 🏹' },
    jade: { image: './src/assets/img/mobs/jade.jpg', caption: '*💎 Jade* - Estrategia para cazar este mob 🏹' },
    megalarva: { image: './src/assets/img/mobs/megalarva.jpg', caption: '*🐛 Megalarva* - Estrategia para cazar este mob 🏹' },
    moai: { image: './src/assets/img/mobs/moai.jpg', caption: '*🗿 Moai* - Estrategia para cazar este mob 🏹' },
    lamuerte: { image: './src/assets/img/mobs/lamuerte.jpg', caption: '*💀 La Muerte* - Estrategia para cazar este mob 🏹' },
    necrosis: { image: './src/assets/img/mobs/necrosis.jpg', caption: '*☠️ Necrosis* - Estrategia para cazar este mob 🏹' },
    noceros: { image: './src/assets/img/mobs/noceros.jpg', caption: '*🦏 Noceros* - Estrategia para cazar este mob 🏹' },
    rugido: { image: './src/assets/img/mobs/rugido.jpg', caption: '*🦁 Rugido* - Estrategia para cazar este mob 🏹' },
    saberfang: { image: './src/assets/img/mobs/saberfang.jpg', caption: '*🐆 Saberfang* - Estrategia para cazar este mob 🏹' },
    serpiente: { image: './src/assets/img/mobs/serpiente.jpg', caption: '*🐍 Serpiente* - Estrategia para cazar este mob 🏹' },
    terrospin: { image: './src/assets/img/mobs/terrospin.jpg', caption: '*🦖 Terrospin* - Estrategia para cazar este mob 🏹' },
    titan: { image: './src/assets/img/mobs/titan.jpg', caption: '*🗿 Titán* - Estrategia para cazar este mob 🏹' },
    caballo: { image: './src/assets/img/mobs/caballo.jpg', caption: '*🐎 Caballo* - Estrategia para cazar este mob 🏹' }
};

async function handleMob(message) {
    const command = message.body.toLowerCase().replace('/', ''); // Quita la barra inicial
    const mob = MOBS[command];

    if (!mob) return; // No es un comando válido

    try {
        const media = MessageMedia.fromFilePath(mob.image);
        await sony.sendMessage(message.from, media, { caption: mob.caption });
        logger.info(`Mensaje del mob "${command}" enviado a ${message.from}`);
    } catch (error) {
        logger.error(`Error al enviar el mob "${command}"`, error);
    }
}

module.exports = handleMob;
