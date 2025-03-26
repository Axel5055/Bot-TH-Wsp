async function sony(message) {
    try {
        // Convertir el mensaje a minúsculas
        let lowercase = message.body.toLowerCase();

        // Verificar si el mensaje contiene la palabra clave "sony"
        if (lowercase === 'sony') {
            // Responder al mensaje
            await message.reply('Aquí estoy, ¿qué necesitas?');

            // Intentar reaccionar con un emoji
            const emoji = '🦊'; // Emoji válido y estándar
            await message.react(emoji);

            console.log('Reacción enviada correctamente.');
        }
    } catch (error) {
        // Manejar cualquier error y registrar información
        console.error('Error en la función sony:', error);

        // Opcional: Responder con un mensaje en caso de error
        await message.reply('Lo siento, ocurrió un problema al procesar tu mensaje.');
    }
}

module.exports = sony;
