import { NextFunction, Request, Response } from 'express'

const checkLoginFields = (req: Request, res: Response, next: NextFunction) => {
  const errors: string[] = []
  if (typeof req.body.login !== 'string' || typeof req.body.password !== 'string') {
    errors.push('Login and password should be the string type')
  }

  if (req.body.login.length === 0 || req.body.login.length > 20) {
    errors.push('Login should be filled and no longer than 20 symbols')
  }
  if (req.body.password.length === 0 || req.body.password.length > 20) {
    errors.push('Password should be filled and no longer than 20 symbols')
  }
  if (errors.length > 0) {
    return next({
      issue: 'Wrong credentials',
      description: errors,
    })
  }

  next()
}

export default {
  checkLoginFields,
}