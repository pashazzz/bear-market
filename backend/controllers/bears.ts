import express, { Request, Response } from 'express'

import IBearEntity from '../../interfaces/IBearEntity'
import BearsModel from '../models/bears'

const router = express.Router()

router.get('/',
  (req: Request, res: Response) => {
    const bears: IBearEntity[] = BearsModel.fetchBears()

    res.status(200).json(bears)
  })

export default router