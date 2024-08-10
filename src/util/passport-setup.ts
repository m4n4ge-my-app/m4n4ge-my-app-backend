//external imports
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20'
import passport from 'passport'
import 'dotenv/config'

//local imports
import * as userController from '../controllers/user/user.controller'
import { UserModel } from '../models/user.model'
import env from './validateEnv'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.serializeUser((user: any, done) => {
  done(null, user.id)
})

passport.deserializeUser((id: string, done) => {
  UserModel.findById(id).then((user) => {
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
    (accessToken, refreshToken, profile: Profile, done) => {
      //Google Strategy Callback
      userController.saveGoogleProfileAsUser(profile).then((user) => {
        done(null, user)
      })
    }
  )
)

export default passport
