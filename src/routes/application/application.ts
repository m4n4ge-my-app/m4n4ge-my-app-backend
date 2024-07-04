import express from 'express'
import * as applicationController from '../../controllers/application/application.controller'

const applicationsRouter = express.Router()

applicationsRouter.get('/', applicationController.getApplications)
applicationsRouter.get('/:id', applicationController.getApplication)
applicationsRouter.post('/', applicationController.createApplication)

export default applicationsRouter
