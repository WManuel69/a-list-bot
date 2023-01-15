const { Client, Collection, Events, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
  .setName('test')
  .setDescription('See the floor price for any project.')
  .addStringOption(option => 
    option.setName('test')
      .setDescription('Contract address or URL name')),
	async execute(interaction) {
		await interaction.reply("Hi");
	},
};
  
