const { Schema, model } = require('mongoose')

const SchemaTypes = mongoose.Schema.Types
const UserSchema = new Schema({
  userID: {type: Number, unique: true, required: true},
  username: {type: String, required: true},
  hours: {type: SchemaTypes.Double, required: true, default: 0},
  status: {type: String, required: true, default: 'USER'},
  substatus: {type: String, required: true, default: 'Обычный чел'},
  avatarURL: {type: String, required: true, default: ' '},
  friendsList: [
    {
      friendID: {type: Number, required: true},
      isMutually: {type: Boolean, default: false, required: true},
      fromRequest: {type: Number, required: true},
    }
  ]
})


module.exports = model('User', UserSchema)
