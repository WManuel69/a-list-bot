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
				axios.get(`https://api.opensea.io/api/v1/collection/${input}`)
				.then((res) => {
					console.log(res.data.collection.stats.floor_price);
					const embed = new EmbedBuilder()
						.setColor(0x0099FF)
						.setTitle('Floor price')
						.setThumbnail('https://cdn.discordapp.com/attachments/1059490759994249267/1062655683557855342/JPG-04.jpg')
						.addFields(
							{ name: 'Floor Price:', value: ` ETH` } // res.data.collection.stats.floor_price
						);
					interaction.reply({ embeds: [embed] });
					return;
				}); 
			} catch (error) {
				await interaction.reply("Collection does not exist. Try again, otherwise use contract address")
				return;
			}
			
			
		}

		const settings = {
			apiKey: "tpZ8EEIC8zHtYWd8xQ5gChmVK7vb2jiE", // Replace with your Alchemy API Key.
			network: Network.ETH_MAINNET, // Replace with your network.
		};

		const alchemy = new Alchemy(settings);

		alchemy.nft.getFloorPrice(address).then((d) => {
			const embed = new EmbedBuilder()
			.setColor(0x0099FF)
			.setTitle('Floor price')
			.setThumbnail('https://cdn.discordapp.com/attachments/1059490759994249267/1062655683557855342/JPG-04.jpg')
			.addFields(
				{ name: 'Floor Price:', value: "hi" } //d.openSea.floorPrice
			);
		interaction.reply({ embeds: [embed] });
		});
		
	
		
	},
};

