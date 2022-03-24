'use strict'
const express = require('express')
const router    = express.Router()
const companies = require('../model/company')
const units     = require('../model/unit')
const assets    = require('../model/asset')
const crud      = require('../model/crud')

router.get('/', async (req, res) => {
  try {
      const value = await crud.read(companies)
      return res.status(200).send(value)
  }
  catch (err) {
    return res.status(500).send({error: `Error on companies select! ${err}`})
  }
})

router.get('/:name', async (req, res) => {
  try {
    const value = await crud.readOne(companies, {name: req.params.name})
    if (!value) return res.status(404).send({error: 'Not found!'})
    return res.status(200).send(value)
  }
  catch (err) {
    return res.status(500).send({error: `Error on company select by name! ${err}`})
  }
})

router.get('/:name/assets', async (req, res) => {
  try {
    const company = await crud.readOne(companies, {name: req.params.name})

    var allUnits = await crud.read(units)
    allUnits = allUnits.filter(unit => {
      return company._id.equals(unit.fkCompany)
    })
    
    var allAssets = await crud.read(assets)
    allAssets = allAssets.filter(asset => {
      for (const unit of allUnits) {
        if (unit._id.equals(asset.fkUnit)) {

          if(!unit.assets) unit.assets = []
          unit.assets.push(asset)
          return true
        }
      }
      return false
    })

    allUnits = allUnits.map(unit => {
      unit.assets = unit.assets.map(asset => {
        return {name: asset.name, image: asset.image, description: asset.description,
                model: asset.model, owner: asset.owner, status: asset.status, health: asset.health}
      })
      return {name: unit.name, assets: unit.assets}
    })

    console.log(company)
    console.log(JSON.stringify(allUnits))
    console.log(allAssets)

    var response = {...company._doc, units: allUnits}
    return res.status(200).send(response)
  }
  catch (err) {
    return res.status(500).send({error: `Error on company assets select by name! ${err}`})
  }
})

router.post('/', async (req, res) => {
  const {name} = req.body;

  if (!name) return res.status(400).send({error: 'Incorrect or missing parameters!'})

  try {
    return res.status(201).send(await crud.create(companies, {name}, req.body))
  }
  catch (err) {
    if (err.message === 'Already exists')
      return res.status(406).send({error: 'Company already exists!'})
    else
      return res.status(500).send({error: `Error on company creation! ${err}`})
  }
})

router.put('/', async (req, res) => {
  const {oldName, name} = req.body;

  if (!oldName || !name) return res.status(400).send({error: 'Incorrect or missing parameters!'})

  try {
    return res.status(200).send(await crud.update(companies, oldName, req.body))
  }
  catch (err) {
    return res.status(500).send({error: `Error on company update! ${err}`})
  }
})

router.delete('/', async (req, res) => {
  const {name} = req.body;

  if (!name) return res.status(400).send({error: 'Incorrect or missing parameters!'})

  try {
    var resBody = await crud.remove(companies, {name})
    if (!resBody) return res.status(404).send({error: "Company not found!"})
    return res.status(201).send(resBody._doc)
  }
  catch (err) {
    return res.status(500).send({error: `Error on company delete! ${err}`})
  }
})

module.exports = router;