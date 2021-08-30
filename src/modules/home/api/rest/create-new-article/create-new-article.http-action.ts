import { HttpAction } from '@root/framework/api/http-action';
import { CommandBus } from '@root/framework/processing/command-bus';
import { CreateNewArticleCommand } from '@root/modules/home/app/commands/create-new-article/create-new-article.command';
import { celebrate, Joi, Segments } from 'celebrate';
import { NextFunction, Request, Response } from 'express';

interface Dependencies {
  commandBus: CommandBus;
}

export const createNewArticleActionValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().min(3).required(),
    content: Joi.string().min(10).required(),
  }),
});

class CreateNewArticleHttpAction implements HttpAction {
  constructor(private readonly dependencies: Dependencies) {}

  public async invoke(req: Request, res: Response, next: NextFunction) {
    this.dependencies.commandBus
      .handle(
        new CreateNewArticleCommand({
          ...req.body,
          userId: res.locals.userId,
        }),
      )
      .then(() => res.sendStatus(201))
      .catch(next);
  }
}

export default CreateNewArticleHttpAction;
