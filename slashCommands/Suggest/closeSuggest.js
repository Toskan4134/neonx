const { MessageEmbed, CommandInteraction, MessageActionRow, MessageButton } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const db = require("../../database/suggests");
const chan = settings.sugChan
module.exports = {
    name: "close", //the command name for the Slash Command
    description: "Cierra una sugerencia", //the command description for Slash Command Overview
    cooldown: 5,
    memberpermissions: ["ADMINISTRATOR"], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
    requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
    options: [ //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!
        //INFORMATIONS! You can add Options, but mind that the NAME MUST BE LOWERCASED! AND NO SPACES!!!, for the CHOCIES you need to add a array of arrays; [ ["",""] , ["",""] ] 
        //{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
        {
            "StringChoices": {
                name: "aceptar-denegar",
                description: "Acepta o denega la sugerencia",
                required: true,
                choices: [
                    ["Aceptar", "accept"],
                    ["Denegar", "deny"]
                ]
            }
        },
        {
            "String": {
                name: "id",
                description: "Escribe la ID del mensaje de la sugerencia",
                required: true
            }
        },
        {
            "String": {
                name: "descripción",
                description: "Escribe la respuesta a la sugerencia",
                required: false
            }
        }
        //to use in the code: interacton.getString("title")
        //{"User": { name: "ping_a_user", description: "To Ping a user lol", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
        // { "Channel": { name: "in_where", description: "In What Channel should I send it?", required: false } }, //to use in the code: interacton.getChannel("what_channel")
        //{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
        //{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }}, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
        //{"StringChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", "botping"], ["Discord Api", "api"]] }}, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")

    ],
    run: async (client, interaction) => {
        try {
            const { member, channelId, guildId, applicationId,
                commandName, deferred, replied, ephemeral,
                options, createdTimestamp, channel
            } = interaction;
            const { guild } = member;
            const opción = await options.getString("aceptar-denegar")
            const id = await options.getString("id")
            const desc = await options.getString("descripción")
            let acceptedEmoji = "https://cdn.discordapp.com/emojis/695240609635631174.gif?size=96&quality=lossless"
            let deniedEmoji = "https://cdn.discordapp.com/emojis/695241294586314852.gif?size=96&quality=lossless"

            const result = await db.find({
                _id: id
            })

            let idnoexiste = new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setFooter({ text: ee.footertext, iconURL: ee.footericon })
                .setTitle(`❌ La ID introducida no existe`)

            if (result.length === 0) return interaction.reply({
                embeds: [idnoexiste],
                ephemeral: true
            })
            let message = ""
            try {
                message = await client.channels.cache.get(chan).messages.fetch(result[0]._id)
            } catch {
                await db.deleteOne({
                    _id: result[0]._id
                })
                return interaction.reply({
                    embeds: [idnoexiste],
                    ephemeral: true
                })
            }

            let user = guild.members.cache.get(result[0].memberID)

            let embed = new MessageEmbed()
                .setTitle("**NUEVA SUGERENCIA 📊**")
                .setDescription("**__Descripción__**\n" + result[0].msg)
                .setAuthor({ name: user.user.tag, iconURL: user.user.displayAvatarURL({ dynamic: true }), url: "https://discordapp.com/users/" + user.user.id })
                .setThumbnail(ee.footericon)
                .setImage(result[0].imgURL)

            async function changeDesc() {
                if (desc !== null) {
                    embed.addField("Respuesta", desc)
                }

            }
            switch (opción) {
                case "accept":
                    changeDesc()
                    embed.setColor("#00FF00")
                    embed.setFooter({ text: "Sugerencia aceptada", iconURL: acceptedEmoji })
                    interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setTitle("Sugerencia aceptada exitosamente")
                                .setFooter({ text: ee.footertext, iconURL: ee.footericon })
                                .setColor(ee.color)
                        ],
                        ephemeral: true
                    })

                    break;
                case "deny":
                    changeDesc()
                    embed.setColor("#FF0000")
                    embed.setFooter({ text: "Sugerencia denegada", iconURL: deniedEmoji })
                    interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setTitle("Sugerencia denegada exitosamente")
                                .setFooter({ text: ee.footertext, iconURL: ee.footericon })
                                .setColor(ee.color)
                        ],
                        ephemeral: true
                    })

                    break;
            }
            await message.edit({
                embeds: [
                    embed
                ]
            })
            // await db.deleteOne({
            //     _id: result[0]._id
            // })

        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}