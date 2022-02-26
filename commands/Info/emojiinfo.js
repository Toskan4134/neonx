const Discord = require("discord.js");
const {MessageEmbed} = require("discord.js");
const config = require("../../botconfig/config.json");
var ee = require("../../botconfig/embed.json");
const moment = require("moment")
const settings = require("../../botconfig/settings.json");
module.exports = {
  activated: true,
  name: "emojiinfo", //the command name for execution & for helpcmd [OPTIONAL]
  category: "Info", //the command category for helpcmd [OPTIONAL]
  aliases: [], //the command aliases for helpcmd [OPTIONAL]
  cooldown: 2, //the command cooldown for execution & for helpcmd [OPTIONAL]
  usage: "emojiinfo <Emoji>", //the command usage for helpcmd [OPTIONAL]
  description: "Muestra información sobre un emoji", //the command description for helpcmd [OPTIONAL]
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  minargs: 1, // minimum args for the message, 0 == none [OPTIONAL]
  maxargs: 0, // maximum args for the message, 0 == none [OPTIONAL]
  minplusargs: 0, // minimum args for the message, splitted with "++" , 0 == none [OPTIONAL]
  maxplusargs: 0, // maximum args for the message, splitted with "++" , 0 == none [OPTIONAL]
  argsmissing_message: "", //Message if the user has not enough args / not enough plus args, which will be sent, leave emtpy / dont add, if you wanna use command.usage or the default message! [OPTIONAL]
  argstoomany_message: "", //Message if the user has too many / not enough args / too many plus args, which will be sent, leave emtpy / dont add, if you wanna use command.usage or the default message! [OPTIONAL]
  run: async (client, message, args, plusArgs, cmdUser, text, prefix) => {
    try {
      let hasEmoteRegex = /<a?:.+:\d+>/gm
      let emoteRegex = /<:.+:(\d+)>/gm
      let animatedEmoteRegex = /<a:.+:(\d+)>/gm

      if(!message.content.match(hasEmoteRegex))
        return message.reply("❌ Tu mensaje no incluye ningún emoji válido. Por favor intenta enviar un emoji exclusivo del servidor")
      
      if (emoji1 = emoteRegex.exec(message)) {
        let url = "https://cdn.discordapp.com/emojis/" + emoji1[1] + ".png?v=1"
        const emoji = message.guild.emojis.cache.find((emj) => emj.name === emoji1[1] || emj.id == emoji1[1])
        if(!emoji) return message.reply("Por favor, envia un emoji de **ESTE SERVIDOR**")
      
        const authorFetch = await emoji.fetchAuthor();
        const checkOrCross = (bool) => bool ? "✅" : "❌" ;
        const embed = new MessageEmbed()
        .setTitle(`**Informacion de Emoji para: __\`${emoji.name.toLowerCase()}\`__**`)
        .setColor(ee.color)
        .setThumbnail(emoji.url)
        .addField("**General:**", [
          `**ID:** \`${emoji.id}\``,
          `**URL:** [\`LINK\`](${emoji.url})`,
          `**AUTOR:** ${authorFetch} (\`${authorFetch.id}\`)`,
          `**FECHA DE CREACIÓN:** \`${moment(emoji.createdTimestamp).format("DD/MM/YYYY") + " | " +  moment(emoji.createdTimestamp).format("hh:mm:ss")}\``
        ])
        .addField("**Otros:**", [
          `**Requires Colons:** \`${checkOrCross(emoji.requireColons)}\``,
          `**Animado:** \`${checkOrCross(emoji.animated)}\``,
          `**Borrable:** \`${checkOrCross(emoji.deleteable)}\``,
          `**Administrado:** \`${checkOrCross(emoji.managed)}\``,
        ]).setFooter({text: ee.footertext, iconURL: ee.footericon})
        message.reply({embeds: [embed]})
      }
      else if (emoji1 = animatedEmoteRegex.exec(message)) {
        let url2 = "https://cdn.discordapp.com/emojis/" + emoji1[1] + ".gif?v=1"
        let attachment2 = new Discord.MessageAttachment(url2, "emoji.gif")
        const emoji = message.guild.emojis.cache.find((emj) => emj.name === emoji1[1] || emj.id == emoji1[1])
        if(!emoji) return message.reply("Por favor, envia un emoji de **ESTE SERVIDOR**")
      
        const authorFetch = await emoji.fetchAuthor();
        const checkOrCross = (bool) => bool ? "✅" : "❌" ;
        const embed = new MessageEmbed()
        .setTitle(`**Informacion de Emoji para: __\`${emoji.name.toLowerCase()}\`__**`)
        .setColor(ee.color)
        .setThumbnail(emoji.url)
        .addField("**General:**", [
          `**ID:** \`${emoji.id}\``,
          `**URL:** [\`LINK\`](${emoji.url})`,
          `**AUTOR:** ${authorFetch} (\`${authorFetch.id}\`)`,
          `**FECHA DE CREACIÓN:** \`${moment(emoji.createdTimestamp).format("DD/MM/YYYY") + " | " +  moment(emoji.createdTimestamp).format("hh:mm:ss")}\``
        ])
        .addField("**Otros:**", [
          `**Requires Colons:** \`${checkOrCross(emoji.requireColons)}\``,
          `**Animado:** \`${checkOrCross(emoji.animated)}\``,
          `**Borrable:** \`${checkOrCross(emoji.deleteable)}\``,
          `**Administrado:** \`${checkOrCross(emoji.managed)}\``,
        ]).setFooter({text: ee.footertext, iconURL: ee.footericon})
        message.reply({embeds: [embed]})
      }
      else {
        message.reply("No se ha podido pegar ningún emoji. Si es unificado (estándar) y no un emoji exlusivo del servidor, no se puede hacer")
      }
    } catch (e) {
      console.log(String(e.stack).bgRed)
      return message.reply({embeds: [new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter({text: ee.footertext, iconURL: ee.footericon})
          .setTitle(`❌ ERROR | Ha ocurrido un error`)
          .setDescription(`\`\`\`${e.message ? String(e.message).substr(0, 2000) : String(e).substr(0, 2000)}\`\`\``)
      ]});
    }
  }
}