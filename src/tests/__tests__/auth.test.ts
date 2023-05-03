import App from '../../app'
import supertest from 'supertest'
import { verifyToken } from '../../common/utils/token'

const app = new App()

jest.setTimeout(30000)
describe('/auth', () => {
  describe('/login', () => {
    it('Should return: 200 success and token include expected user', async () => {
      const data = {
        email: 'user01@example.com',
        password: 'vexento078',
      }
      const expected = expect.objectContaining({
        email: 'user01@example.com',
      })
      const res = await supertest(app.app).post('/api/auth/login').send(data)
      const token = res.body.data
      const user = await verifyToken(token)
      expect(user).toEqual(expected)
    })

    it('Should return: 500 bad request and message Password is required ', async () => {
      const data = {
        email: 'user01@example.com',
        password: 'fwef23f',
      }
      const expectedError = {
        code: 500,
        message: 'Wrong password',
      }
      const response = await supertest(app.app).post('/api/auth/login').send(data)
      expect({
        code: response.body.code,
        message: response.body.message,
      }).toEqual(expectedError)
    })

    it('Should return: 500 bad request and message No user with email created', async () => {
      const data = {
        email: 'unknown@example.com',
        password: 'vexento078',
      }
      const expectedError = {
        code: 500,
        message: 'No user with email created',
      }
      const response = await supertest(app.app).post('/api/auth/login').send(data)
      expect({
        code: response.body.code,
        message: response.body.message,
      }).toEqual(expectedError)
    })
  })
})
