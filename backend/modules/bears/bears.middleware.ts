import { NextFunction, Request, Response } from 'express'
import BearsModel from './bears.model'
import IBearEntity from '../../../interfaces/IBearEntity'

declare module "express-serve-static-core" {
  interface Request {
    bear: IBearEntity
  }
}

const isUserOwner = (req: Request, res: Response, next: NextFunction) => {
  const errors: string[] = []
  if (!req.user.id) {
    errors.push('Unauthorized access')
  }
  if (!req.body.id) {
    errors.push('Bear id is not defined')
  }
  if (errors.length > 0) {
    return next({
      issue: 'Wrong data',
      description: errors,
    })
  }
  BearsModel.fetchBearById(req.body.id)
    .then((bear: IBearEntity | undefined) => {
      if (!bear) {
        return next({
          issue: 'Bear with this id is not exists... For you?..',
          description: `id: ${req.body.id}`,
        })
      }
      if (bear.ownerId !== req.user.id) {
        return next({
          issue: 'Bear with this id is not exists... For you?..',
          description: `id: ${req.body.id}`,
        })
      }
      req.bear = bear
      next()
    })
    .catch((e) => {
      return next({
        issue: 'Wrong data on catching bear',
        description: e,
      })
    })

}

export default {
  isUserOwner,
}
