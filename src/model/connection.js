'use strict'
require('dotenv').config();
const mongoose    = require('mongoose')
const url         = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}`
const options     = {maxPoolSize: 50, useNewUrlParser: true, useUnifiedTopology: true}
const connection  = mongoose.connect(url, options)

mongoose.connection.on('error', (err) =>{
  console.log('MongoDB connection error: ' + err)
})

mongoose.connection.on('connected', () =>{
  console.log('Node.js connected to MongoDB')
})

mongoose.connection.on('disconnected', () =>{
  console.log('Node.js disconnected from MongoDB')
})

module.exports = connection