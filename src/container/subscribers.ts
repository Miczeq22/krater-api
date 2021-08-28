import { DomainSubscriber } from '@root/framework/ddd-building-blocks/domain-subscriber';
import { ConfirmationCodeHasBeenResentSubscriber } from '@root/modules/platform-access/app/subscribers/confirmation-email-has-been-resent/confirmation-code-has-been-resent.subscriber';
import { EmailVerificationCodeGeneratedSubscriber } from '@root/modules/platform-access/app/subscribers/email-verification-code-generated/email-verification-code-generated.subscriber';
import { NewAccontRegisteredSubscriber } from '@root/modules/platform-access/app/subscribers/new-account-registered/new-account-registered.subscriber';
import { asClass, AwilixContainer } from 'awilix';
import { registerAsArray } from './register-as-array';

export const registerSubscribers = (container: AwilixContainer) => {
  container.register({
    subscribers: registerAsArray<DomainSubscriber<any>>([
      asClass(NewAccontRegisteredSubscriber).singleton(),
      asClass(EmailVerificationCodeGeneratedSubscriber).singleton(),
      asClass(ConfirmationCodeHasBeenResentSubscriber).singleton(),
    ]),
  });
};
