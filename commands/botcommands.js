const { Client, Collection, Events, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
  		.setName('account')
  		.setDescription('See the floor price for any project.')
  		.addStringOption(option => 
    		option.setName('test')
      	.setDescription('Contract address or URL name')),
	async execute(interaction) {
    const input = interaction.options.getString('test');
		await interaction.reply(input);
	},
}
module.exports = {
    data: new SlashCommandBuilder()
  		.setName('gas_price')
  		.setDescription('See the floor price for any project.')
  		.addStringOption(option => 
    		option.setName('test')
      	.setDescription('Contract address or URL name')),
	async execute(interaction) {
    const input = interaction.options.getString('test');
		await interaction.reply(input);
	},
}
module.exports = {
    data: new SlashCommandBuilder()
  		.setName('project_info')
  		.setDescription('See the floor price for any project.')
  		.addStringOption(option => 
    		option.setName('test')
      	.setDescription('Contract address or URL name')),
	async execute(interaction) {
    const input = interaction.options.getString('test');
		await interaction.reply(input);
	},
}
module.exports = {
    data: new SlashCommandBuilder()
  		.setName('project_volume')
  		.setDescription('See the floor price for any project.')
  		.addStringOption(option => 
    		option.setName('test')
      	.setDescription('Contract address or URL name')),
	async execute(interaction) {
    const input = interaction.options.getString('test');
		await interaction.reply(input);
	},
}
module.exports = {
    data: new SlashCommandBuilder()
  		.setName('project_trait')
  		.setDescription('See the floor price for any project.')
  		.addStringOption(option => 
    		option.setName('test')
      	.setDescription('Contract address or URL name')),
	async execute(interaction) {
    const input = interaction.options.getString('test');
		await interaction.reply(input);
	},
};
  