const config = require("../../botconfig/config.json"); //loading config file with token and prefix
const settings = require("../../botconfig/settings.json"); //loading settings file with the settings
const ee = require("../../botconfig/embed.json"); //Loading all embed settings like color footertext and icon ...
const Discord = require("discord.js"); //this is the official discord.js wrapper for the Discord Api, which we use!
//here the event starts
module.exports = async (client, member) => {
    if (settings.logs.enabled) {
        const fetchedLogs = await member.guild.fetchAuditLogs({
            limit: 1,
            type: "MEMBER_KICK",
        });
        const kickLog = fetchedLogs.entries.first();
        let embed = new Discord.MessageEmbed()
            .setAuthor({
                name: ee.footertext + " | Logs",
                iconURL: ee.footericon,
            })
            .setColor(ee.color)
            .setTitle("📤 Un nuevo usuario ha __Salido__")
            .setDescription(`**Usuario:** ${member} - ${member.user.tag}`)
            .setFooter({
                text: member.user.tag,
                iconURL: member.user.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp();

        const { executor, target } = kickLog;

        if (
            !kickLog ||
            kickLog.createdAt < member.joinedAt ||
            member.id !== target.id
        )
            return client.channels.cache
                .get(settings.logs.guildMemberChan)
                .send({ embeds: [embed] });

        embed.setTitle("🛑 Un usuario ha sido __Kickeado__");
        let string = `**Usuario:** ${member} - ${member.user.tag}`;
        if (target.id === member.id) {
            string += `\n**Kickeado por:** <@${executor.id}> - ${executor.tag}`;
        }

        if (kickLog.reason) {
            string += `\n**Razón:** ${kickLog.reason}`;
        }

        embed.setDescription(string);

        client.channels.cache
            .get(settings.logs.guildBanChan)
            .send({ embeds: [embed] });
    }
};
