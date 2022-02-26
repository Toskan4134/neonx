const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const { delay } = require("../../handlers/functions");
module.exports = { //if [OPTIONAL] it means, you don't need to type it!
    activated: true,
    name: "clean", //the Command Name [REQUIRED]
    category: "Administration", //the Command Category [OPTIONAL]
    aliases: ["clear", "cl", "borrar", "purge", "limpiar"], //the command aliases [OPTIONAL]
    cooldown: 2, //the Command Cooldown (Default in /botconfig/settings.json) [OPTIONAL]
    usage: "clean <NºMensajes>", //the Command usage [OPTIONAL]
    description: "Borra una cantidad de mensajes", //the command description [OPTIONAL]
    memberpermissions: ["MANAGE_MESSAGES"], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
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
            let error14Days = new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setFooter({ text: ee.footertext, iconURL: ee.footericon })
                .setTitle(`❌ No se pueden borrar mensajes con más de 14 días de antiguedad`)
            let rato = new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setFooter({ text: ee.footertext, iconURL: ee.footericon })
                .setTitle(`🔧 Este proceso tomará un rato, por favor espere`)
            let success = new MessageEmbed()
                .setColor(ee.color)
                .setFooter({ text: ee.footertext, iconURL: ee.footericon })
                .setTitle(`✅ ${args[0]} mensajes borrados correctamente`)

            let toDelete = parseInt(args[0]) + 1;
            try {
                if (toDelete > 100) {
                    toDelete++
                    message.channel.send({ embeds: [rato] })
                }
                while (toDelete > 100) {
                    message.channel.bulkDelete(100)
                    // console.log(100)
                    await delay(6000)
                    toDelete -= 100

                }
                message.channel.bulkDelete(toDelete)
                // console.log(toDelete)
            } catch {
                message.channel.send({ embeds: [error14Days] })
                    .then(msg => {
                        setTimeout(() => {
                            return msg.delete().catch((e) => {
                                console.log(String(e).grey)
                            })
                        }, 5 * 1000)
                    })
            }
            message.channel.send({ embeds: [success] }).then(msg => {
                setTimeout(() => {
                    return msg.delete().catch((e) => {
                        console.log(String(e).grey)
                    })
                }, 5 * 1000)
            })

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
