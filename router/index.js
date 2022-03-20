const {Router} = require('express')
const userController = require('../controllers/userController')
const taskController = require('../controllers/taskController')
const adminController = require('../controllers/adminController')
const {body} = require('express-validator')

const adminMiddleware = require('../middlewares/adminMiddleware')

const router = new Router()

router.post('/login', userController.login) //+++++++++++++++++++++++++++++ 
router.get('/info/:userID', userController.info) //+++++++++++++++++++++++++++++
router.get('/info-by-username/:username', userController.infoByUsername) //+++++++++++++++++++++++++++++
router.post('/data', userController.getData) //+++++++++++++++++++++++++++++
router.post('/data-all', userController.getAllData) //+++++++++++++++++++++++++++++
router.post('/request-friend', userController.requestFriend) //+++++++++++++++++++++++++++++
router.post('/delete-friend', userController.deleteFriend) //+++++++++++++++++++++++++++++
router.get('/friend-list/:userID', userController.getFriendList) //+++++++++++++++++++++++++++++
router.post('/users-by-id', userController.usersByID)
router.post('/get-token', userController.getToken) //+++++++++++++++++++++++++++++
router.post('/find-by-token', userController.findByToken) //+++++++++++++++++++++++++++++
router.post('/change-user-inf', userController.changeUserInf) //+++++++++++++++++++++++++++++

router.post('/add-task', body('label').isLength({min: 3, max: 64}), taskController.addTask) //+++++++++++++++++++++++++++++
router.post('/add-today-task', taskController.addTodayTask) //+++++++++++++++++++++++++++++
router.post('/complete-today-task', taskController.completeTodayTask) //+++++++++++++++++++++++++++++
router.get('/get-task-all/:userID', taskController.getTaskAll) //+++++++++++++++++++++++++++++
router.get('/get-task-id/:userID/:taskID', taskController.getTaskByID) //+++++++++++++++++++++++++++++
router.get('/get-task-date/:userID/:date', taskController.getTaskByDate) //+++++++++++++++++++++++++++++
router.post('/delete-task', taskController.deleteTask) //+++++++++++++++++++++++++++++
router.get('/get-completed-tasks/:userID', taskController.getCompletedTasks) //+++++++++++++++++++++++++++++
router.post('/get-task-during-period', taskController.getTaskDuringThePeriod) //+++++++++++++++++++++++++++++


router.post('/banned', adminMiddleware, adminController.bannedUser)  //+++++++++++++++++++++++++++++
router.post('/unbanned', adminMiddleware, adminController.unbannedUser)  //+++++++++++++++++++++++++++++
router.post('/change-user-status', adminMiddleware, adminController.changeUserStatus)  //+++++++++++++++++++++++++++++
router.post('/users-list', adminMiddleware, adminController.usersList) //+++++++++++++++++++++++++++++
router.post('/find-users-username', adminMiddleware, adminController.findUsersByUsername) //+++++++++++++++++++++++++++++


module.exports = router


// Админ - Бан пользователей, корректировка данных пользователя
// Пользователь - просмотр данных, добавление заданий, добавление друзей
