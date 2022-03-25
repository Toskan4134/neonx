const {
    MessageEmbed,
    CommandInteraction,
    MessageActionRow,
    MessageButton,
    ButtonInteraction,
    PermissionOverwrites,
} = require('discord.js');
const db = require('../../database/tickets.js');
const settings = require('../../botconfig/settings.json');
const config = require('../../botconfig/config.json');
const ee = require('../../botconfig/embed.json');
const { ticketOptions } = require('../../handlers/functions');

module.exports = async (client, interaction) => {
    if (!interaction.isButton() && !interaction.isSelectMenu()) return;

    const {
        member,
        channelId,
        guildId,
        applicationId,
        commandName,
        deferred,
        replied,
        ephemeral,
        options,
        id,
        createdTimestamp,
    } = interaction;
    let { customId } = interaction;
    const { guild } = member;
    if (!['Reportar-Usuario', 'RolePlay'].includes(customId)) return;
    const result = await db.find({ OpenedBy: member.id });
    if (result.length > 0) {
        for (let index = 0; index < result.length; index++) {
            if (!result[index].Closed) {
                let Buttons = new MessageActionRow();
                Buttons.addComponents(
                    new MessageButton()
                        .setLabel('Ticket')
                        .setStyle('LINK')
                        .setURL(
                            `https://discord.com/channels/901950565649641532/${result[index].ChannelID}`
                        )
                        .setEmoji('📋')
                );
                return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                            .setTitle(
                                `:x: No puedes crear un nuevo ticket porque ya tienes uno abierto`
                            )
                            .setColor(ee.wrongcolor),
                    ],
                    components: [Buttons],
                    ephemeral: true,
                });
            }
        }
    }
    const ID = Math.floor(Math.random() * 900000) + 100000;
    if (interaction.isSelectMenu()) {
        customId = interaction.values[0];
    }

    if (customId == undefined) return interaction.deferUpdate().catch();

    let emoji = ticketOptions(customId, member).emoji;
    let embedMsg = ticketOptions(customId, member).embed;
    let msg = ticketOptions(customId, member).msg;
    await guild.channels
        .create(`『${emoji}』${ID}⇨${customId}`, {
            type: 'GUILD_TEXT',
            parent: settings.tickets.categoryID,
            permissionOverwrites: [
                {
                    id: settings.StaffID,
                    allow: [
                        'SEND_MESSAGES',
                        'VIEW_CHANNEL',
                        'READ_MESSAGE_HISTORY',
                    ],
                },
                {
                    id: member.id,
                    allow: [
                        'SEND_MESSAGES',
                        'VIEW_CHANNEL',
                        'READ_MESSAGE_HISTORY',
                    ],
                },
                {
                    id: settings.everyoneID,
                    deny: [
                        'SEND_MESSAGES',
                        'VIEW_CHANNEL',
                        'READ_MESSAGE_HISTORY',
                    ],
                },
            ],
        })
        .then(async (channel) => {
            await db.create({
                GuildID: guild.id,
                MembersID: member.id,
                TicketID: ID,
                ChannelID: channel.id,
                Closed: false,
                OpenedBy: member.id,
                Locked: false,
                Type: customId,
                Claimed: false,
            });

            const embed = new MessageEmbed()
                .setTitle(`${customId} | Ticket ${ID}`)
                .setThumbnail(ee.footericon)
                .setDescription(embedMsg)
                .setFooter({
                    text: 'Los siguientes botones solo los puede usar miembros del STAFF',
                    iconURL: ee.footericon,
                })
                .setColor(ee.color);
            const Buttons = new MessageActionRow();
            Buttons.addComponents(
                new MessageButton()
                    .setCustomId('cerrarTicket')
                    .setLabel('Cerrar')
                    .setStyle('DANGER')
                    .setEmoji('💾'),
                new MessageButton()
                    .setCustomId('bloquearTicket')
                    .setLabel('Bloquear')
                    .setStyle('PRIMARY')
                    .setEmoji('🔒'),
                new MessageButton()
                    .setCustomId('desbloquearTicket')
                    .setLabel('Desbloquear')
                    .setStyle('SUCCESS')
                    .setEmoji('🔓'),
                new MessageButton()
                    .setCustomId('reclamarTicket')
                    .setLabel('Reclamar')
                    .setStyle('SECONDARY')
                    .setEmoji('📥')
            );

            channel
                .send({ content: msg, embeds: [embed], components: [Buttons] })
                .then((m) => {
                    m.pin();
                });
            // await channel.send({ content: `${member} aquí tienes tu ticket` }).then(m => {
            //     setTimeout(() => {
            //         m.delete().catch();
            //     }, 6 * 1000)
            // })
            // await channel.send({ content: `<@&${staffRole}>` }).then(m => {
            //     setTimeout(() => {
            //         m.delete().catch();
            //     }, 1 * 1000)
            // })
            interaction.reply({
                content: `${member} tu ticket ha sido creado: ${channel}`,
                ephemeral: true,
            });
        });
};
