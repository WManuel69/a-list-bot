var Jimp = require("jimp");
const fs = require("fs");
const sharp = require('sharp');


// generateImage(0.5, 0.003, 5, 0.020, 0, 0.085, `0.08Ξ ($112.90)`, 504 + "%", "LEVINOTACKERMAN#7777", `ASSPIXX.WTF`, "500")

async function generateImage(tm, AVGCost, TotalTokens, AVGSale, Remaining, PNL, Profits, ROI, discord, pname, p) {
    fs.readFile("./commands/images/file.jpg", (err, data) => {
        fs.writeFile("./commands/images/" + tm.toString() + ".jpg", data, (err) => {
            if (err) console.log(err);
        })
    })
    p = p * 100
    let font1 = "profit";
    if (Math.sign(parseFloat(p)) == -1 || Math.sign(parseFloat(p)) == -0) font1 = "loss"
    let adjustedWhenNegativeForRealizzedProfits = 0;
    if(PNL < 0) adjustedWhenNegativeForRealizzedProfits = 19;
    return new Promise(resolve => {
        cropDiscordImage(tm).then(async () => {
            cropProject(tm).then(async => {
                addDiscord(tm).then(async () => {
                    addProject(tm).then(async () => {
                        editImage(815, 395, AVGCost + "Ξ", "body", tm).then(async () => {
                            editImage(870, 335, TotalTokens, "body", tm).then(async () => {
                            }).then(async () => {
                                editImage(815, 455, AVGSale + "Ξ", "body", tm).then(async () => {
                                }).then(async () => {
                                    editImage(870, 575, Remaining, "body", tm).then(async () => {
                                    }).then(async () => {
                                        editImage(815-adjustedWhenNegativeForRealizzedProfits, 517, PNL + "Ξ", "body", tm).then(async () => {
                                        }).then(async () => {
                                            editImage(150, 737, Profits, font1, tm).then(async () => {
                                            }).then(async () => {
                                                editImage(810, 737, ROI + "%", font1, tm).then(async () => {
                                                    editImage(293, 220, pname, "projectname", tm).then(async () => {
                                                        editImage(253, 891, discord, "smalldisc", tm).then(async () => {
                                                            resolve()
                                                        })
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    })
}





function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



function cropDiscordImage(tm) {
    return new Promise(async (resolve, reject) => {

        const writeStream = fs.createWriteStream("./commands/images/" + tm * 2 + ".jpg");
        const readableStream = fs.createReadStream("./commands/images/" + tm / 2 + ".jpg")
        const roundedCorners = Buffer.from(
            '<svg><rect x="0" y="0" width="72" height="72" rx="72" ry="72"/></svg>'
        );

        const roundedCornerResizer =
            sharp()
                .resize(72, 72)
                .composite([{
                    input: roundedCorners,
                    blend: 'dest-in'
                }])
                .png();

        readableStream
            .pipe(roundedCornerResizer)
            .pipe(writeStream)
        await sleep(200);
        resolve();
    })
}

function addDiscord(tm) {
    return new Promise(async (resolve, reject) => {
        var loadedImage;
        var discordPfp = await Jimp.read("./commands/images/" + tm * 2 + ".jpg")
        await sleep(300)
        await Jimp.read("./commands/images/" + tm + ".jpg")
            .then(function (image) {
                loadedImage = image;
                return;
            })
            .then(function (font) {
                loadedImage.composite(discordPfp, 154, 877)
                    .write("./commands/images/" + tm + ".jpg");
                resolve(0)
            })
            .catch(function (err) {
                console.error(err);
                reject(0)
            });
    })

}


function cropProject(tm) {
    return new Promise(async (resolve, reject) => {

        const writeStream = fs.createWriteStream("./commands/images/" + tm * 4 + ".jpg");
        const readableStream = fs.createReadStream("./commands/images/" + tm / 4 + ".jpg")
        const roundedCorners = Buffer.from(
            '<svg><rect x="0" y="0" width="108" height="108" rx="25" ry="25"/></svg>'
        );

        const roundedCornerResizer =
            sharp()
                .resize(108, 108)
                .composite([{
                    input: roundedCorners,
                    blend: 'dest-in'
                }])
                .png();

        readableStream
            .pipe(roundedCornerResizer)
            .pipe(writeStream)
        await sleep(200);
        resolve();
    })
}
function addProject(tm) {
    return new Promise(async (resolve, reject) => {
        var loadedImage;
        var discordPfp = await Jimp.read("./commands/images/" + tm * 4 + ".jpg")
        await sleep(300)
        await Jimp.read("./commands/images/" + tm + ".jpg")
            .then(function (image) {
                loadedImage = image;
                return;
            })
            .then(function (font) {
                loadedImage.composite(discordPfp, 153, 187)
                    .write("./commands/images/" + tm + ".jpg");
                resolve(0)
            })
            .catch(function (err) {
                console.error(err);
                reject(0)
            });
    })

}


function editImage(x, y, text, font, tm) {
    return new Promise(async (resolve, reject) => {
        var loadedImage;
        await sleep(300)
        await Jimp.read("./commands/images/" + tm + ".jpg")
            .then(function (image) {
                loadedImage = image;
                return Jimp.loadFont(`./commands/fonts/${font}.fnt`);
            })
            .then(function (font) {

                loadedImage.print(font, x, y, text)
                    .write("./commands/images/" + tm + ".jpg");
                resolve(0)
            })
            .catch(function (err) {
                console.error(err);
                reject(0)
            });
    })
}



function editImagez(x, y, text, font, tm) {
    return new Promise(async (resolve, reject) => {
        var loadedImage;
        await sleep(300)
        await Jimp.read("./commands/images/" + tm + ".jpg")
            .then(function (image) {
                loadedImage = image;
                return Jimp.loadFont(`./commands/fonts/${font}.fnt`);
            })
            .then(function (font) {

                loadedImage.print(font, x, y, {
                    text: text,
                    alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
                    alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM
                }, 1080, 1042)
                    .write("./commands/images/" + tm + ".jpg");
                resolve(0)
            })
            .catch(function (err) {
                console.error(err);
                reject(0)
            });
    })
}

module.exports = { editImage, editImagez, addDiscord, cropDiscordImage, sleep, generateImage }