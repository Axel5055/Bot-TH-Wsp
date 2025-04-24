const consola = require("consola");
const OpenAI = require("openai");

require("dotenv").config(); // Cargar variables de entorno

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Reemplaza con tu clave API de OpenAI
});

// Configuración global
const EMOJI = "🦊";
const PREFIX_RESPONSE = "🦊 *Respuesta de Sony* 🦊";

// Función para manejar errores
async function handleError(error, message) {
    consola.error("Hubo un error: " + error.message);
    await message.reply(`${PREFIX_RESPONSE}\nLo siento, hubo un error al procesar tu solicitud.`);
}

// Función para obtener respuesta de OpenAI
async function getOpenAIResponse(prompt) {
    const completion = await openai.chat.completions.create({
        model: "gpt-4.1",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150,
        temperature: 0.7,
    });
    return completion.choices[0].message.content.trim();
}

// Función principal
async function chatgtp(message) {
    const lowercase = message.body.toLowerCase();

    // Ignorar mensajes generados por la IA
    if (message.body.includes(PREFIX_RESPONSE)) {
        consola.info("Mensaje generado por la IA detectado, ignorando.");
        return;
    }

    // Reaccionar si el mensaje contiene "sony"
    if (lowercase.includes("sony")) {
        try {
            await message.react(EMOJI);
        } catch (error) {
            consola.warn("No se pudo reaccionar al mensaje: " + error.message);
        }
    }

    // Procesar saludo específico "hola sony"
    if (lowercase.includes("hola sony")) {
        try {
            consola.start("Procesando saludo para 'hola sony'");
            const response = await getOpenAIResponse("Saluda amablemente");
            await message.reply(`${PREFIX_RESPONSE}\n${response}`);
            consola.success("Respuesta enviada para 'hola sony'");
        } catch (error) {
            await handleError(error, message);
        }
        return;
    }

    // Procesar mensajes que comienzan con "sony"
    if (lowercase.startsWith("sony")) {
        const words = message.body.split(" ");
        if (words.length >= 2) {
            try {
                const userPrompt = words.slice(1).join(" ");
                consola.start(`Usuario a GPT: ${userPrompt}`);
                const response = await getOpenAIResponse(userPrompt);
                await message.reply(`${PREFIX_RESPONSE}\n${response}`);
                consola.success("Respuesta enviada correctamente.");
            } catch (error) {
                await handleError(error, message);
            }
        } else {
            consola.info("Mensaje incompleto: se requiere un texto después de 'Sony'");
            await message.reply(`${PREFIX_RESPONSE}\nDebes escribir algo después de "Sony". Ejemplo: sony ¿cómo puedo crear una cuenta de Google?`);
        }
    }
}

module.exports = chatgtp;