'use strict'
const express         = require('express')
const router          = express.Router()
const assetsRoute     = require('./assets')
const companiesRoute  = require('./companies')
const unitsRoute      = require('./units')
const usersRoute      = require('./users')

router.use('/assets',    assetsRoute)
router.use('/companies', companiesRoute)
router.use('/units',     unitsRoute)
router.use('/users',     usersRoute)

router.use((req, res) => {
  return res.status(404).send({ error: 'Not found!' })
});

module.exports = router;