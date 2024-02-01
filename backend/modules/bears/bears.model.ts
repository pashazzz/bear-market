import { db } from "../../../app"
import IBearEntity from "../../../interfaces/IBearEntity"

const fetchBears = async (ofUserId?: number): Promise<IBearEntity[]> => {
  const sql = `SELECT * FROM bears${ofUserId ? ` WHERE owner = ${ofUserId}` : ''}`
  return new Promise(resolve => {
    db.all(sql, (err, rows: IBearEntity[]) => {
      if (err) {
        console.error(err.message)
        resolve([])
      }
      resolve(rows)
    })
  })
}

const fetchBearById = (id: number): Promise<IBearEntity | undefined> => {
  const sql = `SELECT * FROM bears WHERE id = ${id}`
  return new Promise(resolve => {
    db.get(sql, (err, row: IBearEntity) => {
      if (err) {
        console.error(err.message)
        resolve(undefined)
      }
      resolve(row)
    })
  })
}
const fetchBearByUrl = (url: string): Promise<IBearEntity | undefined> => {
  const sql = `SELECT * FROM bears WHERE imgUrl = "${url}"`
  return new Promise(resolve => {
    db.get(sql, (err, row: IBearEntity) => {
      if (err) {
        console.error(err.message)
        resolve(undefined)
      }
      resolve(row)
    })
  })
}

export default {
  fetchBears,
  fetchBearById,
  fetchBearByUrl,
}