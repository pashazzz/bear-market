import jsonwebtoken from 'jsonwebtoken'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

import { IUserEntity, IUserPublicFields, HiddenFields } from "../../../interfaces/IUserEntity";

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pathToKey = path.join(__dirname, '..', '..', 'utils', 'id_rsa_priv.pem')
const PRIV_KEY = fs.readFileSync(pathToKey, 'utf8')

function sanitizeUserEntity(user: IUserEntity): IUserPublicFields {
  for (const field in HiddenFields) {
    if (isNaN(Number(field))) {
      delete user[field]
    }
  }
  
  return user as IUserPublicFields
}

interface IssuedToken {
  token: string
  expires: number
}

function issueJWT(user: IUserEntity): IssuedToken {
  const expiresIn = 7 * 365 * 24 * 60 * 60 * 1000 // 7 years
  const payload = {
    sub: user.id,
    iat: Date.now(),
    roles: user.roles,
  }

  const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, {
    expiresIn: expiresIn,
    algorithm: 'RS256',
  })

  return {
    token: 'Bearer ' + signedToken,
    expires: expiresIn,
  }
}

export default {
  sanitizeUserEntity,
  issueJWT,
}