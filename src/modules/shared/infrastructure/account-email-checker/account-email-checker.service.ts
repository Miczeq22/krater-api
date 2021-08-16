import { AvailableDatabaseTable } from '@infrastructure/database/available-tables';
import { QueryBuilder } from '@infrastructure/database/query-builder';
import { AccountEmailCheckerService } from '../../core/account-email/account-email-checker.service';

interface Dependencies {
  queryBuilder: QueryBuilder;
}

export class AccountEmailCheckerServiceImpl implements AccountEmailCheckerService {
  constructor(private readonly dependencies: Dependencies) {}

  public async isUnique(email: string) {
    const { queryBuilder } = this.dependencies;

    const result = await queryBuilder
      .select('id')
      .where('email', email)
      .from(AvailableDatabaseTable.ACCOUNT_REGISTRATION);

    return result.length === 0;
  }
}
