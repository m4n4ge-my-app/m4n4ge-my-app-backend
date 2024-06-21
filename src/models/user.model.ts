import mongoose, { Schema, Model, Document } from 'mongoose'
import bcrypt from 'bcrypt'

export interface UserType extends Document {
  firstName: string
  lastName: string
  userName?: string
  email: string
  password?: string
  photoString?: string
  googleId?: string
}

interface UserModelType extends Model<UserType> {
  signup(firstName: string, lastName: string, email: string, password: string): Promise<UserType>
  signin(email: string, password: string): Promise<UserType>
}

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    unique: false
  },
  lastName: {
    type: String,
    required: true,
    unique: false
  },
  userName: {
    type: String,
    required: false,
    unique: false
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: false,
    unique: false
  },
  photoString: {
    type: String,
    required: false,
    unique: false
  },
  googleId: {
    type: String,
    required: false,
    unique: true
  }
})

//static signup method to create a new user
userSchema.statics.signup = async function (
  firstName: string,
  lastName: string,
  email: string,
  password: string
): Promise<UserType> {
  const exists = await this.findOne({ email })

  if (exists) {
    throw new Error('User with email already exists')
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  const user = await this.create({
    firstName,
    lastName,
    email,
    password: hashedPassword
  })

  return user
}

//static signin method to sign in a user
userSchema.statics.signin = async function (email: string, password: string): Promise<UserType> {
  //no need to check if email and user fiels are empty becuause they are validated on the front end and it would not reach this point if that was the case

  const user = await this.findOne({ email })

  if (!user) {
    throw new Error('Invalid email or password') //cannot be more specific for security reasons
  }

  const isMatch = await bcrypt.compare(password, user.password as string)

  if (!isMatch) {
    throw new Error('Invalid email or password') //cannot be more specific for security reasons
  }

  return user
}

export const UserModel = mongoose.model<UserType, UserModelType>('User', userSchema)
