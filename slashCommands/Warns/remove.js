const { MessageEmbed, CommandInteraction, MessageActionRow, MessageButton } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const db = require("../../database/warns.js");
module.exports = {
    name: "remove", //the command name for the Slash Command
    description: "Elimina una advertencia", //the command description for Slash Command Overview
    cooldown: 1,
    memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
    requiredroles: [settings.StaffID], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
    options: [ //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!
        //INFORMATIONS! You can add Options, but mind that the NAME MUST BE LOWERCASED! AND NO SPACES!!!, for the CHOCIES you need to add a array of arrays; [ ["",""] , ["",""] ] 
        {
            "String": {
                name: "idwarn",
                description: "Introduce la ID de la advertencia",
                required: true
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
            let idnoexiste = new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setFooter({ text: ee.footertext, iconURL: ee.footericon })
                .setTitle(`❌ La ID introducida no existe`)

            const ID = await options.getString("idwarn")
            var result = await db.findOne({
                WarnID: ID
            })
            if (!result) return interaction.reply({ embeds: [idnoexiste], ephemeral: true })
            await db.deleteOne({
                WarnID: ID
            })
            let warned = guild.members.cache.get(result.MemberID)
            let warner = guild.members.cache.get(result.WarnedBy)

            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("✅ Advertencia eliminado correctamente")
                        .setDescription(`**ID:** ${ID}\n**Usuario:** ${warned ? warned : `<@${result.MemberID}>`} - ${warned ? warned.user.tag : result.MemberTag}\n**Advertido por:** ${warner ? warner : `<@${result.WarnedBy}>`} - ${warner ? warner.user.tag : result.WarnedByTag}\n**Razón:** ${result.Reason ? result.Reason : "Indefinida"}\n**Fecha:** <t:${result.Date}>`)
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