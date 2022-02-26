const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
module.exports = {
  activated: true,
  name: "testserver", //the Command Name
  category: "Administration", //the Command Category [OPTIONAL]
  aliases: ["ts"], //the command aliases [OPTIONAL]
  cooldown: 2, //the Command Cooldown (Default in /botconfig/settings.json) [OPTIONAL]
  usage: "testserver <join / exit>", //the Command usage [OPTIONAL]
  description: "El bot activa el evento de entrar o salir del servidor", //the command description [OPTIONAL]
  memberpermissions: ["MANAGE_SERVER"], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
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
      let cmd = client.commands.get("testserver")
      let embed = new Discord.MessageEmbed()
        .setDescription("**👤 Usuario:** " + message.author.username +
          "\n**📡 ID Canal:** " + message.channel.id)
        .setFooter({ text: ee.footertext, iconURL: ee.footericon })
        .setTimestamp()
        .setColor(ee.color)
        .setTimestamp(ee.footericon)
      var title = "";

      if (args[0].toLowerCase() === "j" || args[0].toLowerCase() === "join") {
        client.emit(
          "guildMemberAdd",
          message.member || (await message.guild.member.fetch(message.author))
        );
        title = ':inbox_tray: >> | Simulando Entrada al Servidor';
      } else
        if (args[0].toLowerCase() === "e" || args[0].toLowerCase() === "exit") {
          client.emit(
            "guildMemberRemove",
            message.member || (await message.guild.member.fetch(message.author))
          );
          title = ':outbox_tray: >> | Simulando Salida del Servidor'
        } else
          if (args[0].toLowerCase() === "b" || args[0].toLowerCase() === "boost") {
            client.emit(
              "guildMemberBoost",
              message.member || (await message.guild.member.fetch(message.author))
            );
            title = '🎁 >> | Simulando Boosteo del Servidor'
          } else {
            return message.reply({
              embeds: [new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setFooter({ text: ee.footertext, iconURL: ee.footericon })
                .setTitle(`❌ ERROR | Has introducido un parámetro incorrecto`)
                .setDescription("Uso: `" + cmd.usage + "`")
              ]
            })
          }
      embed.setTitle(title)
      message.channel.send({ embeds: [embed] })
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