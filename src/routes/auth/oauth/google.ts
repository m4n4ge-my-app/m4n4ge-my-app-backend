import passport from '../../../util/passport-setup'
import express, { Response } from 'express'

const googleRouter = express.Router()

googleRouter.get('/', passport.authenticate('google', { scope: ['profile', 'email'] }))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
googleRouter.get('/redirect', passport.authenticate('google'), (req: any, res: Response) => {
  if (req.user) {
    res.cookie('userId', req.user.id)
    res.redirect('/dashboard')
  } else {
    res.redirect('/signin')
  }
})

export default googleRouter
