const { Client, Collection, Events, GatewayIntentBits, REST, Routes, SlashCommandBuilder, channelLink, EmbedBuilder } = require('discord.js');
const { default: axios } = require("axios");
const { Network, Alchemy } = require("alchemy-sdk");

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
				const resp = axios.get(`https://api.opensea.io/api/v1/collection/${input}`)
				.then((res) => {
					address = res.data.primary_asset_contracts.address;
				}); 
			} catch (error) {
				await interaction.reply("Error occurred")
				return;
			}
			
			
		}
		await interaction.reply(address + " " + input);
		/*

		const settings = {
			apiKey: "tpZ8EEIC8zHtYWd8xQ5gChmVK7vb2jiE", // Replace with your Alchemy API Key.
			network: Network.ETH_MAINNET, // Replace with your network.
		};

		const alchemy = new Alchemy(settings);

		const response = await alchemy.nft.getFloorPrice(address);
	


		const embed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle('Floor price')
			.setThumbnail('https://cdn.discordapp.com/attachments/1059490759994249267/1062655683557855342/JPG-04.jpg')
			.addFields(
				{ name: 'Floor Price:', value: response.openSea.floorPrice } // or value_list.nftMarketplace.floorPrice
			)
		interaction.reply({ embeds: [embed] });
		*/
	},
};

