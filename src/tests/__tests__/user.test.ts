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
  const res = await supertest(app.app).post('/api/auth/login').send(data)
  const token = res.body.data
  auth.token = token
}

async function loginAdmin(auth) {
  const data = {
    email: 'user01@example.com',
    password: 'vexento078',
  }
  const res = await supertest(app.app).post('/api/auth/login').send(data)
  const token = res.body.data
  auth.token = token
}

beforeAll(async () => {
  await Promise.all([loginHr(authHr), loginAdmin(authAdmin)])
})

jest.setTimeout(30000)
describe('/users', () => {
  describe('/list', () => {
    it('Should return: 200 success and list expected users', async () => {
      const expected = [
        expect.objectContaining({
          id: 1,
          email: 'user01@example.com',
          name: 'name user 1',
          role: 'admin',
        }),
        expect.objectContaining({
          id: 2,
          email: 'user02@example.com',
          name: 'name user 2',
          role: 'hr',
        }),
        expect.objectContaining({
          id: 3,
          email: 'user03@example.com',
          name: 'name user 3',
          role: 'hr',
        }),
      ]
      const res = await supertest(app.app)
        .get('/api/users/list')
        .set('Authorization', 'Bearer ' + authHr.token)
      expect(res.body.data).toEqual(expected)
    })

    it('Should return error: 401 Unauthorized', async () => {
      const expectedError = {
        code: 401,
        message: 'Unauthorized',
      }
      const response = await supertest(app.app).get('/api/users/list')
      expect({
        code: response.body.code,
        message: response.body.message,
      }).toEqual(expectedError)
    })
  })

  describe('/:id', () => {
    it('Should return: 200 success and expected user that id = 1', async () => {
      const expected = expect.objectContaining({
        id: 1,
        email: 'user01@example.com',
        name: 'name user 1',
        role: 'admin',
      })
      const res = await supertest(app.app)
        .get('/api/users/1')
        .set('Authorization', 'Bearer ' + authHr.token)
      expect(res.body.data).toEqual(expected)
    })
  })

  describe('/getByEmail', () => {
    it('Should return: 200 success and expected user that emal = user01@example.com', async () => {
      const requestData = {
        email: 'user01@example.com',
      }
      const expected = expect.objectContaining({
        id: 1,
        email: 'user01@example.com',
        name: 'name user 1',
        role: 'admin',
      })
      const res = await supertest(app.app)
        .post('/api/users/getByEmail')
        .send(requestData)
        .set('Authorization', 'Bearer ' + authHr.token)
      expect(res.body.data).toEqual(expected)
    })
  })

  describe('/createHr', () => {
    it('Should return: 200 success with user data and hrtest data', async () => {
      const requestData = {
        user: {
          id: 4,
          email: 'khanhdg@paditech.com',
          name: 'Đỗ Gia Khánh',
          password: 'vexento078',
          role: 'hr',
        },
        tests: [1, 2, 3],
      }
      const expected = expect.objectContaining({
        userData: expect.objectContaining({
          id: 4,
          email: 'khanhdg@paditech.com',
          name: 'Đỗ Gia Khánh',
          role: 'hr',
        }),
        hrTestDatas: [
          expect.objectContaining({
            user_id: 4,
            test_id: 1,
          }),
          expect.objectContaining({
            user_id: 4,
            test_id: 2,
          }),
          expect.objectContaining({
            user_id: 4,
            test_id: 3,
          }),
        ],
      })
      const res = await supertest(app.app)
        .post('/api/users/createHr')
        .send(requestData)
        .set('Authorization', 'Bearer ' + authAdmin.token)
      expect(res.body.data).toEqual(expected)
    })

    it('Hr createHr should return: 403 Forbidden', async () => {
      const requestData = {
        user: {
          id: 4,
          email: 'khanhdg@paditech.com',
          name: 'Đỗ Gia Khánh',
          password: 'vexento078',
          role: 'hr',
        },
        tests: [1, 2, 3],
      }
      const expectedError = {
        code: 403,
        message: 'Forbidden',
      }
      const response = await supertest(app.app)
        .post('/api/users/createHr')
        .send(requestData)
        .set('Authorization', 'Bearer ' + authHr.token)
      expect({
        code: response.body.code,
        message: response.body.message,
      }).toEqual(expectedError)
    })
  })
})
