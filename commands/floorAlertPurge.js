const { Client, Collection, Events, GatewayIntentBits, REST, Routes, SlashCommandBuilder, channelLink, EmbedBuilder } = require('discord.js');
const { default: axios } = require("axios");
const { Network, Alchemy } = require("alchemy-sdk");
const {MongoClient} = require('mongodb');
const url = "mongodb+srv://doadmin:mZXBV7k3z24y8509@db-mongodb-ams3-14998-ce0deaf1.mongo.ondigitalocean.com/admin?authSource=admin&replicaSet=db-mongodb-ams3-14998&tls=true";
const client = new MongoClient(url);

module.exports = {
    data: new SlashCommandBuilder()
  		.setName('purge')
  		.setDescription('Remove all items from your list'),
	async execute(interaction) {
		const dbName = "Alist"
        try {
            client.connect();
            const db = client.db(dbName);
            const col = db.collection("contractAddresses");   
            col.deleteMany( {
                userID:  interaction.user.id,
            } );
            
            await interaction.reply("Purge completed!")
            
        } catch (err) {
            interaction.reply("error occurred");
            
        }
    
        finally {
           client.close();
           
        }


		}
	};