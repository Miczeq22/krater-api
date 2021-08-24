import { AvailableDatabaseTable } from '@infrastructure/database/available-tables';
import { QueryBuilder } from '@infrastructure/database/query-builder';
import { Account, PersistedAccount } from '../../core/account/account.aggregate-root';
import { AccountRepository } from '../../core/account/account.repository';

interface Dependencies {
  queryBuilder: QueryBuilder;
}

export class AccountRepositoryImpl implements AccountRepository {
  constructor(private readonly dependencies: Dependencies) {}

  public async findByEmail(email: string) {
    const { queryBuilder } = this.dependencies;

    const result = await queryBuilder
      .select(['id', 'status'])
      .where('email', email)
      .from(AvailableDatabaseTable.ACCOUNT_REGISTRATION)
      .first();

    return result ? AccountRepositoryImpl.toEntity(result) : null;
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
  ): Omit<PersistedAccount, 'verificationCodeProviderService'> {
    return {
      id: account.getId().getValue(),
      status: account.getStatus(),
    };
  }
}
