// import { db } from "../../../app"
import { getAll, getOne, sqlQuery } from "../../services/db"
import IBearEntity from "../../../interfaces/IBearEntity"
import { IUserPublicFields } from "../../../interfaces/IUserEntity"

const fetchBears = async (ofUserId?: number): Promise<IBearEntity[]> => {
  const sql = `SELECT bears.*, MAX(bids.value) as maxBid
    FROM bears
    LEFT JOIN bids ON bids.bearId = bears.id
    ${ofUserId ? ` WHERE ownerId = ${ofUserId}` : ''}
    GROUP BY bears.id`
  return getAll(sql) as Promise<IBearEntity[]>
}

const fetchBearById = (id: number): Promise<IBearEntity | undefined> => {
  const sql = `SELECT
      bears.*,
      MAX(bids.value) as maxBid,
      bids.userId as lastBidUserId
    FROM bears
    LEFT JOIN bids ON bids.bearId = bears.id
    WHERE bears.id = ${id}
    GROUP BY bears.id`
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

const updateTradePeriod = (id: number, tradeStart: string | null, tradeEnd: string | null): Promise<void> => {
  const sql = `UPDATE bears SET
    tradeStart = ${tradeStart ? `"${tradeStart}"` : 'NULL'},
    tradeEnd = ${tradeEnd ? `"${tradeEnd}"` : 'NULL'}
    WHERE id = ${id}`
  return sqlQuery(sql) as Promise<void>
}

const changeOwner = async (bear: IBearEntity) => {
  const newOwner = await getOne(`SELECT id, username, email, roles
    FROM users
    WHERE id = ${bear.lastBidUserId}`) as IUserPublicFields
  
  if (!newOwner) {
    return Promise.reject({reason: 'user not exists'})
  }

  const sql = `UPDATE bears SET
    ownerId = ${newOwner.id}
    WHERE id = ${bear.id}`
  return sqlQuery(sql) as Promise<void>
}

export default {
  fetchBears,
  fetchBearById,
  fetchBearByUrl,
  updateField,
  updateTradePeriod,
  changeOwner,
}