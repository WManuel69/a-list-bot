const { Client, Collection, Events, GatewayIntentBits, REST, Routes, SlashCommandBuilder, channelLink, EmbedBuilder } = require('discord.js');
const { default: axios } = require("axios");
const { Network, Alchemy } = require("alchemy-sdk");
const { MongoClient } = require('mongodb');
const url = "mongodb+srv://doadmin:mZXBV7k3z24y8509@db-mongodb-ams3-14998-ce0deaf1.mongo.ondigitalocean.com/admin?authSource=admin&replicaSet=db-mongodb-ams3-14998&tls=true";
const client = new MongoClient(url);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Remove all items from your list'),
    async execute(interaction) {
        const dbName = "Alist"
        try {
            await client.connect();
            const db = client.db(dbName);
            db.stats().then(stats => {
                db.collections().then(col => {
                    for (let i = 0; i < stats.collections; i++) {
                        let collect = db.collection(col[i].s.namespace.collection);
                        collect.deleteMany({
                            userID: interaction.user.id,
                        });
                    }
                });
            })

            await interaction.reply({ content: "Purge completed!", ephemeral: true })

        } catch (err) {
            interaction.reply({ content: "Error occurred, try again",  ephemeral: true });

        }

        finally {
            client.close();

        }


    }
};