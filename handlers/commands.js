const {
    readdirSync
} = require("fs");
module.exports = (client) => {
    try {
        let amount = 0;
        let off = 0;
        readdirSync("./commands/").forEach((dir) => {
            const commands = readdirSync(`./commands/${dir}/`).filter((file) => file.endsWith(".js"));
            for (let file of commands) {
                let pull = require(`../commands/${dir}/${file}`);
                if (pull.name) {
                    if (pull.activated) {
                        amount++;
                    } else {
                        off++
                        pull.category = "Deactivated"
                    }
                    client.commands.set(pull.name, pull);
                } else {
                    console.log(file, `error -> falta un help.name, o el help.name no es un string.`.brightRed);
                    continue;
                }
                if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach((alias) => client.aliases.set(alias, pull.name));
            }
        });
        console.log(`${amount} Comandos Cargados`.brightGreen);
        console.log(`${off} Comandos Desactivados`.brightGreen);
    } catch (e) {
        console.log(String(e.stack).bgRed)
    }
};
