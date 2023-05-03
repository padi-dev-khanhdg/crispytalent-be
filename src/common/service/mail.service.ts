import * as nodeMailer from 'nodemailer'
import { env } from '@env'
import { Service } from 'typedi'

@Service()
export class MailService {
  private transporter: nodeMailer.Transporter
  private fromValue: string
  private toValue: string
  private subjectValue: string
  private textValue: string
  private htmlValue: string

  public constructor() {
    this.transporter = nodeMailer.createTransport({
      service: 'Gmail',
      port: 465,
      auth: {
        user: '29x77278@gmail.com',
        pass: 'qbhkthbjxdlkumee',
      },
    })
  }

  public from(value: string) {
    this.fromValue = value

    return this
  }

  public to(value: string) {
    this.toValue = value

    return this
  }

  public subject(value: string) {
    this.subjectValue = value

    return this
  }

  public text(value: string) {
    this.textValue = value

    return this
  }

  public html(value: string) {
    this.htmlValue = value

    return this
  }

  public async send() {
    const mailOptions = {
      from: this.fromValue,
      to: this.toValue,
      subject: this.subjectValue,
      text: this.textValue,
      html: this.htmlValue,
    }

    return this.transporter.sendMail(mailOptions)
  }
}
