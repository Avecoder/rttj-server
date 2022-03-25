const UserModel = require('../models/userModel')

class AdminServices {
  async bannedUser(userID) {
    const user = await UserModel.findOne({userID})

    user.status = 'BANNED'
    user.substatus = 'Забаненный'

    await user.save()
    return user
  }

  async unbannedUser(userID) {
    const user = await UserModel.findOne({userID})

    user.status = 'USER'
    user.substatus = 'Обычный чел'

    await user.save()
    return user
  }

  async changeUserStatus(userID, substatus) {
    const user = await UserModel.findOne({userID})

    user.substatus = substatus

    await user.save()
    return user
  }

  async usersList(count) {
    const users = await UserModel.find().limit(count)
    return users
  }

  async findUsersByUsername(username) {
    const users = await UserModel.find({}).limit(10)
    return users.filter(item => item.username.toLowerCase().indexOf(username.toLowerCase()) >= 0 && item.status !== 'ADMIN')
  }
}


module.exports = new AdminServices()
