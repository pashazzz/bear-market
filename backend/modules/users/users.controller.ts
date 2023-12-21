
import express, { Request, Response } from 'express'

import UsersMiddleware from './users.middleware'
import UsersModel from './users.model'
import UsersService from './users.service'

const router = express.Router()

router.post('/login',
  UsersMiddleware.checkLoginFields,
  (req: Request, res: Response) => {
    const userEntity = UsersModel.findUserByUsername(req.body.login)
    if (userEntity === undefined) {
      return res.status(401).json({error: {issue: "Wrong credentials"}})
    }
    if (UsersModel.checkUserPassword(userEntity, req.body.password) === false) {
      return res.status(401).json({error: {issue: "Wrong credentials"}})
    }
    const user = UsersService.sanitizeUserEntity(userEntity)
    const jwtoken = UsersService.issueJWT(userEntity)

    res.status(200).json({user, jwtoken})
  })

export default router