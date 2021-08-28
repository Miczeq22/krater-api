import { AvailableDatabaseTable } from '@infrastructure/database/available-tables';
import { DatabaseTransaction } from '@infrastructure/database/database-transaction';
import { DomainEvents } from '@infrastructure/message-queue/in-memory/in-memory-message-queue.service';
import { DomainSubscriber } from '@root/framework/ddd-building-blocks/domain-subscriber';
import { UniqueEntityID } from '@root/framework/unique-entity-id';
import {
  EmailVerificationCodeGeneratedEventPayload,
  EMAIL_VERIFICATION_CODE_GENERATED_EVENT,
} from '@root/modules/platform-access/core/account/events/email-verification-code-generated.event';
import { ActivationCodeStatus } from '@root/modules/platform-access/core/activation-code-status/activation-code-status.value-object';

export class EmailVerificationCodeGeneratedSubscriber extends DomainSubscriber<EmailVerificationCodeGeneratedEventPayload> {
  constructor() {
    super(EMAIL_VERIFICATION_CODE_GENERATED_EVENT);
  }

  public setup() {
    DomainEvents.register(this.handle.bind(this), this.name);
  }

  public async handle(
    { accountId, activationCode, generatedAt }: EmailVerificationCodeGeneratedEventPayload,
    trx: DatabaseTransaction,
  ) {
    try {
      await trx
        .update({
          status: ActivationCodeStatus.Archived.getValue(),
        })
        .where('account_id', accountId)
        .into(AvailableDatabaseTable.ACCOUNT_ACTIVATION_CODE);

      await trx
        .insert({
          id: new UniqueEntityID().getValue(),
          account_id: accountId,
          status: ActivationCodeStatus.Active.getValue(),
          created_at: generatedAt,
          code: activationCode,
        })
        .into(AvailableDatabaseTable.ACCOUNT_ACTIVATION_CODE);
    } catch (error) {
      trx.rollback();

      throw error;
    }
  }
}
