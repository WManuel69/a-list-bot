const { Client, Collection, Events, GatewayIntentBits, REST, Routes, SlashCommandBuilder, channelLink } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
  		.setName('gas_price')
  		.setDescription('See the current gas prices'),
	async execute(interaction) {
		const data = await request("https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=NQVJFVIWT2Q83ZZ2MCYYI54G1ZWY5TJT9X");
		const json = JSON.parse(data);
		const embed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle('Gas price')
			.setThumbnail('https://cdn.discordapp.com/attachments/1059490759994249267/1062655683557855342/JPG-04.jpg')
			.addFields(
				{ name: 'Slow', value: json.result.SafeGasPrice, inline: true },
				{ name: 'Medium', value: json.result.ProposeGasPrice, inline: true },
				{ name: 'Fast', value: json.result.FastGasPrice, inline: true },
			);

		await interaction.send({ embeds: [embed] });
	},
}