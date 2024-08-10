import express from 'express'
// import googleRouter from './../../routes/auth/oauth/google'
import * as userController from '../../controllers/user/user.controller'

const authRouter = express.Router()

// authRouter.use('/google', googleRouter)

authRouter.post('/signin', userController.signInUser)
authRouter.post('/signup', userController.signUpUser)

export default authRouter
