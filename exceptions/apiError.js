module.exports = class ApiError extends Error {
  status
  errors

  constructor(status, message, errors = []) {
    super(message)
    this.status = status
    this.errors = errors
  }

  // static - функция, к которой можно обратиться без создания экземпляра класса

  // Ошибка авторизации
  static UnauthorizedError() {
    return new ApiError(401, 'Пользователь не авторизован')
  }

  // Ошибка валидации
  static BadRequest(message, errors = []) {
    return new ApiError(400, message, errors)
  }
}
