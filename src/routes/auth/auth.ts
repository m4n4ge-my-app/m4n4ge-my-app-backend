import express, { Request, Response } from 'express'
import googleRouter from './../../routes/auth/oauth/google'

const authRouter = express.Router()

authRouter.use('/google', googleRouter)

authRouter.get('/check', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ isAuthenticated: true })
  } else {
    res.json({ isAuthenticated: false })
  }
})

authRouter.get('/logout', (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Could not log out.')
    } else {
      return res.redirect('/')
    }
  })
})

export default authRouter
