import express, { Express, Request, Response } from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import 'dotenv/config'
import cors from 'cors'
import expressSession from 'express-session'
import passport from 'passport'

import env from './util/validateEnv'
import googleRouter from './routes/auth/oauth/google'
// import usersRouter from './routes/user/users'

const app: Express = express()
const port = process.env.PORT || 5000

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

app.use('/api/auth', googleRouter)

app.get('/api/auth/check', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ isAuthenticated: true })
  } else {
    res.json({ isAuthenticated: false })
  }
})

app.get('/api/auth/logout', (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Could not log out.')
    } else {
      return res.redirect('/')
    }
  })
})

// app.use('/api/users', usersRouter)

app.get('/api', (req: Request, res: Response) => {
  res.json({ message: 'Hello World! Are you ready for M4n4geMy.app?' })
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
