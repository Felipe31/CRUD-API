const fetch = require('cross-fetch')
require('dotenv').config();

test("home", async() => {
  const response = await fetch(`http://${process.env.HOST}:${process.env.PORT}`)
  expect(response.status).toBe(404)
})