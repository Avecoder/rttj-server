const userServices = require('../services/userServices')
const avatarServices = require('../services/avatarServices')



class userController {
  async login(req, res, next) {
    try {
      const {userID, username} = req.body
      const {user, tokenData, candidate} = await userServices.login(userID, username)
      if(candidate) {
        return res.status(200).json({candidate})
      }
      const avatar = await avatarServices.createNewAvatar(userID, username)
      return res.status(200).json({user, tokenData, avatar})
    } catch(e) {
      next(e)
    }
  }

  async info(req, res, next) {
    try {
      const {userID} = req.params
      const userData = await userServices.info(userID)
      return res.status(200).json(userData)
    } catch(e) {
      next(e)
    }
  }

  async infoByUsername(req, res, next) {
    try {
      const {username} = req.params
      const userData = await userServices.infoByUsername(username)
      return res.status(200).json(userData)
    } catch(e) {
      next(e)
    }
  }

  async getToken(req, res, next) {
    try {
      const {userID} = req.body
      const token = await userServices.getToken(userID)
      return res.status(200).json(token)
    } catch(e) {
      next(e)
    }
  }

  async updateToken(req, res, next) {
    try {
      const {userID} = req.body
      const token = await userServices.updateToken(userID)
      return res.status(200).json(token)
    } catch(e) {
      next(e)
    }
  }

  async findByToken(req, res, next) {
    try {
      const {token} = req.body
      const user = await userServices.findByToken(token)
      return res.status(200).json(user)
    } catch(e) {
      next(e)
    }
  }


  async getData(req, res, next) {
    try {

      const {userID, firstDate, secondDate} = req.body

      const allData = await userServices.getData(userID, firstDate, secondDate)
      const end = new Date().getTime()

      return res.status(200).json(allData)
    } catch(e) {
      next(e)
    }
  }


  async getAllData(req, res, next) {
    try {

      const {firstDate, secondDate, userID} = req.body

      const usersID = await userServices.getUsersID(userID)

      const usersDataWeeks = []

      for(let i = 0; i < usersID.length; i++) {
        const data = await userServices.getPeriodData(firstDate, secondDate, usersID[i])

        const user = await userServices.info(usersID[i])
        await usersDataWeeks.push({userID: usersID[i], data, username: user.username, substatus: user.substatus, status: user.status, hours: user.hours})
      }


      return res.status(200).json(usersDataWeeks)
    } catch(e) {
      next(e)
    }
  }


  async requestFriend(req, res, next) {
    try {
      const {userID, friendID} = req.body

      const friendItem = await userServices.requestFriend(userID, friendID)

      return res.status(200).json(friendItem)
    } catch(e) {
      next(e)
    }
  }

  async deleteFriend(req, res, next) {
    try {
      const {userID, friendID} = req.body

      const friendItem = await userServices.deleteUser(userID, friendID)
      return res.status(200).json({message: `Пользователь ${friendItem.friend.username} больше не друг Вам`, friendItem})
    } catch(e) {
      next(e)
    }
  }

  async getUsers (req, res, next) {
    try {
      const users = await userServices.getUsers()

      return res.json(users)
    } catch(e) {
      next(e)
    }
  }

  async getFriendList (req, res, next) {
    try {
      const {userID} = req.params

      const friendsList = await userServices.getFriendList(userID)

      return res.status(200).json({friendsList})
    } catch(e) {
      next(e)
    }
  }

  async usersByID (req, res, next) {
    try {
      const {usersID} = req.body

      const usersList = await userServices.usersByID(usersID)

      return res.status(200).json({usersList})
    } catch(e) {
      next(e)
    }
  }

  async changeUserInf (req, res, next) {
    try {


      const {userID, username, avatar} = req.body


      const avatarURL = await avatarServices.updateAvatar(avatar, userID)
      const name = await userServices.updateUsername(userID, username)
      return res.status(200).json({avatarURL, name})
    } catch(e) {
      next(e)
    }
  }

}






module.exports = new userController()
