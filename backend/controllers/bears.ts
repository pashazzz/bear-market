import express, { Request, Response } from 'express'

import IBearEntity from '../../interfaces/IBearEntity'
import BearsModels from '../models/bears'

const router = express.Router()

router.get('/',
  (req: Request, res: Response) => {
    const bears: IBearEntity[] = BearsModels.fetchBears()

    res.status(200).json(bears)
  })

export default router