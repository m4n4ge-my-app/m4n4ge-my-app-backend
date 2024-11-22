import { Request, Response } from 'express'
import Document from '../../models/document.model'
import { uploadToS3Bucket } from '../../util/s3'

export const uploadToS3 = async (req: Request, res: Response) => {
  try {
    // Ensure file is available
    const file = req.file as Express.Multer.File // Multer attaches the file to `req.file`
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    //@ts-ignore
    const userId = req.user!._id

    // Proceed with file upload to S3
    const s3Result = await uploadToS3Bucket(file.buffer, `documents/${file.originalname}`, file.mimetype)

    // Save document metadata in MongoDB
    const document = new Document({
      name: file.originalname,
      s3Url: s3Result.Location,
      userId,
      type: file.mimetype,
      size: file.size
    })

    await document.save()

    return res.status(201).json(document)
  } catch (error) {
    console.error('Error uploading file:', error)
    return res.status(500).json({ error: 'Failed to upload document' })
  }
}
