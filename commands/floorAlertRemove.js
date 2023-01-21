const { Client, Collection, Events, GatewayIntentBits, REST, Routes, SlashCommandBuilder, channelLink, EmbedBuilder } = require('discord.js');
const { default: axios } = require("axios");
const { Network, Alchemy } = require("alchemy-sdk");
const {MongoClient} = require('mongodb');
const url = "mongodb+srv://doadmin:mZXBV7k3z24y8509@db-mongodb-ams3-14998-ce0deaf1.mongo.ondigitalocean.com/admin?authSource=admin&replicaSet=db-mongodb-ams3-14998&tls=true";
const client = new MongoClient(url);

module.exports = {
    data: new SlashCommandBuilder()
  		.setName('remove')
  		.setDescription('All collections you want to be notified about')
          .addStringOption(option => 
    		option
				.setName('address')
      			.setDescription('Contract address or URL name').setRequired(true))
                
		.addStringOption(option => 
			option
				.setName("Change")
				.setDescription("Format: 0.5").setRequired(true)),
	async execute(interaction) {
		const dbName = "Alist"
        const contractAddress = interaction.options.get('address').value;
		const increment = interaction.options.get('increment').value;
        try {
            client.connect();
            const db = client.db(dbName);
            const col = db.collection("contractAddresses");   
            const entries =  col.deleteOne( {
                userID:  interaction.user.id,
                increment: increment,
                contractAddress: contractAddress
            } );
            
            interaction.reply("Collection removed!")
            
        } catch (err) {
            interaction.reply("error occurred");
            
        }
    
        finally {
           client.close();
           
        }


		}
	};