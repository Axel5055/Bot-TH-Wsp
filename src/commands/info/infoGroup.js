async function infoGroup(message) {
    const lowercase = message.body.toLowerCase();

    if (lowercase === '/info') {
        const chat = await message.getChat();

        if (chat.isGroup) {
            message.reply(`*🦊 INFORMACIÓN DEL GRUPO 🦊*

🦊 > *Nombre del grupo*: ${chat.name}

🦊 > *Descripción*: ${chat.description}

🦊 > *Creado el*: ${chat.createdAt.toString()}

🦊 > *Bot Creado por*: wa.me/+${chat.owner.user}

🦊 > *Número de participantes*: ${chat.participants.length}
---------------->>

🅣🅗 ​ - ​ 🅑🅞🅣`);
        } else {
            message.reply('*⚠️ ¡Este comando solo se puede usar en un grupo! ⚠️*');
        }
    }
}

module.exports = infoGroup;
