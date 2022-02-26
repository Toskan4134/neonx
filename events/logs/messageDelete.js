const config = require("../../botconfig/config.json"); //loading config file with token and prefix
const settings = require("../../botconfig/settings.json"); //loading settings file with the settings
const ee = require("../../botconfig/embed.json"); //Loading all embed settings like color footertext and icon ...
const Discord = require("discord.js"); //this is the official discord.js wrapper for the Discord Api, which we use!
const { delay } = require("../../handlers/functions")
//here the event starts
module.exports = async (client, message) => {

    if (settings.logs.enabled) {

        let embed = new Discord.MessageEmbed()
            .setAuthor({ name: ee.footertext + " | Logs", iconURL: ee.footericon })
            .setColor(ee.color)
            .setTitle("🗑 Un mensaje ha sido __Eliminado__")
            .setTimestamp()


        const fetchedLogs = await message.guild.fetchAuditLogs({
            limit: 1,
            type: 'MESSAGE_DELETE',
        });
        const removeLog = fetchedLogs.entries.first();

        const { executor } = removeLog;
        if (!message.content) {
            message.content = "`[Embed]`"
        }
        try {
            embed.setDescription(
                "**Mensaje:** " + message.content +
                "\n**Autor:** <@" + message.author.id + "> - " + message.author.tag +
                "\n**Canal:** <#" + message.channel.id + "> - " + message.channel.name)
                .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        } catch {
            embed.setDescription(
                "\n**Canal:** <#" + message.channel.id + "> - " + message.channel.name)
                .setFooter({ text: ee.footertext, iconURL: ee.footericon })
        }




        client.channels.cache.get(settings.logs.messageChan).send({ embeds: [embed] })
    }

}