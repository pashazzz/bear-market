// import { db } from "../../../app"
import { getAll, getOne } from "../../services/db"
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

export default {
  fetchBears,
  fetchBearById,
  fetchBearByUrl,
}