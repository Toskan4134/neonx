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
  name: "delete", //the command name for the Slash Command
  description: "Elimina un sorteo (Mensaje y base de datos)", //the command description for Slash Command Overview
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
        description: "ID del sorteo a eliminar",
        required: true,
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
          let msg = await channel.messages.fetch(docs.MessageID);
          msg.delete();
          docs.delete();
          interaction.reply({
            embeds: [
              new MessageEmbed()
                .setTitle("✅ Sorteo eliminado correctamente")
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
