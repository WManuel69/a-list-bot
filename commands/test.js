// Github: https://github.com/alchemyplatform/alchemy-sdk-js
// Setup: npm install alchemy-sdk
/*
const { Network, Alchemy } = require("alchemy-sdk");
const { default: axios } = require("axios");

// Optional Config object, but defaults to demo api-key and eth-mainnet.
const settings = {
    apiKey: "tpZ8EEIC8zHtYWd8xQ5gChmVK7vb2jiE", // Replace with your Alchemy API Key.
    network: Network.ETH_MAINNET, // Replace with your network.
};
*/
const {MongoClient} = require('mongodb');
const url = "mongodb+srv://doadmin:mZXBV7k3z24y8509@db-mongodb-ams3-14998-ce0deaf1.mongo.ondigitalocean.com/admin?authSource=admin&replicaSet=db-mongodb-ams3-14998&tls=true";
const client = new MongoClient(url);
const dbName = "Alist"

    client.connect();
    const db = client.db(dbName);
    const col = db.collection("contractAddresses");

    const entries =  col.find( { userID: "143444705009598464"});
    entries.forEach(item => console.log(item.collectionName))






/*
const alchemy = new Alchemy(settings);

// Print the NFT floor price for a contract
alchemy.nft.getFloorPrice("0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d").then((d) => {
        console.log(d.openSea.collectionUrl.substr(d.openSea.collectionUrl.indexOf("collection/")+11,d.openSea.collectionUrl.length));
    });

*/



/*
const resp = axios.get('https://api.opensea.io/api/v1/collection/doodles-official')
    .then((res) => {
        console.log(res.data.collection.stats.one_day_volume)
    });

console.log((5123).substr(0,2))
*
 */