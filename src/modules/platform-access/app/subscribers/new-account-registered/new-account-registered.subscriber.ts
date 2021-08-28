import { AvailableDatabaseTable } from '@infrastructure/database/available-tables';
import { DatabaseTransaction } from '@infrastructure/database/database-transaction';
import { MailerService } from '@infrastructure/mailer/mailer.service';
import { DomainEvents } from '@infrastructure/message-queue/in-memory/in-memory-message-queue.service';
import { DomainSubscriber } from '@root/framework/ddd-building-blocks/domain-subscriber';
import { UniqueEntityID } from '@root/framework/unique-entity-id';
import { AccountRegistrationRepository } from '@root/modules/platform-access/core/account-registration/account-registration.repository';
import {
  NewAccountRegisteredEventPayload,
  NEW_ACCOUNT_REGISTERED_EVENT,
} from '@root/modules/platform-access/core/account-registration/events/new-account-registered.event';
import { ActivationCodeStatus } from '@root/modules/platform-access/core/activation-code-status/activation-code-status.value-object';

interface Dependencies {
  mailerService: MailerService;
  accountRegistration: AccountRegistrationRepository;
}

export class NewAccontRegisteredSubscriber extends DomainSubscriber<NewAccountRegisteredEventPayload> {
  constructor(private readonly dependencies: Dependencies) {
    super(NEW_ACCOUNT_REGISTERED_EVENT);
  }

  public setup() {
    DomainEvents.register(this.handle.bind(this), this.name);
  }

  public async handle(
    { email, accountId, activationCode, generatedAt }: NewAccountRegisteredEventPayload,
    trx: DatabaseTransaction,
  ) {
    const { mailerService } = this.dependencies;

    await trx
      .insert({
        id: new UniqueEntityID().getValue(),
        account_id: accountId,
        code: activationCode,
        created_at: generatedAt,
        status: ActivationCodeStatus.Active.getValue(),
      })
      .into(AvailableDatabaseTable.ACCOUNT_ACTIVATION_CODE);

    await mailerService.sendMail({
      payload: {
        activationCode,
        link: `${process.env.FRONTEND_URL}/confirm-email`,
      },
      subject: 'Welcome',
      template: 'welcome',
      to: email,
    });
  }
}
