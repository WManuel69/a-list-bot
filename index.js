const { Client, Collection, Events, GatewayIntentBits, REST, Routes, SlashCommandBuilder, channelLink, EmbedBuilder } = require('discord.js');
const { default: axios } = require("axios");
const { Network, Alchemy } = require("alchemy-sdk");
const { MongoClient } = require('mongodb');
const url = "mongodb+srv://doadmin:mZXBV7k3z24y8509@db-mongodb-ams3-14998-ce0deaf1.mongo.ondigitalocean.com/admin?authSource=admin&replicaSet=db-mongodb-ams3-14998&tls=true";
const clientDb = new MongoClient(url);
const client = new Client({ intents: [3276799] });
const discordToken = "MTA2Mzc3ODM1OTYxNzc4MTg2Mg.G384lv.tnywhYlgTX6xDYyTiKTOAWyWQW5oqmn2at7KUY";
client.commands = new Collection();
const fs = require('node:fs');
const path = require('node:path');
const ethers = require("ethers");
const commands = [];

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.on("ready", () => {
    console.log("Discord bot has started!");
    client.user.setActivity("with nfts");
});
setInterval(async () => {
    const settings = {
        apiKey: "tpZ8EEIC8zHtYWd8xQ5gChmVK7vb2jiE", // Replace with your Alchemy API Key.
        network: Network.ETH_MAINNET, // Replace with your network.
    };
    const alchemy = new Alchemy(settings);
    await clientDb.connect();
    const dbName = "Alist"
    const db = clientDb.db(dbName);
    db.stats().then(stats => {
        db.collections().then(async (col) => {
            for (let i = 0; i < stats.collections; i++) {
                let collectionNames = (await db.collections())[i].s.namespace.collection;
                let collect = db.collection(collectionNames);
                const entries = collect.find({});
                // if (!ethers.utils.isAddress(col[i].s.namespace.collection)) return console.log("Not a contract address")
                alchemy.nft.getFloorPrice(col[i].s.namespace.collection).then(async (d) => {
                    entries.forEach(item => {
                        console.log(0)
                        // if (d.openSea.floorPrice - parseFloat(item.currentPrice + '') > parseFloat(0)) { 
                        //     console.log(`<@${item.userID}> Target price for the collection ${item.collectionName} has been reached with change of +${item.change} ETH. The current floor price is now ${d.openSea.floorPrice}`);
                        //     col.deleteOne({  collectionName: item.collectionName , userID:  item.userID , change: item.change, currentPrice: item.currentPrice });
                        // } else if (d.openSea.floorPrice - parseFloat(item.currentPrice + '') < parseFloat(0) * -1.0) {
                        //     console.log(`<@${item.userID}> Target price for the collection ${item.collectionName} has been reached with change of -${item.change} ETH. The current floor price is now ${d.openSea.floorPrice}`);
                        //     col.deleteOne({  collectionName: item.collectionName , userID:  item.userID , change: item.change, currentPrice: item.currentPrice });
                        // }
                    })
                })
            }
        });
    })


}, 1000);


client.login(discordToken);






// Submit slash commands to Discord

const rest = new REST({ version: '10' }).setToken(discordToken);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes.applicationCommands("1063778359617781862"),
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();
