'use strict'
require('dotenv').config();
const {insert, update, get, getAndResponse, remove} = require("./crud.helper")
const assets = require("../src/model/asset")
const units  = require("../src/model/unit")

const MODULE = "assets"
const PRIMARY_NAME = "Asset 1"
const SECONDARY_NAME = "Asset 2"
const COMPANY_NAME1 = "Company for " + PRIMARY_NAME
const COMPANY_NAME2 = "Company for " + SECONDARY_NAME
const UNIT_NAME1 = "Unit for " + PRIMARY_NAME
const UNIT_NAME2 = "Unit for " + SECONDARY_NAME


// TODO remove all existing assets
beforeAll(async() => {
  await new Promise(r => setTimeout(r, 1000))
  await remove(MODULE, {name: PRIMARY_NAME}, true)
  await remove(MODULE, {name: SECONDARY_NAME}, true)
  await insert("companies", {name: COMPANY_NAME1}, true)
  await insert("companies", {name: COMPANY_NAME2}, true)
  const c1 = await getAndResponse("companies/"+COMPANY_NAME1)
  const c2 = await getAndResponse("companies/"+COMPANY_NAME2)
  await insert("units", {name: UNIT_NAME1, fkCompany: c1.name}, true)
  await insert("units", {name: UNIT_NAME2, fkCompany: c2.name}, true)
}, 10000)

afterAll(async() => {
  await remove("units", {name: UNIT_NAME1}, true)
  await remove("units", {name: UNIT_NAME2}, true)
  await remove("companies", {name: COMPANY_NAME1}, true)
  await remove("companies", {name: COMPANY_NAME2}, true)
})

test("Assert: insert", async() => {
  var body = {name: PRIMARY_NAME, status: "Running", health: 100, fkUnit: UNIT_NAME1}
  await insert(MODULE, body)
})

test("Assert: update name", async() => {
  var body = {oldName: PRIMARY_NAME, name: SECONDARY_NAME, fkUnit: UNIT_NAME1}
  var unit = {name: SECONDARY_NAME, fkUnit: UNIT_NAME1}
  await update(MODULE, body, unit)
})

test("Assert: update unit", async() => {
  var body = {oldName: SECONDARY_NAME, name: SECONDARY_NAME, fkUnit: UNIT_NAME2}
  var unit = {name: SECONDARY_NAME, fkUnit: UNIT_NAME2}
  await update(MODULE, body, unit)
})

test("Assert: get", async() => {
  await get(MODULE, [{name: SECONDARY_NAME, fkUnit: UNIT_NAME2}])
})

test("Assert: delete", async() => {
  var body = {name: SECONDARY_NAME, fkUnit: UNIT_NAME2}
  await remove(MODULE, body)
})