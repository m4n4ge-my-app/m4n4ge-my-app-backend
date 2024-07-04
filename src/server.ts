import express, { Express, NextFunction, Request, Response } from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import 'dotenv/config'
import cors from 'cors'
import expressSession from 'express-session'
import passport from 'passport'
import morgan from 'morgan'

import env from './util/validateEnv'
import authRouter from './routes/auth/auth'
import applicationsRouter from './routes/application/application'

const app: Express = express()
const port = process.env.PORT || 5000

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

//set session
app.use(
  expressSession({
    secret: env.COOKIE_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000
    }
  })
)

//initialize passport
app.use(passport.initialize())
app.use(passport.session())

//auth routes
app.use('/api/auth', authRouter)

//application routes
app.use('/api/applications', applicationsRouter)

//error handling middleware for invalid routes
app.use((_req: Request, _res: Response, next: NextFunction) => next(Error('Endpoint not found')))

//error handling middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, _req: Request, res: Response, next: NextFunction) => {
  console.log('error:', error)
  let errorMessage = 'An unbeknownst error occurred.'
  if (error instanceof Error) {
    errorMessage = error.message
  }
  res.status(500).json({ error: errorMessage })
})

//connect to mongodb
mongoose
  .connect(env.MONGO_CONNECTION_STRING, {})
  .then(() => {
    console.log('Connected to MongoDB via Mongoose')
  })
  .catch((err) => {
    console.error('db connection err:', err)
  })

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`)
})
