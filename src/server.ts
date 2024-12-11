//external imports
import express, { Express, NextFunction, Request, Response } from 'express'
import createHttpError, { isHttpError } from 'http-errors'
import bodyParser from 'body-parser'
// import passport from 'passport'
import mongoose from 'mongoose'
import 'dotenv/config'
import cors from 'cors'
import morgan from 'morgan'

//local imports
import applicationsRouter from './routes/application/application'
import documentsRouter from './routes/document/document'
import { requireAuth } from './middleware/requireAuth'
import authRouter from './routes/auth/auth'
import env from './util/validateEnv'

const app: Express = express()
const port = process.env.PORT || 5000

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

// //initialize passport
// app.use(passport.initialize())
// app.use(passport.session())

//auth routes
app.use('/api/auth', authRouter)

//auth middleware
app.use(requireAuth)

//application routes
app.use('/api/applications', applicationsRouter)

//document routes
app.use('/api/documents', documentsRouter)

//error handling middleware for invalid routes
app.use((_req: Request, _res: Response, next: NextFunction) => next(createHttpError(404, 'Endpoint not found')))

//error handling middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, _req: Request, res: Response, next: NextFunction) => {
  console.log('error:', error)
  let errorMessage = 'An unknown error occurred.'
  let statusCode = 500
  if (isHttpError(error)) {
    errorMessage = error.message
    statusCode = error.status
  }
  res.status(statusCode).json({ error: errorMessage })
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
