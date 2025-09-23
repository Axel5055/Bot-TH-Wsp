const consola = require("consola");
const OpenAI = require("openai");

require("dotenv").config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Configuración
const EMOJI = "🦊";
const BOT_NAME = "Sony";
const PREFIX_RESPONSE = `🦊 *${BOT_NAME}* 🦊`;

// Mensaje inicial de personalidad
const SYSTEM_PROMPT = `
Eres ${BOT_NAME}, un bot para grupos de WhatsApp. 
Tienes personalidad divertida, directa y algo irreverente, pero siempre amable con los usuarios. 
No usas respuestas corporativas, hablas como una persona real en español.
Puedes bromear, ser ingenioso, y dar respuestas creativas.
No repitas frases innecesarias como "como IA no puedo...".
Si te piden opinión, respóndela como si fueras un amigo de confianza.
`;

// Manejo de errores
async function handleError(error, message) {
    consola.error("Hubo un error:", error);
    await message.reply(`${PREFIX_RESPONSE}\nUps... algo salió mal 😅`);
}

// Obtener respuesta de OpenAI
async function getOpenAIResponse(prompt, context = []) {
    const completion = await openai.chat.completions.create({
        model: "gpt-4.1-nano-2025-04-14",
        messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...context,
            { role: "user", content: prompt }
        ],
        max_tokens: 400,
        temperature: 0.95, // Más creatividad
        presence_penalty: 0.6, // Más variedad
        frequency_penalty: 0.4,
    });

    return completion.choices[0]?.message?.content?.trim() || "No sé qué decir 😅";
}

// Procesar mensajes
async function chatgtp(message, chatHistory = {}) {
    const text = message.body.trim();
    const lowercase = text.toLowerCase();

    // Evitar responder a sí mismo
    if (text.includes(PREFIX_RESPONSE)) return;

    // Reacción si mencionan el nombre
    if (lowercase.includes(BOT_NAME.toLowerCase())) {
        try { await message.react(EMOJI); } 
        catch (error) { consola.warn("No se pudo reaccionar:", error.message); }
    }

    // Saludo especial
    if (lowercase === `hola ${BOT_NAME.toLowerCase()}`) {
        try {
            const response = await getOpenAIResponse("Respóndeme con un saludo amigable y algo gracioso.");
            await message.reply(`${PREFIX_RESPONSE}\n${response}`);
        } catch (error) {
            await handleError(error, message);
        }
        return;
    }

    // Si empieza con el nombre del bot
    if (lowercase.startsWith(BOT_NAME.toLowerCase())) {
        const userPrompt = text.split(" ").slice(1).join(" ").trim();

        if (!userPrompt) {
            await message.reply(`${PREFIX_RESPONSE}\nPon algo después de "${BOT_NAME}". Ej: ${BOT_NAME} cuéntame un chiste`);
            return;
        }

        try {
            // Guardar historial del chat para contexto
            const chatId = message.from;
            chatHistory[chatId] = chatHistory[chatId] || [];
            chatHistory[chatId].push({ role: "user", content: userPrompt });

            const response = await getOpenAIResponse(userPrompt, chatHistory[chatId]);
            
            chatHistory[chatId].push({ role: "assistant", content: response });
            await message.reply(`${PREFIX_RESPONSE}\n${response}`);
        } catch (error) {
            await handleError(error, message);
        }
    }
}

module.exports = chatgtp;
