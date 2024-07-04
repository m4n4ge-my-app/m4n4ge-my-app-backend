import express from 'express'
import * as applicationController from '../../controllers/application/application.controller'

const applicationsRouter = express.Router()

applicationsRouter.get('/', applicationController.getApplications)

export default applicationsRouter
