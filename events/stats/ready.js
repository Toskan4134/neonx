const config = require("../../botconfig/config.json")
const { guildMemberStats } = require("../../handlers/functions");
module.exports = async client => {
    try {
        let guild = client.guilds.cache.get("901950565649641532")
        let channel = guild.channels.cache.get("902639378432688169");
        let count = guild.members.cache.filter(member => !member.user.bot && member.roles.cache.has("901950565649641535")).size;
        let msg = "👤 • Ciudadanos ➝ " + count
        guildMemberStats(channel, msg);
        setInterval(() => {
            guild = client.guilds.cache.get("901950565649641532")
            channel = guild.channels.cache.get("902639378432688169");
            count = guild.members.cache.filter(member => !member.user.bot && member.roles.cache.has("901950565649641535")).size;
            msg = "👤 • Ciudadanos ➝ " + count
            guildMemberStats(channel, msg);
        }, 5 * 61 * 1000);
    } catch (e) {
        console.log(String(e.stack).grey.italic.dim.bgRed)
    }
}