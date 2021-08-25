import { AvailableDatabaseTable } from '@infrastructure/database/available-tables';
import { QueryBuilder } from '@infrastructure/database/query-builder';
import { PasswordHashProviderService } from '@root/modules/shared/core/account-password/password-hash-provider.service';
import { Account, PersistedAccount } from '../../core/account/account.aggregate-root';
import { AccountRepository } from '../../core/account/account.repository';
import { ActivationCodeStatusValue } from '../../core/activation-code-status/activation-code-status.value-object';
import { VerificationCodeProviderService } from '../../core/services/verification-code-provider.service';

interface Dependencies {
  queryBuilder: QueryBuilder;
  passwordHashProviderService: PasswordHashProviderService;
  verificationCodeProviderService: VerificationCodeProviderService;
}

export class AccountRepositoryImpl implements AccountRepository {
  constructor(private readonly dependencies: Dependencies) {}

  public async findById(id: string) {
    const { queryBuilder, passwordHashProviderService, verificationCodeProviderService } =
      this.dependencies;

    const result = await queryBuilder
      .select(['id', 'status', 'password'])
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

    return AccountRepositoryImpl.toEntity({
      ...result,
      passwordHashProviderService,
      verificationCodeProviderService,
      activationCode: codeResult.code,
    });
  }

  public async findByEmail(email: string) {
    const { queryBuilder, passwordHashProviderService, verificationCodeProviderService } =
      this.dependencies;

    const result = await queryBuilder
      .select(['id', 'status', 'password'])
      .where('email', email)
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

    return AccountRepositoryImpl.toEntity({
      ...result,
      passwordHashProviderService,
      verificationCodeProviderService,
      activationCode: codeResult.code,
    });
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
  ): Omit<
    PersistedAccount,
    | 'verificationCodeProviderService'
    | 'activationCode'
    | 'password'
    | 'passwordHashProviderService'
  > {
    return {
      id: account.getId().getValue(),
      status: account.getStatus(),
    };
  }
}
