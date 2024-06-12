import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import 'dotenv/config'
import env from './validateEnv'
import * as userController from '../controllers/user/user.controller'

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
      console.log('Google Strategy Callback', profile)
      userController.saveUser(profile.displayName, profile.id).then((user) => {
        console.log('User saved:', user)
        done(null, user)
      })
    }
  )
)

export default passport
