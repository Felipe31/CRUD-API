'use strict'
const express   = require('express')
const router    = express.Router()
const units     = require('../model/unit')
const companies = require('../model/company')
const crud      = require('../model/crud')

router.get('/', async (req, res) => {
  try {
    var allUnits = await crud.read(units)
    const companyIds = allUnits.map(company => company.fkCompany.toString())
    const uniqueIds = companyIds.filter((v, i, a) => a.indexOf(v) === i)
    var companyObjects = []
    for (companyId of uniqueIds) {
      const company = await crud.readOne(companies, {'_id': companyId})
      companyObjects.push(...company)
    }

    allUnits = allUnits.map(unit => {
      const company = companyObjects.filter(comp => {
        return comp._id.toString() === unit.fkCompany.toString()
      })
      return {
        ...unit._doc,
        'companyName': company.length > 0 ? company[0].name : ''
      }
    })
    return res.status(200).send(allUnits)
  }
  catch (err) {
    return res.status(500).send({error: `Error on units select! ${err}`})
  }
})

router.post('/create', async (req, res) => {
  const {name, fkCompany} = req.body;

  if (!name || !fkCompany)
    return res.status(400).send({error: 'Incorrect or missing parameters!'})

  const company = await crud.readOne(companies, {'name': fkCompany})
  if (company.length == 0)
    return res.status(406).send({error: 'Given company does not exist!'})
  const body = req.body
  body.fkCompany = company[0]._id

  try {
    var resBody = await crud.create(units, {name}, body)
    return res.status(201).send({name: resBody.name, fkCompany})
  }
  catch (err) {
    if (err.message === 'Already exists')
      return res.status(406).send({error: 'Unit already exists!'})
    else
      return res.status(500).send({error: `Error on unit creation! ${err}`})
  }
})

router.patch('/update', async (req, res) => {
  var {oldName, name, fkCompany} = req.body;

  if (!name)
    return res.status(400).send({error: 'Incorrect or missing parameters!'})

  if (!oldName) oldName = name

  const body = req.body
  if (fkCompany) {
    const company = await crud.readOne(companies, {'name': fkCompany})
    if (company.length == 0)
      return res.status(406).send({error: 'Given company does not exist!'})
    body.fkCompany = company[0]._id
  }

  try {
    var resBody = await crud.update(units, oldName, body)
    return res.status(200).send({name: resBody.name, fkCompany})
  }
  catch (err) {
    return res.status(500).send({error: `Error on unit update! ${err}`})
  }
})

router.delete('/delete', async (req, res) => {
  const {name} = req.body;

  if (!name)
    return res.status(400).send({error: 'Incorrect or missing parameters!'})

  try {
    var resBody = await crud.remove(units, {name})
    const company = await crud.readOne(companies, {_id: resBody.fkCompany})
    return res.status(201).send({name: resBody.name, fkCompany: company.name})
  }
  catch (err) {
    return res.status(500).send({error: `Error on unit delete! ${err}`})
  }
})

module.exports = router;