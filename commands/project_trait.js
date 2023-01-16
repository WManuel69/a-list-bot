const { Client, Collection, Events, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { default: axios } = require("axios");
const { Network, Alchemy } = require("alchemy-sdk");

module.exports = {
    data: new SlashCommandBuilder()
  		.setName('project_trait')
  		.setDescription('See the floor price for any project.')
  		.addStringOption(option => 
    		option.setName('input')
      	.setDescription('Contract address or URL name')),
	async execute(interaction) {
		const input = interaction.options.get('input').value;
		let embed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle('Balance of you')
			.setDescription(`$ ETH`)
			.setThumbnail('https://cdn.discordapp.com/attachments/1059490759994249267/1062655683557855342/JPG-04.jpg');
		embed.addFields(
			 { name: "hello", value: input },
		);
		await interaction.reply({ embeds: [embed] }); 
	},
};