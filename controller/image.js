const dbRepo = require('../helper/db')
const response = require('../helper/response')
const parallel = require('async/parallel')

module.exports = {
  update(req, res) {
    const { image } = req.body
    let data = { image }
    Object.keys(data).forEach(key => data[key] === undefined && delete data[key]);

    dbRepo.update('image', data, req.params.id, (err, result) => {
      if (err) {
        res.status(err.code)
        res.send(response('ERROR', err.message))
      } else {
        dbRepo.getById('image', req.params.id, (err2, result2) => {
          if (err2) {
            res.status(err2.code)
            res.send(response('ERROR', err2.message))
          } else {
            res.send(response('SUCCESS', null, result2))
          }
        })
      }
    })
  },
  delete(req, res) {
    dbRepo.delete('image', req.params.id, (err, result) => {
      if (err) {
        res.status(err.code)
        res.send(response('ERROR', err.message))
      } else {
        dbRepo.getByIdForce('image', req.params.id, (err2, result2) => {
          if (err2) {
            res.status(err2.code)
            res.send(response('ERROR', err2.message))
          } else {
            res.send(response('SUCCESS', null, result2))
          }
        })
      }
    })
  },
}