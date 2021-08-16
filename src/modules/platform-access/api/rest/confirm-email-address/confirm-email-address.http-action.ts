import { HttpAction } from '@root/framework/api/http-action';
import { CommandBus } from '@root/framework/processing/command-bus';
import { ConfirmEmailAddressCommand } from '@root/modules/platform-access/app/commands/confirm-email-address/confirm-email-address.command';
import { celebrate, Joi, Segments } from 'celebrate';
import { NextFunction, Request, Response } from 'express-serve-static-core';
import { ApiOperationGet, ApiPath } from 'swagger-express-ts';

interface Dependencies {
  commandBus: CommandBus;
}

export const confirmEmailAddressActionValidation = celebrate({
  [Segments.QUERY]: {
    token: Joi.string().required(),
  },
});

@ApiPath({
  path: '/',
  name: 'Platform Access',
})
class ConfirmEmailAddressHttpAction implements HttpAction {
  constructor(private readonly dependencies: Dependencies) {}

  @ApiOperationGet({
    path: 'confirm-email',
    description: 'Confirm email endpoint',
    summary: 'Allows to confirm email address.',
    parameters: {
      query: {
        token: {
          type: 'string',
          required: true,
        },
      },
    },
    responses: {
      204: {
        description: 'Email confirmed successfuly.',
      },
      400: {
        description: 'Email is already confirmed.',
      },
      403: {
        description: 'Unauthenticated.',
      },
      422: {
        description: 'Validation error.',
      },
    },
  })
  public async invoke(req: Request, res: Response, next: NextFunction) {
    this.dependencies.commandBus
      .handle(new ConfirmEmailAddressCommand(req.query.token as string))
      .then(() => res.sendStatus(204))
      .catch(next);
  }
}

export default ConfirmEmailAddressHttpAction;
