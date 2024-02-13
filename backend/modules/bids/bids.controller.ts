import express, { Request, Response } from 'express'
import passport from 'passport'

import BidsModel from './bids.model'
import BearsModel from '../bears/bears.model'
import BearsService from '../bears/bears.service'

const router = express.Router()

router.get('/:bearId/lastBid',
  async (req: Request<{bearId: number}>, res: Response) => {
    const lastBid = await BidsModel.getLastBid(req.params.bearId)
    
    res.status(200).json({lastBid: lastBid?.value ?? 0})
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
    console.log(req.body.value, minBid, (req.body.value <= minBid))
    if (req.body.value <= minBid) {
      return res.status(400).json({error: "Your bid should be more than last bid or price"})
    }

    const bid = await BidsModel.createBid(req.params.bearId, req.user.id, req.body.value)
    console.log(bid)
    
    res.status(200).json(bid)
  })

export default router