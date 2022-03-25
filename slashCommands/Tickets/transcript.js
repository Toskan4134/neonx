const {
    MessageEmbed,
    CommandInteraction,
    MessageActionRow,
    MessageButton,
} = require('discord.js');
const config = require('../../botconfig/config.json');
const ee = require('../../botconfig/embed.json');
const settings = require('../../botconfig/settings.json');
const db = require('../../database/tickets');
const { createTranscript } = require('discord-html-transcripts');
module.exports = {
    name: 'transcript', //the command name for the Slash Command
    description: 'Transcribe el ticket en el que se ha ejecutado este comando', //the command description for Slash Command Overview
    cooldown: 2,
    memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
    requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
    options: [
        //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!
        //INFORMATIONS! You can add Options, but mind that the NAME MUST BE LOWERCASED! AND NO SPACES!!!, for the CHOCIES you need to add a array of arrays; [ ["",""] , ["",""] ]
    ],
    run: async (client, interaction) => {
        try {
            //console.log(interaction, StringOption)

            //things u can directly access in an interaction!
            const { member, guildId, options, channel } = interaction;
            const { guild } = member;
            const embed = new MessageEmbed().setFooter({
                text: ee.footertext,
                iconURL: ee.footericon,
            });

            db.findOne({ ChannelID: channel.id }, async (err, docs) => {
                if (err) throw err;
                if (!docs)
                    return interaction.reply({
                        embeds: [
                            embed
                                .setColor(ee.wrongcolor)
                                .setTitle(
                                    ':x: Este canal no pertenece a un ticket'
                                ),
                        ],
                        ephemeral: true,
                    });
                const attachment = await createTranscript(channel, {
                    limit: -1,
                    returnBuffer: false,
                    fileName: `${docs.Type}-${docs.TicketID}.html`,
                });
                let msg = await channel.send({
                    files: [attachment],
                });
                var attURL;
                msg.attachments.map((m) => {
                    attURL = m.url;
                });
                msg.delete();
                const Buttons = new MessageActionRow();
                Buttons.addComponents(
                    new MessageButton()
                        .setLabel('Descargar Transcripción')
                        .setStyle('LINK')
                        .setURL(attURL)
                        .setEmoji('📑')
                );

                interaction.reply({
                    embeds: [
                        embed
                            .setColor(ee.color)
                            .setTitle('✅ Ticket transcrito correctamente'),
                    ],
                    components: [Buttons],
                    ephemeral: true,
                });
            });
        } catch (e) {
            console.log(String(e.stack).bgRed);
        }
    },
};
