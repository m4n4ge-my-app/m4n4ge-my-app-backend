import AWS from 'aws-sdk'
import jwt from 'jsonwebtoken'

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
  const params: AWS.S3.PutObjectRequest = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: fileName,
    Body: fileBuffer,
    ContentType: contentType
  }

  return s3.upload(params).promise()
}

export const generatePresignedUrl = (s3key: string, token: string): string => {
  //decode token
  const decodedToken = jwt.decode(token) as { exp: number }
  if (!decodedToken || !decodedToken.exp) {
    throw new Error('Invalid token')
  }

  //get the expiration time of the token and calculate the remaining time
  const currentTime = Math.floor(Date.now() / 1000)
  const remainingSessionTime = decodedToken.exp - currentTime

  //ensuring remainingSessionTime is always positive, or default to 1 minutes if session has expired
  const expiresIn = remainingSessionTime > 0 ? remainingSessionTime : 60 * 1

  const params: AWS.S3.GetObjectRequest & { Expires: number } = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: s3key,
    Expires: expiresIn
  }

  return s3.getSignedUrl('getObject', params)
}

export const deleteFromS3Bucket = async (s3key: string): Promise<void> => {
  const params: AWS.S3.DeleteObjectRequest = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: s3key
  }

  await s3.deleteObject(params).promise()
}
