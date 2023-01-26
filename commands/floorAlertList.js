const { Client, Collection, Events, GatewayIntentBits, REST, Routes, SlashCommandBuilder, channelLink, EmbedBuilder } = require('discord.js');
const { default: axios } = require("axios");
const { Network, Alchemy } = require("alchemy-sdk");
const {MongoClient} = require('mongodb');
const url = "mongodb+srv://doadmin:mZXBV7k3z24y8509@db-mongodb-ams3-14998-ce0deaf1.mongo.ondigitalocean.com/admin?authSource=admin&replicaSet=db-mongodb-ams3-14998&tls=true";
const client = new MongoClient(url);

module.exports = {
    data: new SlashCommandBuilder()
  		.setName('list')
  		.setDescription('All collections you want to be notified about'),
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
            
            const numOfCollections = (await db.stats()).collections;
            for(let i = 0; i<numOfCollections; i++) {
                let collectionNames = (await db.collections())[i].s.namespace.collection;
                let collect = db.collection(collectionNames);
                const entries =  collect.find( { userID: interaction.user.id });
                await entries.forEach((item) => {
                    embed.addFields({ name: item.collectionName, value: "Change: " + item.change + " ETH" })
                });
            }
                
            
            await interaction.reply({ embeds: [embed] });
            
        } catch (err) {
            interaction.reply("Error occurred, try again");
            
        }
    
        finally {
           client.close();
           
        }


		}
	};
