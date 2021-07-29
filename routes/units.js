const express = require('express')
const router  = express.Router()

router.get('/', (req, res) => {
  return res.send({message: 'Get funcionando!'})
})

router.post('/create', (req, res) => {
  return res.send({message: 'Post funcionando!'})
})

router.post('/update', (req, res) => {
  return res.send({message: 'Post funcionando!'})
})

router.post('/delete', (req, res) => {
  return res.send({message: 'Post funcionando!'})
})

module.exports = router;
