const express   = require('express')
const router    = express.Router()
const units     = require('../model/unit')
const companies = require('../model/company')
const crud      = require('../model/crud')

router.get('/', async (req, res) => {
  try {
    const value = await crud.read(units)
    console.log(value)
    return res.status(200).send(value)
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
    return res.status(201).send(await crud.create(units, {name}, body))
  }
  catch (err) {
    if (err.message === 'Already exists')
      return res.status(406).send({error: 'Unit already exists!'})
    else
      return res.status(500).send({error: `Error on unit creation! ${err}`})
  }
})

router.post('/update', async (req, res) => {
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
    return res.status(200).send(await crud.update(units, oldName, body))
  }
  catch (err) {
    return res.status(500).send({error: `Error on unit update! ${err}`})
  }
})

router.post('/delete', async (req, res) => {
  const {name} = req.body;

  if (!name)
    return res.status(400).send({error: 'Incorrect or missing parameters!'})

  try {
    return res.status(201).send(await crud.remove(units, {name}))
  }
  catch (err) {
    return res.status(500).send({error: `Error on unit delete! ${err}`})
  }
})

module.exports = router;