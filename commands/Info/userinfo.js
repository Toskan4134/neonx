const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
var ee = require("../../botconfig/embed.json");
const moment = require('moment');
const { GetUser, GetGlobalUser } = require("../../handlers/functions")
const flags = {
  DISCORD_EMPLOYEE: 'Discord Employee',
  DISCORD_PARTNER: 'Discord Partner',
  BUGHUNTER_LEVEL_1: 'Bug Hunter (Level 1)',
  BUGHUNTER_LEVEL_2: 'Bug Hunter (Level 2)',
  HYPESQUAD_EVENTS: 'HypeSquad Events',
  HOUSE_BRAVERY: 'House of Bravery',
  HOUSE_BRILLIANCE: 'House of Brilliance',
  HOUSE_BALANCE: 'House of Balance',
  EARLY_SUPPORTER: 'Early Supporter',
  TEAM_USER: 'Team User',
  SYSTEM: 'System',
  VERIFIED_BOT: 'Verified Bot',
  VERIFIED_DEVELOPER: 'Verified Bot Developer'
};
function trimArray(arr, maxLen = 25) {
  if (Array.from(arr.values()).length > maxLen) {
    const len = Array.from(arr.values()).length - maxLen;
    arr = Array.from(arr.values()).sort((a, b) => b.rawPosition - a.rawPosition).slice(0, maxLen);
    arr.map(role => `<@&${role.id}>`)
    arr.push(`${len} more...`);
  }
  return arr.join(", ");
}
const statuses = {
  "online": "🟢",
  "idle": "🟠",
  "dnd": "🔴",
  "offline": "⚫️",
}
module.exports = {
  activated: true,
  name: "userinfo", //the command name for execution & for helpcmd [OPTIONAL]
  category: "Info", //the command category for helpcmd [OPTIONAL]
  aliases: ["uinfo", "whoami"], //the command aliases for helpcmd [OPTIONAL]
  cooldown: 5, //the command cooldown for execution & for helpcmd [OPTIONAL]
  usage: "userinfo [@USER] [global]", //the command usage for helpcmd [OPTIONAL]
  description: "Muestra la información de un Usuario", //the command description for helpcmd [OPTIONAL]
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  minargs: 0, // minimum args for the message, 0 == none [OPTIONAL]
  maxargs: 0, // maximum args for the message, 0 == none [OPTIONAL]
  minplusargs: 0, // minimum args for the message, splitted with "++" , 0 == none [OPTIONAL]
  maxplusargs: 0, // maximum args for the message, splitted with "++" , 0 == none [OPTIONAL]
  argsmissing_message: "", //Message if the user has not enough args / not enough plus args, which will be sent, leave emtpy / dont add, if you wanna use command.usage or the default message! [OPTIONAL]
  argstoomany_message: "", //Message if the user has too many / not enough args / too many plus args, which will be sent, leave emtpy / dont add, if you wanna use command.usage or the default message! [OPTIONAL]
  run: async (client, message, args, plusArgs, cmdUser, text, prefix) => {
    try {
      var user;
      if (args[0]) {
        try {
          if (args[1] && args[1].toLowerCase() == "global") {
            args.pop()
            user = await GetGlobalUser(message, args)
          } else {
            user = await GetUser(message, args)
          }
        } catch (e) {
          if (!e) return message.reply("No se ha encontrado el usuario")
          return message.reply(e)
        }
      } else {
        user = message.author;
      }
      if (!user || user == null || user.id == null || !user.id) return message.reply("❌ No se ha podido encontrar el Usuario")
      try {
        const member = message.guild.members.cache.get(user.id);
        const roles = member.roles;
        const userFlags = member.user.flags.toArray();
        const activity = member.user.presence.activities[0];
        //create the EMBED
        const embeduserinfo = new MessageEmbed()
        embeduserinfo.setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
        embeduserinfo.setAuthor({ name: "Información de:   " + member.user.username + "#" + member.user.discriminator, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
        embeduserinfo.addField('**❱ Usuario:**', `<@${member.user.id}>\n\`${member.user.tag}\``, true)
        embeduserinfo.addField('**❱ ID:**', `\`${member.id}\``, true)
        embeduserinfo.addField('**❱ Avatar:**', `[\`Link al avatar\`](${member.user.displayAvatarURL({ format: "png" })})`, true)
        embeduserinfo.addField('**❱ Fecha de Creación:**', "\`" + moment(member.user.createdTimestamp).format("DD/MM/YYYY") + "\`\n" + "`" + moment(member.user.createdTimestamp).format("hh:mm:ss") + "\`", true)
        embeduserinfo.addField('**❱ Fecha de Entrada al Server:**', "\`" + moment(member.joinedTimestamp).format("DD/MM/YYYY") + "\`\n" + "`" + moment(member.joinedTimestamp).format("hh:mm:ss") + "\`", true)
        embeduserinfo.addField('**❱ Flags:**', `\`${userFlags.length ? userFlags.map(flag => flags[flag]).join(', ') : 'Ninguna'}\``, true)
        embeduserinfo.addField('**❱ Estado:**', `\`${statuses[member.user.presence.status]} ${member.user.presence.status}\``, true)
        embeduserinfo.addField('**❱ Rol más Alto:**', `${member.roles.highest.id === message.guild.id ? 'Ninguno' : member.roles.highest}`, true)
        embeduserinfo.addField('**❱ Es un Bot:**', `\`${member.user.bot ? "✔️" : "❌"}\``, true)
        var userstatus = "Sin estado personalizado";
        if (activity) {
          if (activity.type === "CUSTOM_STATUS") {
            let emoji = `${activity.emoji ? activity.emoji.id ? `<${activity.emoji.animated ? "a" : ""}:${activity.emoji.name}:${activity.emoji.id}>` : activity.emoji.name : ""}`
            userstatus = `${emoji} \`${activity.state || 'Sin estado personalizado'}\``
          }
          else {
            userstatus = `\`${activity.type.toLowerCase().charAt(0).toUpperCase() + activity.type.toLowerCase().slice(1)} ${activity.name}\``
          }
        }
        embeduserinfo.addField('**❱ Actividad:**', `${userstatus}`)
        embeduserinfo.addField('**❱ Permisos:**', `${member.permissions.toArray().map(p => `\`${p}\``).join(", ")}`)
        embeduserinfo.addField(`❱ [${roles.cache.size}] Roles: `, roles.cache.size < 25 ? Array.from(roles.cache.values()).sort((a, b) => b.rawPosition - a.rawPosition).map(role => `<@&${role.id}>`).join(', ') : roles.cache.size > 25 ? trimArray(roles.cache) : 'No tiene Roles')
        embeduserinfo.setColor(ee.color)
        embeduserinfo.setFooter({ text: ee.footertext, iconURL: ee.footericon })
        //send the EMBED
        message.reply({ embeds: [embeduserinfo] })
      } catch (e) {
        console.log(e)
        const userFlags = user.flags.toArray();
        const activity = user.presence.activities[0];
        //create the EMBED
        const embeduserinfo = new MessageEmbed()
        embeduserinfo.setThumbnail(user.displayAvatarURL({ dynamic: true, size: 512 }))
        embeduserinfo.setAuthor("Información de:   " + user.username + "#" + user.discriminator, user.displayAvatarURL({ dynamic: true }))
        embeduserinfo.addField('**❱ Usuario:**', `<@${user.id}>\n\`${user.tag}\``, true)
        embeduserinfo.addField('**❱ ID:**', `\`${user.id}\``, true)
        embeduserinfo.addField('**❱ Avatar:**', `[\`Link al avatar\`](${user.displayAvatarURL({ format: "png" })})`, true)
        embeduserinfo.addField('**❱ Flags:**', `\`${userFlags.length ? userFlags.map(flag => flags[flag]).join(', ') : 'Ninguna'}\``, true)
        embeduserinfo.addField('**❱ Estado:**', `\`${statuses[user.presence.status]} ${user.presence.status}\``, true)
        embeduserinfo.addField('**❱ Es un bot:**', `\`${user.bot ? "✔️" : "❌"}\``, true)
        var userstatus = "Sin estado personalizado";
        if (activity) {
          if (activity.type === "CUSTOM_STATUS") {
            let emoji = `${activity.emoji ? activity.emoji.id ? `<${activity.emoji.animated ? "a" : ""}:${activity.emoji.name}:${activity.emoji.id}>` : activity.emoji.name : ""}`
            userstatus = `${emoji} \`${activity.state || 'Sin estado personalizado'}\``
          }
          else {
            userstatus = `\`${activity.type.toLowerCase().charAt(0).toUpperCase() + activity.type.toLowerCase().slice(1)} ${activity.name}\``
          }
        }
        embeduserinfo.addField('**❱ Actividad:**', `${userstatus}`)
        embeduserinfo.addField('**❱ Permisos:**', `${member.permissions.toArray().map(p => `\`${p}\``).join(", ")}`)
        embeduserinfo.setColor(ee.color)
        embeduserinfo.setFooter({ text: ee.footertext, iconURL: ee.footericon })
        //send the EMBED
        message.reply({ embeds: [embeduserinfo] })
      }

    } catch (e) {
      console.log(String(e.stack).bgRed)
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter({ text: ee.footertext, iconURL: ee.footericon })
          .setTitle(`❌ ERROR | Ha ocurrido un error`)
          .setDescription(`\`\`\`${e.message ? String(e.message).substr(0, 2000) : String(e).substr(0, 2000)}\`\`\``)
        ]
      });
    }
  }
}