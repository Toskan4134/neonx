const config = require("../../botconfig/config.json"); //loading config file with token and prefix
const settings = require("../../botconfig/settings.json"); //loading settings file with the settings
const ee = require("../../botconfig/embed.json"); //Loading all embed settings like color footertext and icon ...
const Discord = require("discord.js"); //this is the official discord.js wrapper for the Discord Api, which we use!
//here the event starts
module.exports = async (client, member, oldUsername, newUsername) => {
    if (settings.logs.enabled) {

        let embed = new Discord.MessageEmbed()
            .setAuthor({ name: ee.footertext + " | Logs", iconURL: ee.footericon })
            .setColor(ee.color)
            .setTimestamp()
            .setFooter({ text: member.tag, iconURL: member.displayAvatarURL({ dynamic: true }) })
            .setDescription(`**Usuario:** <@${member.id}> - ${member.tag}` +
                "\n**Nombre Antiguo:** " + oldUsername +
                "\n**Nombre Nuevo:** " + newUsername)
            .setTitle("👤 Un usuario se ha cambiado el __Nombre__")
        client.channels.cache.get(settings.logs.guildMemberChan).send({ embeds: [embed] })
    }
}