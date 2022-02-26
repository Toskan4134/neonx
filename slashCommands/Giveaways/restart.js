const {
  MessageEmbed,
  CommandInteraction,
  MessageActionRow,
  MessageButton,
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const db = require("../../database/giveaways");
let chan = settings.giveawaysChan;
const ms = require("ms");
module.exports = {
  name: "restart", //the command name for the Slash Command
  description: "Vuelve a empezar un sorteo", //the command description for Slash Command Overview
  cooldown: 5,
  memberpermissions: ["ADMINISTRATOR"], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [
    //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!
    //INFORMATIONS! You can add Options, but mind that the NAME MUST BE LOWERCASED! AND NO SPACES!!!, for the CHOCIES you need to add a array of arrays; [ ["",""] , ["",""] ]
    //{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
    {
      String: {
        name: "id-sorteo",
        description: "ID del sorteo a resetear",
        required: true,
      },
    },
    {
      String: {
        name: "días",
        description: "Días para la duración del sorteo (Por defecto 0)",
        required: false,
      },
    },
    {
      String: {
        name: "horas",
        description: "Horas para la duración del sorteo (Por defecto 0)",
        required: false,
      },
    },
    {
      String: {
        name: "minutos",
        description: "Minutos para la duración del sorteo (Por defecto 0)",
        required: false,
      },
    },
    {
      String: {
        name: "segundos",
        description: "Segundos para la duración del sorteo (Por defecto 0)",
        required: false,
      },
    },
    //to use in the code: interacton.getString("title")
    //{"User": { name: "ping_a_user", description: "To Ping a user lol", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
    // { "Channel": { name: "in_where", description: "In What Channel should I send it?", required: false } }, //to use in the code: interacton.getChannel("what_channel")
    //{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
    //{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }}, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
    //{"StringChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", "botping"], ["Discord Api", "api"]] }}, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
  ],
  run: async (client, interaction) => {
    try {
      const {
        member,
        channelId,
        guildId,
        applicationId,
        commandName,
        deferred,
        replied,
        ephemeral,
        options,
        createdTimestamp,
        channel,
      } = interaction;

      const { guild } = member;
      let ID = options.getString("id-sorteo");
      let días = options.getString("días") ? options.getString("días") : 0;
      días = ms(días + "d");
      let horas = options.getString("horas") ? options.getString("horas") : 0;
      horas = ms(horas + "h");
      let minutos = options.getString("minutos")
        ? options.getString("minutos")
        : 0;
      minutos = ms(minutos + "m");
      let segundos = options.getString("segundos")
        ? options.getString("segundos")
        : 0;
      segundos = ms(segundos + "s");
      let duración = Date.now() + días + horas + minutos + segundos;
      duración = (duración - (duración % 1000)) / 1000;

      let res = db.findOne(
        {
          GiveawayID: ID,
        },
        async (err, docs) => {
          if (err) throw err;
          let idnoexiste = new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter({ text: ee.footertext, iconURL: ee.footericon })
            .setTitle(`❌ La ID introducida no existe`);
          if (!docs)
            return interaction.reply({
              embeds: [idnoexiste],
              ephemeral: true,
            });
          if (docs.Finished == false) {
            return interaction.reply({
              embeds: [
                new MessageEmbed()
                  .setColor(ee.wrongcolor)
                  .setFooter({ text: ee.footertext, iconURL: ee.footericon })
                  .setTitle(
                    `❌ No se puede resetear un sorteo que no ha finalizado`
                  ),
              ],
              ephemeral: true,
            });
          }

          let member = await guild.members.cache.get(docs.MemberID);
          let embed = new MessageEmbed()
            .setTitle("🎁 Nuevo sorteo activo | NeonX")
            .addField("Descripción", docs.Description)
            .addField("Ganadores", docs.WinnersCount, true)
            .addField("Expiración", `<t:${duración}:R>`, true)
            .setTimestamp()
            .setThumbnail("https://img.freepik.com/vector-gratis/sorteo-letreros-neon-sobre-fondo-pared-ladrillo_100690-93.jpg?size=600&ext=jpg")
            .setImage(docs.Image)
            .setAuthor({
              name: member.user.tag,
              iconURL: member.user.displayAvatarURL({ dynamic: true }),
              url: "https://discordapp.com/users/" + member.user.id,
            })
            .setColor(ee.color)
            .setFooter({
              text: ee.footertext + " - " + docs.GiveawayID,
              iconURL: ee.footericon,
            });

          let msg = await channel.messages.fetch(docs.MessageID);
          await msg.edit({
            embeds: [embed],
          });

          docs.Finished = false;
          docs.Expiration = duración;
          docs.save();
          interaction.reply({
            embeds: [
              new MessageEmbed()
                .setTitle("✅ Sorteo reseteado correctamente")
                .setColor(ee.color)
                .setFooter({ text: ee.footertext, iconURL: ee.footericon }),
            ],
            ephemeral: true,
          });
        }
      );
    } catch (e) {
      console.log(String(e.stack).bgRed);
    }
  },
};
