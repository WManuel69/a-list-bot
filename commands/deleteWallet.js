const { Client, Collection, Events, GatewayIntentBits, REST, Routes, SlashCommandBuilder, channelLink, EmbedBuilder } = require('discord.js');
const { QuickDB } = require("quick.db");

const db = new QuickDB(); // will make a json.sqlite in the root folder


module.exports = {
    data: new SlashCommandBuilder()
        .setName('deletewallet')
        .setDescription('delete wallets')
        .addStringOption((option) => option.setName("address").setDescription("Your address to delete").setRequired(true)),
    async execute(interaction) {
        let toAddWallet = interaction.options.get("address").value.toLowerCase();
        let walle33ts = toAddWallet.match(/(\b0x[a-f0-9]{40}\b)/g)
        if (!walle33ts) return interaction.reply({ content: "No addresses!", ephemeral: true })

        let currentAddedWallets = await db.get(`${interaction.user.id}_wallets`);

        if (currentAddedWallets != null || currentAddedWallets != undefined || currentAddedWallets == "") {
            if (walle33ts.some(r => !currentAddedWallets.includes(r))) return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setTitle("Delete Wallet")
                    .setDescription(`Your wallet has not been found in our database and is not being monitored, to add it use: \`/addwallet address:${toAddWallet}\``)
                    .setColor('Red')
                    .setTimestamp()
                    .setFooter({ text: `A List`, iconURL: "https://media.discordapp.net/attachments/1059490759994249267/1062655683834683422/JPG-05.jpg?width=898&height=898" })], ephemeral: true
            })

            const ToSetWallets = currentAddedWallets.filter(val => !walle33ts.includes(val));
            db.set(`${interaction.user.id}_wallets`, ToSetWallets)

            interaction.reply({
                embeds: [new EmbedBuilder()
                    .setTitle("Deleted Wallet(s)")
                    .setDescription("Wallet(s) has been removed from our database! (" + walle33ts.length + ")")
                    .setColor('White')
                    .setTimestamp()
                    .setFooter({ text: `A List`, iconURL: "https://media.discordapp.net/attachments/1059490759994249267/1062655683834683422/JPG-05.jpg?width=898&height=898" })], ephemeral: true

            })
        } else {
           return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setTitle("Delete Wallet")
                    .setDescription("You do not have any wallets linked to the bot and so its unable to proceed.")
                    .setColor('Red')
                    .setTimestamp()
                    .setFooter({ text: `A List`, iconURL: "https://media.discordapp.net/attachments/1059490759994249267/1062655683834683422/JPG-05.jpg?width=898&height=898" })], ephemeral: true
            })
        }
    }
}