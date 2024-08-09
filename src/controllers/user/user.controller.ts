// import { Profile } from 'passport-google-oauth20'
// import { UserModel, UserType } from '../../models/user.model'
import { Request, Response } from 'express'
// import { generateToken } from '../../util/jwt'

// export const saveGoogleProfileAsUser = async (user: Profile) => {
//   try {
//     const existingUser = await UserModel.findOne({
//       $or: [{ googleId: user.id }, { email: user.emails?.at(0)?.value }]
//     }).exec()
//     if (!existingUser) {
//       const newUser = await UserModel.create({
//         firstName: user.name?.givenName,
//         lastName: user.name?.familyName,
//         email: user.emails?.at(0)?.value,
//         userName: user.displayName,
//         photoString: user.photos?.at(0)?.value,
//         googleId: user.id
//       })
//       return newUser
//     }
//     return existingUser
//   } catch (error) {
//     return new Error('Error while saving user')
//   }
// }

//signin user
export const signInUser = async (req: Request, res: Response) => {
  res.json({ message: 'Signin path accessed' })
}

//signup user
export const signUpUser = async (req: Request, res: Response) => {
  res.json({ message: 'Signup path accessed' })
}
