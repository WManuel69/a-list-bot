const { Client, Collection, Events, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('talk')
		.setDescription('Replies with Pong!')
		.addStringOption(option => 
			option.setName('input')
				.setDescription('Contract address or URL name')),
	async execute(interaction) {
		const input = interaction.option.getString('input');
		let address = "";
		if (input.startsWith("0x") && input.length() == 42) {
			address = input;
		} else {
			const options = {method: 'GET'};
			fetch(`https://api.opensea.io/api/v1/collection/${input}`, options)
  			.then(response => response.json())
  			.then(response => console.log(response))
  			.catch(err => console.error(err));	
		}
		// Optional Config object, but defaults to demo api-key and eth-mainnet.
		const settings = {
			apiKey: "tpZ8EEIC8zHtYWd8xQ5gChmVK7vb2jiE", // Replace with your Alchemy API Key.
			network: Network.ETH_MAINNET, // Replace with your network.
		};

		const alchemy = new Alchemy(settings);

		  // Print the NFT floor price for a contract
		await alchemy.nft
		.getFloorPrice(address)
		.then(console.log);
	},
};

