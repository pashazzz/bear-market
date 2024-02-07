import express, { Request, Response } from 'express'
import passport from 'passport'

import IBearEntity from '../../../interfaces/IBearEntity'
import BearsModel from './bears.model'
import usersMiddleware from '../users/users.middleware'

const router = express.Router()

router.get('/',
  async (req: Request, res: Response) => {
    const bears: IBearEntity[] = await BearsModel.fetchBears()

    res.status(200).json(bears)
  })

router.get('/:id',
  usersMiddleware.isAuthenticated,
  async (req: Request<{id: number}>, res: Response) => {
    const bear: IBearEntity | undefined = await BearsModel.fetchBearById(Number(req.params.id))
    const status: number = bear === undefined ? 404 : 200

    res.status(status).json(bear)
  })

interface IReqChangePrice {
  id: number,
  price: number | null,
}
router.post('/changePrice',
  passport.authenticate('jwt', {session: false}),
  async (req: Request<object, object, IReqChangePrice>, res: Response) => {
    const bear: IBearEntity | undefined = await BearsModel.fetchBearById(Number(req.body.id))
    if (!bear || bear?.owner !== req.user.id) {
      return res.status(404).send('Bear with this id is not exists... For you?..')
    }
    if (typeof req.body.price !== 'number' && req.body.price !== null) {
      return res.status(400).send('Bad request')
    }
    try {
      await BearsModel.updateField(req.body.id, 'price', req.body.price)
    } catch(e) {
      console.log(e)
      return res.status(400).send('Bad request')
    }

    res.status(200).json({changed: 'ok'})
  })

export default router