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