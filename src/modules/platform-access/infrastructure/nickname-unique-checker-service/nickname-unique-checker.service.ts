import { AvailableDatabaseTable } from '@infrastructure/database/available-tables';
import { QueryBuilder } from '@infrastructure/database/query-builder';
import { NicknameUniqueCheckerService } from '../../core/services/nickname-unique-checker.service';

interface Dependencies {
  queryBuilder: QueryBuilder;
}

export class NicknameUniqueCheckerServiceImpl implements NicknameUniqueCheckerService {
  constructor(private readonly dependencies: Dependencies) {}

  public async isUnique(nickname: string) {
    const { queryBuilder } = this.dependencies;

    const result = await queryBuilder
      .select('id')
      .where('nickname', nickname)
      .from(AvailableDatabaseTable.ACCOUNT_REGISTRATION);

    return result.length === 0;
  }
}
