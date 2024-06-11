import express, { Express, Request, Response } from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import 'dotenv/config'

import env from './util/validateEnv'

const app: Express = express()
const port = process.env.PORT || 5000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req: Request, res: Response) => {
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
