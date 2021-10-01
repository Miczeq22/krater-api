import { HttpAction } from '@root/framework/api/http-action';
import { CommandBus } from '@root/framework/processing/command-bus';
import { ArchiveArticleCommand } from '@root/modules/articles/app/commands/archive-article/archive-article.command';
import { celebrate, Joi, Segments } from 'celebrate';
import { NextFunction, Request, Response } from 'express';

export const archiveArticleActionValidation = celebrate({
  [Segments.PARAMS]: {
    id: Joi.string().uuid().required(),
  },
});

interface Dependencies {
  commandBus: CommandBus;
}

class ArchiveArticleHttpAction implements HttpAction {
  constructor(private readonly dependencies: Dependencies) {}

  public async invoke(req: Request, res: Response, next: NextFunction) {
    this.dependencies.commandBus
      .handle(
        new ArchiveArticleCommand({
          articleId: req.params.id,
          userId: res.locals.userId,
        }),
      )
      .then(() => res.sendStatus(204))
      .catch(next);
  }
}

export default ArchiveArticleHttpAction;
