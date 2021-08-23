import { MailerService } from '@infrastructure/mailer/mailer.service';
import { DomainSubscriber } from '@root/framework/ddd-building-blocks/domain-subscriber';
import {
  NewAccountRegisteredEventPayload,
  NEW_ACCOUNT_REGISTERED_EVENT,
} from '@root/modules/platform-access/core/account-registration/events/new-account-registered.event';
import { VerificationCodeProviderService } from '@root/modules/platform-access/core/services/verification-code-provider.service';
import { TokenProviderService } from '@root/modules/shared/infrastructure/token-provider/token-provider.service';

interface Dependencies {
  mailerService: MailerService;
  tokenProviderService: TokenProviderService;
  verificationCodeProviderService: VerificationCodeProviderService;
}

export class NewAccontRegisteredSubscriber extends DomainSubscriber<NewAccountRegisteredEventPayload> {
  constructor(private readonly dependencies: Dependencies) {
    super(NEW_ACCOUNT_REGISTERED_EVENT);
  }

  public async handle({ email }: NewAccountRegisteredEventPayload) {
    const { mailerService, tokenProviderService, verificationCodeProviderService } =
      this.dependencies;

    const confirmToken = tokenProviderService.generateToken({ userEmail: email }, '48h');

    await mailerService.sendMail({
      payload: {
        link: `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}/confirm-email?token=${confirmToken}`,
        activationCode: verificationCodeProviderService.generateEmailVerificationCode(),
      },
      subject: 'Welcome',
      template: 'welcome',
      to: email,
    });
  }
}
