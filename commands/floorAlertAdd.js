const { Client, Collection, Events, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { default: axios } = require("axios");
const { Network, Alchemy } = require("alchemy-sdk");
const {MongoClient} = require('mongodb');
const url = "mongodb+srv://doadmin:mZXBV7k3z24y8509@db-mongodb-ams3-14998-ce0deaf1.mongo.ondigitalocean.com/admin?authSource=admin&replicaSet=db-mongodb-ams3-14998&tls=true";
const client = new MongoClient(url);


module.exports = {
    data: new SlashCommandBuilder()
  		.setName('add_collection')
  		.setDescription('Get pinged if the collection is moved by a fixed increment.')
  		.addStringOption(option => 
    		option
				.setName('address')
      			.setDescription('Contract address or URL name'))
		.addStringOption(option => 
			option
				.setName("increment")
				.setDescription("Format: 0.5")),
	async execute(interaction) {
		const contractAddress = interaction.options.get('address').value;
		const increment = interaction.options.get('increment').value;
		const dbName = "Alist"
		try {
            await client.connect();
            console.log("Connected correctly to server");
            const db = client.db(dbName);
            // Use the collection "people"
            const col = db.collection("contractAddresses");
            // Construct a document                                                                                                                                                              
            let personDocument = {
                "contractAddress": contractAddress,
                "increment": increment
            }
            await col.insertOne(personDocument);
            
           } catch (err) {
            await interaction.reply("error occurred")
        }
    
        finally {
           await client.close();
           await interaction.reply("Collection added!")

       }
	},
};