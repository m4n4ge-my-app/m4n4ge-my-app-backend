import { InferSchemaType, Schema, model } from 'mongoose'

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: false
  },
  googleId: {
    type: String,
    required: true,
    unique: true
  }
})

//since this is typescript project, we need to defind the type of the application document so that we can ensure type safety
//below is one way of doing, in this case mongoose will infer the type of the document based on the schema
type User = InferSchemaType<typeof userSchema>

//again we are using mongoose to create Applications collection in the database
//we will use this model to interact with the database for all the application related operations
export default model<User>('User', userSchema)
