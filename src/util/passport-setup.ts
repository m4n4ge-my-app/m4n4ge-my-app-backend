import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import 'dotenv/config'
import env from './validateEnv'

passport.use(
  new GoogleStrategy(
    {
      //Google Strategy Options
      callbackURL: 'http://localhost:5173/dashboard',
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET
    },
    () => {
      //Google Strategy Callback
    }
  )
)

export default passport
