const { Client, Collection, Events, GatewayIntentBits, REST, Routes, SlashCommandBuilder, channelLink, EmbedBuilder } = require('discord.js');
const { default: axios } = require("axios");
const { Network, Alchemy } = require("alchemy-sdk");
const {MongoClient} = require('mongodb');
const url = "mongodb+srv://doadmin:mZXBV7k3z24y8509@db-mongodb-ams3-14998-ce0deaf1.mongo.ondigitalocean.com/admin?authSource=admin&replicaSet=db-mongodb-ams3-14998&tls=true";
const client = new MongoClient(url);

module.exports = {
    data: new SlashCommandBuilder()
  		.setName('remove')
  		.setDescription('Remove alert from your list')
          .addStringOption(option => 
    		option
				.setName('collection')
      			.setDescription('Collection name').setRequired(true))
		.addStringOption(option => 
			option
				.setName('change')
				.setDescription("Format: 0.5").setRequired(true)),
	async execute(interaction) {
		const dbName = "Alist"
        const collectionName = interaction.options.get('collection').value;
		const change = interaction.options.get('change').value;
        try {
            client.connect();
            const db = client.db(dbName);
            db.stats().then(stats => {
                db.collections().then(col => {
                    for(let i = 0; i<stats.collections; i++) {
                        let collect = db.collection(col[i].s.namespace.collection);
                        collect.deleteOne({  collectionName: collectionName , userID:  interaction.user.id , change: change});
                    }
                }); 
            })
            
            
            await interaction.reply("Collection removed!")
            
        } catch (err) {
            interaction.reply("Error occurred, try again");
            
        }
    
        finally {
           client.close();
           
        }


		}
	};