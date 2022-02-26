const config = require("../../botconfig/config.json"); //loading config file with token and prefix
const settings = require("../../botconfig/settings.json"); //loading settings file with the settings
const ee = require("../../botconfig/embed.json"); //Loading all embed settings like color footertext and icon ...
const Discord = require("discord.js"); //this is the official discord.js wrapper for the Discord Api, which we use!
//here the event starts
module.exports = async (client, member) => {
    if (settings.logs.enabled) {

        let embed = new Discord.MessageEmbed()
            .setAuthor({ name: ee.footertext + " | Logs", iconURL: ee.footericon })
            .setColor("#ff00ff")
            .setTimestamp()
            .setImage("https://support.discord.com/hc/article_attachments/360013500032/nitro_gif.gif")
            .setFooter({ text: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(`**Usuario:** ${member} - ${member.user.tag}`)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setTitle("<a:boostgif:718898667603492864> ¡Un usuario ha __BOOSTEADO__ el servidor!")
        client.channels.cache.get("901950567474147430").send({ embeds: [embed] })
    }
}