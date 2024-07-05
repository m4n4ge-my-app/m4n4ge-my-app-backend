import express from 'express'
import * as applicationController from '../../controllers/application/application.controller'

const applicationsRouter = express.Router()

applicationsRouter.get('/', applicationController.getApplications)
applicationsRouter.get('/:id', applicationController.getApplication)
applicationsRouter.post('/', applicationController.createApplication)
applicationsRouter.patch('/:id', applicationController.updateApplication)
applicationsRouter.delete('/:id', applicationController.deleteApplication)

export default applicationsRouter
