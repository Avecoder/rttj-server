const TaskModel = require('../models/taskModel')
const UserModel = require('../models/userModel')
const ApiError = require('../exceptions/apiError')
const uniqid = require('uniqid')



class TaskServices {
  async addTask(task) {
    task.date = new Date(task.date)
    task.taskID = uniqid()
    if(task.isCompleted) {
      const user = await UserModel.findOne({userID: task.userID})
      user.hours += task.hours
      console.log(user)
      user.save()
    }
    const newTask = await TaskModel.create(task)

    return newTask
  }

  async addTodayTask(taskID, hours) {
    const task = await TaskModel.findOne({taskID})
    const user = await UserModel.findOne({userID: task.userID})

    task.hours += hours
    user.hours += hours

    await task.save()
    await user.save()

    return task
  }

  async completeTodayTask(taskID, hours) {
    const task = await TaskModel.findOne({taskID})
    const user = await UserModel.findOne({userID: task.userID})

    task.hours = hours
    user.hours += hours

    task.isCompleted = true

    await task.save()
    await user.save()

    return task
  }


  async getTaskAll(userID) {
    const tasks = await TaskModel.find({userID})

    return tasks
  }

  async getTaskByID(userID, taskID) {
    const task = await TaskModel.findOne({userID, taskID})

    return task
  }

  async getTaskByDate(userID, date) {
    date = new Date(date)
    const tasks = await TaskModel.find({userID, date})
    return tasks
  }



  async deleteTask(userID, taskID) {
    const task = await TaskModel.deleteOne({userID, taskID})

    return task
  }


  async getCompletedTasks(userID) {
    const tasks = TaskModel.find({userID, isCompleted: true})

    return tasks
  }
}


module.exports = new TaskServices()
