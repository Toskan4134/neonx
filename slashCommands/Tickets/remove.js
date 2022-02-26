const { MessageEmbed, CommandInteraction, MessageActionRow, MessageButton } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const db = require("../../database/tickets");
module.exports = {
    name: "remove", //the command name for the Slash Command
    description: "Elimina un usuario del ticket", //the command description for Slash Command Overview
    cooldown: 2,
    memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
    requiredroles: [settings.StaffID], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
    options: [ //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!
        //INFORMATIONS! You can add Options, but mind that the NAME MUST BE LOWERCASED! AND NO SPACES!!!, for the CHOCIES you need to add a array of arrays; [ ["",""] , ["",""] ] 
        {
            "User": {
                name: "usuario",
                description: "Selecciona un usuario",
                required: true
            }
        }
    ],
    run: async (client, interaction) => {
        try {
            //console.log(interaction, StringOption)

            //things u can directly access in an interaction!
            const { member, guildId, options, channel
            } = interaction;
            const { guild } = member;
            const Member = await options.getUser("usuario")
            const embed = new MessageEmbed()
                .setFooter({ text: ee.footertext, iconURL: ee.footericon });
            db.findOne({ ChannelID: channel.id }, async (err, docs) => {
                if (err) throw err;
                if (!docs)
                    return interaction.reply({
                        embeds: [embed.setColor(ee.wrongcolor)
                            .setTitle(":x: Este canal no pertenece a un ticket")
                        ],
                        ephemeral: true
                    })
                if (!docs.MembersID.includes(Member.id))
                    return interaction.reply({
                        embeds: [embed.setColor(ee.wrongcolor)
                            .setTitle(":x: Este miembro no está en el ticket")
                        ],
                        ephemeral: true
                    })
                docs.MembersID.remove(Member.id);
                channel.permissionOverwrites.edit(Member.id, {
                    "VIEW_CHANNEL": false,
                })
                interaction.reply({
                    embeds: [embed.setColor(ee.color)
                        .setTitle(`✅ Un usuario ha sido eliminado del ticket`)
                        .setDescription(`**Usuario:** ${Member}`)
                    ],
                })
                docs.save();
            })

        } catch (e) {
            console.log(String(e.stack).bgRed)
        }

    }
}