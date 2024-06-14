import express from 'express'
import * as userController from '../../controllers/user/user.controller'

const usersRouter = express.Router()

usersRouter.get('/:id', userController.getUserById)

export default usersRouter
