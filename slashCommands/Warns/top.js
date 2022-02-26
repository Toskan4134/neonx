const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const db = require("../../database/warns.js");
const { removeDupes } = require("../../handlers/functions.js")
module.exports = {
    name: "top", //the command name for the Slash Command
    description: "Envía el top 10 usuarios con más Avisos", //the command description for Slash Command Overview
    cooldown: 1,
    memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
    requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
    options: [ //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!
        //INFORMATIONS! You can add Options, but mind that the NAME MUST BE LOWERCASED! AND NO SPACES!!!, for the CHOCIES you need to add a array of arrays; [ ["",""] , ["",""] ] 
    ],
    run: async (client, interaction) => {
        try {

            const { member, channelId, guildId, applicationId,
                commandName, deferred, replied, ephemeral,
                options, id, createdTimestamp, channel
            } = interaction;
            const { guild } = member;
            let find
            let array = []
            let warned;
            let processed = 0;
            let findLength = await db.find({})
            if (findLength.length === 0) {
                return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setTitle("📈 Top Advertencias - " + ee.footertext)
                            .setThumbnail(ee.footericon)
                            .setColor(ee.color)
                            .setFooter({ text: ee.footertext, iconURL: ee.footericon })
                            .setDescription("Ningún usuario tiene advertencias")
                    ]
                })
            }
            findLength = await findLength.map(function (m) {
                return m.MemberID
            })
            findLength = removeDupes(findLength).length
            guild.members.cache.forEach(async m => {
                find = await db.find({
                    MemberID: m.id
                })

                if (find.length !== 0) {
                    try {
                        warned = guild.members.cache.get(find[0].MemberID)
                        array.push({ name: `${warned ? warned : `<@${find[0].MemberID}>`} - ${warned ? warned.user.tag : find[0].MemberTag}`, size: find.length })
                        processed++
                        if (processed === findLength) {
                            array = array.sort(function (a, b) {
                                if (a.size < b.size) {
                                    return 1;
                                }
                                if (a.size > b.size) {
                                    return -1;
                                }
                                return 0;
                            });
                            callback(interaction, array)
                        }
                    } catch { }
                }

            })

        } catch (e) {
            console.log(String(e.stack).bgRed)
        }

    }
}

function callback(interaction, array) {
    let { string } = toString(array)
    interaction.reply({
        embeds: [
            new MessageEmbed()
                .setTitle("📈 Top Advertencias - " + ee.footertext)
                .setThumbnail(ee.footericon)
                .setColor(ee.color)
                .setFooter({ text: ee.footertext, iconURL: ee.footericon })
                .setDescription(string)
        ]
    })


}


function toString(array) {
    let name = "";
    let size = "";
    let string = ""
    for (let i = 0; i < (array.length > 10 ? 10 : array.length); i++) {
        name += array[i].name + "\n"
        size += array[i].size + "\n"
        string += `**Usuario:** ${array[i].name}\n**Avisos:** ${array[i].size}\n\n`
    }
    return { string, name, size };
}

