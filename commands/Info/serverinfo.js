const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json")
var ee = require("../../botconfig/embed.json")
const moment = require("moment")
const settings = require("../../botconfig/settings.json");
module.exports = {
  activated: true,
  name: "serverinfo", //the command name for execution & for helpcmd [OPTIONAL]
  category: "Info", //the command category for helpcmd [OPTIONAL]
  aliases: ["sinfo"], //the command aliases for helpcmd [OPTIONAL]
  cooldown: 5, //the command cooldown for execution & for helpcmd [OPTIONAL]
  usage: "serverinfo", //the command usage for helpcmd [OPTIONAL]
  description: "Muestra la información del server", //the command description for helpcmd [OPTIONAL]
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
      function trimArray(arr, maxLen = 25) {
        if (arr.array().length > maxLen) {
          const len = arr.array().length - maxLen;
          arr = arr.array().sort((a, b) => b.rawPosition - a.rawPosition).slice(0, maxLen);
          arr.map(role => `<@&${role.id}>`)
          arr.push(`${len} más...`);
        }
        return arr.join(", ");
      }
      await message.guild.members.fetch();
      let verifLevels = [
        "Ninguno",
        "Bajo",
        "Medio",
        "(╯°□°）╯︵  ┻━┻",
        "┻━┻ミヽ(ಠ益ಠ)ノ彡┻━┻"
      ];
      let region = {
        brazil: ":flag_br: Brasíl",
        "eu-central": ":flag_eu: Centro Europa",
        singapore: ":flag_sg: Singapur",
        "us-central": ":flag_us: Centro América",
        sydney: ":flag_au: Sidney",
        "us-east": ":flag_us: América Este",
        "us-south": ":flag_us: Sudamérica",
        "us-west": ":flag_us: América Oeste",
        "eu-west": ":flag_eu: Europa Oeste",
        "vip-us-east": ":flag_us: VIP América Este",
        london: ":flag_gb: Londres",
        amsterdam: ":flag_nl: Amsterdam",
        hongkong: ":flag_hk: Hong Kong",
        russia: ":flag_ru: Rusia",
        southafrica: ":flag_za: Sudáfrica",
      };
      if (region === undefined) { region = ":flag_eu: Europa" }
      function emojitrimarray(arr, maxLen = 20) {
        if (arr.length > maxLen) {
          const len = arr.length - maxLen;
          arr = arr.slice(0, maxLen);
          arr.push(`${len} más...`);
        }
        return arr.join(", ");
      }
      let boosts = message.guild.premiumSubscriptionCount;
      var boostlevel = 0;
      if (boosts >= 2) boostlevel = "1";
      if (boosts >= 15) boostlevel = "2";
      if (boosts >= 30) boostlevel = "3 / ∞";
      let maxbitrate = 96000;
      if (boosts >= 2) maxbitrate = 128000;
      if (boosts >= 15) maxbitrate = 256000;
      if (boosts >= 30) maxbitrate = 384000;
      message.reply({
        embeds: [new Discord.MessageEmbed()
          .setAuthor("Información del server: " + message.guild.name, message.guild.iconURL({
            dynamic: true
          }))
          .setColor(ee.color)
          .addField("❱ Propietario", `${message.guild.owner.user}\n\`${message.guild.owner.user.tag}\``, true)
          .addField("❱ Creado el", "\`" + moment(message.guild.createdTimestamp).format("DD/MM/YYYY") + "\`\n" + "`" + moment(message.guild.createdTimestamp).format("hh:mm:ss") + "`", true)
          .addField("❱ Has entrado el", "\`" + moment(message.member.joinedTimestamp).format("DD/MM/YYYY") + "\`\n" + "`" + moment(message.member.joinedTimestamp).format("hh:mm:ss") + "`", true)

          .addField("❱ Canales Totales", "👁‍🗨 \`" + message.guild.channels.cache.size + "\`", true)
          .addField("❱ Canales de Texto", "💬 \`" + message.guild.channels.cache.filter(channel => channel.type == "text").size + "\`", true)
          .addField("❱ Canales de Voz", "🔈 \`" + message.guild.channels.cache.filter(channel => channel.type == "voice").size + "\`", true)

          .addField("❱ Usuarios Totales", "😀 \`" + message.guild.memberCount + "\`", true)
          .addField("❱ Humanos", "👤 \`" + message.guild.members.cache.filter(member => !member.user.bot).size + "\`", true)
          .addField("❱ Bots", "🤖 \`" + message.guild.members.cache.filter(member => member.user.bot).size + "\`", true)

          .addField("❱ En Línea", "🟢 \`" + message.guild.members.cache.filter(member => member.presence.status != "offline").size + "\`", true)
          .addField("❱ Desconectados", ":black_circle:\`" + message.guild.members.cache.filter(member => member.presence.status == "offline").size + "\`", true)

          .addField("❱ Mejoras Totales", "\`" + message.guild.premiumSubscriptionCount + "\`", true)
          .addField("❱ Nivel de Mejora", "\`" + boostlevel + "\`", true)
          .addField("❱ Bitrate de Audio Máximo", "👾 \`" + maxbitrate + " kbps\`", true)
          .addField("❱ Nivel de Verificación", "🔒\`" + verifLevels[message.guild.verificationLevel] + "\`", true)
          .addField("❱ Región", region[message.guild.region], true)
          .addField(`❱ [${message.guild.emojis.cache.size}] Emojis: `, "> " + message.guild.emojis.cache.size < 20 ? message.guild.emojis.cache.map(emoji => `${emoji}`).join(", ") : message.guild.emojis.cache.size > 20 ? emojitrimarray(message.guild.emojis.cache.map(emoji => `${emoji}`)).substr(0, 1024) : 'No tiene Emojis')
          .addField(`❱ [${message.guild.roles.cache.size}] Roles: `, "> " + message.guild.roles.cache.size < 25 ? message.guild.roles.cache.array().sort((a, b) => b.rawPosition - a.rawPosition).map(role => `<@&${role.id}>`).join(', ') : message.guild.roles.cache.size > 25 ? trimArray(message.guild.roles.cache) : 'No tiene Roles')
          .setThumbnail(message.guild.iconURL({
            dynamic: true
          }))
          .setFooter("ID: " + message.guild.id, message.guild.iconURL({
            dynamic: true
          }))]
      });

    } catch (e) {
      console.log(String(e.stack).bgRed)
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter({text: ee.footertext, iconURL: ee.footericon})
          .setTitle(`❌ ERROR | Ha ocurrido un error`)
          .setDescription(`\`\`\`${e.message ? String(e.message).substr(0, 2000) : String(e).substr(0, 2000)}\`\`\``)
        ]
      });
    }
  }
}