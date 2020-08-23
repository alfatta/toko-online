const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mysql = require('mysql')

const config = require('./config')

const app = express()

const db = mysql.createConnection(config.db.mysql)

db.connect((err) => {
  if (err) throw err
  console.log('DB Connected');
})

global.db = db

app.use(cors())
app.use(bodyParser.json())

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);

  if (Object.keys(req.body).length) {
    console.log(`BODY: ${JSON.stringify(req.body)}`);
  }
  
  next()
})

const routeV1 = require('./route/v1')
const route404 = require('./controller/404')

app.use('/v1', routeV1)

app.use(route404)

app.listen(config.app.port, () => {
  console.log(`App started on port : ${config.app.port}`);
})