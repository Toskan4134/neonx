//here the event starts
const config = require("../../botconfig/config.json")
const { change_status } = require("../../handlers/functions");
require("dotenv").config()
module.exports = async client => {
  try {

    client.guilds.cache.forEach(g => {
      if (g.id !== "901950565649641532" && g.id !== "718898285053739019") {
        g.leave()
      }
    })

    try {
      const stringlength = 69;
      console.log("\n")
      console.log(`     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`.bold.brightGreen)
      console.log(`     ┃ `.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".bold.brightGreen)
      console.log(`     ┃ `.bold.brightGreen + `                          Bot Online`.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length - `                          Bot Online`.length) + "┃".bold.brightGreen)
      console.log(`     ┃ `.bold.brightGreen + `                /--/ ${client.user.tag} /--/`.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length - `                /--/ ${client.user.tag} /--/`.length) + "┃".bold.brightGreen)
      console.log(`     ┃ `.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".bold.brightGreen)
      console.log(`     ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.bold.brightGreen)
    } catch { /* */ }
    change_status(client, "PLAYING", `${config.prefix}help | NeonX Bot`);
    //loop through the status per each 10 minutes
    setInterval(() => {
      change_status(client, "PLAYING", `${config.prefix}help | NeonX Bot`);
    }, 15 * 1000);
    client.categories.push("Deactivated")
  } catch (e) {
    console.log(String(e.stack).grey.italic.dim.bgRed)
  }
}