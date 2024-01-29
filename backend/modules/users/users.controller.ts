import express, { Request, Response } from 'express'
import passport from 'passport'
import _ from 'lodash'

import UsersMiddleware from './users.middleware'
import UsersModel from './users.model'
import UsersService from './users.service'
import { IRequestWithUser } from './users.interfaces'
import bearsModel from '../bears/bears.model'

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
    const jwtoken = UsersService.issueJWT(userEntity)
    const user = UsersService.sanitizeUserEntity(_.clone(userEntity))

    res.status(200).json({user, jwtoken})
  }
)

router.get('/username/:username',
  passport.authenticate('jwt', {session: false}),
  (req: IRequestWithUser, res) => {
    if (req.user?.username.toString() !== req.params.username) {
      return res.status(401).json({ error: 'Access denied' })
    }

    res.status(200).json(UsersService.sanitizeUserEntity(_.clone(req.user)))
  }
)

router.get('/:username/bears',
  passport.authenticate('jwt', {session: false}),
  (req: IRequestWithUser, res) => {
    res.status(200).json(bearsModel.fetchBears(req.user?.id))
  }
)

router.all('/test',
  passport.authenticate('jwt', {session: false}),
  (req: Request, res: Response) => {
    res.status(200).json({test: 'ok'})
  }
)

export default router