/**
 * @INFO
 * Loading all needed File Information Parameters
 */
const Canvas = require('canvas');
const config = require("../../botconfig/config.json"); //loading config file with token and prefix
const settings = require("../../botconfig/settings.json"); //loading settings file with the settings
const ee = require("../../botconfig/embed.json"); //Loading all embed settings like color footertext and icon ...
const Discord = require("discord.js"); //this is the official discord.js wrapper for the Discord Api, which we use!
//here the event starts
module.exports = async (client, member) => {


    if (member.user.bot) {
        let rol = client.roles.cache.get("901950565691572265")
        member.roles.add(rol).catch();
        return;
    }

    if(member.guild.id !== "901950565649641532") return;

    Canvas.registerFont('././files/guildMemberAdd/Poppins-Bold.ttf', { family: 'bold' })
    Canvas.registerFont('././files/guildMemberAdd/Poppins-Medium.ttf', { family: 'medium' })
    const canvas = Canvas.createCanvas(1200, 400);
    const ctx = canvas.getContext('2d');


    const applyText = (canvas, text) => {
        let fontSize = 80;
        do {
            ctx.font = `${fontSize -= 10}px bold`
        } while (ctx.measureText(text).width > canvas.width - 300)
        return ctx.font;
    }

    const bg = await Canvas.loadImage("././files/guildMemberAdd/NeonXFondo.png")
    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: "png", size: 512 }))
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = "#ee00ff";
    ctx.lineWidth = 10;
    ctx.strokeRect(0, 0, canvas.width, canvas.height)
    ctx.font = "55px'medium'"
    ctx.fillStyle = "#fff"
    ctx.textAlign = "center"
    ctx.fillText("Bienvenid@ a NeonX", canvas.width / 1.57, 150)
    ctx.textAlign = "center"
    ctx.font = applyText(canvas, member.user.tag)
    ctx.fillStyle = "#fff"
    ctx.fillText(member.user.tag, canvas.width / 1.57, 285)
    ctx.beginPath();
    ctx.translate(50, 50)
    ctx.moveTo(300, 300);
    ctx.arcTo(0, 300, 0, 0, 50);
    ctx.arcTo(0, 0, 300, 0, 50);
    ctx.arcTo(300, 0, 300, 300, 50);
    ctx.arcTo(300, 300, 0, 300, 50);
    ctx.shadowBlur = 30;
    ctx.shadowColor = "#00eeff";
    ctx.fill();
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 0, 0, 300, 300)


    const attach = new Discord.MessageAttachment(canvas.toBuffer(), "welcome-image.png")

    let embed = new Discord.MessageEmbed()
        .setTitle("**__¡Bienvenido al servidor de GTA RP de Neon Servers!__**\n<a:flecha:902606657182367744>" + member.user.tag)

        .setDescription("*Recomendamos que vayas a mirar estos canales para que tengas una mejor experiencia de gameplay*\n"
            + "**──────────────────────────────**\n"
            + "> No olvides leerte la <#901950566236823578>\n"
            + "> En <#902608169879076934> tienes una pequeña ayuda\n"
            + "> Recuerda hacer la <#901950566236823572> para tener acceso al servidor\n"
            + "**──────────────────────────────**")
        .setThumbnail(ee.footericon)
        .setColor(ee.color)
        .setImage("attachment://welcome-image.png")
        .setFooter({ text: ee.footertext, iconURL: ee.footericon })
        .setTimestamp()
    client.channels.cache.get("901950565733523484").send({ embeds: [embed], files: [attach] });

}

