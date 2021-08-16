import { celebrate, Joi, Segments } from 'celebrate';
import { HttpAction } from '@root/framework/api/http-action';
import { CommandBus } from '@root/framework/processing/command-bus';
import { NextFunction, Request, Response } from 'express';
import { RegisterNewAccountCommand } from '@root/modules/platform-access/app/commands/register-new-account/register-new-account.command';
import { ApiOperationPost, ApiPath } from 'swagger-express-ts';

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

@ApiPath({
  path: '/',
  name: 'Platform Access',
})
class RegisterNewAccountHttpAction implements HttpAction {
  constructor(private readonly dependencies: Dependencies) {}

  @ApiOperationPost({
    path: 'register',
    description: 'Register endpoint',
    summary: 'Allows to register new account by providing correct `credentials`',
    parameters: {
      body: {
        properties: {
          email: {
            type: 'string',
            required: true,
          },
          password: {
            type: 'string',
            required: true,
          },
          nickname: {
            type: 'string',
            required: true,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Successufly registered.',
      },
      400: {
        description: 'Email is already taken.',
      },
      422: {
        description: 'Validation error.',
      },
    },
  })
  public async invoke(req: Request, res: Response, next: NextFunction) {
    this.dependencies.commandBus
      .handle(new RegisterNewAccountCommand(req.body))
      .then(() => res.sendStatus(201))
      .catch(next);
  }
}

export default RegisterNewAccountHttpAction;
