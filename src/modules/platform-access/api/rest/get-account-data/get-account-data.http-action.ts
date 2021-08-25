import { HttpAction } from '@root/framework/api/http-action';
import { QueryBus } from '@root/framework/processing/query-bus';
import { GetAccountDataQuery } from '@root/modules/platform-access/app/queries/get-account-data/get-account-data.query';
import { NextFunction, Request, Response } from 'express-serve-static-core';

interface Dependencies {
  queryBus: QueryBus;
}

class GetAccountDataHttpAction implements HttpAction {
  constructor(private readonly dependencies: Dependencies) {}

  public async invoke(_: Request, res: Response, next: NextFunction) {
    this.dependencies.queryBus
      .handle(new GetAccountDataQuery(res.locals.userId))
      .then((accountData) => res.status(200).json(accountData))
      .catch(next);
  }
}

export default GetAccountDataHttpAction;
