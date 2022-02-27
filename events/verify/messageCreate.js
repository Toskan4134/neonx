const config = require(`../../botconfig/config.json`);
const ee = require(`../../botconfig/embed.json`);
const settings = require(`../../botconfig/settings.json`);
const { onCoolDown, replacemsg } = require("../../handlers/functions");
const Discord = require("discord.js");
module.exports = async (client, message) => {
    if (message.channel.id !== settings.verifyChan) return;

    if (["solicito whitelist", "solicito wl", "sw", "solicito withelist", "wl", "swl", "s w"].includes(message.content.toLowerCase())) {
        let role = message.guild.roles.cache.find(r => r.id === "901950565649641535")
        message.member.roles.add(role).catch()
    }

    message.delete()
}