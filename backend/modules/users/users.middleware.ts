import { NextFunction, Request, Response } from 'express'
import passport from 'passport'

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

// if it's not logged in user, we will write into req.user empty object
// otherwise - User object
const isAuthenticated = (req, res, next) => {
  passport.authenticate('jwt', (err, user) => {
    if (err) {
      return next(err)
    }
    req.user = user ? user : {}
    next()
  })(req, res, next)
}

export default {
  checkLoginFields,
  isAuthenticated,
}