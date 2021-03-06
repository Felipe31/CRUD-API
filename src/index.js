'use strict'
require('dotenv').config();
require('./model/connection')
const express = require('express')
const routes  = require('./routes')
const app     = express()


app.use(express.urlencoded({ extended: false}))
app.use(express.json())

app.use(routes)

app.listen(process.env.PORT)

module.exports = app