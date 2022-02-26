const { MessageEmbed } = require("discord.js");
const settings = require("../../botconfig/settings.json");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const sugSchema = require("../../database/suggests.js")
const fs = require('fs');
const fetch = require('node-fetch');
module.exports = { //if [OPTIONAL] it means, you don't need to type it!
    activated: true,
    name: "suggest", //the Command Name [REQUIRED]
    category: "Utility", //the Command Category [OPTIONAL]
    aliases: ["sug", "sugerir"], //the command aliases [OPTIONAL]
    cooldown: 2, //the Command Cooldown (Default in /botconfig/settings.json) [OPTIONAL]
    usage: "suggest [sugerencia]", //the Command usage [OPTIONAL]
    description: "Manda la sugerencia al canal establecido", //the command description [OPTIONAL]
    memberpermissions: ["SEND_MESSAGES"], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
    requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
    minargs: 0, // minimum args for the message, 0 == none [OPTIONAL]
    maxargs: 0, // maximum args for the message, 0 == none [OPTIONAL]
    minplusargs: 0, // minimum args for the message, splitted with "++" , 0 == none [OPTIONAL]
    maxplusargs: 0, // maximum args for the message, splitted with "++" , 0 == none [OPTIONAL]
    argsmissing_message: "", //Message if the user has not enough args / not enough plus args, which will be sent, leave emtpy / dont add, if you wanna use command.usage or the default message! [OPTIONAL]
    argstoomany_message: "", //Message if the user has too many / not enough args / too many plus args, which will be sent, leave emtpy / dont add, if you wanna use command.usage or the default message! [OPTIONAL]
    run: async (client, message, args, plusArgs, cmdUser, text, prefix) => {
        let loadingEmoji = "https://cdn.discordapp.com/emojis/732057183524749365.gif?size=96&quality=lossless";
        var tiempoSugerencias = false;
        let canal = settings.sugChan
        let finembed = new MessageEmbed()
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }), url: "https://discordapp.com/users/" + message.author.id })
            .setTitle("**SUGERENCIA FINALIZADA** ✅")
            .setColor("#00FF00")
            .setThumbnail(
                ee.footericon
            );
        let okembed = new MessageEmbed()
            .setTitle("Sugerencias")
            .setDescription(
                "**SUGERENCIA EN PROCESO ⏱**\n\n**Describa su sugerencia por favor.**"
            )
            .setColor("#ffff00")
            .setThumbnail(
                ee.footericon
            )
            .setFooter({
                text: "Si quieres cancelar la sugerencia, reacciona a la papelera"
            }
            );


        let sugerencia = new MessageEmbed()
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }), url: "https://discordapp.com/users/" + message.author.id })
            .setTitle("**NUEVA SUGERENCIA 📊**")
            .setColor(ee.color)
            .setThumbnail(
                ee.footericon)
            .setFooter({ text: "Vota con 👍 si te gusta o 👎 si no te gusta", iconURL: loadingEmoji });


        if (args[0]) {
            endSuggest(args.join(" "))
        } else {

            let msg = await message.channel.send({ embeds: [okembed] });
            await msg.react("🗑");
            const filter = (reaction, user) => {
                return reaction.emoji.name === '🗑' &&
                    user.id == message.member.id
            }

            const collector = await msg.createReactionCollector({
                filter,
                max: 1
            })

            collector.on("collect", () => {
                msg.delete()
                tiempoSugerencias = true;
            })

            const filtro = (m) => {
                return m.member.id === message.member.id
            }

            const coll = message.channel.createMessageCollector({
                filter: filtro, max: 1, time: 240 * 1000
            })

            coll.on("collect", async col => {
                if (tiempoSugerencias) return;
                msg.delete()
                endSuggest(col.content);
            })

            coll.on("end", collected => {
                if (collected.size === 0) {
                    msg.delete()
                    message.reply({
                        embeds: [
                            new MessageEmbed()
                                .setTitle(":x: Se ha acabado el tiempo y no has introducido tu sugerencia")
                                .setColor("#ff0000")
                                .setFooter({ text: ee.footertext, iconURL: ee.footericon })
                        ]
                    })
                }
            })
        }





        async function endSuggest(txt) {
            finembed.setDescription(
                "**Descripción**\n" +
                txt
            )
            sugerencia.setDescription("**__Descripción__**\n" + txt)
            message.channel.send({ embeds: [finembed] });
            let env = await client.channels.cache.get(canal).send({ embeds: [sugerencia] });
            const sug = {
                _id: env.id,
                msg: txt,
            }
            await new sugSchema(sug).save()
            await env.react("👍");
            await env.react("👎");
        }

    }
}