const mongoose  = require('mongoose')
const Schema    = mongoose.Schema

const AssetSchema = new  Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  image: {
    // data: Buffer,
    // contentType: String
    type: String
  },
  description: {
    type: String
  },
  model: {
    type: String
  },
  owner: {
    type: String
  },
  status: {
    type: String,
    enum: {
      values: ['Running', 'Alerting', 'Stopped'],
      message: '{VALUE} is not supported'
    }
  },
  health: {
    type: Number,
    min: [0, 'Health must be a number between 0 and 100'],
    max: [100, 'Health must be a number between 0 and 100'],
  },
  created: {
    type: Date,
    default: Date.now
  },
  fkUnit: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Unit'
  }
})

module.exports = mongoose.model('Asset', AssetSchema)