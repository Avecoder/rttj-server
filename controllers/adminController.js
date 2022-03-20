const adminServices = require('../services/adminServices')



class adminController {
  async bannedUser(req, res, next) {
    try {
      const {userID} = req.body

      const user = await adminServices.bannedUser(userID)

      return res.status(200).json({message: `Пользователь с именем ${user.username} и id ${user.userID} забанен`})
    } catch(e) {
      next(e)
    }
  }

  async unbannedUser(req, res, next) {
    try {
      const {userID} = req.body

      const user = await adminServices.unbannedUser(userID)

      return res.status(200).json({message: `Пользователь с именем ${user.username} и id ${user.userID} разбанен`})
    } catch(e) {
      next(e)
    }
  }

  async changeUserStatus(req, res, next) {
    try {
      const {userID, substatus} = req.body

      const user = await adminServices.changeUserStatus(userID, substatus)

      return res.status(200).json({message: `У пользователя с именем ${user.username} и id ${user.userID} теперь статус '${user.substatus}'`})
    } catch(e) {
      next(e)
    }
  }

  async usersList(req, res, next) {
    try {
      const {count = 100} = req.body

      console.log(count)
      const users = await adminServices.usersList(count)

      return res.status(200).json({count, users})
    } catch(e) {
      next(e)
    }
  }

  async findUsersByUsername(req, res, next) {
    try {
      const {username} = req.body

      const users = await adminServices.findUsersByUsername(username)

      return res.status(200).json(users)
    } catch(e) {
      next(e)
    }
  }


}



module.exports = new adminController()
