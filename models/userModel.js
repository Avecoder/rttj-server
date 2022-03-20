const { Schema, model } = require('mongoose')


const UserSchema = new Schema({
  userID: {type: Number, unique: true, required: true},
  username: {type: String, required: true},
  hours: {type: Number, required: true, default: 0},
  status: {type: String, required: true, default: 'USER'},
  substatus: {type: String, required: true, default: 'подпездник'},
  friendsList: [
    {
      friendID: {type: Number, required: true},
      isMutually: {type: Boolean, default: false, required: true},
      fromRequest: {type: Number, required: true},
    }
  ]
})


module.exports = model('User', UserSchema)
