const fs = require("fs");
const allevents = [];
module.exports = async (client) => {
    try {
        try {
            const stringlength = 69;
            console.log(`     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`.bold.magenta)
            console.log(`     ┃ `.bold.magenta + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".bold.magenta)
            console.log(`     ┃ `.bold.magenta + `                       Neon Servers Bot`.bold.blue + " ".repeat(-1 + stringlength - ` ┃ `.length - `                       Neon Servers Bot`.length) + "┃".bold.magenta)
            console.log(`     ┃ `.bold.magenta + `                       - By Toskan4134 -`.bold.cyan + " ".repeat(-1 + stringlength - ` ┃ `.length - `                       - By Toskan4134 -`.length) + "┃".bold.magenta)
            console.log(`     ┃ `.bold.magenta + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".bold.magenta)
            console.log(`     ┃ `.bold.magenta + `                 / Discord: Toskan4134#6265 \\`.bold.magenta + " ".repeat(-1 + stringlength - ` ┃ `.length - `                    / Discord: Toskan4134#6265 \\`.length) + "   ┃".bold.magenta)
            console.log(`     ┃ `.bold.magenta + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".bold.magenta)
            console.log(`     ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.bold.magenta)
        } catch {
            /* */
        }
        let amount = 0;
        const load_dir = (dir) => {
            const event_files = fs.readdirSync(`./events/${dir}`).filter((file) => file.endsWith(".js"));
            for (const file of event_files) {
                try {
                    const event = require(`../events/${dir}/${file}`)
                    let eventName = file.split(".")[0];
                    allevents.push(eventName);
                    client.on(eventName, event.bind(null, client));
                    amount++;
                } catch (e) {
                    console.log(e)
                }
            }
        }
        await ["client", "guild", "tickets", "verify", "logs", "stats", "giveaways"].forEach(e => load_dir(e));
        console.log(`${amount} Eventos Cargados`.brightGreen);
        try {
            const stringlength2 = 69;
            console.log(`     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`.bold.yellow)
            console.log(`     ┃ `.bold.yellow + " ".repeat(-1 + stringlength2 - ` ┃ `.length) + "┃".bold.yellow)
            console.log(`     ┃ `.bold.yellow + `                          Iniciando Bot`.bold.yellow + " ".repeat(-1 + stringlength2 - ` ┃ `.length - `                          Iniciando Bot`.length) + "┃".bold.yellow)
            console.log(`     ┃ `.bold.yellow + " ".repeat(-1 + stringlength2 - ` ┃ `.length) + "┃".bold.yellow)
            console.log(`     ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.bold.yellow)
        } catch {
            /* */
        }
    } catch (e) {
        console.log(String(e.stack).bgRed)
    }
};