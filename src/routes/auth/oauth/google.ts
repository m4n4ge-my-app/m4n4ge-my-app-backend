import passport from '../../../util/passport-setup'
import express, { Response } from 'express'

const gooleRouter = express.Router()

gooleRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
gooleRouter.get('/google/redirect', passport.authenticate('google'), (req: any, res: Response) => {
  if (req.user) {
    res.cookie('userId', req.user.id, { httpOnly: true })
    res.redirect('/dashboard')
  } else {
    res.redirect('/signin')
  }
})

export default gooleRouter
