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
        const user = interaction.user.id;
        if (input.startsWith("0x") && input.length == 42) {
			const settings = {
				apiKey: "tpZ8EEIC8zHtYWd8xQ5gChmVK7vb2jiE", // Replace with your Alchemy API Key.
				network: Network.ETH_MAINNET, // Replace with your network.
			};

			const alchemy = new Alchemy(settings);
            // Just to check if the collection does exist 
			alchemy.nft.getFloorPrice(contractAddress).then((d) => {
				let collectionName = d.openSea.collectionUrl.substr(d.openSea.collectionUrl.indexOf("collection/")+11,d.openSea.collectionUrl.length);
				axios.get(`https://api.opensea.io/api/v1/collection/${collectionName}`).then((resp) => {
					try {
                        client.connect();
                        console.log("Connected correctly to server");
                        const db = client.db(dbName);
                        // Use the collection "people"
                        const col = db.collection("contractAddresses");
                        // Construct a document                                                                                                                                                              
                        let personDocument = {
                            "contractAddress": contractAddress,
                            "increment": increment,
                            "userID": user
                        }
                        col.insertOne(personDocument);
                        
                    } catch (err) {
                        interaction.reply("error occurred")
                    }
                
                    finally {
                       client.close();
                       interaction.reply("Collection added!")
                   }


					interaction.reply({ embeds: [embed] });}).catch((err) => interaction.reply("Wrong contract address"));
			}).catch((err) => interaction.reply("Wrong contract address"));
		} else {
			try {
				axios.get(`https://api.opensea.io/api/v1/collection/${contractAddress}`)
					.then((res) => {
						try {
                            client.connect();
                            console.log("Connected correctly to server");
                            const db = client.db(dbName);
                            // Use the collection "people"
                            const col = db.collection("contractAddresses");
                            // Construct a document                                                                                                                                                              
                            let personDocument = {
                                "contractAddress": res.data.collection.primary_asset_contracts[0].address,
                                "increment": increment,
                                "userID": user
                            }
                            col.insertOne(personDocument);
                            
                        } catch (err) {
                            interaction.reply("error occurred")
                        }
                    
                        finally {
                           client.close();
                           interaction.reply("Collection added!")
                
                       }
					
						
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