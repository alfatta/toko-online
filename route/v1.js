const express = require('express')

const route = express.Router()

const testController = require('../controller/test')
const categoryController = require('../controller/category')

route.get('/test', testController)

route.get('/category', categoryController.getAll)
route.post('/category', categoryController.insert)
route.patch('/category/:id', categoryController.update)
route.delete('/category/:id', categoryController.delete)

module.exports = route