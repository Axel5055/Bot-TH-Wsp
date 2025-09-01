const { Client, LocalAuth } = require('whatsapp-web.js');

const sony = new Client({
    authStrategy: new LocalAuth({
        clientId: process.env.WA_CLIENT_ID || "Sony"
    }),
    puppeteer: {
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-accelerated-2d-canvas",
            "--no-first-run",
            "--no-zygote",
            "--single-process",
            "--disable-gpu",
            "--disable-voice-input",
            "--disable-default-browser-check",
            "--disable-translate",
            "--disable-sync",
            "--disable-site-isolation-trials",
            "--disable-renderer-backgrounding",
            "--disable-infobars",
            "--disable-remote-fonts",
            "--disable-logging",
            "--disable-hang-monitor",
            "--disable-default-apps",
            "--disable-breakpad"
        ],
        defaultViewport: { width: 50, height: 50 },
        headless: 'new',  // Cambiado a 'new' para mayor estabilidad
        ignoreHTTPSErrors: true,
    },
    // webVersionCache: {
    //     type: 'remote',
    //     remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.3000.1026474633-alpha.html',
    // },
    maxConcurrency: 1,
    maxBrowserMemory: 150 * 1024 * 1024,
    disableMediaDownload: true,
    maxCachedMessages: 0,
});

module.exports = sony;
