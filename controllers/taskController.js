const taskServices = require('../services/taskServices')
const {validationResult} = require('express-validator')
const ApiError = require('../exceptions/apiError')


class taskController{
  async addTask (req, res, next) {
    try {
      const errors = validationResult(req)

      if(!errors.isEmpty()) {
        return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
      }

      const task = req.body

      const newTask = await taskServices.addTask(task)

      return res.status(200).json({message: 'Задание добавлено', newTask})
    } catch(e) {
      next(e)
    }
  }

  async addTodayTask (req, res, next) {
    try {
      const {taskID, hours} = req.body

      const newTask = await taskServices.addTodayTask(taskID, hours)

      return res.status(200).json({message: 'Задание изменено', newTask})
    } catch(e) {
      next(e)
    }
  }

  async completeTodayTask(req, res, next) {
    try {
      const {taskID, hours} = req.body

      const newTask = await taskServices.completeTodayTask(taskID, hours)

      return res.status(200).json({message: 'Задание изменено', newTask})
    } catch(e) {
      console.log(e)
    }
  }


  async getTaskAll(req, res, next) {
    try {
      const {userID} = req.params

      const taskItems = await taskServices.getTaskAll(userID)

      return res.status(200).json(taskItems)
    } catch(e) {
      next(e)
    }
  }

  async getTaskByID(req, res, next) {
    try {
      const {taskID, userID} = req.params

      const taskItems = await taskServices.getTaskByID(userID, taskID)

      return res.status(200).json(taskItems)
    } catch(e) {
      next(e)
    }
  }

  async getTaskByDate(req, res, next) {
    try {
      const {date, userID} = req.params

      const taskItems = await taskServices.getTaskByDate(userID, date)

      return res.status(200).json(taskItems)
    } catch(e) {
      next(e)
    }
  }

  async deleteTask(req, res, next) {
    try {
      const {userID, taskID} = req.body

      const taskItem = await taskServices.deleteTask(userID, taskID)

      return res.status(200).json({message: 'Task deleted successfull', taskItem})
    } catch(e) {
      next(e)
    }
  }


  async getCompletedTasks(req, res, next) {
    try {
      const {userID} = req.params

      const taskItems = await taskServices.getCompletedTasks(userID)

      return res.status(200).json({taskItems})

    } catch(e) {
      next(e)
    }
  }

  async getTaskDuringThePeriod(req, res, next) {
    try {
      const {firstDate, secondDate, userID} = req.body

      const allTasks = []

      let start = new Date(firstDate)
      let end = new Date(secondDate)
      let taskItem

      const pad = (s) => ('00' + s).slice(-2)

      while(start.getTime() < end.getTime()) {
        taskItem = await taskServices.getTaskByDate(userID, `${start.getFullYear()}-${pad(start.getMonth()+1)}-${pad(start.getDate())}`)
        allTasks.push(...taskItem)
        start.setDate( start.getDate()+1);
      }


      return res.status(200).json(allTasks)
    } catch(e) {
      next(e)
    }
  }


}



module.exports = new taskController()
