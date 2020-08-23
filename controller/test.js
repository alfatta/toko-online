const response = require('../helper/response')

module.exports = (req, res) => {
  res.send(response('SUCCESS', null, { success : true }))
}