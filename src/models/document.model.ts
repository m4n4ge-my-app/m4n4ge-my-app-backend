import { InferSchemaType, Schema, model } from 'mongoose'

const documentSchema = new Schema({
  name: { type: String, required: true },
  s3Url: { type: String, required: true },
  s3key: { type: String, required: true },
  userId: { type: String, required: true },
  type: { type: String, required: true },
  size: { type: Number, required: true },
  fileType: { type: String, required: true },
  applications: { type: [String], required: false },
  tags: { type: [String], required: false },
  uploadedAt: { type: Date, default: Date.now }
})

type DocumentType = InferSchemaType<typeof documentSchema>

export default model<DocumentType>('Document', documentSchema)
