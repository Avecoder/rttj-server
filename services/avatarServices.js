const fs = require('fs')
const path = require('path')
const request = require('request')
const cheerio = require('cheerio')
const wg = require('waifu-generator')
const pngToJpg = require('png-jpg')
const jimp = require('jimp')


class AvatarServices {
	async downloadAvatar(userID, username) {
		const userURL = `https://t.me/${username}`

		const getURL = body => {
			const $ = cheerio.load(body)
			const url = $('.tgme_page_photo_image').attr('src')
			return url
		}

		const createAvatar = async url => {
			if(!url) {
				await wg({path: './static', filename: `${userID}`})
				await jimp.read(`./static/${userID}.png`, (err, image) => {
					if(err) {
						console.log(err)
						return
					}

					image.write(`./static/${userID}.jpg`)
					fs.unlinkSync(`./static/${userID}.png`)
				})

			} else {
				request.head(url, function(err, res, body){
				    request(url).pipe(fs.createWriteStream(`./static/${userID}.jpg`)).on('close', () => console.log(`Avatar ${username} saved(${userID}.jpg).`))
				})
			}
		}

		request(userURL, async (err, res, body) => {
			if(err) {
				console.log(err)
			} else {
				const url = await getURL(body)
				await createAvatar(url)
			}
		})

	}

	async updateAvatar(image, userID) {
		try {
			let fileName = `${userID}.jpg`

			await image.mv(path.resolve(__dirname, '..', 'static', fileName))
			return fileName
		} catch(e) {
			console.log(e)
		}
	}
}



module.exports = new AvatarServices()
