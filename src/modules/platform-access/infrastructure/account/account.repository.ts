import { AvailableDatabaseTable } from '@infrastructure/database/available-tables';
import { QueryBuilder } from '@infrastructure/database/query-builder';
import { Account, PersistedAccount } from '../../core/account/account.aggregate-root';
import { AccountRepository } from '../../core/account/account.repository';
import { ActivationCodeStatusValue } from '../../core/activation-code-status/activation-code-status.value-object';

interface Dependencies {
  queryBuilder: QueryBuilder;
}

export class AccountRepositoryImpl implements AccountRepository {
  constructor(private readonly dependencies: Dependencies) {}

  public async findById(id: string) {
    const { queryBuilder } = this.dependencies;

    const result = await queryBuilder
      .select(['id', 'status'])
      .where('id', id)
      .from(AvailableDatabaseTable.ACCOUNT_REGISTRATION)
      .first();

    if (!result) {
      return null;
    }

    const codeResult = await queryBuilder
      .select('code')
      .where('account_id', result.id)
      .andWhere('status', ActivationCodeStatusValue.Active)
      .from(AvailableDatabaseTable.ACCOUNT_ACTIVATION_CODE)
      .first();

    return AccountRepositoryImpl.toEntity({ ...result, activationCode: codeResult.code });
  }

  public async update(account: Account) {
    const trx = await this.dependencies.queryBuilder.transaction();

    const { id, ...data } = AccountRepositoryImpl.toRecord(account);

    await trx.update(data).where('id', id).into(AvailableDatabaseTable.ACCOUNT_REGISTRATION);

    return trx;
  }

  private static toEntity(record: PersistedAccount): Account {
    return Account.fromPersistence(record);
  }

  private static toRecord(
    account: Account,
  ): Omit<PersistedAccount, 'verificationCodeProviderService' | 'activationCode'> {
    return {
      id: account.getId().getValue(),
      status: account.getStatus(),
    };
  }
}
