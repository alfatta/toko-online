const response = require('../helper/response')

module.exports = (req, res) => {
  res.status(404)
  res.send(response('ERROR', '404 Not Found'))
}