'use strict'
const express = require('express')
const router    = express.Router()
const companies = require('../model/company')
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
    return res.status(200).send(value)
  }
  catch (err) {
    return res.status(500).send({error: `Error on company select by name! ${err}`})
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
    return res.status(201).send(await crud.remove(companies, {name}))
  }
  catch (err) {
    return res.status(500).send({error: `Error on company delete! ${err}`})
  }
})

module.exports = router;