const { Client, Collection, Events, GatewayIntentBits, REST, Routes, SlashCommandBuilder, channelLink, EmbedBuilder } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
  		.setName('help_botcommands')
  		.setDescription('List all commands'),
	async execute(interaction) {
		const embed = new EmbedBuilder()
		.setColor(0x0099FF)
		.setTitle('Bot commands')
		.setThumbnail('https://cdn.discordapp.com/attachments/1059490759994249267/1062655683557855342/JPG-04.jpg')
		.addFields(
			{ name: "/account", value: "See the floor price for any project." },
			{ name: "/gas_price", value: "See the current gas prices." },
			{ name: "/project_info", value: "Check info about project." },
			{ name: "/project_volume", value: "Check project volume." },
			{ name: "/project_trait", value: "Check token traits from user input and rank." },
			{ name: "/floor_price", value: "Check project floor price." },
			{ name: "/viewwallets", value: "See which wallets are being used for the profit bot." },
			{ name: "/addwallet", value: "Add a wallets to the profit bot." },
			{ name: "/deletewallet", value: "Remove a wallets from the profit bot." },
			{ name: "/profits", value: "Make the profit bot show you your profits." },
			{ name: "/add_collection", value: "Add collection to watchlist andbe pinged when it falls below/exceeds threshold. " },
			{ name: "/list", value: "Prints your watchlist" },
			{ name: "/remove", value: "Removes from your watchlist. Input the name of the collection by typing exactly the same in your watchlist" },
			{ name: "/purge", value: "Removes all collections from your watchlist" }
		);
		await interaction.reply({ embeds: [embed], ephemeral: true });
	}
};
  