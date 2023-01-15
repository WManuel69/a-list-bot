const { Client, Collection, Events, GatewayIntentBits, REST, Routes, SlashCommandBuilder, channelLink, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
  		.setName('gas_price')
  		.setDescription('See the current gas prices'),
	async execute(interaction) {
		const data = fetch("https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=NQVJFVIWT2Q83ZZ2MCYYI54G1ZWY5TJT9X")
			.then((response) => response.json())
			.then((d) => {const embed = new EmbedBuilder()
				.setColor(0x0099FF)
				.setTitle('Gas price')
				.setThumbnail('https://cdn.discordapp.com/attachments/1059490759994249267/1062655683557855342/JPG-04.jpg')
				.addFields(
					{ name: 'Slow', value: d.result.SafeGasPrice, inline: true },
					{ name: 'Medium', value: d.result.ProposeGasPrice, inline: true },
					{ name: 'Fast', value: d.result.FastGasPrice, inline: true },
				);
	
			interaction.reply({ embeds: [embed] });} );
		
	},
}