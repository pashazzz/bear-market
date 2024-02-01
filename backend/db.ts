import sqlite3 from 'sqlite3'

import { users } from './seeds/users'
import { bears } from './seeds/bears'

export function startDb ():sqlite3.Database {
  const db = new sqlite3.Database(':memory:', err => {
    if (err) {
      return console.error('---> DB not created', err?.message)
    }
    console.log('---> Connected to the in-memory SQlite database.')
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
      `("${u.username}", ${u.firstName ? `"${u.firstName}"` : 'NULL'}, ${u.lastName ? `"${u.lastName}"`: 'NULL'}, "${u.salt}", "${u.passwordHash}", "${u.email}", "${u.roles}", "${u.createdAt}")`
      )
  })
  const usersInsertString =  `INSERT INTO users (username, firstName, lastName, salt, passwordHash, email, roles, createdAt) VALUES ${usersInsertArray.join(', ')};`

  return usersInsertString
}

function prepareBearsString(): string {
  const bearsInsertArray: string[] = []
  bears.forEach(b => {
    bearsInsertArray.push(
      `("${b.title}", ${b.description ? `"${b.description}"` : 'NULL'}, "${b.imgUrl}", "${b.imgExt}", ${b.owner}, "${b.price ?? 'NULL'}", "${b.createdAt}")`
      )
  })
  const bearsInsertString =  `INSERT INTO bears (title, description, imgUrl, imgExt, owner, price, createdAt) VALUES ${bearsInsertArray.join(', ')};`

  return bearsInsertString
}

function seedData(db: sqlite3.Database) {
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