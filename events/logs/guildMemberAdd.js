const config = require("../../botconfig/config.json"); //loading config file with token and prefix
const settings = require("../../botconfig/settings.json"); //loading settings file with the settings
const ee = require("../../botconfig/embed.json"); //Loading all embed settings like color footertext and icon ...
const Discord = require("discord.js"); //this is the official discord.js wrapper for the Discord Api, which we use!
//here the event starts
module.exports = async (client, member) => {

    if (settings.logs.enabled) {
        let embed = new Discord.MessageEmbed()
            .setAuthor({ name: ee.footertext + " | Logs", iconURL: ee.footericon })
            .setColor(ee.color)
            .setTitle("📥 Un nuevo usuario ha __Entrado__")
            .setDescription(`**Usuario:** ${member} - ${member.user.tag}`)
            .setFooter({ text: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
            .setTimestamp()


        client.channels.cache.get(settings.logs.guildMemberChan).send({ embeds: [embed] })
    }

}