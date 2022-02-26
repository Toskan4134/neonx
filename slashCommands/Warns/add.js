const { MessageEmbed, CommandInteraction, MessageActionRow, MessageButton } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const db = require("../../database/warns.js");
module.exports = {
    name: "add", //the command name for the Slash Command
    description: "Añade una advertencia a un usuario", //the command description for Slash Command Overview
    cooldown: 1,
    memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
    requiredroles: [settings.StaffID], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
    options: [ //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!
        //INFORMATIONS! You can add Options, but mind that the NAME MUST BE LOWERCASED! AND NO SPACES!!!, for the CHOCIES you need to add a array of arrays; [ ["",""] , ["",""] ] 
        {
            "User": {
                name: "usuario",
                description: "Selecciona un usuario para advertir",
                required: true
            },
        },
        {
            "String": {
                name: "razon",
                description: "Explica por qué has puesto la advertencia",
                required: false
            }
        }
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
            const Reason = await options.getString("razon")
            const date = Date.now().toString().slice(0, -3)
            var ID;
            var result;
            do {
                ID = Math.floor(Math.random() * 90000) + 10000;
                result = await db.findOne({
                    WarnID: ID
                })

            } while (result)

            await db.create({
                MemberID: Member.id,
                WarnID: ID,
                WarnedBy: member.id,
                Date: date,
                Reason: Reason,
                MemberTag: Member.tag,
                WarnedByTag: member.user.tag
            })
            Member.send({
                embeds: [
                    new MessageEmbed()
                        .setTitle("⚠ Has recibido una Advertencia")
                        .setColor("#ffdd00")
                        .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true }), url: "https://discordapp.com/users/" + member.user.id })
                        .setFooter({ text: ee.footertext, iconURL: ee.footericon })
                        .setDescription(`**ID:** ${ID}\n**Advertido por:** ${member} - ${member.user.tag}\n**Razón:** ${Reason ? Reason : "Indefinida"}`)
                        .setTimestamp()
                ]
            })

            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("✅ Usuario Advertido correctamente")
                        .setDescription(`**ID:** ${ID}\n**Usuario:** <@${Member.id}> - ${Member.tag}\n**Razón:** ${Reason ? Reason : "Indefinida"}`)
                        .setColor(ee.color)
                        .setFooter({ text: ee.footertext, iconURL: ee.footericon })
                        .setTimestamp()
                ],
                ephemeral: true
            })
            
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }

    }
}