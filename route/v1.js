const express = require('express')

const route = express.Router()

const testController = require('../controller/test')
const categoryController = require('../controller/category')
const productController = require('../controller/product')
const imageController = require('../controller/image')
const specificationController = require('../controller/specification')

route.get('/test', testController)

route.get('/category', categoryController.getAll)
route.post('/category', categoryController.insert)
route.patch('/category/:id', categoryController.update)
route.delete('/category/:id', categoryController.delete)
route.get('/category/:id/product', categoryController.getProduct)


route.get('/product', productController.getAll)
route.get('/product/:id', productController.getById)
route.post('/product', productController.insert)
route.post('/product/:id/image', productController.insertImage)
route.post('/product/:id/specification', productController.insertSpecification)
route.patch('/product/:id', productController.update)
route.delete('/product/:id', productController.delete)


route.patch('/image/:id', imageController.update)
route.delete('/image/:id', imageController.delete)


route.patch('/specification/:id', specificationController.update)
route.delete('/specification/:id', specificationController.delete)

module.exports = route