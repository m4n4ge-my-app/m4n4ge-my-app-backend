import { RequestHandler } from 'express'
import ApplicationModel from '../../models/application.model'
import createHttpError from 'http-errors'
import mongoose from 'mongoose'

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
    //handle invalid object id
    if (!mongoose.isValidObjectId(applicationId)) {
      throw createHttpError(400, 'Invalid application id')
    }
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

//we need to add the types of the request body to make sure that the request body has all the required fields and types. before implementing this, a request body with missing fields or wrong types would have been accepted by the server and would have caused an error (from mongoose schema) in the controller function
//NOTE: ? denotes optional fields and corresponds to the "required: false" in the schema

//ATTENTION: employerName, positionName, applicationDate, workModel and jobPlatform are required fields so "?" is not needed but we will assume that somehow they can be missed in the body, thus we need to assign them the ?, and then we can check on them in the controller function and throw appropriate error if they are missing

interface CreateApplicationBody {
  employerName?: string
  positionName?: string
  applicationDate?: string
  jobPostPostingDate?: string
  jobPostEndingDate?: string
  jobLocation?: string
  note?: string
  workModel?: string
  jobPlatform?: string
  isFavorite?: boolean
}

export const createApplication: RequestHandler<unknown, unknown, CreateApplicationBody, unknown> = async (
  req,
  res,
  next
) => {
  const employerName = req.body.employerName
  const positionName = req.body.positionName
  const applicationDate = req.body.applicationDate
  const jobPostPostingDate = req.body.jobPostPostingDate
  const jobPostEndingDate = req.body.jobPostEndingDate
  const jobLocation = req.body.jobLocation
  const note = req.body.note
  const workModel = req.body.workModel
  const jobPlatform = req.body.jobPlatform
  const isFavorite = req.body.isFavorite

  try {
    if (!employerName || !positionName || !applicationDate || !workModel || !jobPlatform) {
      throw createHttpError(
        400,
        'employerName, positionName, applicationDate, workModel, and jobPlatform are required fields.'
      )
    }
    const application = await ApplicationModel.create({
      employerName,
      positionName,
      applicationDate,
      jobPostPostingDate,
      jobPostEndingDate,
      jobLocation,
      note,
      workModel,
      jobPlatform,
      isFavorite
    })

    res.status(201).json(application)
  } catch (error) {
    next(error)
  }
}
