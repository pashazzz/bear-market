import express, { Request, Response } from 'express'

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
  async(req: Request<{id: number}>, res: Response) => {
    const bear: IBearEntity | undefined = await BearsModel.fetchBearById(Number(req.params.id))
    const status: number = bear === undefined ? 404 : 200

    res.status(status).json(bear)
  })


export default router