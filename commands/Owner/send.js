var { MessageEmbed } = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`../../botconfig/config.json`);
var ee = require(`../../botconfig/embed.json`);
var settings = require(`../../botconfig/settings.json`);
var { delay } = require(`../../handlers/functions`);
const fs = require("fs");
module.exports = {
  activated: true,
  name: "send",
  category: "Owner",
  aliases: [],
  cooldown: 5,
  usage: "send",
  description: "Envía un mensaje prediseñado",
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: settings.ownerIDS, //Only allow specific Users to execute a Command [OPTIONAL]
  minargs: 0, // minimum args for the message, 0 == none [OPTIONAL]
  maxargs: 1, // maximum args for the message, 0 == none [OPTIONAL]
  minplusargs: 0, // minimum args for the message, splitted with "++" , 0 == none [OPTIONAL]
  maxplusargs: 0, // maximum args for the message, splitted with "++" , 0 == none [OPTIONAL]
  argsmissing_message: "", //Message if the user has not enough args / not enough plus args, which will be sent, leave emtpy / dont add, if you wanna use command.usage or the default message! [OPTIONAL]
  argstoomany_message: "", //Message if the user has too many / not enough args / too many plus args, which will be sent, leave emtpy / dont add, if you wanna use command.usage or the default message! [OPTIONAL]
  run: async (client, message, args, plusArgs, cmdUser, text, prefix) => {
    try {
      let embed = new MessageEmbed()
        .setAuthor({
          name: ee.footertext + " | Sugerencias",
          iconURL: ee.footericon,
        })
        .setColor(ee.color)
        .setDescription(
          "Utiliza `/suggest new <descripción>` en cualquier canal de texto para enviar tu sugerencia.\n\nSe puede aportar una imágen opcionalmente añadiendo su URL después de la descripción"
        );
      let msg = await message.channel.messages.fetch("941485451259289691")
      msg.edit({ embeds: [embed] });
      // message.channel.send({embeds:[embed]})
      message.delete();
    } catch (e) {
      console.log(String(e.stack).bgRed);
      return message.channel.send(
        new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter({ text: ee.footertext, iconURL: ee.footericon })
          .setTitle(`:x: Algo ha salido mal`)
          .setDescription(
            `\`\`\`${String(JSON.stringify(e)).substr(0, 2000)}\`\`\``
          )
      );
    }
  },
};
