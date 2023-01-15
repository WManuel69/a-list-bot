const { Client, Collection, Events, GatewayIntentBits, REST, Routes, SlashCommandBuilder, channelLink } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
  		.setName('account')
  		.setDescription('Check ETH wallet balance')
  		.addStringOption(option => 
    		option.setName('input')
      	.setDescription('Wallet address')),
	async execute(interaction) {
    const input = interaction.options.getString('input');
		const address = interaction.options.get("input").value;

		// could add a part where u ask if u provide an .eth address tho idk if needed
		if (address.length != 42) {
			await interaction.reply("Wrong address given")
			return
		}
		
		const { Alchemy, Utils } = require('alchemy-sdk');

		const apiKey = "tpZ8EEIC8zHtYWd8xQ5gChmVK7vb2jiE";
		const settings = {
    		apiKey: apiKey
		};

		const alchemy = new Alchemy(settings);

		// make the address prettier using three dots in the middle:

		const output_address = address.substr(0,4) + "..." + address.substr(38,41);


		let balance = await alchemy.core.getBalance(address, 'latest');
		balance = Utils.formatEther(balance);

		// make balance prettier
		
		let dot_placement = 0;

		for(i = 0; i<balance.length; i++) {
			if (balance.substr(i,i+1) === ".") {
				dot_placement = i;
				break;
			}
		}

		const output_balance = balance.substr(0,5+dot_placement-1); 

		await interaction.reply(`Balance of ${output_address}: ${output_balance} ETH`);
	
	},
}