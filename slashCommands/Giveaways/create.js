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
  name: "create", //the command name for the Slash Command
  description: "Crea un Sorteo", //the command description for Slash Command Overview
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
        name: "descripción",
        description: "Descripción de la cosa a sortear",
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
    {
      String: {
        name: "ganadores",
        description: "Cantidad de ganadores para el sorteo (Por defecto 1)",
        required: false,
      },
    },
    {
      String: {
        name: "imagen",
        description: "Imagen para el sorteo (Por defecto logo de NeonX)",
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
      let descripción = options.getString("descripción").replace("\\n", "\n");
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
      let imagen = options.getString("imagen")
      let ganadores = options.getString("ganadores")
        ? parseInt(options.getString("ganadores"))
        : 1;
      if (ganadores < 1) ganadores = 1;
      if (isNaN(duración)) {
        return interaction.reply({
          embeds: [
            new MessageEmbed()
              .setTitle(":x: Duración introducida inválida")
              .setColor(ee.wrongcolor)
              .setFooter({ text: ee.footertext, iconURL: ee.footericon }),
          ],
          ephemeral: true,
        });
      }

      if (isNaN(ganadores)) {
        return interaction.reply({
          embeds: [
            new MessageEmbed()
              .setTitle(":x: Cantidad de ganadores inválida")
              .setColor(ee.wrongcolor)
              .setFooter({ text: ee.footertext, iconURL: ee.footericon }),
          ],
          ephemeral: true,
        });
      }

      var ID;
      var result;
      do {
        ID = Math.floor(Math.random() * 90000) + 10000;
        result = await db.findOne({
          GiveawayID: ID,
        });
      } while (result);
      let embed = new MessageEmbed()
        .setTitle("🎁 Nuevo sorteo activo | NeonX")
        .addField("Descripción", descripción)
        .addField("Ganadores", ganadores.toString(), true)
        .addField("Expiración", `<t:${duración}:R>`, true)
        .setTimestamp()
        .setThumbnail("https://img.freepik.com/vector-gratis/sorteo-letreros-neon-sobre-fondo-pared-ladrillo_100690-93.jpg?size=600&ext=jpg")
        .setImage(imagen)
        .setAuthor({
          name: member.user.tag,
          iconURL: member.user.displayAvatarURL({ dynamic: true }),
          url: "https://discordapp.com/users/" + member.user.id,
        })
        .setColor(ee.color)
        .setFooter({
          text: ee.footertext + " - " + ID,
          iconURL: ee.footericon,
        });

      let canal = guild.channels.cache.get(chan);

      let msg = await canal.send({
        embeds: [embed],
      });
      await msg.react("🎁");

      let Giveaway = {
        MemberID: member.id,
        MessageID: msg.id,
        GiveawayID: ID,
        Finished: false,
        Description: descripción,
        Expiration: duración,
        WinnersCount: ganadores,
        Image: imagen,
      };

      await new db(Giveaway).save();
      interaction.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("✅ Sorteo activado correctamente")
            .setDescription(`[Ver Sorteo](${msg.url})`)
            .setColor(ee.color)
            .setFooter({ text: ee.footertext, iconURL: ee.footericon }),
        ],
        ephemeral: true,
      });
    } catch (e) {
      console.log(String(e.stack).bgRed);
    }
  },
};
