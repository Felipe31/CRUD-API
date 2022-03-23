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
  await remove(MODULE, {name: PRIMARY_NAME}, true)
  await remove(MODULE, {name: SECONDARY_NAME}, true)
})

test("Company: insert", async() => {
  var body = {name: PRIMARY_NAME}
  await insert(MODULE, body)
})

test("Company: update", async() => {
  var body = {oldName: PRIMARY_NAME, name: SECONDARY_NAME}
  var company = {name: SECONDARY_NAME}
  await update(MODULE, body, company)
})

test("Company: get", async() => {
  await get(MODULE, [{name: SECONDARY_NAME}])
})

test("Company: delete", async() => {
  var body = {name: SECONDARY_NAME}
  await remove(MODULE, body)
})