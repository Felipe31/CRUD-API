const express = require('express')
const router  = express.Router()
const users   = require('../model/user')

router.post('/', (req, res) => {
  users.find({}, (err, data) => {
    if(err) return res.status(500).send({error: 'Users DB query failure!'})
    return res.send(data)
  })
})

router.post('/create', async (req, res) => {
  const {username, name} = req.body;

  if (!username || !name) return res.status(400).send({error: 'Incorrect or missing parameters!'})

  try {
    if (await users.findOne({username})) return res.send({error: 'Username already in use!'})
    const user = users.create(req.body);
    return res.status(201).send(user);
  }
  catch (err) {
    return res.status(500).send({error: 'Error on user creation!'})
  }

})

router.post('/update', (req, res) => {
  return res.send({message: 'Post funcionando!'})
})

router.post('/delete', (req, res) => {
  return res.send({message: 'Post funcionando!'})
})
module.exports = router;