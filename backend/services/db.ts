import { db } from "../../app"

export function getOne(sql: string) {
  return new Promise((resolve, reject) => {
    db.get(sql, (err, row) => {
      if (err) {
        console.error(err.message)
        reject(undefined)
      }
      resolve(row)
    })
  })
}

export function getAll(sql: string) {
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (err) {
        console.error(err.message)
        reject([])
      }
      resolve(rows)
    })
  })
}