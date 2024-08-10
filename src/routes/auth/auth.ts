import express from 'express'
// import googleRouter from './../../routes/auth/oauth/google'
import * as userController from '../../controllers/user/user.controller'

const authRouter = express.Router()

// authRouter.use('/google', googleRouter)

// authRouter.get('/check', (req, res) => {
//   if (req.isAuthenticated()) {
//     res.json({ isAuthenticated: true })
//   } else {
//     res.json({ isAuthenticated: false })
//   }
// })

authRouter.post('/signin', userController.signInUser)
authRouter.post('/signup', userController.signUpUser)

// authRouter.get('/users/:id', userController.getUserById)

export default authRouter
