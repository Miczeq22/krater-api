import { HttpAction } from '@root/framework/api/http-action';
import { QueryBus } from '@root/framework/processing/query-bus';
import { GetSingleArticleQuery } from '@root/modules/articles/app/queries/get-single-article/get-single-article.query';
import { celebrate, Joi, Segments } from 'celebrate';
import { NextFunction, Request, Response } from 'express';

interface Dependencies {
  queryBus: QueryBus;
}

export const getSingleArticleActionValidation = celebrate({
  [Segments.PARAMS]: {
    id: Joi.string(),
  },
});

class GetSingleArticleHttpAction implements HttpAction {
  constructor(private readonly dependencies: Dependencies) {}

  public async invoke(req: Request, res: Response, next: NextFunction) {
    this.dependencies.queryBus
      .handle(new GetSingleArticleQuery(req.params.id))
      .then((article) => res.status(200).json(article))
      .catch(next);
  }
}

export default GetSingleArticleHttpAction;
