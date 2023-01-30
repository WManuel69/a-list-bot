const { Client, Collection, Events, GatewayIntentBits, REST, Routes, SlashCommandBuilder, channelLink, EmbedBuilder } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
  		.setName('help_watchlist')
  		.setDescription('List all watchlist commands'),
	async execute(interaction) {
		const embed = new EmbedBuilder()
		.setColor(0x0099FF)
		.setTitle('Watchlist bot commands')
		.setThumbnail('https://cdn.discordapp.com/attachments/1059490759994249267/1062655683557855342/JPG-04.jpg')
		.addFields(
			{ name: "/add_collection", value: "Add collection to watchlist andbe pinged when it falls below/exceeds threshold. " },
			{ name: "/list", value: "Prints your watchlist" },
			{ name: "/remove", value: "Removes from your watchlist. Input the name of the collection by typing exactly the same in your watchlist" },
			{ name: "/purge", value: "Removes all collections from your watchlist" }
		);
		await interaction.reply({ embeds: [embed] });
	}
};
  