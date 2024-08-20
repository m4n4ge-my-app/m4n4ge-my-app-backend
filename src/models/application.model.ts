import { InferSchemaType, Schema, model } from 'mongoose'

const applicationSchema = new Schema({
  employerName: { type: String, required: true },
  positionName: { type: String, required: true },
  applicationDate: { type: Date, required: true },
  jobPostPostingDate: { type: Date, required: false },
  jobPostEndingDate: { type: Date, required: false },
  jobLocation: { type: String, required: false },
  note: { type: String, required: false },
  workModel: { type: String, required: true },
  jobPlatform: { type: String, required: true },
  isFavorite: { type: Boolean, required: false },
  userId: { type: String, required: true },
  applicationStatus: { type: String, required: false }
})

type ApplicationType = InferSchemaType<typeof applicationSchema>

export default model<ApplicationType>('Application', applicationSchema)
