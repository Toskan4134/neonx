require("dotenv").config()
const express = require("express");
const app = express();
const path = require("path")
app.use(express.static("public"));
app.use(express.static(__dirname + "/view"));
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '/view/404.html'));
})
app.set('port', process.env.PORT || 80);
app.listen(app.get('port'));


// Discord.js

const Discord = require("discord.js");
const config = require(`./botconfig/config.json`);
const settings = require(`./botconfig/settings.json`);
const colors = require("colors");
const mongoose = require("mongoose");

const client = new Discord.Client({
  //fetchAllMembers: false,
  //restTimeOffset: 0,
  //restWsBridgetimeout: 100,
  shards: "auto",
  allowedMentions: {
    parse: ["users", "roles"],
    repliedUser: false,
  },
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_BANS,
    Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    //Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
    //Discord.Intents.FLAGS.GUILD_WEBHOOKS,
    Discord.Intents.FLAGS.GUILD_INVITES,
    Discord.Intents.FLAGS.GUILD_VOICE_STATES,
    Discord.Intents.FLAGS.GUILD_PRESENCES,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    //Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
    Discord.Intents.FLAGS.DIRECT_MESSAGES,
    Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    //Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING
  ],
  presence: {
    activity: {
      name: `Music`,
      type: "LISTENING",
    },
    status: "online"
  }
});
const logs = require('discord-logs');
logs(client);

setTimeout(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    keepAlive: true,
  })
}, 1000)


//Define some Global Collections

client.commands = new Discord.Collection();
client.handlers = new Discord.Collection();
client.cooldowns = new Discord.Collection();
client.slashCommands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.categories = require("fs").readdirSync(`./commands`);
//Require the Handlers                  Add the antiCrash file too, if its enabled
function handlers() {
  ["events", "commands", "slashCommands", "handlers", settings.antiCrash ? "antiCrash" : null]
    .filter(Boolean)
    .forEach(h => {
      require(`./handlers/${h}`)(client);
    })
}
handlers()

module.exports.handlers = handlers;
//Start the Bot
client.login(process.env.TOKEN)