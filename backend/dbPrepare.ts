import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sqlite3 from 'sqlite3'

import { users } from './seeds/users'
import { bears } from './seeds/bears'

export function startDb ():sqlite3.Database {
  let dbAddr = ':memory:'
  if (process.env.DB_ADDR && process.env.DB_ADDR !== '') {
    dbAddr = process.env.DB_ADDR
  }
  const db = new sqlite3.Database(dbAddr, err => {
    if (err) {
      return console.error('---> DB not created', err?.message)
    }
    console.log(`---> Connected to the SQlite database (${dbAddr})`)
    seedData(db)
    console.log('---> DB seeded')

    return db
  })

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
      "${u.createdAt}")`
      )
  })
  const usersInsertString =  `INSERT INTO users (username, firstName, lastName, salt, passwordHash, email, roles, createdAt) VALUES ${usersInsertArray.join(', ')};`

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
      "${b.createdAt}")`
      )
  })
  const bearsInsertString =  `INSERT INTO bears (title, description, imgUrl, imgExt, owner, price, createdAt) VALUES ${bearsInsertArray.join(', ')};`

  return bearsInsertString
}

function refreshImgs() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
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
  refreshImgs()

  db.run(`CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    firstName TEXT,
    lastName TEXT,
    salt TEXT NOT NULL,
    passwordHash TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    roles TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL);`, () => db.run(prepareUsersString()))
  
  db.run(`CREATE TABLE bears (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    imgUrl TEXT NOT NULL,
    imgExt TEXT NOT NULL,
    owner INTEGER NOT NULL,
    price NUMERIC,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL);`, () => db.run(prepareBearsString()))
  
}