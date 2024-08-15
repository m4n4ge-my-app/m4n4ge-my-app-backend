import { InferSchemaType, Schema, model } from 'mongoose'

const applicationSchema = new Schema({
  employerName: { type: String, required: true },
  positionName: { type: String, required: true },
  applicationDate: { type: String, required: true },
  jobPostPostingDate: { type: String, required: false },
  jobPostEndingDate: { type: String, required: false },
  jobLocation: { type: String, required: false },
  note: { type: String, required: false },
  workModel: { type: String, required: true },
  jobPlatform: { type: String, required: true },
  isFavorite: { type: Boolean, required: false },
  userId: { type: String, required: true },
  status: { type: String, required: false }
})

type ApplicationType = InferSchemaType<typeof applicationSchema>

export default model<ApplicationType>('Application', applicationSchema)
