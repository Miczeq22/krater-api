import { UnauthorizedError } from '@errors/unauthorized.error';
import { AvailableDatabaseTable } from '@infrastructure/database/available-tables';
import { QueryBuilder } from '@infrastructure/database/query-builder';
import { QueryHandler } from '@root/framework/processing/query-handler';
import { AccountStatusValue } from '@root/modules/shared/core/account-status/account-status.value-object';
import { GetAccountDataQuery, GET_ACCOUNT_DATA_QUERY } from './get-account-data.query';

interface Dependencies {
  queryBuilder: QueryBuilder;
}

export interface AccountDataDTO {
  id: string;
  email: string;
  nickname: string;
  isEmailConfirmed: boolean;
}

export class GetAccountDataQueryHandler extends QueryHandler<GetAccountDataQuery, AccountDataDTO> {
  constructor(private readonly dependencies: Dependencies) {
    super(GET_ACCOUNT_DATA_QUERY);
  }

  public async handle({ payload: { userId } }: GetAccountDataQuery) {
    const { queryBuilder } = this.dependencies;

    const result = await queryBuilder
      .select(['id', 'email', 'nickname', 'status'])
      .where('id', userId)
      .from(AvailableDatabaseTable.ACCOUNT)
      .first();

    if (!result) {
      throw new UnauthorizedError();
    }

    const { status, ...accountData } = result;

    return {
      ...accountData,
      isEmailConfirmed: status === AccountStatusValue.EmailConfirmed,
    };
  }
}
