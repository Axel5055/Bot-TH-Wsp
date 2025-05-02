// whatsapp.js
const { Client } = require('whatsapp-web.js');
const client = new Client();

let isReady = false;

client.on('ready', () => {
  isReady = true;
  console.log('Bot de WhatsApp listo');
});

client.initialize();

async function sendWhatsAppMessage(message) {
  if (!isReady) return;

  const chatId = '120363376810768678@g.us'; // o grupo, p. ej. 123456789-123456@g.us
  await client.sendMessage(chatId, message);
}

module.exports = { sendWhatsAppMessage };
