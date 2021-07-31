require('./model/connection')
const express = require('express')
const routes  = require('./routes')
const app     = express()
const cors    = require('cors');

app.use(cors());
app.options('*', cors());

app.use(express.urlencoded({ extended: false}))
app.use(express.json())

app.use(routes)

app.listen(3030)

module.exports = app