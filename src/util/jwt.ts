import jwt from 'jsonwebtoken'
import env from './validateEnv'

export function generateToken(_id: string) {
  return jwt.sign({ _id }, env.JWT_SECRET!, { expiresIn: '1d' })
}
