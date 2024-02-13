import express, { Request, Response } from 'express'
import passport from 'passport'

import IBearEntity from '../../../interfaces/IBearEntity'
import BearsModel from './bears.model'
import UsersMiddleware from '../users/users.middleware'
import { compareDates } from '../../services/dates'

const router = express.Router()

router.get('/',
  async (req: Request, res: Response) => {
    const bears: IBearEntity[] = await BearsModel.fetchBears()

    res.status(200).json(bears)
  })

router.get('/:id',
  UsersMiddleware.isAuthenticated,
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
    if (!bear || bear?.ownerId !== req.user.id) {
      return res.status(404).send('Bear with this id is not exists... For you?..')
    }
    if (typeof req.body.price !== 'number' && req.body.price !== null) {
      return res.status(400).send('Bad request')
    }
    if (bear.price === req.body.price) {
      return res.status(200).json({notNeedToChange: true})
    }
    try {
      await BearsModel.updateField(req.body.id, 'price', req.body.price)
    } catch(e) {
      console.log(e)
      return res.status(400).send('Bad request')
    }

    return res.status(200).json({changed: 'ok'})
  })

interface IReqChangePeriod {
  id: number,
  tradeStart: string | null,
  tradeEnd: string | null,
}
router.post('/changePeriod',
  passport.authenticate('jwt', {session: false}),
  async (req: Request<object, object, IReqChangePeriod>, res: Response) => {
    const bear: IBearEntity | undefined = await BearsModel.fetchBearById(Number(req.body.id))
    if (!bear || bear?.ownerId !== req.user.id) {
      return res.status(404).send('Bear with this id is not exists... For you?..')
    }
    const start = req.body.tradeStart !== null
      ? new Date(req.body.tradeStart).toISOString().split('T')[0] + 'T00:00:00Z'
      : null
    const end = req.body.tradeEnd !== null
      ? new Date(req.body.tradeEnd).toISOString().split('T')[0] + 'T23:59:59Z'
      : null

    if (compareDates(start, bear.tradeStart) && compareDates(end, bear.tradeEnd)) {
      return res.status(200).json({notNeedToChange: true})
    }

    try {
      await BearsModel.updateTradePeriod(req.body.id, start, end)
    } catch(e) {
      console.log(e)
      return res.status(400).send('Bad request')
    }

    res.status(200).json({changed: 'ok'})
  })

export default router