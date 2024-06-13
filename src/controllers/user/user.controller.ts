import UserModel from '../../models/user.model'

export const saveUser = async (userName: string, googleId: string) => {
  try {
    const user = await UserModel.findOne({ googleId }).exec()
    if (!user) {
      const newUser = await UserModel.create({
        userName,
        googleId
      })
      console.log('User saved:', newUser)
      return newUser
    }
    console.log('User already exist:', user)
    return user
  } catch (error) {
    console.error('Error while saving user:', error)
    return new Error('Error while saving user')
  }
}
