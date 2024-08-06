import { getOne, sqlQuery } from "../../services/db"

import UsersModel from "../users/users.model"
import IBidEntity from "../../../interfaces/IBidEntity"
import IBearEntity from "../../../interfaces/IBearEntity"
import { IUserEntity } from "../../../interfaces/IUserEntity"

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

const transferCreditsForBid = async (bear: IBearEntity) => {
  const amount = bear.maxBid
  const receiverId = bear.ownerId
  const payerId = bear.lastBidUserId
  if (!amount || !payerId) {
    return Promise.reject(`No amount to pay (${amount}) or not exists the payer with id ${payerId}`)
  }
  const payer: IUserEntity|undefined = await UsersModel.findUserById(payerId)
  if (!payer) {
    return Promise.reject(`Payer with id ${payerId} is not exists`)
  }
  if (payer.wallet < amount) {
    return Promise.reject(`Payer have not enough credits (${amount}) in wallet`)
  }

  try {
    const sql = `UPDATE users SET
      wallet = wallet - ${amount}
      WHERE id = ${payerId}`
    await sqlQuery(sql)
  } catch (e) {
    return Promise.reject(`Cannot transfer ${amount} credits from payer with id ${payerId}`)
  }

  try {
    const sql = `UPDATE users SET
      wallet = wallet + ${amount}
      WHERE id = ${receiverId}`
    await sqlQuery(sql)
  } catch (e) {
    return Promise.reject(`Cannot transfer ${amount} credits to receiver with id ${receiverId}`)
  }

  return Promise.resolve()
}

const cleanBidsForBear = (id: number) => {
  const sql = `DELETE FROM bids WHERE bearId=${id}`
  return sqlQuery(sql) as Promise<void>
}

export default {
  getLastBid,
  createBid,
  fetchBidById,
  deleteBid,
  transferCreditsForBid,
  cleanBidsForBear,
}