const mongoose  = require('mongoose')
const Schema    = mongoose.Schema

const UserSchema = new  Schema({
  username:   {type: String, required: true, unique: true, lowercase: true},
  name:       {type: String, required: true},
  created:    {type: Date, default: Date.now},
  fkCompany:  {type: mongoose.Schema.Types.ObjectId, ref: 'Company'}

})

module.exports = mongoose.model('User', UserSchema)