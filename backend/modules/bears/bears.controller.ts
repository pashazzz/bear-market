import express, { Request, Response } from 'express'

import IBearEntity from '../../../interfaces/IBearEntity'
import BearsModel from './bears.model'
import usersMiddleware from '../users/users.middleware'

const router = express.Router()

router.get('/',
  (req: Request, res: Response) => {
    const bears: IBearEntity[] = BearsModel.fetchBears()

    res.status(200).json(bears)
  })

router.get('/:id',
  usersMiddleware.isAuthenticated,
  (req: Request<{id: number}>, res: Response) => {
    const bear: IBearEntity | undefined = BearsModel.fetchBearById(Number(req.params.id))
    const status: number = bear === undefined ? 404 : 200

    res.status(status).json(bear)
  })


export default router