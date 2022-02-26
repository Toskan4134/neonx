const { MessageEmbed, CommandInteraction, MessageActionRow, MessageButton } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const db = require("../../database/suggests");
module.exports = {
    name: "new", //the command name for the Slash Command
    description: "Crea una nueva sugerencia", //the command description for Slash Command Overview
    cooldown: 5,
    memberpermissions: ["SEND_MESSAGES"], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
    requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
    options: [ //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!
        //INFORMATIONS! You can add Options, but mind that the NAME MUST BE LOWERCASED! AND NO SPACES!!!, for the CHOCIES you need to add a array of arrays; [ ["",""] , ["",""] ] 
        //{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
        {
            "String": {
                name: "texto",
                description: "Escribe tu sugerencia",
                required: true
            }
        },
        {
            "String": {
                name: "imágen",
                description: "Escribe la URL de una imágen para adjuntarla",
                required: false
            }
        }, //to use in the code: interacton.getString("title")
        //{"User": { name: "ping_a_user", description: "To Ping a user lol", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
        // { "Channel": { name: "in_where", description: "In What Channel should I send it?", required: false } }, //to use in the code: interacton.getChannel("what_channel")
        //{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
        //{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }}, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
        //{"StringChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", "botping"], ["Discord Api", "api"]] }}, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")

    ],
    run: async (client, interaction) => {
        try {
            //console.log(interaction, StringOption)

            //things u can directly access in an interaction!
            const { member, channelId, guildId, applicationId,
                commandName, deferred, replied, ephemeral,
                options, id, createdTimestamp, channel
            } = interaction;
            const { guild } = member;
            const texto = await options.getString("texto")
            const img = await options.getString("imágen")
            let loadingEmoji = "https://cdn.discordapp.com/emojis/732057183524749365.gif?size=96&quality=lossless";
            let canal = settings.sugChan
            let finembed = new MessageEmbed()
                .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true }), url: "https://discordapp.com/users/" + member.user.id })
                .setTitle("✅ **SUGERENCIA FINALIZADA**")
                .setColor("#00FF00")
                .setThumbnail(ee.footericon)
                .setDescription(texto)
            let sugerencia = new MessageEmbed()
                .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true }), url: "https://discordapp.com/users/" + member.user.id })
                .setTitle("**NUEVA SUGERENCIA 📊**")
                .setColor(ee.color)
                .setThumbnail(ee.footericon)
                .setFooter({ text: "Vota con 👍 si te gusta o 👎 si no te gusta", iconURL: loadingEmoji })
                .setDescription("**__Descripción__**\n" + texto)


            try {
                finembed.setImage(img)
                sugerencia.setImage(img)
            } catch {
                return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setTitle(":x: La imagen no se ha podido adjuntar")
                            .setColor(ee.wrongcolor)
                            .setDescription("Por favor revisa que la URL introducida es correcta e inténtalo de nuevo")
                    ]
                })
            }
            interaction.reply({ embeds: [finembed], ephemeral: true });
            let env = await client.channels.cache.get(canal).send({ embeds: [sugerencia] });
            let sug = {};
            if (img == null) {
                sug = {
                    _id: env.id,
                    msg: texto,
                    memberID: member.id
                }
            } else {
                sug = {
                    _id: env.id,
                    msg: texto,
                    imgURL: img,
                    memberID: member.id
                }
            }
            await new db(sug).save()
            await env.react("👍");
            await env.react("👎");

        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}