import { Request, Response } from 'express'
import { v4 as uuid } from 'uuid'

import Document from '../../models/document.model'
import { generatePresignedUrl, uploadToS3Bucket } from '../../util/s3'

export const uploadToS3 = async (req: Request, res: Response) => {
  try {
    const file = req.file as Express.Multer.File
    const { fileType } = req.body

    //ensure file and fileType are provided
    if (!file || !fileType) {
      return res.status(400).json({ error: 'File and fileType are required' })
    }

    //@ts-ignore
    const userId = req.user!._id

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

    return res.status(201).json(document)
  } catch (error) {
    console.error('Error uploading file:', error)
    return res.status(500).json({ error: 'Failed to upload document' })
  }
}

export const getPresignedUrl = async (req: Request, res: Response) => {
  const id = req.params.id

  //extract the token from the Authorization header
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  const token = authHeader.split(' ')[1]

  try {
    const document = await Document.findById(id)

    if (!document) {
      return res.status(404).json({ error: 'Document not found' })
    }

    const presignedUrl = generatePresignedUrl(document.s3key, token)
    return res.status(200).json({ presignedUrl })
  } catch (error) {
    console.error('Error fetching document:', error)
    return res.status(500).json({ error: 'Failed to fetch document' })
  }
}

export const getAllDocuments = async (req: Request, res: Response) => {
  try {
    //@ts-ignore
    const userId = req.user!._id
    const documents = await Document.find({ userId })
    return res.status(200).json(documents)
  } catch (error) {
    console.error('Error fetching documents:', error)
    return res.status(500).json({ error: 'Failed to fetch documents' })
  }
}

export const deleteDocument = async (req: Request, res: Response) => {
  const id = req.params.id

  try {
    await Document.findByIdAndDelete(id)
    return res.sendStatus(204)
  } catch (error) {
    console.error('Error deleting document:', error)
    return res.status(500).json({ error: 'Failed to delete document' })
  }
}
