'use strict'
const mongoose  = require('mongoose')
const Schema    = mongoose.Schema

const UnitSchema = new  Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  created: {
    type: Date,
    default: Date.now
  },
  fkCompany: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Company'
  }
})

module.exports = mongoose.model('Unit', UnitSchema)