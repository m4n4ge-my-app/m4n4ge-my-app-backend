import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import 'dotenv/config'
import env from './validateEnv'
import * as userController from '../controllers/user/user.controller'
import userModel from '../models/user.model'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.serializeUser((user: any, done) => {
  done(null, user.id)
})

passport.deserializeUser((id: string, done) => {
  userModel.findById(id).then((user) => {
    done(null, user)
  })
})

passport.use(
  new GoogleStrategy(
    {
      //Google Strategy Options
      callbackURL: 'http://localhost:5173/api/auth/google/redirect',
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET
    },
    (accessToken, refreshToken, profile, done) => {
      //Google Strategy Callback
      userController.saveUser(profile.displayName, profile.id).then((user) => {
        done(null, user)
      })
    }
  )
)

export default passport
