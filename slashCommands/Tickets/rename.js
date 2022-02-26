const { MessageEmbed, CommandInteraction, MessageActionRow, MessageButton } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const db = require("../../database/tickets");
module.exports = {
    name: "rename", //the command name for the Slash Command
    description: "Renombra el ticket", //the command description for Slash Command Overview
    cooldown: 5,
    memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
    requiredroles: [settings.StaffID], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
    options: [ //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!
        //INFORMATIONS! You can add Options, but mind that the NAME MUST BE LOWERCASED! AND NO SPACES!!!, for the CHOCIES you need to add a array of arrays; [ ["",""] , ["",""] ] 
        //{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
        {
            "String": {
                name: "nombre",
                description: "Escribe un nombre nuevo para el ticket",
                required: true
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
            const Nombre = await options.getString("nombre")
            const antiguo = channel.name
            db.findOne({ ChannelID: channel.id }, async (err, docs) => {
                if (err) throw err;
                if (!docs)
                    return interaction.reply({
                        embeds: [new MessageEmbed()
                            .setFooter({ text: ee.footertext, iconURL: ee.footericon })
                            .setColor(ee.wrongcolor)
                            .setTitle(":x: Este canal no pertenece a un ticket")
                        ],
                        ephemeral: true
                    })
                channel.setName(Nombre).then(() => {
                    interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setFooter({ text: ee.footertext, iconURL: ee.footericon })
                                .setColor(ee.color)
                                .setTitle("✏ El nombre del ticket ha sido cambiado")
                                .setDescription("**Nombre antiguo:** " + antiguo + "\n**Nombre nuevo:** " + Nombre)
                                .setTimestamp()
                        ],
                    })
                })
            })
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}