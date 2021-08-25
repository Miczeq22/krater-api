import { HttpAction } from '@root/framework/api/http-action';
import { CommandBus } from '@root/framework/processing/command-bus';
import { ConfirmEmailAddressCommand } from '@root/modules/platform-access/app/commands/confirm-email-address/confirm-email-address.command';
import { celebrate, Joi, Segments } from 'celebrate';
import { NextFunction, Request, Response } from 'express-serve-static-core';

interface Dependencies {
  commandBus: CommandBus;
}

export const confirmEmailAddressActionValidation = celebrate({
  [Segments.BODY]: {
    activationCode: Joi.string().required(),
  },
});

class ConfirmEmailAddressHttpAction implements HttpAction {
  constructor(private readonly dependencies: Dependencies) {}

  public async invoke(req: Request, res: Response, next: NextFunction) {
    this.dependencies.commandBus
      .handle(
        new ConfirmEmailAddressCommand({
          ...req.body,
          userId: res.locals.userId,
        }),
      )
      .then(() => res.sendStatus(204))
      .catch(next);
  }
}

export default ConfirmEmailAddressHttpAction;
