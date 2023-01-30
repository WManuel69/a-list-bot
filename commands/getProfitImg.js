const { Client, Collection, Events, GatewayIntentBits, REST, Routes, SlashCommandBuilder, channelLink, EmbedBuilder } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
  		.setName('profits')
  		.setDescription('List all commands'),
	async execute(interaction) {

	}
};
  