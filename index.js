require('dotenv').config() // Импортируем переменную окружения
require('colors')

const express = require('express') // Импортируем express
const cors = require('cors') // Импортируем cors (Для работы с запросами в браузере)
const cookieParser = require('cookie-parser') // Импортируем cookie-parser
const mongoose = require('mongoose') // Импортируем mongoose
const path = require('path')
const fileUpload = require('express-fileupload')
const router = require('./router')


const PORT = process.env.PORT || 5000 // Используем 5000 порт


const app = express()  // Создаем экземпляр приложения

app.use(cors()) // Подключаем middleware cors()
app.use(cookieParser()) // Подключаем middleware cookieParser()
app.use(express.static(path.resolve(__dirname, 'static'))) 
app.use(fileUpload({}))
app.use(express.json()) // Подключаем middleware express.json()

app.use('/api', router)

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true, useUnifiedTopology: true
    })
    await app.listen(PORT, () => console.log(`Server has been started on port ${PORT}`.cyan))
  } catch (e) {
    console.log('Серверу пизда'.red, e)
  }
}

start()
