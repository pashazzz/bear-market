import { getOne } from "../../services/db"
import IBidEntity from "../../../interfaces/IBidEntity"

const getLastBid = async (bearId: number) => {
  const sql = `SELECT * FROM bids WHERE bearId = ${bearId} ORDER BY id LIMIT 1`
  return getOne(sql) as Promise<IBidEntity>
}

export default {
  getLastBid,
}