const { Client, Collection, Events, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { default: axios } = require("axios");
const { Network, Alchemy } = require("alchemy-sdk");
const {MongoClient} = require('mongodb');
const url = "mongodb+srv://doadmin:mZXBV7k3z24y8509@db-mongodb-ams3-14998-ce0deaf1.mongo.ondigitalocean.com/admin?authSource=admin&replicaSet=db-mongodb-ams3-14998&tls=true";
const client = new MongoClient(url);

module.exports = {
    data: new SlashCommandBuilder()
  		.setName('add_collection')
  		.setDescription('Get pinged if the collection is moved by a fixed increment.'),
  		
	async execute(interaction) {
		const dbName = "Alist"
        try {
            client.connect();
            const db = client.db(dbName);
            const col = db.collection("contractAddresses");
                                                                                                                                                                       
            let embed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('My alerts')
                .setThumbnail('https://cdn.discordapp.com/attachments/1059490759994249267/1062655683557855342/JPG-04.jpg');
                
            const entries =  col.find( { userID: interaction.user.id})
            for(let i = 0; i<entries.length; i++) {
                embed.addFields({ name: entries.collectionName })
            }
            interaction.reply({ embeds: [embed] });
            
        } catch (err) {
            interaction.reply("error occurred");
            
        }
    
        finally {
           client.close();
           
        }


		}
	};
