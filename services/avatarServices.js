const fs = require('fs')
const path = require('path')
const request = require('request')
const cheerio = require('cheerio')
const wg = require('waifu-generator')
const { cloudinary } = require('../utils')
const UserModel = require('../models/userModel')

const newAvatar = async (userID, stringImage) => {
	const uploadResponse = await cloudinary.uploader.upload(stringImage, {
			upload_preset: 'avatars',
	})


	const user = await UserModel.findOne({userID})
	user.avatarURL = uploadResponse.secure_url
	await user.save()



	return uploadResponse.secure_url
}

const base64_encode = file => {
		return "data:image/gif;base64,"+fs.readFileSync(file, 'base64');
}

class AvatarServices {
	async createNewAvatar(userID, username) {
		const userURL = `https://t.me/${username}`


		const getURL = body => {
			const $ = cheerio.load(body)
			const url = $('.tgme_page_photo_image').attr('src')
			return url
		}



		const createAvatar = async url => {
			if(!url) {
				await wg({path: './static', filename: `${userID}`})
				const filename = `${userID}.png`
				const image = await base64_encode(path.resolve(__dirname, '..', 'static', filename))

				const avatarURL = await newAvatar(userID, image)

				await fs.unlinkSync(path.resolve(__dirname, '..', 'static', filename))
				return avatarURL
			} else {
				const filename = `${userID}.jpg`

				request.head(url, function(err, res, body){
				    request(url).pipe(fs.createWriteStream(path.resolve(__dirname, '..', 'static', filename))).on('close', () => console.log(`Avatar ${username} saved(${userID}.jpg).`))
				})

				const image = await base64_encode(path.resolve(__dirname, '..', 'static', filename))

				const avatarURL = await newAvatar(userID, image)

				await fs.unlinkSync(path.resolve(__dirname, '..', 'static', filename))
				return avatarURL
			}
		}

		request(userURL, async (err, res, body) => {
			if(err) {
				console.log(err)
			} else {
				const url = await getURL(body)
				const avatarURL = await createAvatar(url)
				return avatarURL
			}
		})
	}

	async updateAvatar(avatar, userID) {
		try {
			const avatarURL = await newAvatar(userID, avatar)
			return avatarURL
		} catch(e) {
			console.log(e)
		}
	}
}



module.exports = new AvatarServices()
