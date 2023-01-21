const { Client, Collection, Events, GatewayIntentBits, REST, Routes, SlashCommandBuilder, channelLink, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
  		.setName('account')
  		.setDescription('Check ETH wallet balance')
  		.addStringOption(option => 
    		option.setName('input')
      	.setDescription('Wallet address or ENS').setRequired(true))
		,
	async execute(interaction) {

		const address = interaction.options.get("input").value;

		
		if (address.length != 42 && !address.endsWith(".eth")) {
			await interaction.reply("Wrong address given")
			return
		}
		
		const { Alchemy, Utils } = require('alchemy-sdk');

		const apiKey = "tpZ8EEIC8zHtYWd8xQ5gChmVK7vb2jiE";
		const settings = {
    		apiKey: apiKey
		};

		const alchemy = new Alchemy(settings);

		let output_address = address;

		// make the address prettier using three dots in the middle:
		if (!address.endsWith(".eth")) {
			output_address = address.substr(0,4) + "..." + address.substr(38,41);
		}
		
		let balance = 0;

		try {
			balance = await alchemy.core.getBalance(address, 'latest');
			balance = Utils.formatEther(balance);
		} catch (error) {
			await interaction.reply("ENS does not exist")
			return;
		}

		// make balance prettier

		const output_balance = balance.substr(0,5+balance.indexOf('.')-1); 

		const embed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle(`Balance of ${output_address}`)
			.setDescription(`${output_balance} ETH`)
			.setThumbnail('https://cdn.discordapp.com/attachments/1059490759994249267/1062655683557855342/JPG-04.jpg')
		await interaction.reply({ embeds: [embed] });
	
	},
}