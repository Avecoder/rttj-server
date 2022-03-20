const { Schema, model } = require('mongoose')


const TokenSchema = new Schema({
	user: {type: Schema.Types.ObjectId, ref: 'User'},
	token: {type: String, required: true, unique: true},
})

module.exports =  model('Token', TokenSchema)
