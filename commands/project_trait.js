const { Client, Collection, Events, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { default: axios } = require("axios");
const { Network, Alchemy } = require("alchemy-sdk");

module.exports = {
    data: new SlashCommandBuilder()
  		.setName('project_trait')
  		.setDescription('See the floor price for any project.')
  		.addStringOption(option => 
    		option
				.setName('Address')
      			.setDescription('Contract address or URL name'))
		.addStringOption(option => 
			option
				.setName("TokenID")
				.setDescription("Token ID of the NFT")),
	async execute(interaction) {
		const contractAddress = interaction.options.get('Address').value;
		const tokenID = interaction.options.get('TokenID').value;
		if (contractAddress.startsWith("0x") && address.length == 42) {			
			let embed = new EmbedBuilder()
				.setColor(0x0099FF)
				.setTitle('Rarity of NFT')
				.setThumbnail('https://cdn.discordapp.com/attachments/1059490759994249267/1062655683557855342/JPG-04.jpg');
			axios(
					{
						method: "get",
						headers: { "X-API-KEY": "" },
						url: `https://api.opensea.io/api/v1/asset/${contractAddress}/${tokenID}`
					}
			)
				.then((res) => {
					for (let i = 0; i < res.data.traits.length; i++) {
						embed.addFields(
							{ name: res.data.traits[i].trait_type, value: res.data.traits[i].value, inline: true }
						);
					}
					try {
						embed.addFields(
							{ name: "Rank", value: res.data.rarity_data.rank}
						);
					} catch (err) {
						embed.addFields(
							{ name: "Rank", value: "Rank is not currently available"}
						);
					}
					interaction.reply({ embeds: [embed] });
				}).catch((err) => {
					interaction.reply("Traits aren't currently available")
				})
		} else {
			axios.get(
				`https://api.opensea.io/api/v1/collection/${contractAddress}`
			)
				.then((addy) => {
					axios(
						{
							method: "get",
							headers: { "X-API-KEY": "" },
							url: `https://api.opensea.io/api/v1/asset/${addy.data.collection.primary_asset_contracts[0].address}/${tokenID}`
						}
				)
					.then((res) => {
						for (let i = 0; i < res.data.traits.length; i++) {
							embed.addFields(
								{ name: res.data.traits[i].trait_type, value: res.data.traits[i].value, inline: true }
							);
						}
						try {
							embed.addFields(
								{ name: "Rank", value: res.data.rarity_data.rank}
							);
						} catch (err) {
							embed.addFields(
								{ name: "Rank", value: "Rank is not currently available"}
							);
						}
						interaction.reply({ embeds: [embed] });
					}).catch((err) => {
						interaction.reply("Traits aren't currently available")
					})
				})
		}
		
	},
};