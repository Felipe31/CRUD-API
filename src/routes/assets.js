'use strict'
const express = require('express')
const router  = express.Router()
const units   = require('../model/unit')
const assets  = require('../model/asset')
const crud    = require('../model/crud')

router.get('/', async (req, res) => {
  try {
    var allAssets = await crud.read(assets)
    const unitIds = allAssets.map(asset => asset.fkUnit)
    const uniqueIds = unitIds.filter((v, i, a) => a.indexOf(v) === i)
    var unitObjects = []

    for (var unitId of uniqueIds) {
      const unit = await crud.readById(units, unitId)
      unitObjects.push(unit)
    }

    allAssets = allAssets.map(asset => {
      const unit = unitObjects.filter(element => {
        return element._id.toString() === asset.fkUnit.toString()
      })
      return {
        ...asset._doc,
        fkUnit: unit.length > 0 ? unit[0].name : ''
      }
    })
    return res.status(200).send(allAssets)
  }
  catch (err) {
    return res.status(500).send({error: `Error on assets select! ${err}`})
  }
})

router.post('/', async (req, res) => {
  const {name, fkUnit, image, description, model, owner, status, health} = req.body;

  if (!name || !fkUnit)
    return res.status(400).send({error: 'Incorrect or missing parameters!'})

  const unit = await crud.readOne(units, {name: fkUnit})
  if (!unit)
    return res.status(406).send({error: 'Given unit does not exist!'})
  var body = {name, fkUnit, image, description, model, owner, status, health}
  body.fkUnit = unit._id

  try {
    var resBody = await crud.create(assets, {name}, body)
    return res.status(201).send({...resBody._doc, fkUnit})
  }
  catch (err) {
    if (err.message === 'Already exists')
      return res.status(406).send({error: 'Asset already exists!'})
    else
      return res.status(500).send({error: `Error on asset creation! ${err}`})
  }
})

router.put('/', async (req, res) => {
  var {oldName, name, fkUnit, image, description, model, owner, status, health} = req.body;
  var body = {name, fkUnit, image, description, model, owner, status, health}

  if (!name)
    return res.status(400).send({error: 'Incorrect or missing parameters!'})

  if (!oldName) oldName = name

  if (fkUnit) {
    const unit = await crud.readOne(units, {name: fkUnit})
    if (!unit)
      return res.status(406).send({error: 'Given unit does not exist!'})
    body.fkUnit = unit._id
  }

  try {
    var resBody = await crud.update(assets, {oldName}, body)
    return res.status(200).send({...resBody._doc, fkUnit})
  }
  catch (err) {
    return res.status(500).send({error: `Error on asset update! ${err}`})
  }
})

router.delete('/', async (req, res) => {
  const {name} = req.body;

  if (!name)
    return res.status(400).send({error: 'Incorrect or missing parameters!'})

  try {
    var resBody = await crud.remove(assets, {name})
    if (!resBody) return res.status(404).send({error: "Asset not found!"})
    const unit = await crud.readById(units, resBody.fkUnit)
    return res.status(201).send({...resBody._doc, fkUnit: unit.name})
  }
  catch (err) {
    return res.status(500).send({error: `Error on asset delete! ${err}`})
  }
})

module.exports = router;