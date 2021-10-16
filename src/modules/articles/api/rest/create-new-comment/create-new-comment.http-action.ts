import { HttpAction } from '@root/framework/api/http-action';
import { CommandBus } from '@root/framework/processing/command-bus';
import { CreateNewCommentCommand } from '@root/modules/articles/app/commands/create-new-comment/create-new-comment.command';
import { celebrate, Joi, Segments } from 'celebrate';
import { NextFunction, Request, Response } from 'express';

interface Dependencies {
  commandBus: CommandBus;
}

export const createNewCommentActionValidation = celebrate(
  {
    [Segments.BODY]: Joi.object().keys({
      content: Joi.string().min(3).trim().required(),
    }),
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  },
  {
    abortEarly: false,
  },
);

class CreateNewCommentHttpAction implements HttpAction {
  constructor(private readonly dependencies: Dependencies) {}

  public async invoke(req: Request, res: Response, next: NextFunction) {
    this.dependencies.commandBus
      .handle(
        new CreateNewCommentCommand({
          ...req.body,
          authorId: res.locals.userId,
          articleId: req.params.id,
        }),
      )
      .then((comment) => res.status(201).json(comment))
      .catch(next);
  }
}

export default CreateNewCommentHttpAction;
