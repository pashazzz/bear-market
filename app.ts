import cors from 'cors'
import express, { Express, Request, Response, NextFunction, ErrorRequestHandler } from 'express'
import passport from 'passport'

import path from 'path'
import { fileURLToPath } from 'url'

import BearsController from './backend/modules/bears/bears.controller'
import UsersController from './backend/modules/users/users.controller'

import passportInit from './backend/services/passport'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app: Express = express()

app.use(express.json()) // for json responses
app.use(express.urlencoded({ extended: true })) // for form requests
app.use(cors())

passportInit(passport)
app.use(passport.initialize())

//
// Controllers
app.use('/api/bears', BearsController)
app.use('/api/users', UsersController)
// 

app.use(express.static('dist')) // static asserts from /build
// wildcard for not handled requests
app.all('*', (req: Request, res: Response) => {
  return res.sendFile(path.join(__dirname + '/dist/index.html'))
});

// error handler
app.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
  console.log(err)
  res.status(500)
     .json({ msg: 'Something went wrong', error: err })
  next()
})

export default app
