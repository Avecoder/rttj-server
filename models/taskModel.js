const { Schema, model } = require('mongoose')


const TaskSchema = new Schema({
  label: {type: String, required: true},
  primordialHours: {type: Number, required: true, default: 0},
  hours: {type: Number, required: true, default: 0},
  date: {type: Date, required: true},
  isCompleted: {type: Boolean, default: false, required: true},
  userID: {type: Number, required: true},
  taskID: {type: String, required: true}
})



module.exports = model('Task', TaskSchema)
