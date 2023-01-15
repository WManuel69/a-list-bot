const { Client, Collection, Events, GatewayIntentBits, REST, Routes, SlashCommandBuilder, channelLink } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('floor_price')
		.setDescription('See the floor price for any project.')
		.addStringOption(option => 
			option.setName('input')
				.setDescription('Contract address or URL name')),
	async execute(interaction) {
		const input = interaction.options.get("input").value;
		let address = "";
		if (input.startsWith("0x") && input.length == 42) {
			address = input;
		} else {
			try {
			const result = await request(`https://api.opensea.io/api/v1/collection/${input}`);
			const { list } = await result.body.json();
			
			const [results] = list;

			address = results.primary_asset_contracts.address;
			} catch (error) {
				await interaction.reply("Error occurred")
			}
		}

		const settings = {
			apiKey: "tpZ8EEIC8zHtYWd8xQ5gChmVK7vb2jiE", // Replace with your Alchemy API Key.
			network: Network.ETH_MAINNET, // Replace with your network.
		};

		const alchemy = new Alchemy(settings);

		const value = await alchemy.nft.getFloorPrice(address);
	


		const embed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle('Floor price')
			.setThumbnail('https://cdn.discordapp.com/attachments/1059490759994249267/1062655683557855342/JPG-04.jpg')
			.addFields(
				{ name: 'Floor Price:', value: value.floorPrice } // or value_list.nftMarketplace.floorPrice
			)
		channel.send({ embeds: [embed] });
		
	},
};

