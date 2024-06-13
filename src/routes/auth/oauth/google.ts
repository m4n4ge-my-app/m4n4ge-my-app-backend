import passport from '../../../util/passport-setup'
import express, { NextFunction, Request, Response } from 'express'

const gooleRouter = express.Router()

gooleRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

gooleRouter.get(
  '/google/redirect',
  passport.authenticate('google'),
  (req: Request, res: Response, next: NextFunction) => {
    req.user ? res.redirect('/dashboard') : res.redirect('/signin')
  }
)

export default gooleRouter
