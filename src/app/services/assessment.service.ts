import AssessmentRepository from '@repositories/assessment.repository'
import { Service } from 'typedi'
import TestService from './test.service'
import RedisService from 'common/cache/service/redis.service'
import { Op } from 'sequelize'
import TopicService from './topic.service'
import ResultService from './results.service'
import { TestStatusEnum } from '@enums/test.enum'

@Service()
class AssessmentService {
  constructor(
    protected assessmentRepository: AssessmentRepository,
    protected testService: TestService,
    protected redisService: RedisService,
    protected topicService: TopicService,
    protected resultService: ResultService,
  ) {}

  async findById(id: number) {
    return this.assessmentRepository.findById(id)
  }

  async updateSublink(updateData: any, id: number) {
    return this.assessmentRepository.updateSubLinkAssessment(updateData, id)
  }

  async getInfoAssessment(sub_link: string) {
    const assessmentInfo = await this.assessmentRepository.findBySubLink(sub_link)
    return {
      logo: '',
      company_name: 'Crispy',
      start_date: assessmentInfo.start_date,
      end_date: assessmentInfo.end_date,
    }
  }

  async generateTopic(req: any) {
    const { user } = req

    const testInfo = await this.testService.findById(req.params.test_id)

    const userTopicCache = await this.redisService.lrange(user.email + 'topic', 0, -1)

    if (userTopicCache.length > 0) {
      const topicArray = userTopicCache.map((topic) => JSON.parse(topic))

      const cachedTopic = topicArray.map((topic) => {
        return topic.id
      })

      const answered = topicArray.map((topic) => {
        if (topic.answer) {
          return topic
        }
      }).length

      const topic = await this.topicService.getTopic({
        test_id: req.params.test_id,
        id: {
          [Op.notIn]: cachedTopic,
        },
      })

      await this.redisService.lpush(
        user.email + 'topic',
        JSON.stringify({
          id: topic.id,
          question: topic.question,
          game_id: topic.test_id,
          isSkip: false,
        }),
      )

      const isGameEnded = answered == 32 ? true : false

      const responseData = {
        answered_question_num: answered,
        game_ended: isGameEnded,
        option: null,
        question: {
          id: topic.id,
          game_id: topic.test_id,
          content: topic.question,
          score: 1,
        },
        time: testInfo.time,
        total_question: 32,
        total_score: testInfo.score,
        used_time: 1,
      }
      return responseData
    } else {
      const topic = await this.topicService.getTopic({
        test_id: req.params.test_id,
      })

      await this.redisService.lpush(
        user.email + 'topic',
        JSON.stringify({
          id: topic.id,
          question: topic.question,
          game_id: topic.test_id,
          isSkip: false,
        }),
      )
      const responseData = {
        answered_question_num: 0,
        game_ended: false,
        option: null,
        question: {
          id: topic.id,
          game_id: topic.test_id,
          content: topic.question,
          score: 1,
        },
        time: testInfo.time,
        total_question: 32,
        total_score: testInfo.score,
        used_time: 1,
      }
      return responseData
    }
  }

  async answerQuestion(req: any) {
    const { user } = req

    const userTopicCache = await this.redisService.lrange(user.email + 'topic', 0, -1)

    const topicArray = userTopicCache.map((topic) => JSON.parse(topic))

    let isResultCorrect = null

    await this.redisService.delete(user.email + 'topic')

    const cachedTopic = topicArray.map(async (topic) => {
      if (topic.id == req.body.question_id) {
        const topicInfo = await this.topicService.getTopicById(topic.id)
        if (topicInfo.answer == req.body.answer && req.body.answer) {
          isResultCorrect = 1
          topic.isCorrect = true
        } else if (topicInfo.answer != req.body.answer && req.body.answer) {
          isResultCorrect = 0
          topic.isCorrect = false
        }
        topic.answer = req.body.answer
        topic.isSkip = req.body.is_skip
      }

      return this.redisService.lpush(user.email + 'topic', JSON.stringify(topic))
    })

    await Promise.all(cachedTopic)

    const testInfo = await this.testService.findById(req.params.test_id)

    const userTopicCached = await this.redisService.lrange(user.email + 'topic', 0, -1)

    const topicArrayCached = userTopicCached.map((topic) => JSON.parse(topic))

    const listTopic = topicArrayCached.map((topic) => {
      return topic.id
    })

    const answered = topicArrayCached.map((topic) => {
      if (topic.answer) {
        return topic
      }
    }).length

    const topic = await this.topicService.getTopic({
      test_id: req.params.test_id,
      id: {
        [Op.notIn]: listTopic,
      },
    })

    await this.redisService.lpush(
      user.email + 'topic',
      JSON.stringify({
        id: topic.id,
        question: topic.question,
        game_id: topic.test_id,
        isSkip: false,
      }),
    )

    const isGameEnded = answered == 32 ? true : false

    const responseData = {
      answered_question_num: answered,
      game_ended: isGameEnded,
      option: null,
      question: {
        id: topic.id,
        game_id: topic.test_id,
        content: topic.question,
        score: 1,
      },
      time: testInfo.time,
      total_question: 32,
      total_score: testInfo.score,
      used_time: 1,
      result: isResultCorrect,
    }
    return responseData
  }

  async getScore(req: any, test_id: number) {
    const { user } = req

    const assessmentInfoProcess = await this.assessmentRepository.findBySubLink(req.body.sub_link)

    const testInfoProcess = await this.testService.findById(test_id)

    const userTopicCacheProcess = await this.redisService.lrange(user.email + 'topic', 0, -1)

    const userTestCacheProcess = await this.redisService.lrange(user.email + 'test', 0, -1)

    const [assessmentInfo, testInfo, userTopicCache, userTestCache] = await Promise.all([
      assessmentInfoProcess,
      testInfoProcess,
      userTopicCacheProcess,
      userTestCacheProcess,
    ])

    await this.redisService.delete(user.email + 'test')

    const topicArray = userTopicCache.map((topic) => JSON.parse(topic))

    const testArray = userTestCache.map((test) => JSON.parse(test))

    let score = 0

    topicArray.forEach((topic) => {
      if (topic.isCorrect) {
        score++
      }
    })

    const cacheTest = testArray.map(async (test) => {
      if (test.id == test_id) {
        test.status = TestStatusEnum.FINISH
        test.status_text = 'Finish'
      }
      return this.redisService.lpush(user.email + 'test', JSON.stringify(test))
    })

    await Promise.all(cacheTest)

    await this.resultService.createResult({
      score: Math.round((100 / 32) * score),
      user_email: req.user.email,
      test_name: testInfo.name,
      assessment_name: assessmentInfo.name,
    })

    return score
  }
}

export default AssessmentService
