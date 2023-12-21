import { createHash } from 'crypto'
import express, { Request, Response } from 'express'

import UsersMiddleware from './users.middleware'
import UsersModel from './users.model'
import {IUserPublicFields} from '../../../interfaces/IUserEntity'

const router = express.Router()

router.post('/login',
  UsersMiddleware.checkLoginFields,
  (req: Request, res: Response) => {
    const hashFunc = createHash('SHA3-512')
    const strForHash: string = req.body.login + req.body.password + process?.env?.SALT_FOR_HASH
    
    hashFunc.update(strForHash)
    const hash = hashFunc.digest('hex')
    
    const user: IUserPublicFields | null = UsersModel.findUserByUsernameAndHash({username: req.body.login, hash})

    if (!user) {
      return res.status(401).json({error: "Wrong credentials"})
    }

    res.status(200).json(user)
  })

export default router