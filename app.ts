import express, { Express, Request, Response, NextFunction, ErrorRequestHandler } from 'express'
import BearsController from './backend/modules/bears/bears.controller'
import UsersController from './backend/modules/users/users.controller'

const app: Express = express()

app.use(express.json()) // for json responses
app.use(express.urlencoded({ extended: true })) // for form requests

// Enabling CORS middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  // Website you wish to allow to connect; instead of '*', use more generic
  res.setHeader(
    'Access-Control-Allow-Origin',
    req.header('origin') ||
      req.header('x-forwarded-host') ||
      req.header('referer') ||
      req.header('host') || ''
  )

  res.setHeader('Access-Control-Allow-Methods', 'POST,DELETE,OPTIONS') // Request methods you wish to allow
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type,Authorization'
  ) // Request headers you wish to allow

  // Set to true if you need the website to include cookies in the requests sent to the API (e.g. in case you use sessions)
  // res.setHeader('Access-Control-Allow-Credentials', true);
  next()
})
// /Enabling CORS middleware

//
// Controllers
app.use('/api/bears', BearsController)
app.use('/api/users', UsersController)
// 

// wildcard for not handled requests
app.all('*', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

// error handler
app.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
  console.log(err)
  res.status(500)
     .json({ msg: 'Something went wrong', error: err })
  next()
})

export default app
