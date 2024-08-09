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

// authRouter.get('/logout', (req: Request, res: Response, next: NextFunction) => {
//   // Passport's req.logout function to log the user out
//   req.logout(function (err) {
//     if (err) {
//       return next(err)
//     }
//     // Destroy the session
//     req.session.destroy((err) => {
//       if (err) {
//         console.error('Session destruction error:', err)
//         return res.status(500).send('Could not log out.')
//       } else {
//         // Clear the cookies used for the session
//         res.clearCookie('connect.sid', { path: '/' })
//         res.clearCookie('userId', { path: '/' })
//         // Redirect or send a response indicating a successful logout
//         return res.redirect('/')
//       }
//     })
//   })
// })

export default authRouter
