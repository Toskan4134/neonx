const { MessageEmbed, CommandInteraction, MessageActionRow, MessageButton, ButtonInteraction, PermissionOverwrites } = require("discord.js");
const db = require("../../database/tickets.js")
const settings = require("../../botconfig/settings.json")
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const { createTranscript } = require("discord-html-transcripts")
const { ticketOptions } = require("../../handlers/functions.js")
/**
 * 
 * @param {*} client 
 * @param {ButtonInteraction} interaction 
 */
module.exports = async (client, interaction) => {
    if (!interaction.isButton()) return;

    const { member, channelId, guildId, applicationId,
        commandName, deferred, replied, ephemeral,
        options, id, createdTimestamp, customId, channel
    } = interaction;

    const { guild } = member;
    if (!["cerrarTicket", "bloquearTicket", "desbloquearTicket", "reclamarTicket"].includes(customId)) return;
    if (!member.roles.cache.find(r => r.id === settings.StaffID)) return interaction.reply({ content: "No puedes usar los botones", ephemeral: true })
    const embed = new MessageEmbed()
        .setColor(ee.color)
        .setFooter({ text: ee.footertext, iconURL: ee.footericon })
        .setTimestamp();

    db.findOne({ ChannelID: channel.id }, async (err, docs) => {
        if (err) throw err;
        if (!docs) return interaction.reply({ content: "No se ha encontrado informaciónrelacionada con este ticket, por favor bórralo manualmente", ephemeral: true })
        let ticketRole = ticketOptions(docs.Type).staffRole
        switch (customId) {
            case "bloquearTicket":
                if (docs.Locked) return interaction.reply({ content: "El ticket ya estaba bloqueado", ephemeral: true })
                await db.updateOne({ ChannelID: channel.id }, { Locked: true })
                embed.setDescription("🔒 | El ticket ha sido bloqueado para poder revisarlo")
                docs.MembersID.forEach((m) => {
                    channel.permissionOverwrites.edit(m, {
                        SEND_MESSAGES: false,
                    })
                })
                interaction.reply({ embeds: [embed] })
                break;
            case "desbloquearTicket":
                if (!docs.Locked) return interaction.reply({ content: "El ticket ya estaba desbloqueado", ephemeral: true })
                await db.updateOne({ ChannelID: channel.id }, { Locked: false })
                embed.setDescription("🔓 | El ticket ha sido desbloqueado")
                docs.MembersID.forEach((m) => {
                    channel.permissionOverwrites.edit(m, {
                        SEND_MESSAGES: true,
                    })
                })

                interaction.reply({ embeds: [embed] })
                break;
            case "cerrarTicket":
                if (docs.Closed) return interaction.reply({ content: "El ticket ya está cerrado, por favor espera a que el canal se borre", ephemeral: true })
                const attachment = await createTranscript(channel, {
                    limit: -1,
                    returnBuffer: false,
                    fileName: `${docs.Type}-${docs.TicketID}.html`
                })

                const openedBy = await guild.members.cache.get(docs.OpenedBy)
                const closedBy = member;
                const msg = await channel.send({
                    embeds: [embed.setDescription(`**Tipo de Ticket:** ${docs.Type}\n**ID del Ticket:** ${docs.TicketID}`)],
                    files: [attachment],
                    reply: { messageReference: interaction.message.id }
                })

                var attURL;
                msg.attachments.map(m => {
                    attURL = m.url
                })
                await db.updateOne({ ChannelID: channel.id }, { Closed: true, Transcription: attURL })
                const Buttons = new MessageActionRow();
                Buttons.addComponents(
                    new MessageButton()
                        .setLabel("Descargar Transcripción")
                        .setStyle("LINK")
                        .setURL(attURL)
                        .setEmoji("📑")
                );

                const MESSAGE = await guild.channels.cache.get(settings.tickets.transcriptsID).send({
                    embeds: [
                        embed.setTitle("El ticket ha sido transcrito correctamente")
                            .setThumbnail(ee.footericon)
                            .setDescription(`**Ticket abierto por:** <@${openedBy.user.id}> - ${openedBy.user.tag}\n**Ticket cerrado por**: <@${closedBy.user.id}> - ${closedBy.user.tag}\n**Tipo de Ticket:** ${docs.Type}\n**ID del Ticket:** ${docs.TicketID}`)
                    ],
                    // files: [attachment],
                    components: [Buttons]
                })


                const Menu = new MessageActionRow();
                docs.MembersID.forEach((m) => {
                    m = guild.members.cache.get(m)
                    m.send({
                        embeds: [
                            embed.setTitle("Ticket Finalizado")
                                .setDescription(`**Ticket abierto por:** <@${openedBy.user.id}> - ${openedBy.user.tag}\n**Ticket cerrado por**: <@${closedBy.user.id}> - ${closedBy.user.tag}\n**Tipo de Ticket:** ${docs.Type}\n**ID del Ticket:** ${docs.TicketID}`)
                        ],
                        // files: [attachment],
                        components: [Buttons]
                    })
                })
                interaction.deferUpdate()
                setTimeout(() => {
                    channel.delete();
                }, 10 * 1000)
                break;

            case "reclamarTicket":

                if (docs.Claimed) return interaction.reply({
                    content: "Este ticket ya ha sido reclamado por <@" + docs.ClaimedBy + ">"
                    , ephemeral: true
                })
                if (!member.roles.cache.find(r => r.id === ticketRole)) return interaction.reply({ content: "No puedes reclamar este ticket porque no tienes el rol <@&" + ticketRole + ">", ephemeral: true })
                await db.updateOne({ ChannelID: channel.id }, { Claimed: true, ClaimedBy: member.id })
                embed.setDescription(`📥 El ticket ha sido reclamado por ${member}`)
                interaction.reply({ embeds: [embed] })
                break;
        }
    })
}