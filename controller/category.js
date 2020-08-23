const dbRepo = require('../helper/db')
const response = require('../helper/response')

module.exports = {
  getAll(req, res) {
    const options = {
      sort: {
        by: 'name',
        order: 0
      }
    }
  
    dbRepo.getAll('category', options, (err, result) => {
      if (err) {
        res.status(err.code)
        res.send(response('ERROR', err.message))
      } else {
        res.send(response('SUCCESS', null, result))
      }
    })
  },
  getProduct(req, res) {
    const options = {
      filter: {
        by: {
          key: 'id_category',
          value: parseInt(req.params.id)
        }
      }
    }

    dbRepo.getById('category', req.params.id, (err, result) => {
      if (err) {
        res.status(err.code)
        res.send(response('ERROR', err.message))
      } else {
        dbRepo.getAll('product', options, (err, result) => {
          if (err) {
            res.status(err.code)
            res.send(response('ERROR', err.message))
          } else {
            res.send(response('SUCCESS', null, result))
          }
        })
      }
    })
  },
  insert(req, res) {
    // object destructure
    const { name } = req.body

    // object literal
    const data = { name }

    dbRepo.insert('category', data, (err, result) => {
      if (err) {
        res.status(err.code)
        res.send(response('ERROR', err.message))
      } else {
        dbRepo.getById('category', result.insertId, (err2, result2) => {
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
  update(req, res) {
    const { name } = req.body
    const data = { name }

    dbRepo.update('category', data, req.params.id, (err, result) => {
      if (err) {
        res.status(err.code)
        res.send(response('ERROR', err.message))
      } else {
        dbRepo.getById('category', req.params.id, (err2, result2) => {
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
    dbRepo.delete('category', req.params.id, (err, result) => {
      if (err) {
        res.status(err.code)
        res.send(response('ERROR', err.message))
      } else {
        dbRepo.getByIdForce('category', req.params.id, (err2, result2) => {
          if (err2) {
            res.status(err2.code)
            res.send(response('ERROR', err2.message))
          } else {
            res.send(response('SUCCESS', null, result2))
          }
        })
      }
    })
  }
}