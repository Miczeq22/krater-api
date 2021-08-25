import { HttpAction } from '@root/framework/api/http-action';
import { CommandBus } from '@root/framework/processing/command-bus';
import { LoginCommand } from '@root/modules/platform-access/app/commands/login/login.command';
import { celebrate, Joi, Segments } from 'celebrate';
import { NextFunction, Request, Response } from 'express';

interface Dependencies {
  commandBus: CommandBus;
}

export const loginActionValidation = celebrate(
  {
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    }),
  },
  {
    abortEarly: false,
  },
);

class LoginHttpAction implements HttpAction {
  constructor(private readonly dependencies: Dependencies) {}

  public async invoke(req: Request, res: Response, next: NextFunction) {
    this.dependencies.commandBus
      .handle(
        new LoginCommand({
          ...req.body,
        }),
      )
      .then((token) => res.status(200).json({ accessToken: token }))
      .catch(next);
  }
}

export default LoginHttpAction;
