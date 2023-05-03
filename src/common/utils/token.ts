import User from '@models/entities/user.entity'
import { IAccessToken } from '@interfaces/token.interface'
import jwt from 'jsonwebtoken'
import { env } from '@env'

const createAccessToken = (user: User): string => {
  return jwt.sign(
    {
      email: user.email,
    },

    env.app.jwt_secret as jwt.Secret,
    {
      expiresIn: '10h',
    },
  )
}

const verifyToken = async (token: string): Promise<jwt.VerifyErrors | IAccessToken> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, env.app.jwt_secret as jwt.Secret, (err, payload) => {
      if (err) return reject(err)
      resolve(payload as IAccessToken)
    })
  })
}

export { createAccessToken, verifyToken }
