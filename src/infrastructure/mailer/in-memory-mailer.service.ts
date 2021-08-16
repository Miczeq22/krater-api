import { createTransport, Transporter } from 'nodemailer';
import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import { Logger } from '@tools/logger';
import { MailerService, SendMailPayload } from './mailer.service';

interface Dependencies {
  logger: Logger;
}

export class InMemorMailerServiceImpl implements MailerService {
  private transporter: Transporter;

  constructor(private readonly dependencies: Dependencies) {
    this.initTransporter();
  }

  private initTransporter() {
    this.transporter = createTransport({
      host: process.env.MAILHOG_HOST,
      port: Number(process.env.SMTP_PORT),
    });
  }

  public async sendMail({
    from = process.env.SERVICE_MAIL,
    to,
    payload,
    subject,
    template: templateName,
  }: SendMailPayload) {
    const { logger } = this.dependencies;

    const emailTemplateSource = fs.readFileSync(
      path.join(__dirname, 'templates', `${templateName}.html`),
      'utf-8',
    );

    const template = Handlebars.compile(emailTemplateSource);

    const htmlToSend = template(payload);

    await this.transporter.sendMail({
      from,
      to,
      subject: `Social Aggregation DDD - ${subject}`,
      html: htmlToSend,
    });

    logger.info(`Email with subject: "${subject}" sent to "${to}".`);
  }
}
