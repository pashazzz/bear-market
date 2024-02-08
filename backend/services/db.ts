import { db } from "../../app"

export function getOne(query: string) {
  return new Promise((resolve, reject) => {
    db.get(query, (err, row) => {
      if (err) {
        console.error(err.message)
        reject(undefined)
      }
      resolve(row)
    })
  })
}

export function getAll(query: string) {
  return new Promise((resolve, reject) => {
    db.all(query, (err, rows) => {
      if (err) {
        console.error(err.message)
        reject([])
      }
      resolve(rows)
    })
  })
}

export function sqlQuery(query: string) {
  return new Promise<void>((resolve, reject) => {
    db.run(query, (err) => {
      if (err) {
        console.error(err.message)
        reject()
      }
      resolve()
    })
  })
}