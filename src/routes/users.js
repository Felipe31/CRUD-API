const express   = require('express')
const router    = express.Router()
const users     = require('../model/user')
const companies = require('../model/company')
const crud      = require('../model/crud')

router.get('/', async (req, res) => {
  try {
    var allUsers = await crud.read(users)
    const companyIds = allUsers.map(company => company.fkCompany.toString())
    const uniqueIds = companyIds.filter((v, i, a) => a.indexOf(v) === i)
    companyObjects = []
    for (companyId of uniqueIds) {
      const company = await crud.readOne(companies, {'_id': companyId})
      companyObjects.push(...company)
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

  const company = await crud.readOne(companies, {'name': fkCompany})
  if (company.length == 0)
    return res.status(406).send({error: 'Given company does not exist!'})
  const body = req.body
  body.fkCompany = company[0]._id

  try {
    return res.status(201).send(await crud.create(users, {username}, body))
  }
  catch (err) {
    if (err.message === 'Already exists')
      return res.status(406).send({error: 'Username already in use!'})
    else
      return res.status(500).send({error: `Error on user creation! ${err}`})
  }
})

router.post('/update', async (req, res) => {
  const {username, name, fkCompany} = req.body;

  if (!username || !name)
    return res.status(400).send({error: 'Incorrect or missing parameters!'})

  const body = req.body
  if (fkCompany) {
    const company = await crud.readOne(companies, {'name': fkCompany})
    if (company.length == 0)
      return res.status(406).send({error: 'Given company does not exist!'})
    body.fkCompany = company[0]._id
  }

  try {
    return res.status(200).send(await crud.update(users, {username}, body))
  }
  catch (err) {
    return res.status(500).send({error: `Error on user update! ${err}`})
  }
})

router.post('/delete', async (req, res) => {
  const {username} = req.body;

  if (!username)
    return res.status(400).send({error: 'Incorrect or missing parameters!'})

  try {
    return res.status(201).send(await crud.remove(users, {username}))
  }
  catch (err) {
    return res.status(500).send({error: `Error on user delete! ${err}`})
  }
})

module.exports = router;