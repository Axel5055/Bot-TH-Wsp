const qrcode = require('qrcode-terminal');
const chalk = require('chalk');
const th = require("consola");
const moment = require('moment-timezone');

const comandos = require('./bot/comandos');
const consol = require('./utils/log');

const discord = require('./commands/discord');
discord(); // 👈 solo debe llamarse una vez

//estilos de texto en consola
const red = chalk.bold.red;

//fecha y hora MX
const mexico = moment().tz("America/Mexico_City");
const hour = mexico.format('HH:mm:ss');

//cliente
const sony = require('./bot/client');

// Guarda valores de sesión en el archivo después de una autenticación exitosa
sony.on('authenticated', (session) => {
    //console.clear()
    th.success(red(`Autenticado at ${hour}\n`))
});

//si no esta iniciado, crea un qr
sony.on("qr", qr => {
    console.log('------------ TH Project ------------');
    //console.log('Código QR:', qr);
    qrcode.generate(qr, { small: true });
    console.log('------------ TH Project ------------');
});

//si esta activo, enviar mensaje a los siguientes numeros
const send_message = [
    "5538901631"
]

//Ejecutar cliente
sony.on("ready", async () => {
    consol();
    
    send_message.forEach(async (value) => {
        const chatId = value + "@c.us";
        const currentHour = moment().tz("America/Mexico_City").format('HH:mm:ss');
        const message = `*_Come at me_*!! \nTiempo MX: ${currentHour}\n_Sr. Courtesy_`;

        try {
            await sony.sendMessage(chatId, message);
        } catch (error) {
            console.error(`Error al enviar mensaje a ${chatId}:`, error);
        }
    });
});


//cargando
sony.on('loading_screen', (percent, message) => {
    if (percent === 100) {
        console.log('Carga completa,', 'Iniciando', message);
    } else {
        console.log('Cargando en un', percent, '%', message);
    }
});

//conexion:
sony.on('change_state', state => {
    th.info(red('Estatus de la conexion', state));
});

sony.on('disconnected', async (reason) => {
    console.log('Cliente desconectado:', reason);
    
    console.log('Intentando reiniciar...');
    setTimeout(() => {
        sony.initialize();  // Reinicia la sesión automáticamente
    }, 5000); // Espera 5 segundos antes de intentar reiniciar
});

//iniciar cliente
sony.initialize();

comandos();