// Github: https://github.com/alchemyplatform/alchemy-sdk-js
// Setup: npm install alchemy-sdk

const { Network, Alchemy } = require("alchemy-sdk");
const { default: axios } = require("axios");

// Optional Config object, but defaults to demo api-key and eth-mainnet.
const settings = {
    apiKey: "tpZ8EEIC8zHtYWd8xQ5gChmVK7vb2jiE", // Replace with your Alchemy API Key.
    network: Network.ETH_MAINNET, // Replace with your network.
};
/*
const alchemy = new Alchemy(settings);

// Print the NFT floor price for a contract
alchemy.nft.getFloorPrice("0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d").then((d) => {
        console.log(d.openSea.collectionUrl.substr(d.openSea.collectionUrl.indexOf("collection/")+11,d.openSea.collectionUrl.length));
    });

*/



axios(
        {
            method: "get",
            headers: {
                'authority': 'core-api.prod.blur.io',
                'path': '/v1/collections/mutant-ape-yacht-club/prices?filters={"traits":[],"hasAsks":true}',
                'scheme': 'https',
                'accept': '*/*',
                'accept-encoding': 'gzip, deflate, br',
                'accept-language': 'da-DK,da;q=0.9,en-US;q=0.8,en;q=0.7',
                'cookie': 'rl_page_init_referrer=RudderEncrypt:U2FsdGVkX19vOunhkachlfVRHxxJdyBCFz80ypZt3zA=; rl_page_init_referring_domain=RudderEncrypt:U2FsdGVkX19VsHUUkiotBYy3PbGjE5Zq0xccHf8vdig=; _ga=GA1.2.2111534394.1671895727; _gid=GA1.2.2040123308.1673984538; authToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ3YWxsZXRBZGRyZXNzIjoiMHhlNzgxYjdkOGZjMDlmN2JkYmVkYzQ0MTViOTcxYWJjZTU2NmVkN2NkIiwic2lnbmF0dXJlIjoiMHgwM2Q4MzdlZWJkYjc1MGY2MDUwMjA3MjFiZmFlM2VkMDBkMDg0ZTM2MjQ0YjU2ZjIyODViZTExNGM5MGJhYTQ0MmYzNTc1MTM3YWIyY2UzYTVjMjk0ZjRhNGU5YWIyZjJkYzk1YTliZTM4ZTMxMGJmM2E1Yjk1Y2YwOTZlMDdhMDFjIiwiaWF0IjoxNjcyNzY2OTc1LCJleHAiOjE2NzUzNTg5NzV9.0ERcfUZctXbzUqFYtGRmpP6hG5RwDS0DN54q9jy5M_k; walletAddress=0xe781b7d8fc09f7bdbedc4415b971abce566ed7cd; _gat_gtag_UA_224913115_1=1; __cf_bm=szw2bLNxPS7ajDW2P0pRYA_8j_Glx9lxwRMU4Ynu_2o-1674065182-0-AbV+frRm7Y8IXn8eY/NSW6NmWZgh8BVvxdmsg06yWnWr1GgES1pMN+u297cWlHrRSTYMSfq2SC6YON5uJqtB9TaD6HwRDWI88rufAqb7F4MG; fs_uid=#o-19FFTT-na1#5654863092273152:4923125611417600:::#96fb7060#/1701710848; rl_trait=RudderEncrypt:U2FsdGVkX19RQwybm4eqjx9yzFG6CItzfvvG5rscc7s=; rl_group_id=RudderEncrypt:U2FsdGVkX18theqbP2XBtaJvZrj7bVcOQMHZVoZuBNQ=; rl_group_trait=RudderEncrypt:U2FsdGVkX1/Qiu/8qniQoYG4NwJYymgb2ltIG/VBNlw=; rl_anonymous_id=RudderEncrypt:U2FsdGVkX1+bUm8YnBUvWXoXq7xjkUimC6I9xWrXSR8qwbPYH5np23DGCXvQ+5qBMTYmkLthJbkjRLATqAHgPA==; rl_user_id=RudderEncrypt:U2FsdGVkX19Ogd8wwYR8JZBai6J+Y6873ttwM422YHJpxTdUmghD43gu5OhjUXyQ7QUBYWYlksFX8ngbL1te7w==; rl_session=RudderEncrypt:U2FsdGVkX1/MF5sWMF7nTjm+kI7AaJr/QzMSceYUctx67erU5RZX6P09b2borHIUsGz7HWREANaiCxX2XtpW4RUFHdER0g8H+KAi3KYiszqOS2a/vztyc5pqXgMotL43ZRdzxP4yO1mFXy90VQGL0w==',
                'origin': 'https://blur.io',
                'referer': 'https://blur.io/',
                'sec-ch-ua': '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-site',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
            },
            url: 'https://core-api.prod.blur.io/v1/collections/mutant-ape-yacht-club/prices?filters={"traits":[],"hasAsks":true}',
            validateStatus: false

        }
    )
    .then((res) =>

            console.log(res)
    );

/*
const resp = axios.get('https://api.opensea.io/api/v1/collection/doodles-official')
    .then((res) => {
        console.log(res.data.collection.stats.one_day_volume)
    });

console.log((5123).substr(0,2))
*
 */