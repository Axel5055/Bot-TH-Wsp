async function sony(message) {
    try {
        const body = (message.body || "").trim().toLowerCase();

        // Si contiene la palabra "sony" (no necesariamente exacta)
        if (body === "sony") {
            // Respuesta al usuario
            await message.reply("Aquí estoy, ¿qué necesitas?");

            // Reacción al mensaje
            try {
                await message.react("🦊");
                console.log("Reacción enviada correctamente.");
            } catch (err) {
                console.warn("No se pudo enviar la reacción:", err.message);
            }
        }
    } catch (error) {
        console.error("Error en la función sony:", error);

        // Evitar que un segundo error en reply rompa todo
        try {
            await message.reply("Lo siento, ocurrió un problema al procesar tu mensaje.");
        } catch (err) {
            console.warn("No se pudo enviar el mensaje de error:", err.message);
        }
    }
}

module.exports = sony;
