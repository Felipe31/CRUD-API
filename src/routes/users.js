'use strict'
const express   = require('express')
const router    = express.Router()
const users     = require('../model/user')
const companies = require('../model/company')
const crud      = require('../model/crud')

router.get('/', async (req, res) => {
  try {
    var allUsers = await crud.read(users)
    const companyIds = allUsers.map(company => company.fkCompany)
    const uniqueIds = companyIds.filter((v, i, a) => a.indexOf(v) === i)
    var companyObjects = []

    for (var companyId of uniqueIds) {
      const company = await crud.readById(companies, companyId)
      companyObjects.push(company)
    }

    allUsers = allUsers.map(user => {
      const company = companyObjects.filter(comp => {
        return comp._id.toString() === user.fkCompany.toString()
      })
      return {
        ...user._doc,
        'companyName': company.length > 0 ? company[0].name : ''
      }
    })
    return res.status(200).send(allUsers)
  }
  catch (err) {
    return res.status(500).send({error: `Error on users select! ${err}`})
  }
})

router.post('/create', async (req, res) => {
  const {username, name, fkCompany} = req.body;

  if (!username || !name || !fkCompany)
    return res.status(400).send({error: 'Incorrect or missing parameters!'})

  const company = await crud.readOne(companies, {name: fkCompany})
  if (!company)
    return res.status(406).send({error: 'Given company does not exist!'})
  const body = req.body
  body.fkCompany = company._id

  try {
    var resBody = (await crud.create(users, {username}, body))._doc
    resBody.fkCompany = fkCompany
    return res.status(201).send(resBody)
  }
  catch (err) {
    if (err.message === 'Already exists')
      return res.status(406).send({error: 'Username already in use!'})
    else
      return res.status(500).send({error: `Error on user creation! ${err}`})
  }
})

router.patch('/update', async (req, res) => {
  var {oldUsername, username, name, fkCompany} = req.body;
  var body = {username, name, fkCompany}

  if (!username || !name)
    return res.status(400).send({error: 'Incorrect or missing parameters!'})

  if (!oldUsername) oldUsername = username

  if (fkCompany) {
    const company = await crud.readOne(companies, {name: fkCompany})
    if (!company)
      return res.status(406).send({error: 'Given company does not exist!'})
    body.fkCompany = company._id
  }

  try {
    var resBody = (await crud.update(users, {oldUsername}, body))._doc
    resBody.fkCompany = fkCompany
    return res.status(200).send(resBody)
  }
  catch (err) {
    return res.status(500).send({error: `Error on user update! ${err}`})
  }
})

router.delete('/delete', async (req, res) => {
  const {username} = req.body;

  if (!username)
    return res.status(400).send({error: 'Incorrect or missing parameters!'})

  try {
    var resBody = (await crud.remove(users, {username}))._doc
    const company = await crud.readById(companies, resBody.fkCompany)
    resBody.fkCompany = company.name
    return res.status(201).send(resBody)
  }
  catch (err) {
    return res.status(500).send({error: `Error on user delete! ${err}`})
  }
})

module.exports = router;