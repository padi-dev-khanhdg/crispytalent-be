import App from '../../app'
import supertest from 'supertest'
import { IAuth } from '../../interfaces/auth.interface'
const app = new App()

const authHr: IAuth = {
  token: '',
}

const authAdmin: IAuth = {
  token: '',
}

async function loginHr(auth) {
  const data = {
    email: 'user02@example.com',
    password: 'vexento078',
  }
  const response = await supertest(app.app).post('/api/auth/login').send(data)
  const token = response.body.data
  auth.token = token
}

async function loginAdmin(auth) {
  const data = {
    email: 'user01@example.com',
    password: 'vexento078',
  }
  const response = await supertest(app.app).post('/api/auth/login').send(data)
  const token = response.body.data
  auth.token = token
}

beforeAll(async () => {
  await Promise.all([loginHr(authHr), loginAdmin(authAdmin)])
})

jest.setTimeout(30000)

describe('/result', () => {
  describe('/all', () => {
    it('should return 200 and expected data', async () => {
      const exptected = expect.objectContaining({
        results: [
          expect.objectContaining({
            score: 20,
            note: null,
            assessment_id: 2,
            test_id: 2,
            user_id: 3,
          }),
          expect.objectContaining({
            score: 15,
            note: null,
            assessment_id: 2,
            test_id: 1,
            user_id: 3,
          }),
        ],
      })
      const response = await supertest(app.app)
        .get('/api/results/all')
        .set('Authorization', 'Bearer ' + authAdmin.token)
      expect(response.body.data).toEqual(exptected)
      expect(response.body.data.dataFile).toBeDefined()
    })
    it('should return 403 and Forbidden', async () => {
      const expectedError = {
        code: 403,
        message: 'Forbidden',
      }
      const response = await supertest(app.app)
        .get('/api/results/all')
        .set('Authorization', 'Bearer ' + authHr.token)
      expect({
        code: response.body.code,
        message: response.body.message,
      }).toEqual(expectedError)
    })

    it('should return 401 and Unauthorized', async () => {
      const expectedError = {
        code: 401,
        message: 'Unauthorized',
      }
      const response = await supertest(app.app).get('/api/results/all')
      expect({
        code: response.body.code,
        message: response.body.message,
      }).toEqual(expectedError)
    })
  })
})
