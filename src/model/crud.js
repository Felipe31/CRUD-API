
const read = async (model) =>{
  return model.find({}, (err, data) => {
    if(err) throw err
    return data
  })
}

const readOne = async (model, keyPair) =>{
  return model.find(keyPair, (err, data) => {
    if(err) throw err
    return data
  })
}

const create = async (model, keyPair, allFields) =>{
  try {
    if (await model.findOne(keyPair)) throw (new Error('Already exists'))
    return await model.create(allFields)
  }
  catch (err) {
    throw err
  }
}

const update = async (model, keyPair, allFields) =>{
  try {
    const query = model.findOneAndUpdate(keyPair, allFields, {new: true})
    return await query.exec()

  }
  catch (err) {
    throw err
  }
}

const remove = async (model, keyPair) =>{
  try {
    const query = model.findOneAndDelete(keyPair)
    return await query.exec()
  }
  catch (err) {
    throw err
  }
}

module.exports = { create, read, readOne, update, remove};