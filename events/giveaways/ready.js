const settings = require("../../botconfig/settings.json");
const db = require("../../database/giveaways");
var ee = require(`../../botconfig/embed.json`);
let chan = settings.giveawaysChan;
const { MessageEmbed, UserFlags } = require("discord.js");
module.exports = async (client) => {
  try {
    let channel = await client.channels.cache.get(chan);
    let guild = await client.guilds.cache.get("901950565649641532");
    setInterval(async () => {
      db.find(
        {
          Finished: false,
        },
        async (err, docs) => {
          if (err) throw err;
          let now = (Date.now() - (Date.now() % 1000)) / 1000;
          docs.forEach(async (r) => {
            if (now >= r.Expiration) {
              r.Finished = true;
              r.Winners = [];
              let msg = await channel.messages.fetch(r.MessageID);
              const users = [];
              let winMsg = "";
              let sendMsg = "";
              let reactions = await msg.reactions.resolve("🎁").users.fetch();
              reactions.map((user) => {
                if (user.id !== client.user.id) {
                  users.push(user.id);
                }
              });
              let usersLength = users.length;
              if (users.length == 0) {
                winMsg += "Nadie ha participado en el sorteo\n";
              } else {
                try {
                  for (let i = 0; i < parseInt(r.WinnersCount); i++) {
                    let rndm = Math.floor(Math.random() * users.length);
                    let w = users.slice(rndm, rndm + 1);
                    let user = await guild.members.cache.get(w[0]);
                    winMsg +=
                      i +
                      1 +
                      "º " +
                      user.user.tag +
                      " - <@" +
                      user.user.id +
                      ">\n";
                    sendMsg += user.user.tag + " - <@" + user.user.id + ">\n";
                    r.Winners.push(w[0]);
                    users.splice(rndm, rndm + 1);
                    user.send({
                      embeds: [
                        new MessageEmbed()
                          .setColor(ee.color)
                          .setFooter({
                            text: ee.footertext,
                            iconURL: ee.footericon,
                          })
                          .setTitle(`🎉 Has ganado un sorteo 🎉`)
                          .setDescription(
                            `Felicidades, has ganado el sorteo "${r.Description}"\n\n[Ver Sorteo](${msg.url})`
                          )
                          .setTimestamp(),
                      ],
                    });
                  }
                } catch {}
              }
              let member = await guild.members.cache.get(r.MemberID);
              let embed = new MessageEmbed()
                .setTitle("🎁 Sorteo Terminado | NeonX")
                .addField("Descripción", r.Description)
                .addField("Ganadores", winMsg, true)
                .setTimestamp()
                .setThumbnail("https://img.freepik.com/vector-gratis/sorteo-letreros-neon-sobre-fondo-pared-ladrillo_100690-93.jpg?size=600&ext=jpg")
                .setImage(r.Image)
                .setAuthor({
                  name: member.user.tag,
                  iconURL: member.user.displayAvatarURL({ dynamic: true }),
                  url: "https://discordapp.com/users/" + member.user.id,
                })
                .setColor("#00ffff")
                .setFooter({
                  text: ee.footertext + " - " + r.GiveawayID,
                  iconURL: ee.footericon,
                });

              msg.edit({ embeds: [embed] });
              r.save();
              channel.send({
                embeds: [
                  new MessageEmbed()
                    .setColor(ee.color)
                    .setFooter({
                      text: ee.footertext,
                      iconURL: ee.footericon,
                    })
                    .setTitle(`🎉 Ha terminado un sorteo 🎉`)
                    .setTimestamp()
                    .setDescription(
                      `${
                        usersLength == 0
                          ? winMsg
                          : r.Winners.length == 1
                          ? `**El ganador es:**\n${sendMsg}`
                          : `**Los ganadores son:**\n${sendMsg}`
                      }\n[Ver Sorteo](${msg.url})`
                    ),
                ],
              });
            }
          });
        }
      );
    }, 10 * 1000);
  } catch (e) {
    console.log(String(e.stack).grey.italic.dim.bgRed);
  }
};
