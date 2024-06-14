import { Profile } from 'passport-google-oauth20'
import UserModel from '../../models/user.model'

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
