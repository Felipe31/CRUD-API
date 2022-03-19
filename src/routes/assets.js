const express = require('express')
const router  = express.Router()
const assets  = require('../model/asset')
const units   = require('../model/unit')
const crud    = require('../model/crud')

router.get('/', async (req, res) => {
  try {
    // const value = await crud.read(assets)
    // return res.status(200).send(value)

    var allAssets = await crud.read(assets)
    const unitIds = allAssets.map(unit => unit.fkUnit.toString())
    const uniqueIds = unitIds.filter((v, i, a) => a.indexOf(v) === i)
    unitObjects = []
    for (unitId of uniqueIds) {
      const unit = await crud.readOne(units, {'_id': unitId})
      unitObjects.push(...unit)
    }
    console.log(unitObjects)

    allAssets = allAssets.map(asset => {
      const unit = unitObjects.filter(item => {
        return item._id.toString() === asset.fkUnit.toString()
      })
      console.log(unit)
      return {...asset._doc, 'unitName': unit.length > 0 ? unit[0].name : ''}
    })
    return res.status(200).send(allAssets)
  }
  catch (err) {
    return res.status(500).send({error: `Error on assets select! ${err}`})
  }
})

router.post('/create', async (req, res) => {
  const {name, fkUnit} = req.body;

  if (!name || !fkUnit)
    return res.status(400).send({error: 'Incorrect or missing parameters!'})

  const unit = await crud.readOne(units, {'name': fkUnit})
  if (unit.length == 0)
    return res.status(406).send({error: 'Given unit does not exist!'})
  const body = req.body
  body.fkUnit = unit[0]._id

  try {
    return res.status(201).send(await crud.create(assets, {name}, body))
  }
  catch (err) {
    if (err.message === 'Already exists')
      return res.status(406).send({error: 'Name already in use!'})
    else
      return res.status(500).send({error: `Error on asset creation! ${err}`})
  }
})

router.post('/update', async (req, res) => {
  var {name, oldName, fkUnit} = req.body;

  if (!name)
    return res.status(400).send({error: 'Incorrect or missing parameters!'})

  if (!oldName) oldName = name

  const body = req.body
  if (fkUnit) {
    const unit = await crud.readOne(units, {'name': fkUnit})
    if (unit.length == 0)
      return res.status(406).send({error: 'Given unit does not exist!'})
    body.fkUnit = unit[0]._id
  }

  try {
    const keyPair = {'name': oldName}
    return res.status(200).send(await crud.update(assets, keyPair, body))
  }
  catch (err) {
    return res.status(500).send({error: `Error on asset update! ${err}`})
  }
})

router.post('/delete', async (req, res) => {
  const {name} = req.body;

  if (!name)
    return res.status(400).send({error: 'Incorrect or missing parameters!'})

  try {
    return res.status(201).send(await crud.remove(assets, {name}))
  }
  catch (err) {
    return res.status(500).send({error: `Error on asset delete! ${err}`})
  }
})

module.exports = router;