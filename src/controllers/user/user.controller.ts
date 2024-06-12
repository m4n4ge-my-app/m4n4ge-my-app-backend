import UserModel from '../../models/user.model'

export const saveUser = async (userName: string, googleId: string) => {
  try {
    const user = await UserModel.findById(googleId).exec()
    if (!user) {
      const newUser = await UserModel.create({
        userName,
        googleId
      })
      return newUser
    }
    return user
  } catch (error) {
    console.error('Error while saving user:', error)
    return new Error('Error while saving user')
  }
}
