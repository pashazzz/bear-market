import { getOne, sqlQuery } from "../../services/db"
import IBidEntity from "../../../interfaces/IBidEntity"

const getLastBid = (bearId: number) => {
  const sql = `SELECT * FROM bids WHERE bearId = ${bearId} ORDER BY id DESC LIMIT 1`
  return getOne(sql) as Promise<IBidEntity>
}

const createBid = (bearId: number, userId: number, value: number) => {
  const insertSql = `INSERT INTO bids (bearId, userId, value)
    VALUES (${bearId}, ${userId}, ${value})`
  return sqlQuery(insertSql)
    .then(() => {
      const selectSql = `SELECT * FROM bids
        WHERE bearId=${bearId} AND userId=${userId} AND value=${value}`
      return getOne(selectSql) as Promise<IBidEntity>
    })
}

const fetchBidById = (id: number) => {
  const sql = `SELECT * FROM bids WHERE id = ${id}`
  return getOne(sql) as Promise<IBidEntity>
}

const deleteBid = (id: number) => {
  const sql = `DELETE FROM bids WHERE id=${id}`
  return sqlQuery(sql) as Promise<void>
}

export default {
  getLastBid,
  createBid,
  fetchBidById,
  deleteBid,
}