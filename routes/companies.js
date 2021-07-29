const express = require('express')
const router  = express.Router()

router.get('/', (req, res) => {
  return res.send({message: 'Get funcionando!'})
})

router.post('/', (req, res) => {
  return res.send({message: 'Post funcionando!'})
})

module.exports = router;