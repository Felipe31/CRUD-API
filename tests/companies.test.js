'use strict'
const fetch = require('cross-fetch');
require('dotenv').config();
const companies = require("../src/model/company")
const {insert, update, get, remove} = require("./crud.helper")


var MODULE = "companies"
var PRIMARY_NAME = "Company 1"
var SECONDARY_NAME = "Company 2"

beforeAll(async() => {
  await new Promise(r => setTimeout(r, 1000))
  companies.deleteMany({})
})

test("Company: insert", async() => {
  var body = {name: PRIMARY_NAME}
  await insert(MODULE, body)
})

test("Company: update", async() => {
  var body = {oldName: PRIMARY_NAME, name: 'Company 2'}
  var company = {name: "Company 2"}
  await update(MODULE, body, company)
})

test("Company: get", async() => {
  await get(MODULE, [{name: SECONDARY_NAME}])
})

test("Company: delete", async() => {
  var body = {name: SECONDARY_NAME}
  await remove(MODULE, body)
})