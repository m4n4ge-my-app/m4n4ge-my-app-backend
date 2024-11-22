import { Request, Response } from 'express'
import Document from '../../models/document.model'
import { uploadToS3Bucket } from '../../util/s3'

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
    let folder = 'uncategorized'

    switch (fileType) {
      case 'resume':
        folder = 'resumes'
        break
      case 'coverLetter':
        folder = 'coverLetters'
        break
      case 'jobDescription':
        folder = 'jobDescriptions'
        break
      default:
        break
    }

    // Proceed with file upload to S3
    const s3Result = await uploadToS3Bucket(file.buffer, `${folder}/${file.originalname}`, file.mimetype)

    // Save document metadata in MongoDB
    const document = new Document({
      name: file.originalname,
      s3Url: s3Result.Location,
      userId,
      type: file.mimetype,
      size: file.size,
      fileType
    })

    await document.save()

    return res.status(201).json(document)
  } catch (error) {
    console.error('Error uploading file:', error)
    return res.status(500).json({ error: 'Failed to upload document' })
  }
}