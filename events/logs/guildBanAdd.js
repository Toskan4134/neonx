const config = require("../../botconfig/config.json"); //loading config file with token and prefix
const settings = require("../../botconfig/settings.json"); //loading settings file with the settings
const ee = require("../../botconfig/embed.json"); //Loading all embed settings like color footertext and icon ...
const Discord = require("discord.js"); //this is the official discord.js wrapper for the Discord Api, which we use!
//here the event starts
module.exports = async (client, ban) => {

    if (settings.logs.enabled) {

        const fetchedLogs = await ban.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_BAN_ADD',
        });
        const Log = fetchedLogs.entries.first();

        const { executor, target } = Log;
        let string = `**Usuario:** <@${ban.user.id}> - ${ban.user.tag}`;
        let banneo = await ban.guild.bans.fetch(ban.user.id)
        let embed = new Discord.MessageEmbed()
            .setAuthor({ name: ee.footertext + " | Logs", iconURL: ee.footericon })
            .setColor(ee.color)
            .setTitle("💀 Un usuario ha sido __Banneado__")
            .setFooter({ text: ban.user.tag, iconURL: ban.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp()
        if (executor) {
            string += `\n**Banneado por:** <@${executor.id}> - ${executor.tag}`
        }
        if (banneo.reason) {
            string += `\n**Razón:** ${banneo.reason}`
        }
        embed.setDescription(string)



        client.channels.cache.get(settings.logs.guildBanChan).send({ embeds: [embed] })
    }

}