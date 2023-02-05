const { Client, Collection, Events, GatewayIntentBits, REST, Routes, SlashCommandBuilder, channelLink, EmbedBuilder, SharedNameAndDescription } = require('discord.js');
const { default: axios } = require("axios");
const { Network, Alchemy } = require("alchemy-sdk");
const { MongoClient } = require('mongodb').MongoClient;
const url = "mongodb+srv://doadmin:mZXBV7k3z24y8509@db-mongodb-ams3-14998-ce0deaf1.mongo.ondigitalocean.com/admin?authSource=admin&replicaSet=db-mongodb-ams3-14998&tls=true";
const client = new MongoClient(url);


module.exports = {
    data: new SlashCommandBuilder()
        .setName('add_collection')
        .setDescription('Get pinged if the collection is moved by a fixed increment.')
        .addStringOption(option =>
            option
                .setName('address')
                .setDescription('Contract address or URL name').setRequired(true))

        .addStringOption(option =>
            option
                .setName("change")
                .setDescription("Format: 0.5").setRequired(true))
    ,
    async execute(interaction) {
        const contractAddress = interaction.options.get('address').value;
        const change = interaction.options.get('change').value;
        const dbName = "Alist";
        const user = interaction.user.id;
        if (contractAddress.startsWith("0x") && contractAddress.length == 42) {
            const settings = {
                apiKey: "tpZ8EEIC8zHtYWd8xQ5gChmVK7vb2jiE", // Replace with your Alchemy API Key.
                network: Network.ETH_MAINNET, // Replace with your network.
            };

            const alchemy = new Alchemy(settings);
            // Just to check if the collection does exist 
            alchemy.nft.getFloorPrice(contractAddress).then((d) => {
                let collectionName = d.openSea.collectionUrl.substr(d.openSea.collectionUrl.indexOf("collection/") + 11, d.openSea.collectionUrl.length);
                axios.get(`https://api.opensea.io/api/v1/collection/${collectionName}`).then((resp) => {
                    try {
                        MongoClient.connect(url, { useUnifiedTopology: true }).then((client) => {
                        console.log("Connected correctly to server");
                        const db = client.db(dbName);
                        try {
                            db.createCollection(contractAddress);
                        } catch (err) {
                            console.log("Collection already exists")
                        }
                        // Use the collection "people"
                        const col = db.collection(`${contractAddress}`);
                        // Construct a document                                                                                                                                                      
                        let personDocument = {
                            "change": change,
                            "userID": user,
                            "collectionName": resp.data.collection.primary_asset_contracts[0].name,
                            "currentPrice": resp.data.collection.stats.floor_price,
                            "slug": collectionName
                        }
                        col.insertOne(personDocument).catch(err => {
                            console.log(err)
                        })
                        })
                    } catch (err) {
                        console.log("Collection already existsss")
                    } finally {
                        client.close();
                        interaction.reply({ content: "Collection added!", ephemeral: true });
                    }
                }).catch((err) => {
                    console.log(`Collection already exists...ss.`)
                    interaction.reply({ content: "Wrong contract address", ephemeral: true })
                });
            }).catch((err) => {
                console.log(`Collection already exists...`)
                interaction.reply({ content: "Wrong contract address", ephemeral: true })
            });
        } else {
            try {
                axios.get(`https://api.opensea.io/api/v1/collection/${contractAddress}`)
                    .then((res) => {
                        try {
                            client.connect();
                            console.log("Connected correctly to server");
                            const db = client.db(dbName);
                            try {
                                db.createCollection(res.data.collection.primary_asset_contracts[0].address);
                            } catch (err) {

                            }


                            // Use the collection "people"
                            const col = db.collection(`${res.data.collection.primary_asset_contracts[0].address}`);
                            // Construct a document                                                                                                                                                              
                            let personDocument = {
                                "change": change,
                                "userID": user,
                                "collectionName": res.data.collection.primary_asset_contracts[0].name,
                                "currentPrice": res.data.collection.stats.floor_price,
                                "slug": contractAddress
                            }
                            col.insertOne(personDocument);

                        } catch (err) {
                            interaction.reply({ content: "error occurred",  ephemeral: true });
                            return;
                        }

                        finally {
                            client.close();
                            interaction.reply({ content: "Collection added!", ephemeral: true });
                        }


                    })
                    .catch((err) => {
                        interaction.reply(
                            { content: "Collection does not exist. Try again, otherwise use contract address",  ephemeral: true });
                    });
            } catch (error) {
                await interaction.reply({ content: "Collection does not exist. Try again, otherwise use contract address",  ephemeral: true })
                return;
            }


        }
    },
};