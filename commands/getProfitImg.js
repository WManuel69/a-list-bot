const { Client, Collection, Events, GatewayIntentBits, REST, Routes, SlashCommandBuilder, channelLink, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const { QuickDB } = require("quick.db");

const db = new QuickDB(); // will make a json.sqlite in the root folder
const axios = require("axios")
const request = require('request');

const ethers = require("ethers")
const provider = new ethers.providers.JsonRpcProvider("https://node.neontools.me")
const { start } = require("./modules/dataStasher.js");
const fs = require('fs')
const { generateImage } = require("./modules/imageManipulator.js");


module.exports = {
	data: new SlashCommandBuilder()
		.setName('profits')
		.setDescription('List all commands')
		.addStringOption(option =>
			option
				.setName('address')
				.setDescription('Contract address or URL name').setRequired(true)),
	async execute(interaction) {
		if (!(await db.get(`${interaction.user.id}_wallets`))) return await interaction.reply({
			embeds: [new EmbedBuilder()
				.setTitle("Action Needed!")
				.setDescription(`Looks like you have yet to configure your wallets! Set it by doing \`/addwallet {your address}\``)
				.setColor('Red')
				.setTimestamp()
				.setFooter({ text: `A List`, iconURL: "https://media.discordapp.net/attachments/1059490759994249267/1062655683834683422/JPG-05.jpg?width=898&height=898" })]
			, ephemeral: true
		})
		let contractToGetProfitsFrom = interaction.options.get("address").value;
		if (!isAddress(contractToGetProfitsFrom) || await provider.getCode(contractToGetProfitsFrom) == "0x") return await interaction.reply({
			embeds: [new EmbedBuilder()
				.setTitle("Only Contracts!")
				.setDescription(`Only contracts`)
				.setColor('Red')
				.setTimestamp()
				.setFooter({ text: `A List`, iconURL: "https://media.discordapp.net/attachments/1059490759994249267/1062655683834683422/JPG-05.jpg?width=898&height=898" })]
			, ephemeral: true
		})

		await interaction.reply({
			embeds: [new EmbedBuilder()
				.setTitle("Loading...")
				.setDescription(`Currently reading out all your wallets.`)
				.setColor('White')
				.setTimestamp()
				.setFooter({ text: `A List`, iconURL: "https://media.discordapp.net/attachments/1059490759994249267/1062655683834683422/JPG-05.jpg?width=898&height=898" })]
			, ephemeral:
				true
		})
		let currentAddedWallets = await db.get(`${interaction.user.id}_wallets`);
		const startOfLaunch = Date.now();
		const options = {
			"method": "GET",
			"url": "https://api.opensea.io/api/v1/asset_contract/" + contractToGetProfitsFrom,
			"headers": {
				"accept": "application/json",
				"X-API-KEY": ""
			}
		}
		let data = (await axios(options)).data;
		await download(data.image_url, "./commands/images/" + startOfLaunch / 4 + ".jpg")
		await download(interaction.user.avatarURL({ size: 1024, extension: "jpg" }) || interaction.user.defaultAvatarURL, './commands/images/' + startOfLaunch / 2 + ".jpg")

		await start(currentAddedWallets, contractToGetProfitsFrom, startOfLaunch).catch(err => {
			interaction.editReply({ content: "Something went wrong!", ephemeral: true });
		})
		await sleep(500)
		let datas = await db.get(`Results${startOfLaunch}`)
		if (datas.allowned === 0) return await interaction.editReply({
			embeds: [new EmbedBuilder()
				.setTitle("No NFTs")
				.setDescription(`You don't own any of these NFTs!`)
				.setColor('Red')
				.setTimestamp()
				.setFooter({ text: `A List`, iconURL: "https://media.discordapp.net/attachments/1059490759994249267/1062655683834683422/JPG-05.jpg?width=898&height=898" })]

			, ephemeral: true
		})
		const avgCostPerToken = (datas.price / datas.allowned) || 0
		const avgSellPerToken = (datas.allsellprice / datas.allsold) || 0
		let totalEverOwned = (datas.allowned) || 0
		const totalEverSold = (datas.allsold) || 0
		let remainingNfts = (totalEverOwned - totalEverSold) || 0
		const realizedProfit = (datas.allsellprice - datas.price) || 0
		const potentialProfit = (datas.fp * remainingNfts) + realizedProfit || 0
		let roi = parseFloat(((datas.fp * remainingNfts) + (totalEverSold * avgSellPerToken) - (avgCostPerToken * totalEverOwned)) / (avgCostPerToken * totalEverOwned)) * 100 || 999.99;
		if (totalEverOwned >= 9 && totalEverOwned <= 99) totalEverOwned = ` ${totalEverOwned}`
		if (totalEverOwned >= 0 && totalEverOwned <= 9) totalEverOwned = `  ${totalEverOwned}`
		if (remainingNfts >= 9 && remainingNfts <= 99) remainingNfts = ` ${remainingNfts}`
		if (remainingNfts >= 0 && remainingNfts <= 9) remainingNfts = `  ${remainingNfts}`
		if (roi === Infinity) roi = 999.99
		console.log(datas)
		await interaction.editReply({
			embeds: [new EmbedBuilder()
				.setTitle("Creating image...")
				.setDescription(`Found data, now creating an image accordingly!`)
				.setColor('White')
				.setTimestamp()
				.setFooter({ text: `A List`, iconURL: "https://media.discordapp.net/attachments/1059490759994249267/1062655683834683422/JPG-05.jpg?width=898&height=898" })],
			ephemeral: true
		})
		await sleep(3000)

		let text = datas.name;
		if (text.length > 14) {
			text = text.substring(0, 14)//cuts to 1024
			last = text.lastIndexOf(" ")//gets last space (to avoid cutting the middle of a word)
			text = text.substring(0, last)//cuts from last space (to avoid cutting the middle of a word)
			text = text + `...`//adds (...) at the end to show that it's cut
		}
		let ethPrices = 0;
		const ethPrice = {
			method: 'GET',
			url: 'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD,EUR',
			headers: { accept: 'application/json' }

		};

		await axios
			.request(ethPrice)
			.then(async function (response) {
				ethPrices = response.data.USD;
			})
		await generateImage(startOfLaunch, datas.price.toFixed(3), totalEverOwned, datas.allsellprice.toFixed(3), remainingNfts, realizedProfit.toFixed(3), `${potentialProfit.toFixed(2)}Ξ ($${(potentialProfit*ethPrices).toFixed(2)})`, Math.round(roi), `${interaction.user.tag}`, `${text}`, potentialProfit) 

		// await generateImage(startOfLaunch, avgCostPerToken.toFixed(3), totalEverOwned, avgSellPerToken.toFixed(3), remainingNfts, realizedProfit.toFixed(3), `${potentialProfit.toFixed(2)}Ξ [${(potentialProfit * ethPrices).toFixed(2)}$]`, roi.toFixed(2) + "%", await db.get(`twitter_${interaction.user.id}`), `${text}`, potentialProfit)
		await sleep(3000)
		const att = new AttachmentBuilder(`./commands/images/${startOfLaunch}.jpg`)
		await interaction.editReply({
			embeds: [new EmbedBuilder()
				.setTitle("Finished")
				.setColor("White")
				.setImage(`attachment://${startOfLaunch}.jpg`)
				.setTimestamp()
				.setFooter({ text: `A List`, iconURL: "https://media.discordapp.net/attachments/1059490759994249267/1062655683834683422/JPG-05.jpg?width=898&height=898" })],
			files: [att],
			ephemeral: true
		})
	}
};



function isAddress(address) {
	return (/^(0x){1}[0-9a-fA-F]{40}$/i.test(address));
}
async function download(uri, filename) {
	console.log("Downloading")
	request.head(uri, function (err, res, body) {
		request(uri).pipe(fs.createWriteStream(filename));
	});
};

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
