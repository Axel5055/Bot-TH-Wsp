const { Client, LocalAuth } = require('whatsapp-web.js');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// Configuración de headless
const HEADLESS = process.env.WA_HEADLESS === 'false' ? false : 'new';

// Función para detectar Chrome en Windows
function getChromePath() {
    const winPaths = [
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
        path.join(process.env.LOCALAPPDATA || '', "Google\\Chrome\\Application\\chrome.exe")
    ];

    for (const p of winPaths) {
        if (fs.existsSync(p)) return p;
    }
    return null;
}

// Determinar executablePath
let executablePath = getChromePath();
if (!executablePath) {
    console.log("⚡ No se encontró Chrome local, usando Chromium de Puppeteer");
    executablePath = puppeteer.executablePath();
    if (!fs.existsSync(executablePath)) {
        console.error("❌ Chromium de Puppeteer no encontrado. Instala Puppeteer completo:");
        console.error("   npm install puppeteer");
        process.exit(1);
    }
} else {
    console.log("⚡ Usando Google Chrome local:", executablePath);
}

// Crear cliente de WhatsApp
const sony = new Client({
    authStrategy: new LocalAuth({ clientId: process.env.WA_CLIENT_ID || "Sony" }),
    puppeteer: {
        executablePath,
        headless: HEADLESS,
        args: [
            "--disable-dev-shm-usage",
            "--disable-setuid-sandbox",
            "--no-sandbox",
        ],
        defaultViewport: { width: 800, height: 600 },
        ignoreHTTPSErrors: true,
    },
    maxConcurrency: 1,
    maxBrowserMemory: 1024 * 1024 * 1024, // 1GB
    disableMediaDownload: true,
    maxCachedMessages: 0,
});

sony.on('authenticated', () => console.log("✅ Autenticado correctamente!"));
sony.on('ready', () => console.log("🤖 Bot listo y conectado!"));
sony.on('auth_failure', (msg) => console.error("❌ Fallo en autenticación:", msg));
sony.on('disconnected', (reason) => console.log("⚠️ Desconectado:", reason));

module.exports = sony;
