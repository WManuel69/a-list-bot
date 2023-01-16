const { Client, Collection, Events, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { default: axios } = require("axios");
const { Network, Alchemy } = require("alchemy-sdk");

module.exports = {
    data: new SlashCommandBuilder()
  		.setName('project_volume')
  		.setDescription('See the floor price for any project.')
  		.addStringOption(option => 
    		option.setName('input')
      	.setDescription('Contract address or URL name')),
		  async execute(interaction) {
			const input = interaction.options.get("input").value;
			if (input.startsWith("0x") && input.length == 42) {
				const settings = {
					apiKey: "tpZ8EEIC8zHtYWd8xQ5gChmVK7vb2jiE", // Replace with your Alchemy API Key.
					network: Network.ETH_MAINNET, // Replace with your network.
				};
	
				const alchemy = new Alchemy(settings);
	
				alchemy.nft.getFloorPrice(input).then((d) => {
					let collectionName = d.openSea.collectionUrl.substr(d.openSea.collectionUrl.indexOf("collection/")+11,d.openSea.collectionUrl.length);
					axios.get(`https://api.opensea.io/api/v1/collection/${collectionName}`).then((resp) => {
						const embed = new EmbedBuilder()
							.setColor(0x0099FF)
							.setTitle('Floor price')
							.setThumbnail('https://cdn.discordapp.com/attachments/1059490759994249267/1062655683557855342/JPG-04.jpg')
							.addFields(
								{ name: `${resp.data.collection.primary_asset_contracts[0].name}`, value: `` }
							)
							.addFields(
								{ name: 'Daily', value: resp.data.collection.stats.one_day_volume, inline: true },
								{ name: 'Weekly', value: resp.data.collection.stats.seven_day_volume, inline: true },
								{ name: 'Monthly', value: resp.data.collection.stats.thirty_day_volume, inline: true },
								{ name: 'All time', value: resp.data.collection.stats.total_volume, inline: true }
							);
						interaction.reply({ embeds: [embed] });}).catch((err) => interaction.reply("Wrong contract address"));
				}).catch((err) => interaction.reply("Wrong contract address"));
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
									{ name: `${res.data.collection.primary_asset_contracts[0].name}`, value: `` }
								)
								.addFields(
									{ name: 'Daily', value: res.data.collection.stats.one_day_volume, inline: true },
									{ name: 'Weekly', value: res.data.collection.stats.seven_day_volume, inline: true },
									{ name: 'Monthly', value: res.data.collection.stats.thirty_day_volume, inline: true },
									{ name: 'All time', value: res.data.collection.stats.total_volume, inline: true }
								);
							interaction.reply({ embeds: [embed] });
							return;
						})
						.catch((err) => {
							interaction.reply(
								"Collection does not exist. Try again, otherwise use contract address");
						});
				} catch (error) {
					await interaction.reply("Collection does not exist. Try again, otherwise use contract address")
					return;
				}
	
	
			}
		},
	};
	
	