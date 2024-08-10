import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import { UserModel } from '../models/user.model'
import env from '../util/validateEnv'

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  //verify if user is authenticated
  const { authorization } = req.headers
  if (!authorization) {
    return res.status(401).json({ error: 'You must be logged in to access resources.' })
  }

  const token = authorization.replace('Bearer ', '')

  try {
    //verify token
    const { _id } = jwt.verify(token, env.JWT_SECRET) as { _id: string }
    req.user = (await UserModel.findOne({ _id }).select('_id')) as { _id: string }
    return next()
  } catch (error) {
    return res.status(401).json({ error: 'You must be logged in to access resources.' })
  }
}
