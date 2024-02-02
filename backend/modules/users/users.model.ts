import { createHash } from 'crypto'

import { getOne } from '../../services/db'
import { IUserEntity } from "../../../interfaces/IUserEntity";

function findUserById(id: number): Promise<IUserEntity | undefined> {
  const sql = `SELECT * FROM users WHERE id = ${id}`
  return getOne(sql) as Promise<IUserEntity>
}

function findUserByUsername(username: string): Promise<IUserEntity | undefined> {
  const sql = `SELECT * FROM users WHERE username = "${username}"`
  return getOne(sql) as Promise<IUserEntity>
}

function checkUserPassword(user: IUserEntity, password: string): boolean {
  const strForHash: string = user.createdAt + password + user.salt + process?.env?.SALT_FOR_HASH

  const hashFunc = createHash('SHA3-512')
  hashFunc.update(strForHash)
  const hash = hashFunc.digest('hex')

  return hash === user.passwordHash
}


export default {
  findUserById,
  findUserByUsername,
  checkUserPassword,
}