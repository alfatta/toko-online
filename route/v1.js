const express = require('express')

const route = express.Router()

const testController = require('../controller/test')

route.get('/test', testController)

module.exports = route