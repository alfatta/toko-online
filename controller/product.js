const dbRepo = require('../helper/db')
const response = require('../helper/response')
const parallel = require('async/parallel')

module.exports = {
  getAll(req, res) {
    const options = {
      baseQuery: "SELECT product.*, image.image as image FROM product LEFT JOIN image ON image.id_product = product.id AND image.deleted_at IS NULL",
      groupBy: 'product.id'
    }
  
    dbRepo.getAll('product', options, (err, result) => {
      if (err) {
        res.status(err.code)
        res.send(response('ERROR', err.message))
      } else {
        res.send(response('SUCCESS', null, result))
      }
    })
  },
  getById(req, res) {
    const options = {filter: {}}
    options.filter.by = {
      key: 'id_product',
      value: req.params.id
    }

    parallel([
      // Get product by id
      function(next) {
        dbRepo.getById('product', req.params.id, (err, result) => {
          if (err) {
            next(err, null)
          } else {
            next(null, result)
          }
        })
      },
      // Get all image by id_product
      function(next) {
        dbRepo.getAll('image', options, (err, result) => {
          if (err) {
            next(err, null)
          } else {
            next(null, result)
          }
        })
      },
      // Get all spec by id_product
      function(next) {
        dbRepo.getAll('specification', options, (err, result) => {
          if (err) {
            next(err, null)
          } else {
            next(null, result)
          }
        })
      },
    ]
    , (err, result) => {
      if (err) {
        res.status(err.code)
        res.send(response('ERROR', err.message))
      } else {
        let productData = result[0]
        productData.image = result[1]
        productData.specification = result[2]

        res.send(response('SUCCESS', null, productData))
      }
    })
  },
  insert(req, res) {
    const { name, sku, price, stock, description, condition, actionLink, id_category, image, specification } = req.body
    let productData = { name, sku, price, stock, description, condition, actionLink, id_category }

    dbRepo.insert('product', productData, (err, result) => {
      if (err) {
        res.status(err.code)
        res.send(response('ERROR', err.message))
      } else {
        parallel([
          function(next) {
            let imageData = image.map(i => [i, result.insertId])
            let imageField = '(`image`, `id_product`)'
            dbRepo.insertMany('image', imageField, imageData, (err2, result2) => {
              if (err2) {
                next(err2, null)
              } else {
                next(null, result2)
              }
            })
          },
          function(next) {
            let specificationData = specification.map(i => [i.key, i.value, result.insertId])
            let specificationField = '(`key`, `value`, id_product)'
            dbRepo.insertMany('specification', specificationField, specificationData, (err2, result2) => {
              if (err2) {
                next(err2, null)
              } else {
                next(null, result2)
              }
            })
          }
        ], () => {
          dbRepo.getById('product', result.insertId, (err2, result2) => {
            if (err2) {
              res.status(err2.code)
              res.send(response('ERROR', err2.message))
            } else {
              res.send(response('SUCCESS', null, result2))
            }
          })
        }) 
      }
    })
  },
  insertImage(req, res) {
    let {image} = req.body
    let data = {image, id_product: req.params.id}
    dbRepo.insert('image', data, (err, result) => {
      if (err) {
        res.status(err.code)
        res.send(response('ERROR', err.message))
      } else {
        dbRepo.getById('image', result.insertId, (err2, result2) => {
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
  insertSpecification(req, res) {
    let {key, value} = req.body
    let data = {key, value, id_product: req.params.id}
    dbRepo.insert('specification', data, (err, result) => {
      if (err) {
        res.status(err.code)
        res.send(response('ERROR', err.message))
      } else {
        dbRepo.getById('specification', result.insertId, (err2, result2) => {
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
    const { name, sku, price, stock, description, condition, actionLink } = req.body
    let data = { name, sku, price, stock, description, condition, actionLink }
    Object.keys(data).forEach(key => data[key] === undefined && delete data[key]);

    dbRepo.update('product', data, req.params.id, (err, result) => {
      if (err) {
        res.status(err.code)
        res.send(response('ERROR', err.message))
      } else {
        dbRepo.getById('product', req.params.id, (err2, result2) => {
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
    dbRepo.delete('product', req.params.id, (err, result) => {
      if (err) {
        res.status(err.code)
        res.send(response('ERROR', err.message))
      } else {
        dbRepo.getByIdForce('product', req.params.id, (err2, result2) => {
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