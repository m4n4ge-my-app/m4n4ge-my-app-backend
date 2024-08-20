import createHttpError from 'http-errors'
import { RequestHandler } from 'express'
import mongoose from 'mongoose'

import ApplicationModel from '../../models/application.model'

export const getApplications: RequestHandler = async (req, res, next) => {
  //@ts-ignore
  const userId = req.user!._id
  try {
    const applications = await ApplicationModel.find({ userId }).exec()
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
  applicationDate?: Date
  jobPostPostingDate?: Date
  jobPostEndingDate?: Date
  jobLocation?: string
  note?: string
  workModel?: string
  jobPlatform?: string
  isFavorite?: boolean
  userId?: string
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
  //@ts-ignore
  const userId = req.user!._id
  const status = 'Applied'

  try {
    if (!employerName || !positionName || !applicationDate || !workModel || !jobPlatform) {
      throw createHttpError(
        400,
        'One of the following required fields are missing: employerName, positionName, applicationDate, workModel, and jobPlatform.'
      )
    }

    if (userId.toString() === '66b7cfe0f28bb61c67d0e18a' || userId.toString() === '66b7d01ab06633512ff5bed6') {
      throw createHttpError(
        403,
        'Access Denied: Demonstration accounts do not have the privileges to add an application. Please create a personal account for full access.'
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
      isFavorite,
      userId,
      status
    })

    res.status(201).json(application)
  } catch (error) {
    next(error)
  }
}

interface UpdateApplicationParams {
  id: string
}
interface UpdateApplicationRequestBody {
  employerName?: string
  positionName?: string
  applicationDate?: Date
  jobPostPostingDate?: Date
  jobPostEndingDate?: Date
  jobLocation?: string
  note?: string
  workModel?: string
  jobPlatform?: string
  isFavorite?: boolean
}

//ATTENTION: when we explicity define the type of the RequestHandler like blow we cannot use "req: Request, res: Response, next: NextFunction" for the callback function parameters for some reason, we have to use as "req, res, next" here
//Note: also note this time we have to types defined for the first parameter of the RequestHandler, this is in-contrast to "getApplicationById" controller where we did not use the type of RequestHandler even though id was used in the controller function, and type of the id was inferred by the typescript. Difference here is that since we are using the types of the RequestHandler and the id params so we need to define it explicitly here
export const updateApplication: RequestHandler<
  UpdateApplicationParams,
  unknown,
  UpdateApplicationRequestBody,
  unknown
> = async (req, res, next) => {
  const applicationId = req.params.id
  const updatedEmployerName = req.body.employerName
  const updatedPositionName = req.body.positionName
  const updatedApplicationDate = req.body.applicationDate
  const updatedJobPostPostingDate = req.body.jobPostPostingDate
  const updatedJobPostEndingDate = req.body.jobPostEndingDate
  const updatedJobLocation = req.body.jobLocation
  const updatedNote = req.body.note
  const updatedWorkModel = req.body.workModel
  const updatedJobPlatform = req.body.jobPlatform
  const updatedIsFavorite = req.body.isFavorite
  try {
    //handle invalid object id
    if (!mongoose.isValidObjectId(applicationId)) {
      throw createHttpError(400, 'Invalid application id')
    }
    //handle resource not found
    const application = await ApplicationModel.findById(applicationId).exec()
    if (!application) {
      throw createHttpError(404, `Application with id ${applicationId} not found`)
    }
    //checks for the required fields
    if (
      !updatedEmployerName ||
      !updatedPositionName ||
      !updatedApplicationDate ||
      !updatedWorkModel ||
      !updatedJobPlatform
    ) {
      throw createHttpError(
        400,
        'One of the following required fields are missing: employerName, positionName, applicationDate, workModel, and jobPlatform.'
      )
    }

    //OPTION 1 to update the note in db
    application.employerName = updatedEmployerName
    application.positionName = updatedPositionName
    application.applicationDate = updatedApplicationDate
    application.jobPostPostingDate = updatedJobPostPostingDate
    application.jobPostEndingDate = updatedJobPostEndingDate
    application.jobLocation = updatedJobLocation
    application.note = updatedNote
    application.workModel = updatedWorkModel
    application.jobPlatform = updatedJobPlatform
    application.isFavorite = updatedIsFavorite
    const updatedApplication = await application.save()

    //OPTIN 2 to update the note in db - this is not preferred becuase application is already fetched and no need to fetch it again like in here
    //since key/value pairs are same, we can use object destructuring to create the new note
    // const updatedApplication = await ApplicationModel.findByIdAndUpdate(applicationId, {
    //   newCompanyName,
    //   newRoleName,
    //   newIsRemote,
    //   newCity,
    //   newState,
    //   newCountry,
    //   newPlatform,
    //   newNote
    // }, {new: true});

    res.status(200).json(updatedApplication)
  } catch (error) {
    next(error)
  }
}

//since we do not need body for deletion, we don not need to pass the types for RequestHandler
export const deleteApplication: RequestHandler = async (req, res, next) => {
  const applicationId = req.params.id
  try {
    //handle invalid object id
    if (!mongoose.isValidObjectId(applicationId)) {
      throw createHttpError(400, 'Invalid application id')
    }
    const application = await ApplicationModel.findById(applicationId).exec()
    //handle resource not found
    if (!application) {
      throw createHttpError(404, `Application with id ${applicationId} not found`)
    }

    await application.deleteOne()
    //this time we dont need to send body. Note. res.status().json() need to chained together, since we are not sending body we are using the other method down below
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
}
