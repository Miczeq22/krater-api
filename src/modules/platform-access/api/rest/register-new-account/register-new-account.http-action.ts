import { celebrate, Joi, Segments } from 'celebrate';
import { HttpAction } from '@root/framework/api/http-action';
import { CommandBus } from '@root/framework/processing/command-bus';
import { NextFunction, Request, Response } from 'express';
import { RegisterNewAccountCommand } from '@root/modules/platform-access/app/commands/register-new-account/register-new-account.command';

interface Dependencies {
  commandBus: CommandBus;
}

export const registerNewAccountActionValidation = celebrate(
  {
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      nickname: Joi.string().min(3).required(),
    }),
  },
  {
    abortEarly: false,
  },
);

class RegisterNewAccountHttpAction implements HttpAction {
  constructor(private readonly dependencies: Dependencies) {}

  public async invoke(req: Request, res: Response, next: NextFunction) {
    this.dependencies.commandBus
      .handle(new RegisterNewAccountCommand(req.body))
      .then(() => res.sendStatus(201))
      .catch(next);
  }
}

export default RegisterNewAccountHttpAction;
