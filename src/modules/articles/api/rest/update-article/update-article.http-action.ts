import { HttpAction } from '@root/framework/api/http-action';
import { CommandBus } from '@root/framework/processing/command-bus';
import { UpdateArticleCommand } from '@root/modules/articles/app/commands/update-article/update-article.command';
import { celebrate, Joi, Segments } from 'celebrate';
import { NextFunction, Request, Response } from 'express';

export const updateArticleActionValidation = celebrate(
  {
    [Segments.BODY]: Joi.object().keys({
      title: Joi.string(),
      content: Joi.string(),
    }),
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  },
  {
    abortEarly: false,
  },
);

interface Dependencies {
  commandBus: CommandBus;
}

class UpdateArticleHttpAction implements HttpAction {
  constructor(private readonly dependencies: Dependencies) {}

  public async invoke(req: Request, res: Response, next: NextFunction) {
    this.dependencies.commandBus
      .handle(
        new UpdateArticleCommand({
          userId: res.locals.userId,
          articleId: req.params.id,
          ...req.body,
        }),
      )
      .then((article) => res.status(200).json(article))
      .catch(next);
  }
}

export default UpdateArticleHttpAction;
