
module.exports = function(req, res, next) {
  if(req.method === 'OPTION') {
    next()
  }
  try {
    const {status} = req.body
    if(status !== 'ADMIN') {
      return res.status(401).json({message: 'Иди нахуй пидорас, ты не админ'})
    }
    next()
  } catch(e) {
    res.status(401).json({message: 'Иди нахуй пидорас, ты не админ'})
  }
}
