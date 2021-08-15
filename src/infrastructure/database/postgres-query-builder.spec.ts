import { postgresQueryBuilder } from './query-builder';

describe('[Infrastructure] Postgres Query Builder', () => {
  test('should query database by postgres query builder', async () => {
    const queryBuilder = postgresQueryBuilder();

    const response = await queryBuilder.raw('SELECT 1');

    expect(response.command).toEqual('SELECT');

    await queryBuilder.destroy();
  });
});
