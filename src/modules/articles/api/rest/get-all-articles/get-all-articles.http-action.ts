import { HttpAction } from '@root/framework/api/http-action';
import { QueryBus } from '@root/framework/processing/query-bus';
import { GetAllArticlesQuery } from '@root/modules/articles/app/queries/get-all-articles/get-all-articles.query';
import { NextFunction, Request, Response } from 'express';

interface Dependencies {
  queryBus: QueryBus;
}

class GetAllArticlesHttpAction implements HttpAction {
  constructor(private readonly dependencies: Dependencies) {}

  public async invoke(req: Request, res: Response, next: NextFunction) {
    this.dependencies.queryBus
      .handle(
        new GetAllArticlesQuery({
          ...req.query,
        }),
      )
      .then((articles) => res.status(200).json(articles))
      .catch(next);
  }
}

export default GetAllArticlesHttpAction;
