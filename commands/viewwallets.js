const { Client, Collection, Events, GatewayIntentBits, REST, Routes, SlashCommandBuilder, channelLink, EmbedBuilder } = require('discord.js');
const { QuickDB } = require("quick.db");

const db = new QuickDB(); // will make a json.sqlite in the root folder


module.exports = {
    data: new SlashCommandBuilder()
        .setName('viewwallets')
        .setDescription('view all your wallets'),
    async execute(interaction) {
        let currentAddedWallets = await db.get(`${interaction.user.id}_wallets`);

       if (currentAddedWallets != null || currentAddedWallets != undefined || currentAddedWallets == "") {
            var message = "";
            for (let i = 0; i < currentAddedWallets.length; i++) {
                if (i === 25) {
                    message += `\nand ${currentAddedWallets.length - 25} more...`

               } else if (i <= 25) {
                    message += `${i + 1}. ${currentAddedWallets[i]}\n`
                }
            }
            if (message == "") return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setTitle("Wallets")
                    .setDescription("You do not have any wallets paired with the bot and so the bot is unable to list any wallets.")
                    .setColor('Red')
                    .setTimestamp()
                    .setFooter({ text: `A List`, iconURL: "https://media.discordapp.net/attachments/1059490759994249267/1062655683834683422/JPG-05.jpg?width=898&height=898" })], ephemeral: true
            })

           interaction.reply({
                embeds: [new EmbedBuilder()
                    .setTitle("Wallets")
                    .setDescription(message)
                    .setColor('White')
                    .setTimestamp()
                    .setFooter({ text: `A List`, iconURL: "https://media.discordapp.net/attachments/1059490759994249267/1062655683834683422/JPG-05.jpg?width=898&height=898" })], ephemeral: true
            })

       } else {
            interaction.reply({
                embeds: [new EmbedBuilder()
                    .setTitle("Wallets")
                    .setDescription("You do not have any wallets paired with the bot and so the bot is unable to list any wallets.")
                    .setColor('Red')
                    .setTimestamp()
                    .setFooter({ text: `A List`, iconURL: "https://media.discordapp.net/attachments/1059490759994249267/1062655683834683422/JPG-05.jpg?width=898&height=898" })], ephemeral: true
            })
        }

    }
}