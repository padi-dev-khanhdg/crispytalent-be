import App from '../../app'
import supertest from 'supertest'
import { IAuth } from '../../interfaces/auth.interface'
import { response } from 'express'
const app = new App()

let sub_link = ''
let tokenCandidate = ''

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
describe('/assessments', () => {
  describe('/list', () => {
    it('Should return: 200 success and list expected asssessments', async () => {
      const expected = [
        expect.objectContaining({
          name: 'Assessment 1',
          user_id: 2,
          status: 'processing',
          sub_link: null,
        }),
      ]
      const response = await supertest(app.app)
        .get('/api/assessments/list')
        .set('Authorization', 'Bearer ' + authHr.token)
      expect(response.body.data).toEqual(expected)
    })

    it('Should return: 401 Unauthorized', async () => {
      const expectedError = {
        code: 401,
        message: 'Unauthorized',
      }
      const response = await supertest(app.app).get('/api/assessments/list')
      expect({
        code: response.body.code,
        message: response.body.message,
      }).toEqual(expectedError)
    })
  })

  describe('/:id', () => {
    it('Should return: 200 success and expected asssessments that id = 1', async () => {
      const expected = expect.objectContaining({
        name: 'Assessment 1',
        user_id: 2,
        status: 'processing',
        sub_link: null,
      })
      const res = await supertest(app.app)
        .get('/api/assessments/1')
        .set('Authorization', 'Bearer ' + authAdmin.token)
      expect(res.body.data).toEqual(expected)
    })

    it('Should return: 401 Unauthorized', async () => {
      const expectedError = {
        code: 401,
        message: 'Unauthorized',
      }
      const response = await supertest(app.app).get('/api/assessments/1')
      expect({
        code: response.body.code,
        message: response.body.message,
      }).toEqual(expectedError)
    })
  })

  describe('/status', () => {
    it('Should return: 200 success and expected asssessments with 2 item that status = processing', async () => {
      const requestData = {
        status: 'processing',
      }
      const expected = [
        expect.objectContaining({
          id: 1,
          name: 'Assessment 1',
          user_id: 2,
          status: 'processing',
          sub_link: null,
        }),
        expect.objectContaining({
          id: 2,
          name: 'Assessment 2',
          user_id: 3,
          status: 'processing',
          sub_link: null,
        }),
      ]
      const res = await supertest(app.app)
        .post('/api/assessments/status')
        .send(requestData)
        .set('Authorization', 'Bearer ' + authHr.token)
      expect(res.body.data.rows).toEqual(expected)
      expect(res.body.data.count).toEqual(2)
    })

    it('Should return: 200 success', async () => {
      const requestData = {
        status: 'processing',
      }
      const expectedError = {
        code: 200,
        message: 'Success',
      }
      const response = await supertest(app.app)
        .post('/api/assessments/status')
        .send(requestData)
        .set('Authorization', 'Bearer ' + authAdmin.token)
      expect({
        code: response.body.code,
        message: response.body.message,
      }).toEqual(expectedError)
    })
  })

  describe('/create', () => {
    it('Should return: 200 success and expected asssessments , assessmenttests', async () => {
      const requestData = {
        assessment: {
          name: 'Assessment 3',
          start_at: '2022-10-26 19:27:21.738 +00:00',
          end_at: '2022-10-29 19:27:21.738 +00:00',
        },
        tests: [1, 2],
      }
      const expected = expect.objectContaining({
        assessmentData: expect.objectContaining({
          name: 'Assessment 3',
          start_at: '2022-10-26T19:27:21.738Z',
          end_at: '2022-10-29T19:27:21.738Z',
        }),
        assessmentTestData: [
          expect.objectContaining({
            assessment_id: 3,
            test_id: 1,
          }),
          expect.objectContaining({
            assessment_id: 3,
            test_id: 2,
          }),
        ],
      })
      const res = await supertest(app.app)
        .post('/api/assessments/create')
        .send(requestData)
        .set('Authorization', 'Bearer ' + authHr.token)
      expect(res.body.data).toEqual(expected)
    })

    it('Admin create assessment should return: 403 Hr do not have permission', async () => {
      const requestData = {
        assessment: {
          name: 'Assessment 4',
          start_at: '2022-10-26 19:27:21.738 +00:00',
          end_at: '2022-10-29 19:27:21.738 +00:00',
        },
        tests: [1, 2, 3],
      }
      const expectedError = {
        code: 500,
        message: 'Hr do not have permission',
      }
      const response = await supertest(app.app)
        .post('/api/assessments/create')
        .send(requestData)
        .set('Authorization', 'Bearer ' + authAdmin.token)
      expect({
        code: response.body.code,
        message: response.body.message,
      }).toEqual(expectedError)
    })
  })

  describe('/update/:id', () => {
    it('Should return: 200 success and [1] ', async () => {
      const requestData = {
        name: 'Assessment 3',
        start_at: '2022-10-25 14:22:21.738 +00:00',
        end_at: '2022-11-01 14:227:21.738 +00:00',
      }
      const expected = [1]
      const res = await supertest(app.app)
        .put('/api/assessments/update/1')
        .send(requestData)
        .set('Authorization', 'Bearer ' + authHr.token)
      expect(res.body.code).toEqual(200)
      expect(res.body.data).toEqual(expected)
    })
  })

  describe('/update/:id', () => {
    it('Should return: 500 bad request and message Assessment name cannot be empty ', async () => {
      const requestData = {
        start_at: '2022-10-25 14:22:21.738 +00:00',
        end_at: '2022-11-01 14:227:21.738 +00:00',
      }
      const expectedError = {
        code: 500,
        message: 'Assessment name cannot be empty',
      }
      const response = await supertest(app.app)
        .put('/api/assessments/update/1')
        .send(requestData)
        .set('Authorization', 'Bearer ' + authHr.token)
      expect({
        code: response.body.code,
        message: response.body.message,
      }).toEqual(expectedError)
    })
  })

  describe('/updateStatus/:id', () => {
    it('Should return: 200 success and [1] ', async () => {
      const requestData = {
        status: 'archived',
      }
      const expected = [1]
      const res = await supertest(app.app)
        .put('/api/assessments/updateStatus/1')
        .send(requestData)
        .set('Authorization', 'Bearer ' + authHr.token)
      expect(res.body.code).toEqual(200)
      expect(res.body.data).toEqual(expected)
    })
  })

  describe('/updateStatus/:id', () => {
    it('Should return: 500 bad request and message Assessment status cannot be empty', async () => {
      const requestData = {}
      const expectedError = {
        code: 500,
        message: 'Assessment status cannot be empty',
      }
      const response = await supertest(app.app)
        .put('/api/assessments/updateStatus/1')
        .send(requestData)
        .set('Authorization', 'Bearer ' + authHr.token)
      expect({
        code: response.body.code,
        message: response.body.message,
      }).toEqual(expectedError)
    })
  })

  describe('/delete/:id', () => {
    it('Should return: 200 success and 1 ', async () => {
      const expected = 1
      const response = await supertest(app.app)
        .delete('/api/assessments/delete/1')
        .set('Authorization', 'Bearer ' + authHr.token)
      expect(response.body.code).toEqual(200)
      expect(response.body.data).toEqual(expected)
    })

    it('Delete unexist item should return: 200 success and 0 ', async () => {
      const expected = 0
      const response = await supertest(app.app)
        .delete('/api/assessments/delete/10')
        .set('Authorization', 'Bearer ' + authHr.token)
      expect(response.body.code).toEqual(200)
      expect(response.body.data).toEqual(expected)
    })
  })

  describe('/:id/inviteCandidate', () => {
    it('Should return: 200 success and expected data ', async () => {
      const requestData = {
        emails: [
          'kanhdg@paditech.com',
          'hungmh@hptech.com',
          'sdgsdgsad@gmail.com',
          'maskedhero1002@gmail.com',
          '29x72778@gmail.com',
        ],
      }
      const expected = expect.objectContaining({
        inviteds: [
          expect.objectContaining({
            assessment_id: '3',
            email: 'kanhdg@paditech.com',
          }),
          expect.objectContaining({
            assessment_id: '3',
            email: 'hungmh@hptech.com',
          }),
          expect.objectContaining({
            assessment_id: '3',
            email: 'sdgsdgsad@gmail.com',
          }),
          expect.objectContaining({
            assessment_id: '3',
            email: 'maskedhero1002@gmail.com',
          }),
          expect.objectContaining({
            assessment_id: '3',
            email: '29x72778@gmail.com',
          }),
        ],
        updateAssessmentSubLink: [1],
      })
      const response = await supertest(app.app)
        .post('/api/assessments/3/inviteCandidate')
        .set('Authorization', 'Bearer ' + authHr.token)
        .send(requestData)
      expect(response.body.code).toEqual(200)
      expect(response.body.data).toEqual(expected)
    })

    it('Should return: 401 Unauthorized', async () => {
      const requestData = {
        emails: [
          'kanhdg@paditech.com',
          'hungmh@hptech.com',
          'sdgsdgsad@gmail.com',
          'maskedhero1002@gmail.com',
          '29x72778@gmail.com',
        ],
      }
      const expectedError = {
        code: 401,
        message: 'Unauthorized',
      }
      const response = await supertest(app.app)
        .post('/api/assessments/3/inviteCandidate')
        .send(requestData)
      expect({
        code: response.body.code,
        message: response.body.message,
      }).toEqual(expectedError)
    })

    it('invite to deleted assessment should return: 500 Assessment not exsist', async () => {
      const requestData = {
        emails: [
          'kanhdg@paditech.com',
          'hungmh@hptech.com',
          'sdgsdgsad@gmail.com',
          'maskedhero1002@gmail.com',
          '29x72778@gmail.com',
        ],
      }
      const expectedError = {
        code: 500,
        message: 'Assessment not exsist',
      }
      const response = await supertest(app.app)
        .post('/api/assessments/1/inviteCandidate')
        .set('Authorization', 'Bearer ' + authHr.token)
        .send(requestData)
      expect({
        code: response.body.code,
        message: response.body.message,
      }).toEqual(expectedError)
    })

    it('already invited should return: 500 Validation error', async () => {
      const requestData = {
        emails: [
          'kanhdg@paditech.com',
          'hungmh@hptech.com',
          'sdgsdgsad@gmail.com',
          'maskedhero1002@gmail.com',
          '29x72778@gmail.com',
        ],
      }
      const expectedError = {
        code: 500,
        message: 'Validation error',
      }
      const response = await supertest(app.app)
        .post('/api/assessments/3/inviteCandidate')
        .set('Authorization', 'Bearer ' + authHr.token)
        .send(requestData)
      expect({
        code: response.body.code,
        message: response.body.message,
      }).toEqual(expectedError)
    })

    it('invited more: return 200 success and same sub_link', async () => {
      const requestDataInvite = {
        emails: [
          'kanhdg@paditech.com',
          'hungmh@hptech.com',
          'sdgsdgsad@gmail.com',
          'maskedhero1002@gmail.com',
          '29x72778@gmail.com',
        ],
      }
      const requestDataInviteMore = {
        emails: ['sheepondamoondg@paditech.com'],
      }
      const responseInvite = await supertest(app.app)
        .post('/api/assessments/2/inviteCandidate')
        .set('Authorization', 'Bearer ' + authHr.token)
        .send(requestDataInvite)
      const responseInviteMore = await supertest(app.app)
        .post('/api/assessments/2/inviteCandidate')
        .set('Authorization', 'Bearer ' + authHr.token)
        .send(requestDataInviteMore)
      expect(responseInvite.body.data.invitedLink).toEqual(responseInviteMore.body.data.invitedLink)
      sub_link = responseInvite.body.data.invitedLink.split('/')[3]
    })
  })

  describe('/candidate/:sub_link/accessing', () => {
    it('accessing by invited email: should return 200 success', async () => {
      const requestData = {
        email: 'sheepondamoondg@paditech.com',
      }
      const expectedSuccess = {
        code: 200,
        message: 'Success',
      }
      const response = await supertest(app.app)
        .post(`/api/assessments/candidate/${sub_link}/accessing`)
        .send(requestData)
      tokenCandidate = response.body.data
      expect({
        code: response.body.code,
        message: response.body.message,
      }).toEqual(expectedSuccess)
    })
    it('accessing by uninvited email: should return 403 message Forbidden', async () => {
      const requestData = {
        email: 'hpt@paditech.com',
      }
      const expectedError = {
        code: 403,
        message: 'Forbidden',
        data: 'You are not invited to this assessment, are you ? ',
      }
      const response = await supertest(app.app)
        .post(`/api/assessments/candidate/${sub_link}/accessing`)
        .send(requestData)
      expect({
        code: response.body.code,
        message: response.body.message,
        data: response.body.data,
      }).toEqual(expectedError)
    })
  })

  describe('/candidate/:sub_link/1', () => {
    it('should return 200 and Success and 25 topics', async () => {
      const expectedDataLength = 25
      const expectedCode = 200
      const response = await supertest(app.app)
        .get(`/api/assessments/candidate/${sub_link}/1`)
        .set('Authorization', 'Bearer ' + tokenCandidate)
      expect({
        code: response.body.code,
        dataLength: response.body.data.length,
      }).toEqual({
        code: expectedCode,
        dataLength: expectedDataLength,
      })
    })
    it('should return 401 Unauthorized', async () => {
      const expectedError = {
        code: 401,
        message: 'Unauthorized',
      }
      const response = await supertest(app.app).get(`/api/assessments/candidate/${sub_link}/1`)
      expect({
        code: response.body.code,
        message: response.body.message,
      }).toEqual(expectedError)
    })
  })

  describe('/candidate/:sub_link', () => {
    it('should return 200 and exptected assessment tests', async () => {
      const expected = [
        { id: 1, name: 'Memory Test' },
        { id: 2, name: 'Logical Test' },
        { id: 3, name: 'Visual Test' },
      ]
      const response = await supertest(app.app)
        .get(`/api/assessments/candidate/${sub_link}`)
        .set('Authorization', 'Bearer ' + tokenCandidate)
      expect({
        code: response.body.code,
        data: response.body.data,
      }).toEqual({
        code: 200,
        data: expected,
      })
    })
  })

  describe('/candidate/:sub_link/:test_id/result', () => {
    it('should return 200 and not null score', async () => {
      const requestData = {
        topics: [
          {
            id: 177,
            question: '<h1>Question title</h1><div>Description for question</div>',
            answer: '1',
          },
          {
            id: 163,
            question: '<h1>Question title</h1><div>Description for question</div>',
            answer: '1',
          },
          {
            id: 153,
            question: '<h1>Question title</h1><div>Description for question</div>',
            answer: '0',
          },
          {
            id: 111,
            question: '<h1>Question title</h1><div>Description for question</div>',
            answer: '0',
          },
          {
            id: 82,
            question: '<h1>Question title</h1><div>Description for question</div>',
            answer: '1',
          },
          {
            id: 149,
            question: '<h1>Question title</h1><div>Description for question</div>',
            answer: '1',
          },
          {
            id: 134,
            question: '<h1>Question title</h1><div>Description for question</div>',
            answer: '0',
          },
          {
            id: 148,
            question: '<h1>Question title</h1><div>Description for question</div>',
            answer: '0',
          },
          {
            id: 103,
            question: '<h1>Question title</h1><div>Description for question</div>',
            answer: '1',
          },
          {
            id: 138,
            question: '<h1>Question title</h1><div>Description for question</div>',
            answer: '1',
          },
          {
            id: 112,
            question: '<h1>Question title</h1><div>Description for question</div>',
            answer: '0',
          },
          {
            id: 147,
            question: '<h1>Question title</h1><div>Description for question</div>',
            answer: '1',
          },
          {
            id: 176,
            question: '<h1>Question title</h1><div>Description for question</div>',
            answer: '0',
          },
          {
            id: 95,
            question: '<h1>Question title</h1><div>Description for question</div>',
            answer: '1',
          },
          {
            id: 86,
            question: '<h1>Question title</h1><div>Description for question</div>',
            answer: '0',
          },
          {
            id: 133,
            question: '<h1>Question title</h1><div>Description for question</div>',
            answer: '0',
          },
          {
            id: 83,
            question: '<h1>Question title</h1><div>Description for question</div>',
            answer: '1',
          },
          {
            id: 181,
            question: '<h1>Question title</h1><div>Description for question</div>',
            answer: '0',
          },
          {
            id: 78,
            question: '<h1>Question title</h1><div>Description for question</div>',
            answer: '0',
          },
          {
            id: 90,
            question: '<h1>Question title</h1><div>Description for question</div>',
            answer: '1',
          },
        ],
      }
      const response = await supertest(app.app)
        .post(`/api/assessments/candidate/${sub_link}/2/result`)
        .set('Authorization', 'Bearer ' + tokenCandidate)
        .send(requestData)
      expect(response.body.code).toEqual(200)
      expect(response.body.data).toBeDefined()
    })
    it('should return error 401 Unauthorized', async () => {
      const requestData = {
        topics: [
          {
            id: 177,
            question: '<h1>Question title</h1><div>Description for question</div>',
            answer: '1',
          },
          {
            id: 163,
            question: '<h1>Question title</h1><div>Description for question</div>',
            answer: '1',
          },
          {
            id: 153,
            question: '<h1>Question title</h1><div>Description for question</div>',
            answer: '0',
          },
          {
            id: 111,
            question: '<h1>Question title</h1><div>Description for question</div>',
            answer: '0',
          },
          {
            id: 82,
            question: '<h1>Question title</h1><div>Description for question</div>',
            answer: '1',
          },
          {
            id: 149,
            question: '<h1>Question title</h1><div>Description for question</div>',
            answer: '1',
          },
          {
            id: 134,
            question: '<h1>Question title</h1><div>Description for question</div>',
            answer: '0',
          },
          {
            id: 148,
            question: '<h1>Question title</h1><div>Description for question</div>',
            answer: '0',
          },
          {
            id: 103,
            question: '<h1>Question title</h1><div>Description for question</div>',
            answer: '1',
          },
          {
            id: 138,
            question: '<h1>Question title</h1><div>Description for question</div>',
            answer: '1',
          },
          {
            id: 112,
            question: '<h1>Question title</h1><div>Description for question</div>',
            answer: '0',
          },
          {
            id: 147,
            question: '<h1>Question title</h1><div>Description for question</div>',
            answer: '1',
          },
          {
            id: 176,
            question: '<h1>Question title</h1><div>Description for question</div>',
            answer: '0',
          },
          {
            id: 95,
            question: '<h1>Question title</h1><div>Description for question</div>',
            answer: '1',
          },
          {
            id: 86,
            question: '<h1>Question title</h1><div>Description for question</div>',
            answer: '0',
          },
          {
            id: 133,
            question: '<h1>Question title</h1><div>Description for question</div>',
            answer: '0',
          },
          {
            id: 83,
            question: '<h1>Question title</h1><div>Description for question</div>',
            answer: '1',
          },
          {
            id: 181,
            question: '<h1>Question title</h1><div>Description for question</div>',
            answer: '0',
          },
          {
            id: 78,
            question: '<h1>Question title</h1><div>Description for question</div>',
            answer: '0',
          },
          {
            id: 90,
            question: '<h1>Question title</h1><div>Description for question</div>',
            answer: '1',
          },
        ],
      }
      const expectedError = {
        code: 401,
        message: 'Unauthorized',
      }
      const response = await supertest(app.app)
        .post(`/api/assessments/candidate/${sub_link}/2/result`)
        .send(requestData)
      expect({
        code: response.body.code,
        message: response.body.message,
      }).toEqual(expectedError)
    })
  })

  describe('/:id/result', () => {
    it('should return 200 and exptected data', async () => {
      const exptected = [
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
        expect.objectContaining({
          note: 'random note',
          assessment_id: 2,
          test_id: 2,
          user_id: 5,
        }),
      ]
      const response = await supertest(app.app)
        .get('/api/assessments/2/result')
        .set('Authorization', 'Bearer ' + authHr.token)
      expect(response.body.data).toEqual(exptected)
    })
    it('should return error 401 Unauthorized', async () => {
      const expectedError = {
        code: 401,
        message: 'Unauthorized',
      }
      const response = await supertest(app.app).get('/api/assessments/2/result')
      expect({
        code: response.body.code,
        message: response.body.message,
      }).toEqual(expectedError)
    })
  })
})
