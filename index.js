const { Client, Collection, Events, GatewayIntentBits, REST, Routes, SlashCommandBuilder, channelLink, EmbedBuilder } = require('discord.js');
const { default: axios } = require("axios");
const { Network, Alchemy } = require("alchemy-sdk");
const {MongoClient} = require('mongodb');
const url = "mongodb+srv://doadmin:mZXBV7k3z24y8509@db-mongodb-ams3-14998-ce0deaf1.mongo.ondigitalocean.com/admin?authSource=admin&replicaSet=db-mongodb-ams3-14998&tls=true";
const db = new MongoClient(url);

const client = new Client({ intents: [3276799] });
const discordToken = "MTA2Mzc3ODM1OTYxNzc4MTg2Mg.G384lv.tnywhYlgTX6xDYyTiKTOAWyWQW5oqmn2at7KUY";
client.commands = new Collection();
const fs = require('node:fs');
const path = require('node:path');

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

client.on('message', (message) => {
    while(true){
        
        db.connect();
        const dbName = "Alist"
        const data = db.db(dbName);
        const col = data.collection("contractAddresses");  
        const entries = col.find({});
        const channel = client.channels.cache.get('1063794467649359923');
        entries.forEach(d => {
            if(d.increment === "0.1") {
                channel.send("yo")
                col.deleteOne({  collectionName: d.collectionName , userID:  d.userID , increment: d.increment})
            }
        })
        
        
    }
    

    /*
    
    while(true) {
        /*
        db.connect();
        const settings = {
            apiKey: "tpZ8EEIC8zHtYWd8xQ5gChmVK7vb2jiE", // Replace with your Alchemy API Key.
            network: Network.ETH_MAINNET, // Replace with your network.
        };

        const alchemy = new Alchemy(settings);
        // Just to check if the collection does exist 
        alchemy.nft.getFloorPrice(contractAddress).then((d) => {
            
        })
        const dbName = "Alist"
        const data = client.db(dbName);
        const col = data.collection("contractAddresses");  
        const entries = col.find({});
        entries.forEach(item => {
            alchemy.nft.getFloorPrice(item.contractAddress).then((d) => {
                if(d.openSea.floorPrice-parseFloat(item.currentPrice+'') > parseFloat(item.increment)) { // når der er ramt et TP så fjerner man den entry
                    message.channel
                } else if (d.openSea.floorPrice-parseFloat(item.currentPrice+'') < parseFloat(item.increment) * -1.0) {

                }
            })
        })
        
            
        db.close(); 
        

        
            
            
    }
    */
})


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
