import { AvailableDatabaseTable } from '@infrastructure/database/available-tables';
import { QueryBuilder } from '@infrastructure/database/query-builder';
import {
  AccountRegistration,
  PersistedAccountRegistration,
} from '../../core/account-registration/account-registration.aggregate-root';
import { AccountRegistrationRepository } from '../../core/account-registration/account-registration.repository';

interface Dependencies {
  queryBuilder: QueryBuilder;
}

export class AccountRegistrationRepositoryImpl implements AccountRegistrationRepository {
  constructor(private readonly dependencies: Dependencies) {}

  public async insert(account: AccountRegistration) {
    const trx = await this.dependencies.queryBuilder.transaction();

    await trx
      .insert(AccountRegistrationRepositoryImpl.toPersistence(account))
      .into(AvailableDatabaseTable.ACCOUNT_REGISTRATION);

    return trx;
  }

  public static toPersistence(account: AccountRegistration): PersistedAccountRegistration {
    return {
      id: account.getId().getValue(),
      email: account.getEmail(),
      password: account.getPassword(),
      status: account.getStatus(),
      nickname: account.getNickname(),
      registration_date: account.getRegistrationDate().toISOString(),
      email_confirmation_date: account.getEmailConfirmationDate()
        ? account.getEmailConfirmationDate()!.toISOString()
        : null,
    };
  }
}
