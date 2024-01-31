import sqlite3 from 'sqlite3'

import { users } from './seeds/users'

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

function prepareUsersString() {
  const usersInsertArray: string[] = []
  users.forEach(u => {
    usersInsertArray.push(
      `("${u.username}", ${u.firstName ? `"${u.firstName}"` : 'NULL'}, ${u.lastName ? `"${u.lastName}"`: 'NULL'}, "${u.salt}", "${u.passwordHash}", "${u.email}", "${u.roles}", "${u.createdAt}")`
      )
  })
  const usersInsertString =  `INSERT INTO users (username, firstName, lastName, salt, passwordHash, email, roles, createdAt) VALUES ${usersInsertArray.join(', ')};`

  return usersInsertString
}

function seedData(db: sqlite3.Database) {
  db.run(`CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username text NOT NULL UNIQUE,
    firstName text,
    lastName text,
    salt text NOT NULL,
    passwordHash text NOT NULL,
    email text NOT NULL UNIQUE,
    roles text,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL);`, () => db.run(prepareUsersString()))
  
  
}