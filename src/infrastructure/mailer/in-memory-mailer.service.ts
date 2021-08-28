import { createTransport, Transporter } from 'nodemailer';
import { QueryBuilder } from '@infrastructure/database/query-builder';
import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import { Logger } from '@tools/logger';
import { AvailableDatabaseTable } from '@infrastructure/database/available-tables';
import { UniqueEntityID } from '@root/framework/unique-entity-id';
import { MailerService, SendMailPayload } from './mailer.service';

interface Dependencies {
  logger: Logger;
  queryBuilder: QueryBuilder;
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
    const { logger, queryBuilder } = this.dependencies;

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

    await queryBuilder
      .insert({
        from,
        to,
        payload: JSON.stringify(payload),
        template: templateName,
        id: new UniqueEntityID().getValue(),
        sent_at: new Date().toISOString(),
      })
      .into(AvailableDatabaseTable.EMAIL_SENT);

    logger.info(`[Mailer Service]: Email with subject: "${subject}" sent to "${to}".`);
  }
}
