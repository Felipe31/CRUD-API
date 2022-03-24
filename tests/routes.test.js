'use strict'
const fetch = require('cross-fetch')
require('dotenv').config();

beforeAll(async() => {
  await new Promise(r => setTimeout(r, 1000))
})

test("home is not found", async() => {
  const response = await fetch(`http://${process.env.HOST}:${process.env.PORT}`)
  expect(response.status).toBe(404)
})
