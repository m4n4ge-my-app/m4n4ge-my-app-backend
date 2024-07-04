import { RequestHandler } from 'express'
import ApplicationModel from '../../models/application.model'

export const getApplications: RequestHandler = async (_req, res, next) => {
  try {
    const applications = await ApplicationModel.find().exec()
    res.status(200).json(applications)
  } catch (error) {
    next(error)
  }
}

export const getApplication: RequestHandler = async (req, res, next) => {
  const applicationId = req.params.id
  try {
    const application = await ApplicationModel.findById(applicationId).exec()
    if (!application) {
      res.status(404).json({ error: 'Application not found' })
      return
    }
    res.status(200).json(application)
  } catch (error) {
    next(error)
  }
}

export const createApplication: RequestHandler = async (req, res, next) => {
  try {
    const application = new ApplicationModel(req.body)
    await application.save()
    res.status(201).json(application)
  } catch (error) {
    next(error)
  }
}
