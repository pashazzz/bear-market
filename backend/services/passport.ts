import {Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'

import fs from 'fs'
import path from 'path'
// import { callbackify } from 'util'
import { fileURLToPath } from 'url'
import UsersModel from '../modules/users/users.model'
import { IUserEntity } from '../../interfaces/IUserEntity'

declare module "express-serve-static-core" {
  interface Request {
    user: IUserEntity
  }
}

// app.js will pass the global passport object here, and this function will configure it
const passportInit = (passport) => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const pathToKey = path.join(__dirname, '..', 'utils', 'id_rsa_pub.pem')

  const PUB_KEY = fs.readFileSync(pathToKey, 'utf8')

  // At a minimum, you must pass the `jwtFromRequest` and `secretOrKey` properties
  const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUB_KEY,
    algorithms: ['RS256'],
  }

  // The JWT payload is passed into the verify callback
  passport.use('jwt', new JwtStrategy(options, verifyJWT))
  
}

async function verifyJWT (jwt_payload, done) {
  const now = new Date().valueOf()
  if (now > jwt_payload.exp) {
    return done(null, false, {
      error: 'JWT expired',
      actions: [
        { action: 'logout' },
        { redirect: '/' },
        { message: 'You need to login' },
      ],
    }) //try catch - we need to check it somewhere on frontend
  }

  const user = await UsersModel.findUserById(jwt_payload.sub)
  if (user === undefined) {
    return done(null, false)
  }
  return done(null, user)
}

export default passportInit