import express from 'express'
import passport from '../../../util/passport-setup'

const gooleRouter = express.Router()

gooleRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

export default gooleRouter
