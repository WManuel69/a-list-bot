const { Client, Collection, Events, GatewayIntentBits, REST, Routes, SlashCommandBuilder, channelLink, EmbedBuilder } = require('discord.js');
const { default: axios } = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
  		.setName('gas_price')
  		.setDescription('See the current gas prices'),
	async execute(interaction) {
		axios.get("https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=NQVJFVIWT2Q83ZZ2MCYYI54G1ZWY5TJT9X")
			.then((response) => {const embed = new EmbedBuilder()
				.setColor(0x0099FF)
				.setTitle('Gas price')
				.setThumbnail('https://cdn.discordapp.com/attachments/1059490759994249267/1062655683557855342/JPG-04.jpg')
				.addFields(
					{ name: 'Slow', value: response.result.data.SafeGasPrice, inline: true },
					{ name: 'Normal', value: response.result.data.ProposeGasPrice, inline: true },
					{ name: 'Fast', value: response.data.result.FastGasPrice, inline: true },
				);}).then(interaction.reply({ embeds: [embed] }))
	}
}
