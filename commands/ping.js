const { Client, Collection, Events, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder(txt)
		.setName('talk')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply(txt);
	},
};