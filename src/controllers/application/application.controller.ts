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
