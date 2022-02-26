var {
  MessageEmbed
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`../../botconfig/config.json`);
var settings = require(`../../botconfig/settings.json`);
var ee = require(`../../botconfig/embed.json`);
const fs = require('fs');
const fetch = require('node-fetch');
module.exports = {
  activated: true,
  name: "changeavatar",
  category: "Owner",
  aliases: ["changebotavatar", "botavatar", "botprofilepicture", "botpfp"],
  cooldown: 5,
  usage: "changeavatar <Imagenlink/Imagen>",
  description: "Cambia el Avatar del Bot: SUGIERO HACERO ASÍ: Escribe el comando en el chat, adjunta una imagen al comando (no link, simplemente añadela) presiona enter",
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: settings.ownerIDS, //Only allow specific Users to execute a Command [OPTIONAL]
  minargs: 0, // minimum args for the message, 0 == none [OPTIONAL]
  maxargs: 0, // maximum args for the message, 0 == none [OPTIONAL]
  minplusargs: 0, // minimum args for the message, splitted with "++" , 0 == none [OPTIONAL]
  maxplusargs: 0, // maximum args for the message, splitted with "++" , 0 == none [OPTIONAL]
  argsmissing_message: "", //Message if the user has not enough args / not enough plus args, which will be sent, leave emtpy / dont add, if you wanna use command.usage or the default message! [OPTIONAL]
  argstoomany_message: "", //Message if the user has too many / not enough args / too many plus args, which will be sent, leave emtpy / dont add, if you wanna use command.usage or the default message! [OPTIONAL]
  run: async (client, message, args, plusArgs, cmdUser, text, prefix) => {
    try {
      //define a global var
      var url;
      //if there is an attachment
      if (message.attachments.size > 0) {
        //loop through all attachments
        if (message.attachments.every(attachIsImage)) {
          //get a response from the fetcher
          const response = await fetch(url);
          //create a buffer from it
          const buffer = await response.buffer();
          //write the file and log the state
          await fs.writeFile(`./image.jpg`, buffer, () => {
            console.log('Descarga completa')
          });
          //set the avatar from the file
          client.user.setAvatar(`./image.jpg`)
            .then(user => {
              try {
                //try to delete it if possible
                fs.unlinkSync("./image.jpg")
              } catch { }
              //send a success message
              return message.reply({
                embeds: [new MessageEmbed()
                  .setTitle(`El Avatar del bot ha sido cambiado exitosamente!`)
                  .setColor(ee.color)
                  .setFooter({ text: ee.footertext, iconURL: ee.footericon })
                ]
              });
            })
            .catch(e => {
              //send an error message
              return message.reply({
                embeds: [new MessageEmbed()
                  .setColor(ee.wrongcolor)
                  .setFooter({ text: ee.footertext, iconURL: ee.footericon })
                  .setTitle(`:x: Algo ha salido mal`)
                  .setDescription(`\`\`\`${String(JSON.stringify(e)).substr(0, 2000)}\`\`\``)
                ]
              });
            });
        } else {
          return message.reply({
            embeds: [new MessageEmbed()
              .setTitle(`:x: ERROR | No se ha podido establecer la imágen como Avatar, asegurate de que es un \`png\` / \`jpg\``)
              .setColor(ee.wrongcolor)
              .setFooter({ text: ee.footertext, iconURL: ee.footericon })
            ]
          });
        }
      } else if (message.content && textIsImage(message.content)) {
        url = args.join(" ")
        const response = await fetch(url);
        const buffer = await response.buffer();
        await fs.writeFile(`./image.jpg`, buffer, () =>
          console.log('Descarga completa'));
        client.user.setAvatar(`./image.jpg`)
          .then(user => {
            try {
              fs.unlinkSync("./image.jpg")
            } catch {

            }
            return message.reply({
              embeds: [new MessageEmbed()
                .setTitle(`El Avatar del bot ha sido cambiado exitosamente`)
                .setColor(ee.color)
                .setFooter({ text: ee.footertext, iconURL: ee.footericon })
              ]
            });
          })
          .catch(e => {
            return message.reply({
              embeds: [new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setFooter({ text: ee.footertext, iconURL: ee.footericon })
                .setTitle(`:x: Algo ha salido mal`)
                .setDescription(`\`\`\`${String(JSON.stringify(e)).substr(0, 2000)}\`\`\``)
              ]
            });
          });

      } else {
        return message.reply({
          embeds: [new MessageEmbed()
            .setTitle(`:x: ERROR | No se ha podido establecer la imágen como Avatar, asegurate de que es un \`png\` / \`jpg\` / \`jpeg\``)
            .setDescription(`Uso: \`${prefix}changeavatar <AVATARLINK/IMAGEN>\``)
            .setColor(ee.wrongcolor)
            .setFooter({ text: ee.footertext, iconURL: ee.footericon })
          ]
        });
      }

      function attachIsImage(msgAttach) {
        url = msgAttach.url;

        //True if this url is a png image.
        return url.indexOf("png", url.length - "png".length /*or 3*/) !== -1 ||
          url.indexOf("jpeg", url.length - "jpeg".length /*or 3*/) !== -1 ||
          url.indexOf("jpg", url.length - "jpg".length /*or 3*/) !== -1;
      }

      function textIsImage(url) {
        return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
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
  },
};