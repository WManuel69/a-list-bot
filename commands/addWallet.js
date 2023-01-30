const { Client, Collection, Events, GatewayIntentBits, REST, Routes, SlashCommandBuilder, channelLink, EmbedBuilder } = require('discord.js');
const { QuickDB } = require("quick.db");

const db = new QuickDB(); // will make a json.sqlite in the root folder


module.exports = {
    data: new SlashCommandBuilder()
        .setName('addwallet')
        .setDescription('add new wallets')
        .addStringOption((option) => option.setName("address").setDescription("Your address to add").setRequired(true)),
    async execute(interaction) {
        let toAddWallet = interaction.options.get("address").value.toLowerCase();
        let walle33ts = toAddWallet.match(/(\b0x[a-f0-9]{40}\b)/g)
        if (!walle33ts) return interaction.reply({ content: "No addresses!", ephemeral: true })
        let currentAddedWallets = await db.get(`${interaction.user.id}_wallets`);
        if (currentAddedWallets != null || currentAddedWallets != undefined || currentAddedWallets == "") {
            if (walle33ts.some(r => currentAddedWallets.includes(r))) return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setTitle("Add Wallet")
                    .setDescription(`Your wallet has been found in our database and is already being monitored, to remove it use: \`/deletewallet address:${toAddWallet}\``)
                    .setColor('Red')
                    .setTimestamp()
                    .setFooter({ text: `A List`, iconURL: "https://media.discordapp.net/attachments/1059490759994249267/1062655683834683422/JPG-05.jpg?width=898&height=898" })], ephemeral: true
            })
            let array = currentAddedWallets;
            const ToSetWallets = array.concat(walle33ts);
            db.set(`${interaction.user.id}_wallets`, ToSetWallets)
            interaction.reply({
                embeds: [new EmbedBuilder()
                    .setTitle("Added Wallets")
                    .setDescription("Your wallet(s) have been added. (" + walle33ts.length + ")")
                    .setColor('White')
                    .setTimestamp()

                    .setFooter({ text: `A List`, iconURL: "https://media.discordapp.net/attachments/1059490759994249267/1062655683834683422/JPG-05.jpg?width=898&height=898" })], ephemeral: true
            })
        } else {
            db.set(`${interaction.user.id}_wallets`, walle33ts)
            interaction.reply({
                embeds: [new EmbedBuilder()
                    .setTitle("Added Wallets")
                    .setDescription("Your wallet(s) have been added. (" + walle33ts.length + ")")
                    .setColor('White')
                    .setTimestamp()
                    .setFooter({ text: `A List`, iconURL: "https://media.discordapp.net/attachments/1059490759994249267/1062655683834683422/JPG-05.jpg?width=898&height=898" })], ephemeral: true
            })
        }
    }
}