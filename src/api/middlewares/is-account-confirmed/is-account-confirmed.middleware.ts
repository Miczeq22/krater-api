import { UnauthorizedError } from '@errors/unauthorized.error';
import { AvailableDatabaseTable } from '@infrastructure/database/available-tables';
import { QueryBuilder } from '@infrastructure/database/query-builder';
import { AccountStatusValue } from '@root/modules/shared/core/account-status/account-status.value-object';
import { RequestHandler } from 'express';

interface Dependencies {
  queryBuilder: QueryBuilder;
}

export const isAccountConfirmedMiddleware =
  ({ queryBuilder }: Dependencies): RequestHandler =>
  async (req, res, next) => {
    if (!res.locals.userId) {
      throw new UnauthorizedError();
    }

    const result = await queryBuilder
      .select('id')
      .where('id', res.locals.userId)
      .andWhere('status', AccountStatusValue.EmailConfirmed)
      .from(AvailableDatabaseTable.ACCOUNT)
      .first();

    if (!result) {
      throw new UnauthorizedError();
    }

    next();
  };
