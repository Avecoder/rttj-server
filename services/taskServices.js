const TaskModel = require('../models/taskModel')
const ApiError = require('../exceptions/apiError')
const uniqid = require('uniqid')



class TaskServices {
  async addTask(task) {
    task.date = new Date(task.date)
    task.taskID = uniqid()
    const newTask = await TaskModel.create(task)

    return newTask
  }

  async addTodayTask(taskID, hours) {
    const task = await TaskModel.findOne({taskID})

    task.hours += hours

    task.save()

    return task
  }

  async completeTodayTask(taskID, hours) {
    const task = await TaskModel.findOne({taskID})

    task.hours = hours

    task.isCompleted = true

    task.save()

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
