const express = require('express')

const route = express.Router()

const testController = require('../controller/test')
const categoryController = require('../controller/category')
const productController = require('../controller/product')

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


module.exports = route