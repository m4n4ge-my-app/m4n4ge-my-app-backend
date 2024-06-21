import { Profile } from 'passport-google-oauth20'
import { UserModel, UserType } from '../../models/user.model'
import { Request, Response } from 'express'
import { generateToken } from '../../util/jwt'

export const saveGoogleProfileAsUser = async (user: Profile) => {
  try {
    const existingUser = await UserModel.findOne({ googleId: user.id }).exec()
    if (!existingUser) {
      const newUser = await UserModel.create({
        firstName: user.name?.givenName,
        lastName: user.name?.familyName,
        email: user.emails?.at(0)?.value,
        userName: user.displayName,
        photoString: user.photos?.at(0)?.value,
        googleId: user.id
      })
      return newUser
    }
    return existingUser
  } catch (error) {
    return new Error('Error while saving user')
  }
}

//signin user
export const signInUser = async (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    const user: UserType = await UserModel.signin(email, password)
    const token = generateToken(user._id as string)
    res.status(200).json({ email, token })
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message })
    } else {
      res.status(400).json({ error: 'An unknown error occurred' })
    }
  }
}

//signup user
export const signUpUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body

  try {
    const user: UserType = await UserModel.signup(firstName, lastName, email, password)
    const token = generateToken(user._id as string)
    res.status(200).json({ email, token })
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message })
    } else {
      res.status(400).json({ error: 'An unknown error occurred' })
    }
  }
}

export const getUserById = async (req: Request, res: Response) => {
  const userId = req.params.id
  try {
    const existingUser = await UserModel.findOne({ _id: userId }).exec()
    if (!existingUser) {
      return res.status(404).json({ message: 'There is no user by the id: ' + userId })
    }
    return res.status(200).json(existingUser)
  } catch (error) {
    return res.status(500).json({ message: 'Error while fetching user' })
  }
}
