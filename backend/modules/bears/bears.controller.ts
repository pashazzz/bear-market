import express, { Request, Response } from 'express'
import passport from 'passport'

import IBearEntity from '../../../interfaces/IBearEntity'
import BearsMiddleware from './bears.middleware'
import BearsModel from './bears.model'
import BidsModel from '../bids/bids.model'
import UsersMiddleware from '../users/users.middleware'
import { isDatesSame } from '../../services/dates'

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
    // don't show to owner who did last bid
    delete(bear?.lastBidUserId)
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
    // TODO: create middleware for checking ownership of the bear
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
    // don't show to owner who did last bid
    delete(bear.lastBidUserId)
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
  BearsMiddleware.isUserOwner,
  async (req: Request<object, object, IReqChangePeriod>, res: Response) => {
    const start = req.body.tradeStart !== null
      ? new Date(req.body.tradeStart).toISOString().split('T')[0] + 'T00:00:00Z'
      : null
    const end = req.body.tradeEnd !== null
      ? new Date(req.body.tradeEnd).toISOString().split('T')[0] + 'T23:59:59Z'
      : null

    if (isDatesSame(start, req.bear.tradeStart) && isDatesSame(end, req.bear.tradeEnd)) {
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

router.post('/closeTrade',
  passport.authenticate('jwt', {session: false}),
  BearsMiddleware.isUserOwner,
  async (req: Request<object, object, {id: number}>, res: Response) => {
    // delete trade period
    try {
      await BearsModel.updateTradePeriod(req.body.id, null, null)
    } catch(e) {
      console.log(e)
      return res.status(400).send('Bad request')
    }

    if (req.bear.maxBid && req.bear.lastBidUserId) {
      // transfer credits
      try {
        await BidsModel.transferCreditsForBid(req.bear)
      } catch (e) {
        console.log(e)
        res.status(400).send('Cannot transfer credits')
      }

      // change bear owner, if it have at least one bid
      try {
        await BearsModel.changeOwner(req.bear)
      } catch(e) {
        console.log(e)
        res.status(400).send('Cannot change owner')
      }
    }

    // delete all former bids
    BidsModel.cleanBidsForBear(req.bear.id)

    res.status(200).json({closed: true})
  }
)

router.post('/cancelTrade',
  passport.authenticate('jwt', {session: false}),
  BearsMiddleware.isUserOwner,
  async (req: Request<object, object, {id: number}>, res: Response) => {
    // delete trade period
    try {
      await BearsModel.updateTradePeriod(req.body.id, null, null)
    } catch(e) {
      console.log(e)
      return res.status(400).send('Bad request')
    }

    // delete all former bids
    BidsModel.cleanBidsForBear(req.bear.id)

    res.status(200).json({canceled: true})
  }
)

router.all('/*', (req: Request, res: Response) => {
  return res.status(404).send('api request not found')
})

export default router