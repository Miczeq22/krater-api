import { AvailableDatabaseTable } from '@infrastructure/database/available-tables';
import { QueryBuilder } from '@infrastructure/database/query-builder';
import { DomainSubscriber } from '@root/framework/ddd-building-blocks/domain-subscriber';
import { UniqueEntityID } from '@root/framework/unique-entity-id';
import {
  EmailVerificationCodeGeneratedEvent,
  EMAIL_VERIFICATION_CODE_GENERATED_EVENT,
} from '@root/modules/platform-access/core/account/events/email-verification-code-generated.event';
import { ActivationCodeStatus } from '@root/modules/platform-access/core/activation-code-status/activation-code-status.value-object';

interface Dependencies {
  queryBuilder: QueryBuilder;
}

export class EmailVerificationCodeGeneratedSubscriber extends DomainSubscriber<EmailVerificationCodeGeneratedEvent> {
  constructor(private readonly dependencies: Dependencies) {
    super(EMAIL_VERIFICATION_CODE_GENERATED_EVENT);
  }

  public async handle({
    payload: { accountId, activationCode, generatedAt },
  }: EmailVerificationCodeGeneratedEvent) {
    const { queryBuilder } = this.dependencies;

    const trx = await queryBuilder.transaction();

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
