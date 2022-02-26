const config = require("../../botconfig/config.json"); //loading config file with token and prefix
const settings = require("../../botconfig/settings.json"); //loading settings file with the settings
const ee = require("../../botconfig/embed.json"); //Loading all embed settings like color footertext and icon ...
const Discord = require("discord.js"); //this is the official discord.js wrapper for the Discord Api, which we use!
//here the event starts
module.exports = async (client, message, oldContent, newContent) => {
    if (settings.logs.enabled) {
        let embed = new Discord.MessageEmbed()
            .setAuthor({ name: ee.footertext + " | Logs", iconURL: ee.footericon })
            .setColor(ee.color)
            .setTitle("✏ Un mensaje ha sido __Editado__")
            .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setTimestamp()
            .setDescription("**Mensaje Original:** " + oldContent + "\n**Mensaje Editado:** " + newContent + "\n**Ir al Mensaje:** [Haz click Aquí](" + message.url + ")")

        client.channels.cache.get(settings.logs.messageChan).send({ embeds: [embed] })
    }
}