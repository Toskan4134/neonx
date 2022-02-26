const { MessageEmbed, CommandInteraction, MessageActionRow, MessageButton } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const db = require("../../database/warns.js");
module.exports = {
    name: "list", //the command name for the Slash Command
    description: "Envía una lista con todos los Avisos de un usuario", //the command description for Slash Command Overview
    cooldown: 1,
    memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
    requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
    options: [ //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!
        //INFORMATIONS! You can add Options, but mind that the NAME MUST BE LOWERCASED! AND NO SPACES!!!, for the CHOCIES you need to add a array of arrays; [ ["",""] , ["",""] ] 
        {
            "User": {
                name: "usuario",
                description: "Selecciona un usuario para ver sus Advertencias",
                required: true
            },
        },
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
            const Member = await options.getUser("usuario")

            var result = await db.find({
                MemberID: Member.id
            })
            if (result.length === 0) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("📋 Lista de Advertencias de " + Member.tag)
                        .setDescription(`Este usuario no tiene ninguna Advertencia`)
                        .setColor(ee.color)
                        .setFooter({ text: ee.footertext, iconURL: ee.footericon })
                        .setTimestamp()
                        .setThumbnail(Member.displayAvatarURL({ dynamic: true }))
                ],
            })
            let length = result.length
            let string = "";
            let count = 0;
            let i = 1 + count
            let first = true;
            while (length > 15) {
                for (i; i <= 15 + count; i++) {
                    string += `**${i}º** ${result[i - 1].WarnID} - ${result[i - 1].Reason ? result[i - 1].Reason : "Razón Indefinida"}\n`
                }
                if (first) {
                    interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setTitle("📋 Lista de Advertencias de " + Member.tag)
                                .setDescription(string)
                                .setColor(ee.color)
                                .setFooter({ text: ee.footertext, iconURL: ee.footericon })
                                .setTimestamp()
                                .setThumbnail(Member.displayAvatarURL({ dynamic: true }))
                        ]
                    })
                } else {
                    channel.send({
                        embeds: [
                            new MessageEmbed()
                                .setTitle("📋 Lista de Advertencias de " + Member.tag)
                                .setDescription(string)
                                .setColor(ee.color)
                                .setFooter({ text: ee.footertext, iconURL: ee.footericon })
                                .setTimestamp()
                                .setThumbnail(Member.displayAvatarURL({ dynamic: true }))

                        ],
                    })
                }
                length -= 15
                count += 15
                string = ""
                first = false;
            }
            for (i; i <= length + count; i++) {
                string += `**${i}º** ${result[i - 1].WarnID} - ${result[i - 1].Reason ? result[i - 1].Reason : "Razón Indefinida"}\n`
            }

            if (first) return interaction.reply({
                embeds: [new MessageEmbed()
                    .setTitle("📋 Lista de Advertencias de " + Member.tag)
                    .setDescription(string)
                    .setColor(ee.color)
                    .setFooter({ text: ee.footertext, iconURL: ee.footericon })
                    .setTimestamp()
                    .setThumbnail(Member.displayAvatarURL({ dynamic: true }))]
            })

            channel.send({
                embeds: [
                    new MessageEmbed()
                        .setTitle("📋 Lista de Advertencias de " + Member.tag)
                        .setDescription(string)
                        .setColor(ee.color)
                        .setFooter({ text: ee.footertext, iconURL: ee.footericon })
                        .setTimestamp()
                        .setThumbnail(Member.displayAvatarURL({ dynamic: true }))
                ],
            })
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }

    }
}