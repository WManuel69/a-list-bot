const axios = require('axios');
const { QuickDB } = require("quick.db");
const db = new QuickDB(); // will make a json.sqlite in the root folder

const sdk = require('api')('@alchemy-docs/v1.0#17aay1klabp6ed5');

const sdk2 = require('api')('@opensea/v1.0#10fy4ug30l7qohm4q');
sdk.server('https://eth-mainnet.g.alchemy.com/nft/v2');

// Setup: npm install alchemy-sdk
const { Alchemy, Network } = require("alchemy-sdk");
let apiKeyALCHEMY = "NwmRSw_9d6HgFEKLVecB1UIkswNFsQfY"
const config = {
    apiKey: apiKeyALCHEMY,
    network: Network.ETH_MAINNET,
}

const alchemy = new Alchemy(config);

async function start(wallets, contract, startOfLaunch) {
    await getNFTsOwnedAndNotOwned(contract, wallets, startOfLaunch)
    return;
}

// Address we want get NFT mints from
async function getNFTsOwnedAndNotOwned(contract, wallets, startOfLaunch) {
    const OS1 = {
        method: 'GET',
        url: "https://api.opensea.io/api/v1/asset_contract/" + contract,
        headers: { accept: 'application/json', 'X-API-KEY': '' }

    };
    await axios
        .request(OS1)
        .then(async function (response) {
            await db.set(`Results${startOfLaunch}.name`, response.data.collection.name);
            let slug = response.data.collection.slug
            const OS2 = {
                method: 'GET',
                url: "https://api.opensea.io/api/v1/collection/" + slug + "/stats",
                headers: { accept: 'application/json', 'X-API-KEY': '' }
            };
            await axios
                .request(OS2)
                .then(async function (response) {
                    let fp = response.data.stats.floor_price;
                    await db.set(`Results${startOfLaunch}.fp`, fp)

                }).catch(err => console.error(err));
        }).catch(err => console.error(err));

    for await (const wallet of wallets) {

        const cameIn = await alchemy.core.getAssetTransfers({
            fromBlock: "0x0",
            toAddress: wallet,
            contractAddresses: [contract],
            category: ["erc721"],

            maxCount: 0x3e8
        }).catch(err => console.log(err))
        const cameOut = await alchemy.core.getAssetTransfers({
            fromBlock: "0x0",
            fromAddress: wallet,
            contractAddresses: [contract],
            category: ["erc721"],
            maxCount: 0x3e8
        }).catch(err => console.log(err))

        await sleep(500)
        var isNotApplicable = 0;
        var mints = [];
        var hashes = [];
        for (let i = 0; i < cameIn.transfers.length; i++) {
            let sender = cameIn.transfers[i].from;
            let receiver = cameIn.transfers[i].to;
            if (wallets.includes(sender) && wallets.includes(receiver)) {
                isNotApplicable++;
            } else if (sender == "0x0000000000000000000000000000000000000000") {
                mints.push(cameIn.transfers[i].hash)
            } else {
                hashes.push(cameIn.transfers[i].hash)
            }
        }

        var counts = {};
        mints.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });
        var usedHashes = [];

        var newCOunts = {};
        hashes.forEach(function (x) { newCOunts[x] = (newCOunts[x] || 0) + 1; });

        var txnsToBecarefulWith = [];
        var price = 0;
        for (let i = 0; i < Object.keys(counts).length; i++) {
            let tx = Object.keys(counts)[i]
            const transaction1 = await alchemy.core.getTransactionReceipt(tx).catch(err => console.log(err))
            const transaction = await alchemy.core.getTransaction(tx).catch(err => console.log(err))
            var cost = parseInt(transaction.value) / 10e17
            if (transaction1.from.toLowerCase() === wallet.toLowerCase()) cost += parseFloat(transaction1.gasUsed) * parseFloat(transaction1.effectiveGasPrice) / 10e17;
            price += cost;
            usedHashes.push(tx);
        }

        for (let i = 0; i < Object.keys(newCOunts).length; i++) {
            let tx = Object.keys(newCOunts)[i]
            if (Object.values(newCOunts)[i] != 1) txnsToBecarefulWith.push(tx);
        }

        await sdk.getNFTSales({
            fromBlock: '0',
            toBlock: 'latest',
            contractAddress: contract,
            buyerAddress: wallet,
            apiKey: apiKeyALCHEMY

        })
            .then(async ({ data }) => {
                data = data.nftSales;
                for (var key in data) {
                    if (txnsToBecarefulWith.includes(data[key].transactionHash)) {
                    } else {
                        if (data[key].sellerFee && data[key].sellerFee.amount && data[key].royaltyFee && data[key].royaltyFee.amount) {
                            let buyPrice = (((parseFloat(data[key].sellerFee.amount) + parseFloat(data[key].royaltyFee.amount)) / 100) * 102.5) / 10e17
                            const transaction = await alchemy.core.getTransactionReceipt(data[key].transactionHash)
                            buyPrice += (parseFloat(transaction.gasUsed) * parseFloat(transaction.effectiveGasPrice)) / 10e17;
                            price += buyPrice
                            usedHashes.push(data[key].transactionHash);
                        }
                    }

                }
            })
            .catch(err => console.error(err));


        for (let i = 0; i < Object.keys(newCOunts).length; i++) {
            let tx = Object.keys(newCOunts)[i]
            if (usedHashes.includes(tx)) {
            } else {
                const transaction1 = await alchemy.core.getTransactionReceipt(tx)
                const transaction = await alchemy.core.getTransaction(tx)

                const internaltx = await alchemy.core.getAssetTransfers({
                    fromBlock: transaction1.blockNumber,
                    toBlock: transaction1.blockNumber,
                    contractAddresses: [transaction1.to],
                    category: ["internal"],
                    excludeZeroValue: true,
                    maxCount: 0x3e8
                });

                var cost;
                var result = internaltx.transfers.filter(obj => obj.hash == tx && obj.to.toLowerCase() == wallet.toLowerCase());

                if (!result[0]) cost = (transaction.value / 10e17)
                if (result[0]) cst = (parseFloat(transaction.value / 10e17) - result[0].value)

                var value = cost;
                if (transaction1.from.toLowerCase() === wallet.toLowerCase()) value += parseFloat(transaction1.gasUsed) * parseFloat(transaction1.effectiveGasPrice) / 10e17
                price += value;
            }
        }

        let salePrice = 0;
        let totalSold = 0;
        let didFindHashes = [];
        let newHashes = [];

        for (let i = 0; i < cameOut.transfers.length; i++) {
            newHashes.push(cameOut.transfers[i].hash)
        }
        var txnsToBecarefulWith1 = []
        var newHashes1 = {};
        newHashes.forEach(function (x) { newHashes1[x] = (newHashes1[x] || 0) + 1; });

        for (let i = 0; i < Object.keys(newHashes1).length; i++) {
            let tx = Object.keys(newHashes1)[i]
            if (Object.values(newHashes1)[i] != 1) txnsToBecarefulWith1.push(tx);
        }

        await sdk.getNFTSales({
            fromBlock: '0',
            toBlock: 'latest',
            contractAddress: contract,
            sellerAddress: wallet,
            apiKey: apiKeyALCHEMY
        })
            .then(({ data }) => {
                totalSold += data.nftSales.length;
                data = data.nftSales;
                for (var key in data) {
                    if (txnsToBecarefulWith1.includes(data[key].transactionHash)) { } else {
                        if (data[key].sellerFee && data[key].sellerFee.amount && data[key].royaltyFee && data[key].royaltyFee.amount) {
                            didFindHashes.push(data[key].transactionHash);
                            let sellPrice = (parseFloat(data[key].sellerFee.amount)) / 10e17
                            salePrice += sellPrice
                        }
                    }
                }
            })
            .catch(err => console.error(err));

        for (let i = 0; i < cameOut.transfers.length; i++) {
            if (didFindHashes.includes(cameOut.transfers[i].hash)) {
            } else {
                const transaction = await alchemy.core.getTransaction(cameOut.transfers[i].hash).catch(err => console.log(err))
                const internaltx = await alchemy.core.getAssetTransfers({
                    fromBlock: transaction.blockNumber,
                    toBlock: transaction.blockNumber,
                    contractAddresses: [transaction.to],
                    category: ["internal"],
                    excludeZeroValue: false,
                    maxCount: 0x3e8
                }).catch(err => console.log(err))
                var result = internaltx.transfers.filter(obj => obj.hash == cameOut.transfers[i].hash && obj.asset == "ETH" && obj.to.toLowerCase() == wallet.toLowerCase());
                let z = parseInt(transaction.value);
                if (result[0] && result[0].value) z = parseFloat(result[0].value);

                salePrice += z
            }
        }
        await db.add(`Results${startOfLaunch}.allsellprice`, parseFloat(salePrice))
        await db.add(`Results${startOfLaunch}.allsold`, parseFloat(cameOut.transfers.length - isNotApplicable))
        await db.add(`Results${startOfLaunch}.price`, parseFloat(price))
        await db.add(`Results${startOfLaunch}.allowned`, parseFloat(cameIn.transfers.length - isNotApplicable))
        await sleep(1000);
    }
    await sleep(1000)
    return;
}

function sleep(ms) {

    return new Promise(resolve => setTimeout(resolve, ms));

}

module.exports = { start, getNFTsOwnedAndNotOwned }