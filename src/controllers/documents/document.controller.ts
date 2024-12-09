import { RequestHandler } from 'express'
import { v4 as uuid } from 'uuid'

import Document from '../../models/document.model'
import { generatePresignedUrl, uploadToS3Bucket } from '../../util/s3'
import createHttpError from 'http-errors'

export const uploadToS3: RequestHandler = async (req, res, next) => {
  try {
    const file = req.file as Express.Multer.File
    const { fileType } = req.body

    //ensure file and fileType are provided
    if (!file || !fileType) {
      throw createHttpError(400, 'File and fileType are required')
    }

    //@ts-expect-error, we are sure that user is attached to the request object by the auth middleware
    const userId = req.user!._id

    //since userId is coming from trusted source (the token), we can trust it to be a valid ObjectId, therefore skipping the check in all controllers
    // if (!mongoose.isValidObjectId(userId)) {
    //   throw createHttpError(400, 'Invalid user id')
    // }

    //for cases where fileType is provided but not recognized
    let folder = 'unCategorized'

    switch (fileType) {
      case 'resume':
        folder = 'resumes'
        break
      case 'cover letter':
        folder = 'coverLetters'
        break
      case 'description':
        folder = 'jobDescriptions'
        break
      default:
        break
    }

    const sanitizedFileName = file.originalname.replace(/ /g, '_')
    const uniqueFileName = `${uuid()}_${sanitizedFileName}`

    // Proceed with file upload to S3
    const s3Result = await uploadToS3Bucket(file.buffer, `${folder}/${uniqueFileName}`, file.mimetype)

    // Save document metadata in MongoDB
    const document = new Document({
      name: file.originalname,
      s3Url: s3Result.Location,
      s3key: s3Result.Key,
      userId,
      type: file.mimetype,
      size: file.size,
      fileType,
      applications: req.body.applications || [],
      tags: req.body.tags || []
    })

    await document.save()

    res.status(201).json(document)
  } catch (error) {
    next(error)
  }
}

export const getPresignedUrl: RequestHandler = async (req, res, next) => {
  const id = req.params.id

  //extract the token from the Authorization header
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createHttpError(401, 'Unauthorized')
  }
  const token = authHeader.split(' ')[1]

  try {
    const document = await Document.findById(id)

    if (!document) {
      throw createHttpError(404, 'Document not found')
    }

    const presignedUrl = generatePresignedUrl(document.s3key, token)
    res.status(200).json({ presignedUrl })
  } catch (error) {
    next(error)
  }
}

export const getAllDocuments: RequestHandler = async (req, res, next) => {
  try {
    //@ts-expect-error, we are sure that user is attached to the request object by the auth middleware
    const userId = req.user!._id
    const documents = await Document.find({ userId })
    res.status(200).json(documents)
  } catch (error) {
    next(error)
  }
}

export const deleteDocument: RequestHandler = async (req, res, next) => {
  const id = req.params.id

  try {
    await Document.findByIdAndDelete(id)
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
}
