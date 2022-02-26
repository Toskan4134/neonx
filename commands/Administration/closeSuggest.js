const { MessageEmbed, Message } = require("discord.js");
const settings = require("../../botconfig/settings.json");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const sugSchema = require("../../database/suggests.js")
const chan = settings.sugChan
module.exports = { //if [OPTIONAL] it means, you don't need to type it!
    activated: true,
    name: "closesuggest", //the Command Name [REQUIRED]
    category: "Administration", //the Command Category [OPTIONAL]
    aliases: ["csuggest", "csug", "cerrarsugerencia", "csugerencia"], //the command aliases [OPTIONAL]
    cooldown: 1, //the Command Cooldown (Default in /botconfig/settings.json) [OPTIONAL]
    usage: "closesuggest <accept/deny> <idMsgSugerencia> [Descripción]", //the Command usage [OPTIONAL]
    description: "Cierra una sugerencia marcándola como aceptada o denegada y añade la descripción dada", //the command description [OPTIONAL]
    memberpermissions: ["ADMINISTRATOR"], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
    requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
    minargs: 2, // minimum args for the message, 0 == none [OPTIONAL]
    maxargs: 0, // maximum args for the message, 0 == none [OPTIONAL]
    minplusargs: 0, // minimum args for the message, splitted with "++" , 0 == none [OPTIONAL]
    maxplusargs: 0, // maximum args for the message, splitted with "++" , 0 == none [OPTIONAL]
    argsmissing_message: "", //Message if the user has not enough args / not enough plus args, which will be sent, leave emtpy / dont add, if you wanna use command.usage or the default message! [OPTIONAL]
    argstoomany_message: "", //Message if the user has too many / not enough args / too many plus args, which will be sent, leave emtpy / dont add, if you wanna use command.usage or the default message! [OPTIONAL]
    run: async (client, message, args, plusArgs, cmdUser, text, prefix) => {
        let acceptedEmoji = "https://cdn.discordapp.com/emojis/695240609635631174.gif?size=96&quality=lossless"
        let deniedEmoji = "https://cdn.discordapp.com/emojis/695241294586314852.gif?size=96&quality=lossless"
        try {
            let id = args[1];
            const result = await sugSchema.find({
                _id: id
            })


            let idnoexiste = new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setFooter({ text: ee.footertext, iconURL: ee.footericon })
                .setTitle(`❌ La ID introducida no existe`)

            if (result == "" || result == undefined || result == null) return message.reply({
                embeds: [idnoexiste
                ]
            }).then(msg => { setTimeout(() => { msg.delete().catch((e) => { console.log(String(e).grey) }) }, settings.timeout.notallowed_to_exec_cmd.requiredroles) });
            let mensaje = ""
            try {
                mensaje = await client.channels.cache.get(chan).messages.fetch(result[0]._id)
            } catch {
                await sugSchema.deleteOne({
                    _id: result[0]._id
                })
                return message.reply({
                    embeds: [idnoexiste
                    ]
                }).then(msg => { setTimeout(() => { msg.delete().catch((e) => { console.log(String(e).grey) }) }, settings.timeout.notallowed_to_exec_cmd.requiredroles) });
            }


            let embed = new MessageEmbed()
                .setTitle("**NUEVA SUGERENCIA 📊**")
                .setDescription("**__Descripción__**\n" + result[0].msg)
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }), url: "https://discordapp.com/users/" + message.author.id })
                .setThumbnail(ee.footericon)
                .setImage(result[0].imgURL)


            async function changeDesc() {
                if (args.length > 2) {
                    embed.addField("Respuesta", args.slice(2).join(" "))
                }

            }


            let option = args[0].toLowerCase();
            if (option == "a" || option == "aceptar" || option == "accept") {
                option = "a"
            } else if (option == "d" || option == "denegar" || option == "deny") {
                option = "c"
            } else {
                option = "?"
            }
            switch (option) {
                case "a":
                    changeDesc()
                    embed.setColor("#00FF00")
                    embed.setFooter({ text: "Sugerencia aceptada", iconURL: acceptedEmoji })
                    message.reply({
                        embeds: [
                            new MessageEmbed()
                                .setTitle("✅ Sugerencia aceptada exitosamente")
                                .setFooter({ text: ee.footertext, iconURL: ee.footericon })
                                .setColor("#00ff00")
                        ]
                    })

                    break;
                case "c":
                    changeDesc()
                    embed.setColor("#FF0000")
                    embed.setFooter({ text: "Sugerencia denegada", iconURL: deniedEmoji })
                    message.reply({
                        embeds: [
                            new MessageEmbed()
                                .setTitle("✅ Sugerencia denegada exitosamente")
                                .setFooter({ text: ee.footertext, iconURL: ee.footericon })
                                .setColor("#00ff00")
                        ]
                    })

                    break;
                case "?":
                    let command = client.commands.get("closesuggest");
                    return message.reply({
                        embeds: [new MessageEmbed()
                            .setColor(ee.wrongcolor)
                            .setFooter({ text: ee.footertext, iconURL: ee.footericon })
                            .setTitle(":x: Uso incorrecto del comando")
                            .setDescription(command.usage ? "Uso: `" + command.usage + "`" : "`Uso incorrecto del comando`")]
                    }).then(msg => { setTimeout(() => { msg.delete().catch((e) => { console.log(String(e).grey) }) }, settings.timeout.notallowed_to_exec_cmd.minargs) })
            }
            await mensaje.edit({
                embeds: [
                    embed
                ]
            })
            // await sugSchema.deleteOne({
            //     _id: result[0]._id
            // })

        } catch (e) {
            console.log(String(e.stack).bgRed)
            return message.reply({
                embeds: [new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setFooter({ text: ee.footertext, iconURL: ee.footericon })
                    .setTitle(`❌ ERROR | Ha ocurrido un error`)
                    .setDescription(`\`\`\`${e.message ? String(e.message).substr(0, 2000) : String(e).substr(0, 2000)}\`\`\``)
                ]
            });
        }
    }
}
