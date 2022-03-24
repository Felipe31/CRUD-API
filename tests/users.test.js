'use strict'
require('dotenv').config();
const {insert, update, get, remove} = require("./crud.helper")
const companies = require("../src/model/company")
const users     = require("../src/model/user")

const MODULE = "users"
const PRIMARY_NAME = "User 1"
const PRIMARY_USERNAME = "Username 1"
const SECONDARY_NAME = "User 2"
const SECONDARY_USERNAME = "Username 2"
const COMPANY_NAME1 = "Company for " + PRIMARY_NAME
const COMPANY_NAME2 = "Company for " + SECONDARY_NAME


// TODO remove all existing users
beforeAll(async() => {
  await new Promise(r => setTimeout(r, 1000))
  await remove(MODULE, {username: PRIMARY_USERNAME}, true)
  await remove(MODULE, {username: SECONDARY_USERNAME}, true)
  await insert("companies", {name: COMPANY_NAME1}, true)
  await insert("companies", {name: COMPANY_NAME2}, true)
}, 10000)

afterAll(async() => {
  await remove("companies", {name: COMPANY_NAME1}, true)
  await remove("companies", {name: COMPANY_NAME2}, true)
})

test("User: insert", async() => {
  var body = {username: PRIMARY_USERNAME, name: PRIMARY_NAME, fkCompany: COMPANY_NAME1}
  await insert(MODULE, body)
})

test("User: update username", async() => {
  var body = {oldUsername: PRIMARY_USERNAME, username: SECONDARY_USERNAME, name: PRIMARY_NAME, fkCompany: COMPANY_NAME1}
  var user = {username: SECONDARY_USERNAME, name: PRIMARY_NAME, fkCompany: COMPANY_NAME1}
  await update(MODULE, body, user)
})

test("User: update name", async() => {
  var body = {username: SECONDARY_USERNAME, name: SECONDARY_NAME, fkCompany: COMPANY_NAME1}
  await update(MODULE, body, body)
})

test("User: update company", async() => {
  var body = {username: SECONDARY_USERNAME, name: SECONDARY_NAME, fkCompany: COMPANY_NAME2}
  await update(MODULE, body, body)
})

test("User: get", async() => {
  await get(MODULE, [{username: SECONDARY_USERNAME, name: SECONDARY_NAME, fkCompany: COMPANY_NAME2}])
})

test("User: delete", async() => {
  var body = {username: SECONDARY_USERNAME, name: SECONDARY_NAME, fkCompany: COMPANY_NAME2}
  await remove(MODULE, body)
})