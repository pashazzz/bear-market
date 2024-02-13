import express, { Request, Response } from 'express'
import passport from 'passport'

import BidsModel from './bids.model'
import BidsService from './bids.service'
import BearsModel from '../bears/bears.model'
import BearsService from '../bears/bears.service'
import UsersMiddleware from '../users/users.middleware'
import IBidEntity from '../../../interfaces/IBidEntity'
import { IBidEntityNotOwner } from './bids.service'

const router = express.Router()


router.get('/:bearId/lastBid',
  UsersMiddleware.isAuthenticated,
  async (req: Request<{bearId: number}>, res: Response) => {
    let lastBid: IBidEntity | IBidEntityNotOwner = await BidsModel.getLastBid(req.params.bearId)
    if (lastBid && req.user?.id && lastBid.userId !== req.user.id) {
      lastBid = BidsService.sanitizeBidEntity(lastBid as IBidEntity)
    }
    
    res.status(200).json(lastBid)
  })

interface IReqBid {
  value: number,
}
router.post('/:bearId',
  passport.authenticate('jwt', {session: false}),
  async (req: Request<{bearId: number}, object, IReqBid>, res: Response) => {
    const bear = await BearsModel.fetchBearById(req.params.bearId)
    if (!bear || !bear.price) {
      return res.status(404).json({error: "Bear not found"})
    }
    if (!BearsService.isTradeOpen(bear)) {
      return res.status(400).json({error: "Trade is not open"})
    }
    let minBid = bear.price
    const lastBid = await BidsModel.getLastBid(req.params.bearId)
    if (lastBid?.value) {
      minBid = lastBid.value
    }
    if (req.body.value <= minBid) {
      return res.status(400).json({error: "Your bid should be more than last bid or price"})
    }

    const bid = await BidsModel.createBid(req.params.bearId, req.user.id, req.body.value)
    
    res.status(200).json(bid)
  })

export default router