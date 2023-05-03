import { CheckEmailDto, CreateInvitedDto } from '@dtos/invited.dto'
import InvitedRepository from '@repositories/invited.repository'
import { Service } from 'typedi'
import AssessmentService from 'app/services/assessment.service'
import { env } from '@env'
import random from '@utils/sub_link'
import { MailService } from 'common/service/mail.service'

@Service()
class InvitedService {
  constructor(
    protected assessmentService: AssessmentService,
    protected invitedRepository: InvitedRepository,
    protected mailService: MailService,
  ) {}

  async checkEmail(body: CheckEmailDto) {
    const emailInfo = await this.invitedRepository.findByOptionals({
      where: {
        email: body.list_email,
        assessment_id: body.assessment_id,
      },
    })
    if (emailInfo.length > 0) {
      return false
    }
    return true
  }

  async inviteCandidate(body: CreateInvitedDto) {
    this.mailService.from('contact.creativeimage.io@gmail.com')
    this.mailService.subject('')
    const assessment = await this.assessmentService.findById(body.assessment_id)
    let sub_link = assessment.sub_link
    const emails = body.list_email
    const updateData = {
      sub_link: random(6),
    }

    const invitedPromises = emails.map(async (email: any) => {
      const invited = this.invitedRepository.createInvited({
        assessment_id: body.assessment_id,
        email: email,
      })
      return invited
    })
    const inviteds = await Promise.all(invitedPromises)
    if (!sub_link) {
      await this.assessmentService.updateSublink(updateData, body.assessment_id)
      sub_link = updateData.sub_link
      const sendMail = emails.map(async (email: any) => {
        this.mailService.to(email)
        this.mailService.html(
          `<h1>You are invited to assessment of crispytalent</h1><p>Please follow this link to access the assessment : http://localhost:3000/candidate?token=${sub_link} </p>`,
        )
        return this.mailService.send()
      })

      await Promise.all(sendMail)
      return {
        inviteds,
        invitedLink: env.app.url + '/assessments/candidate/' + sub_link,
      }
    }
    const sendMail = emails.map(async (email: any) => {
      this.mailService.to(email)
      this.mailService.text(
        `<h1>You are invited to assessment of crispytalent</h1><p>Please follow this link to access the assessment:http://localhost:3000/candidate?token=${sub_link} </p>`,
      )
      this.mailService.subject('Plbants Feedback')
      return this.mailService.send()
    })

    await Promise.all(sendMail)
    return {
      inviteds,
      invitedLink: `http://localhost:3000/candidate?token=${assessment.sub_link}`,
    }
  }
}

export default InvitedService
