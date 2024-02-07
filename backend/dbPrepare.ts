import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sqlite3 from 'sqlite3'

import { users } from './seeds/users'
import { bears } from './seeds/bears'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export function startDb ():sqlite3.Database {
  let dbAddr = ':memory:'
  if (process.env.DB_ADDR && process.env.DB_ADDR !== '') {
    dbAddr = process.env.DB_ADDR
  }

  let db: sqlite3.Database
  let needToSeed = true

  // callback on connect to DB
  function onConnect(err): sqlite3.Database | undefined {
    if (err) {
      console.error('---> DB not created', err?.message)
      return undefined
    }

    console.log(`---> Connected to the SQlite database (${dbAddr})`)
    if (needToSeed) {
      seedData(db)
      console.log('---> DB seeded')
    }
  }

  // in-memory: every time that server restart the DB state returns to initial
  // filepath: on first time calling the file creates, seeded and after that used
  if (dbAddr === ':memory:') {
    db = new sqlite3.Database(dbAddr, onConnect)
  } else {
    const dbPath = path.join(__dirname + dbAddr)
    needToSeed = false
    // check and create DB file if it not exists
    if (!fs.existsSync(dbPath)) {
      fs.closeSync(fs.openSync(dbPath, 'w'))
      needToSeed = true
    }

    db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, onConnect)
  }

  return db
}

function prepareUsersString(): string {
  const usersInsertArray: string[] = []
  users.forEach(u => {
    usersInsertArray.push(
      `("${u.username}",
      ${u.firstName ? `"${u.firstName}"` : 'NULL'},
      ${u.lastName ? `"${u.lastName}"`: 'NULL'},
      "${u.salt}",
      "${u.passwordHash}",
      "${u.email}",
      "${u.roles}",
      ${u.wallet ? `"${u.wallet}"`: 'NULL'},
      "${u.createdAt}")`
      )
  })
  const usersInsertString =  `INSERT INTO users (username, firstName, lastName, salt, passwordHash, email, roles, wallet, createdAt) VALUES ${usersInsertArray.join(', ')};`

  return usersInsertString
}

function prepareBearsString(): string {
  const bearsInsertArray: string[] = []
  bears.forEach(b => {
    bearsInsertArray.push(
      `("${b.title}",
      ${b.description ? `"${b.description}"` : 'NULL'},
      "${b.imgUrl}",
      "${b.imgExt}",
      ${b.owner},
      ${b.price ? `"${b.price}"` : 'NULL'},
      ${b.tradeStart ? `"${b.tradeStart}"` : 'NULL'},
      ${b.tradeEnd ? `"${b.tradeEnd}"` : 'NULL'},
      "${b.createdAt}")`
      )
  })
  const bearsInsertString =  `INSERT INTO bears (title, description, imgUrl, imgExt, owner, price, tradeStart, tradeEnd, createdAt) VALUES ${bearsInsertArray.join(', ')};`

  return bearsInsertString
}

function refreshImgs() {
  const assetsOrigDir = path.join(__dirname + '/assets/orig')
  const assetsThumbsDir = path.join(__dirname + '/assets/thumbs')
  const seedsOrigDir = path.join(__dirname + '/seeds/origImgs')
  const seedsThumbsDir = path.join(__dirname + '/seeds/thumbImgs')

  fs.rmSync(assetsOrigDir, {recursive: true, force: true})
  fs.rmSync(assetsThumbsDir, {recursive: true, force: true})

  fs.mkdirSync(assetsOrigDir)
  fs.mkdirSync(assetsThumbsDir)
  
  fs.cp(seedsOrigDir,
    assetsOrigDir, 
    {recursive: true},
    err => {err ? console.log(err) : (() => {})()})

  fs.cp(seedsThumbsDir,
    assetsThumbsDir,
    {recursive: true},
    err => {err ? console.log(err) : (() => {})()})
}

function seedData(db: sqlite3.Database) {
  if (process.env.NEED_TO_RETURN_TO_INIT_IMAGES_ON_RESTART === 'true') {
    refreshImgs()
  }

  db.run(`CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    firstName TEXT,
    lastName TEXT,
    salt TEXT NOT NULL,
    passwordHash TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    roles TEXT,
    wallet NUMERIC,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL);`, () => db.run(prepareUsersString()))
  
  db.run(`CREATE TABLE bears (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    imgUrl TEXT NOT NULL,
    imgExt TEXT NOT NULL,
    owner INTEGER NOT NULL,
    price NUMERIC,
    tradeStart DATETIME,
    tradeEnd DATETIME,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL);`, () => db.run(prepareBearsString()))
  
}