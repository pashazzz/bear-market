import express, { Request, Response } from 'express'

import BidsModel from './bids.model'

const router = express.Router()

router.get('/:bearId/lastBid',
  async (req: Request<{bearId: number}>, res: Response) => {
    const lastBid = await BidsModel.getLastBid(req.params.bearId)
    
    res.status(200).json({lastBid: lastBid?.value ?? 0})
  })

export default router