const fs = require('fs')
const path = require('path')

const axios = require('axios')
const cheerio = require('cheerio')

const { cloudinary } = require('../utils')
const UserModel = require('../models/userModel')
const base64url = require('base64-url')

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
			if(!url) url = 'https://res.cloudinary.com/rttj/image/upload/v1648748709/avatars/default_gmufdk.jpg'
			
			let image = await axios.get(url, {responseType: 'arraybuffer'})
			let raw = Buffer.from(image.data).toString('base64')

			const avatarURL = await newAvatar(userID, `data:${image.headers["content-type"]};base64,${raw}`)

			return avatarURL
				
		}

		const res = await axios.get(userURL)
		const url = await getURL(res.data)
		const avatarURL = await createAvatar(url)
		return avatarURL
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
