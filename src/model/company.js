'use strict'
const mongoose  = require('mongoose')
const Schema    = mongoose.Schema

const CompanySchema = new  Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  created: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Company', CompanySchema)