const { MessageEmbed, CommandInteraction, MessageActionRow, MessageButton, Message, MessageSelectMenu } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
module.exports = {
    name: "setup", //the command name for the Slash Command
    description: "Crea embed con botones para abrir ticket", //the command description for Slash Command Overview
    cooldown: 5,
    memberpermissions: ["ADMINISTRATOR"], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
    requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
    alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
    options: [ //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!
        //INFORMATIONS! You can add Options, but mind that the NAME MUST BE LOWERCASED! AND NO SPACES!!!, for the CHOCIES you need to add a array of arrays; [ ["",""] , ["",""] ] 
        //{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
        // { "String": { name: "text", description: "What should I send? [ +n+ = Newline ]", required: true } }, //to use in the code: interacton.getString("title")
        //{"User": { name: "ping_a_user", description: "To Ping a user lol", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
        // { "Channel": { name: "in_where", description: "In What Channel should I send it?", required: false } }, //to use in the code: interacton.getChannel("what_channel")
        //{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
        //{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }}, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
        //{"StringChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", "botping"], ["Discord Api", "api"]] }}, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")

    ],
    run: async (client, interaction) => {
        try {
            //console.log(interaction, StringOption)

            //things u can directly access in an interaction!
            const { member, channelId, guildId, applicationId,
                commandName, deferred, replied, ephemeral,
                options, id, createdTimestamp
            } = interaction;
            const { guild } = member;
            const embed = new MessageEmbed()
                .setAuthor({ name: ee.footertext + " | Tickets", iconURL: ee.footericon })
                .setDescription("Para reportar a un jugador, usa el botón \"**🎟 Reportar Usuario**\"\n\nPara ponerte en contacto con nostros, accede a la categoría correspondiente en el siguiente menú")
                .setColor(ee.color)

            const Buttons = new MessageActionRow();
            Buttons.addComponents(
                new MessageButton()
                    .setCustomId("Reportar-Usuario")
                    .setLabel("Reportar Usuario")
                    .setStyle("PRIMARY")
                    .setEmoji("🎟")
            );
            const Menu = new MessageActionRow();

            Menu.addComponents(
                new MessageSelectMenu()
                    .setCustomId("RolePlay")
                    .setPlaceholder("Elige una opción para abrir un ticket")
                    .addOptions([
                        {
                            label: "Mafias y Bandas",
                            value: "Mafias-Bandas",
                            description: "Ticket sobre las Mafias y Bandas",
                            emoji: "🕵️",
                        },
                        {
                            label: "Facciones Legales",
                            value: "Facciones-Legales",
                            description: "Ticket sobre las Facciones Legales",
                            emoji: "👮",
                        },
                        {
                            label: "CKS y Banneos",
                            value: "CKs-Banneos",
                            description: "Ticket sobre los Character Kills y Banneos",
                            emoji: "💀",
                        },
                        {
                            label: "Contacto con los Fundadores",
                            value: "Contacto-Fundadores",
                            description: "Ticket para poder contacto con los Fundadores",
                            emoji: "💠",
                        },
                        {
                            label: "Bugs y Errores",
                            value: "Bugs-Errores",
                            description: "Ticket para informar sobre algún bug o error",
                            emoji: "🐞",
                        },
                        {
                            label: "Otros",
                            value: "Otros",
                            description: "Ticket para las cosas no mencionadas anteriormente",
                            emoji: "📮",
                        },
                    ])
                    .setMaxValues(1)
                    .setMinValues(0)
            )

            await guild.channels.cache.get(settings.tickets.openID).send({
                embeds: [embed],
                components: [Buttons, Menu]
            })

            interaction.reply({ content: "¡Hecho!", ephemeral: true })


        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
}