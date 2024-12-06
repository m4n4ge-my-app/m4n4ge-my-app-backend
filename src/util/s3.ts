import AWS from 'aws-sdk'
import { v4 as uuid } from 'uuid'

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
})

export const uploadToS3Bucket = async (
  fileBuffer: Buffer,
  fileName: string,
  contentType: string
): Promise<AWS.S3.ManagedUpload.SendData> => {
  const sanitizedFileName = fileName.replace(/ /g, '_')
  const uniqueFileName = `${uuid()}_${sanitizedFileName}`

  const params: AWS.S3.PutObjectRequest = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: uniqueFileName,
    Body: fileBuffer,
    ContentType: contentType
  }

  return s3.upload(params).promise()
}
