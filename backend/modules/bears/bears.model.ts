// import { db } from "../../../app"
import { getAll, getOne, sqlQuery } from "../../services/db"
import IBearEntity from "../../../interfaces/IBearEntity"

const fetchBears = async (ofUserId?: number): Promise<IBearEntity[]> => {
  const sql = `SELECT * FROM bears${ofUserId ? ` WHERE owner = ${ofUserId}` : ''}`
  return getAll(sql) as Promise<IBearEntity[]>
}

const fetchBearById = (id: number): Promise<IBearEntity | undefined> => {
  const sql = `SELECT * FROM bears WHERE id = ${id}`
  return getOne(sql) as Promise<IBearEntity>
}
const fetchBearByUrl = (url: string): Promise<IBearEntity | undefined> => {
  const sql = `SELECT * FROM bears WHERE imgUrl = "${url}"`
  return getOne(sql) as Promise<IBearEntity>
}

const updateField = (id: number, field: string, value: unknown):  Promise<void> => {
  const sql = `UPDATE bears SET ${field} = ${value} WHERE id = ${id}`
  return sqlQuery(sql) as Promise<void>
}

export default {
  fetchBears,
  fetchBearById,
  fetchBearByUrl,
  updateField,
}