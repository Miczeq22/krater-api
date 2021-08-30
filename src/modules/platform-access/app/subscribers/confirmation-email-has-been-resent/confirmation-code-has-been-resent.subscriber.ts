import { MailerService } from '@infrastructure/mailer/mailer.service';
import { DomainEvents } from '@infrastructure/message-queue/in-memory/in-memory-message-queue.service';
import { DomainSubscriber } from '@root/framework/ddd-building-blocks/domain-subscriber';
import {
  ConfirmationCodeHasBeenResentEventPayload,
  CONFIRMATION_CODE_HAS_BEEN_RESENT_EVENT,
} from '@root/modules/platform-access/core/account/events/confirmation-code-has-been-resent.event';

interface Dependencies {
  mailerService: MailerService;
}

export class ConfirmationCodeHasBeenResentSubscriber extends DomainSubscriber<ConfirmationCodeHasBeenResentEventPayload> {
  constructor(private readonly dependencies: Dependencies) {
    super(CONFIRMATION_CODE_HAS_BEEN_RESENT_EVENT);
  }

  public setup() {
    DomainEvents.register(this.handle.bind(this), this.name);
  }

  public async handle({ accountEmail, activationCode }: ConfirmationCodeHasBeenResentEventPayload) {
    const { mailerService } = this.dependencies;

    await mailerService.sendMail({
      subject: 'New confirmation code',
      template: 'resend-confirmation-code',
      to: accountEmail,
      payload: {
        activationCode,
        link: `${process.env.FRONTEND_URL}/confirm-email`,
      },
    });
  }
}
