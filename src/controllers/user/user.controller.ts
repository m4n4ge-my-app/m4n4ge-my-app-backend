import { Profile } from 'passport-google-oauth20'
import UserModel from '../../models/user.model'
import { Request, Response } from 'express'

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
  res.json({ message: 'Sign in user' })
}

//signup user
export const signUpUser = async (req: Request, res: Response) => {
  res.json({ message: 'Sign up user' })
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
