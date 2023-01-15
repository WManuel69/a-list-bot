const { Client, Collection, Events, GatewayIntentBits, REST, Routes, SlashCommandBuilder, channelLink } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
  		.setName('account')
  		.setDescription('Check ETH wallet balance')
  		.addStringOption(option => 
    		option.setName('input')
      	.setDescription('Wallet address')),
	async execute(interaction) {
    const input = interaction.options.getString('input');
		const address = interaction.options.get("input").value;
		

		const { Alchemy, Utils } = require('alchemy-sdk');

		const apiKey = "tpZ8EEIC8zHtYWd8xQ5gChmVK7vb2jiE";
		const settings = {
    		apiKey: apiKey
		};

		const alchemy = new Alchemy(settings);

		// Get balance and format in terms of ETH
		let balance = await alchemy.core.getBalance(address, 'latest');
		balance = Utils.formatEther(balance);
		await interaction.reply(`Balance of ${address}: ${balance} ETH`);
	
	},
}