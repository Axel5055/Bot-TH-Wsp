const sony = require("../bot/client");
const chalk = require("chalk");

function consola() {
    console.clear();

    const banner = `
╭━━━╮╱╱╱╱╱╱╱╱╱╱╭━━━╮
┃╭━╮┃╱╱╱╱╱╱╱╱╱╱┃╭━╮┃╱╱╱╱╭╮
┃╰━━┳━━┳━╮╭╮╱╭╮┃╰━╯┣━┳━━╋╋━━┳━━╮
╰━━╮┃╭╮┃╭╮┫┃╱┃┃┃╭━━┫╭┫╭╮┣┫┃━┫╭━╯
┃╰━╯┃╰╯┃┃┃┃╰━╯┃┃┃╱╱┃┃┃╰╯┃┃┃━┫╰━╮
╰━━━┻━━┻╯╰┻━╮╭╯╰╯╱╱╰╯╰━━┫┣━━┻━━╯
╱╱╱╱╱╱╱╱╱╱╭━╯┃╱╱╱╱╱╱╱╱╱╭╯┃
╱╱╱╱╱╱╱╱╱╱╰━━╯╱╱╱╱╱╱╱╱╱╰━╯
╭━━━━╮╱╱╱╱╱╱╱╭╮╱╭╮╱╱╱╱╱╭╮
┃╭╮╭╮┃╱╱╱╱╱╱╱┃┃╱┃┃╱╱╱╱╭╯╰╮
╰╯┃┃┣┻┳╮╭┳━━╮┃╰━╯┣╮╭┳━╋╮╭╋━━┳━╮
╱╱┃┃┃╭┫┃┃┃┃━┫┃╭━╮┃┃┃┃╭╮┫┃┃┃━┫╭╯
╱╱┃┃┃┃┃╰╯┃┃━┫┃┃╱┃┃╰╯┃┃┃┃╰┫┃━┫┃
╱╱╰╯╰╯╰━━┻━━╯╰╯╱╰┻━━┻╯╰┻━┻━━┻╯
    `;

    console.log(chalk.cyan.bold(banner));
    console.log(chalk.green("🚀 Bot iniciado correctamente\n"));
}

// ✅ Escuchar mensajes de grupos
sony.on("message", async (msg) => {
    if (msg.from.endsWith("@g.us")) {
        console.log(
            chalk.yellow("📢 Grupo detectado: ") + chalk.cyan(msg.from)
        );
    }
});

module.exports = consola;
