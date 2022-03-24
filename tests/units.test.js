'use strict'
require('dotenv').config();
const {insert, update, get, remove} = require("./crud.helper")

const MODULE = "units"
const PRIMARY_NAME = "Unit 1"
const SECONDARY_NAME = "Unit 2"
const COMPANY_NAME1 = "Company for " + PRIMARY_NAME
const COMPANY_NAME2 = "Company for " + SECONDARY_NAME


// TODO remove all existing units
beforeAll(async() => {
  await new Promise(r => setTimeout(r, 1000))
  await remove(MODULE, {name: PRIMARY_NAME}, true)
  await remove(MODULE, {name: SECONDARY_NAME}, true)
  await insert("companies", {name: COMPANY_NAME1}, true)
  await insert("companies", {name: COMPANY_NAME2}, true)
}, 10000)

afterAll(async() => {
  await remove("companies", {name: COMPANY_NAME1}, true)
  await remove("companies", {name: COMPANY_NAME2}, true)
})

test("Unit: insert", async() => {
  var body = {name: PRIMARY_NAME, fkCompany: COMPANY_NAME1}
  await insert(MODULE, body)
})

test("Unit: update name", async() => {
  var body = {oldName: PRIMARY_NAME, name: SECONDARY_NAME, fkCompany: COMPANY_NAME1}
  var unit = {name: SECONDARY_NAME, fkCompany: COMPANY_NAME1}
  await update(MODULE, body, unit)
})

test("Unit: update company", async() => {
  var body = {oldName: SECONDARY_NAME, name: SECONDARY_NAME, fkCompany: COMPANY_NAME2}
  var unit = {name: SECONDARY_NAME, fkCompany: COMPANY_NAME2}
  await update(MODULE, body, unit)
})

test("Unit: get", async() => {
  await get(MODULE, [{name: SECONDARY_NAME, fkCompany: COMPANY_NAME2}])
})

test("Unit: delete", async() => {
  var body = {name: SECONDARY_NAME, fkCompany: COMPANY_NAME2}
  await remove(MODULE, body)
})