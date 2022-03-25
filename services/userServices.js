const jwt = require('jsonwebtoken')

require('dotenv').config()

const UserModel = require('../models/userModel')
const TaskModel = require('../models/taskModel')
const TokenModel = require('../models/tokenModel')
const ApiError = require('../exceptions/apiError')


class UserServices {
  async login(userID, username) {
    const candidate = await UserModel.findOne({userID})

    const payload = {
      userID,
      username
    }

    const token = jwt.sign(payload, process.env.TOKEN_KEY)

    if(candidate) {
      throw ApiError.BadRequest(`Пользователь с id ${userID} уже есть`)
    }

    const user = await UserModel.create({userID, username})

    const tokenData = await TokenModel.create({user: user._id, token})


    return {
      user,
      tokenData
    }
  }


  async info(userID) {
    return UserModel.findOne({userID})
  }

  async infoByUsername(username) {
    const users = await UserModel.find({}).limit(10)
    return users.filter(item => item.username.toLowerCase().indexOf(username) >= 0)
  }

  async getToken(userID) {
    const user = await UserModel.findOne({userID})
    const token = await TokenModel.findOne({user: user._id})
    return token
  }

  async findByToken(token) {
    const tokenData = await TokenModel.findOne({token})
    if(tokenData === null) {
      throw ApiError.UnauthorizedError(`Токена ${token} не существует`)
    }
    const userData = jwt.verify(tokenData.token, process.env.TOKEN_KEY)

    const user = await UserModel.findOne({userID: userData.userID})
    return user
  }

  async getData(userID, firstDate, secondDate) {
    const allData = []

    let start = new Date(firstDate)
    let end = new Date(secondDate)
    let dataItem

    const pad = (s) => ('00' + s).slice(-2)

    
    

    while(start.getTime() < end.getTime()) {
      start.setTime( start.getTime()+ 1000 * 60 * 60 * 24);
      dataItem = await TaskModel.find({userID, date: new Date(`${start.getFullYear()}-${pad(start.getMonth()+1)}-${pad(start.getDate())}`), isCompleted: true})
      if(dataItem.length === 0) allData.push({date: new Date(`${start.getFullYear()}-${pad(start.getMonth()+1)}-${pad(start.getDate())}`), hours: 0})
      else allData.push(...dataItem)
    }



    const dataItems = allData.map(item => {
      return {
        label: item.label,
        hours: item.hours,
        taskID: item.taskID,
        date: item.date
      }
    })

    return dataItems
  }

  async getPeriodData(firstDate, secondDate, userID) {
    let start = new Date(firstDate)
    let end = new Date(secondDate)

    const allData = []

    const pad = (s) => ('00' + s).slice(-2)

    while(start.getTime() < end.getTime()){
      const weekData = []
      for (let i = 0; i < 7; i++) {
        const taskItem = await TaskModel.find({userID, date: new Date(`${end.getFullYear()}-${pad(end.getMonth()+1)}-${pad(end.getDate())}`), isCompleted: true})
        const dataItem = taskItem.map(item => item.hours)
        weekData.push(...dataItem)
        end.setDate( end.getDate()-1)
      }


      if(weekData.length !== 0) allData.push(weekData.reduce((prev, curr) => prev + curr))
      else allData.push(0)
    }

    return allData
  }

  async getUsersID(userID) {
    const user = await UserModel.findOne({userID})

    const usersID = user.friendsList.filter(item => item.isMutually === true).map(item => item.friendID)

    usersID.push(userID)

    return usersID
  }

  async requestFriend(userID, friendID) {
    const user = await UserModel.findOne({userID})
    const friend = await UserModel.findOne({userID: friendID})

    const userFriend = user.friendsList.find(item => item.friendID === friendID)


    if(userFriend === undefined) {
      await user.friendsList.push({friendID, fromRequest: userID})
      await friend.friendsList.push({friendID: userID, fromRequest: userID})

      user.save()
      friend.save()

      return {user, friend}
    }

    if(userFriend.isMutually) {
      throw ApiError.BadRequest(`Пользователь с id ${friendID} уже в друзьях`)
    }

    if(!userFriend.isMutually) {
      user.friendsList.find(item => item.friendID === friendID).isMutually = true
      friend.friendsList.find(item => item.friendID === userID).isMutually = true

      await user.save()
      await friend.save()

      return {user, friend}
    }
  }

  async deleteUser(userID, friendID) {
    const user = await UserModel.findOne({userID})
    const friend = await UserModel.findOne({userID: friendID})

    user.friendsList = user.friendsList.filter(item => item.friendID !== friendID)
    friend.friendsList = friend.friendsList.filter(item => item.friendID !== userID)

    await user.save()
    await friend.save()

    return {user, friend}
  }

  async getFriendList(userID) {
    const user = await UserModel.findOne({userID})

    return user.friendsList.filter(item => item.isMutually)
  }

  async usersByID(usersID) {
    const users = []

    for(let userID of usersID) {
      const user = await UserModel.findOne({userID})
      users.push(user)
    }

    return users
  }

  async updateUsername(userID, username) {
    try {
      const user = await UserModel.findOne({userID})
      user.username = username 
      await user.save()
      return username
    } catch(e) {
      console.log(e)
    }
  }

}


module.exports = new UserServices()
