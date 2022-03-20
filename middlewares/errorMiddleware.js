const ApiError = require('../exceptions/apiError') // Подключаем класс для вывода ошибок


module.exports = (err, req, res, next) => {
  console.log(err)

  // Оператор instanceof проверяет, принадлежит ли объект к определённому классу
  if(err instanceof ApiError) {
    return res.status(err.status).json({message: err.message, errors: err.errors})
  }

  // Ошибка сервера
  return res.status(500).json({message: 'Непредвиденная ошибка'})
}
