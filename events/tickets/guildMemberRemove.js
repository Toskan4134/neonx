const db = require('../../database/tickets.js');
const settings = require('../../botconfig/settings.json');
const config = require('../../botconfig/config.json');
const ee = require('../../botconfig/embed.json');
const { createTranscript } = require('discord-html-transcripts');
const {
    MessageEmbed,
    CommandInteraction,
    MessageActionRow,
    MessageButton,
    ButtonInteraction,
    PermissionOverwrites,
} = require('discord.js');
module.exports = (client, member) => {
    const { guild } = member;
    db.findOne({ OpenedBy: member.id, Closed: false }, async (err, docs) => {
        console.log('ñ');
        if (err) throw err;
        if (!docs) return;
        const embed = new MessageEmbed()
            .setColor(ee.color)
            .setFooter({ text: ee.footertext, iconURL: ee.footericon })
            .setTimestamp();
        const channel = guild.channels.cache.get(docs.ChannelID);
        const attachment = await createTranscript(channel, {
            limit: -1,
            returnBuffer: false,
            fileName: `${docs.Type}-${docs.TicketID}.html`,
        });

        const closedBy = 'Salida del Usuario';
        const msg = await channel.send({
            embeds: [
                embed.setDescription(
                    `**Tipo de Ticket:** ${docs.Type}\n**ID del Ticket:** ${docs.TicketID}`
                ),
            ],
            files: [attachment],
        });

        var attURL;
        msg.attachments.map((m) => {
            attURL = m.url;
        });
        await db.updateOne(
            { ChannelID: channel.id },
            { Closed: true, Transcription: attURL }
        );
        const Buttons = new MessageActionRow();
        Buttons.addComponents(
            new MessageButton()
                .setLabel('Descargar Transcripción')
                .setStyle('LINK')
                .setURL(attURL)
                .setEmoji('📑')
        );

        const MESSAGE = await guild.channels.cache
            .get(settings.tickets.transcriptsID)
            .send({
                embeds: [
                    embed
                        .setTitle('El ticket ha sido transcrito correctamente')
                        .setThumbnail(ee.footericon)
                        .setDescription(
                            `**Ticket abierto por:** <@${member.user.id}> - ${member.user.tag}\n**Ticket cerrado por**: ${closedBy}\n**Tipo de Ticket:** ${docs.Type}\n**ID del Ticket:** ${docs.TicketID}`
                        ),
                ],
                // files: [attachment],
                components: [Buttons],
            });

        docs.MembersID.forEach((m) => {
            m = guild.members.cache.get(m);
            m.send({
                embeds: [
                    embed
                        .setTitle('Ticket Finalizado')
                        .setDescription(
                            `**Ticket abierto por:** <@${member.user.id}> - ${member.user.tag}\n**Ticket cerrado por**: ${closedBy}\n**Tipo de Ticket:** ${docs.Type}\n**ID del Ticket:** ${docs.TicketID}`
                        ),
                ],
                // files: [attachment],
                components: [Buttons],
            });
        });
        setTimeout(() => {
            channel.delete();
        }, 10 * 1000);
    });
};
