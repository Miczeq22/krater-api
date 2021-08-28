import { HttpAction } from '@root/framework/api/http-action';
import { CommandBus } from '@root/framework/processing/command-bus';
import { ResendConfirmationCodeCommand } from '@root/modules/platform-access/app/commands/resend-confirmation-code/resend-confirmation-code.command';
import { NextFunction, Request, Response } from 'express';

interface Dependencies {
  commandBus: CommandBus;
}

class ResendConfirmationCodeHttpAction implements HttpAction {
  constructor(private readonly dependencies: Dependencies) {}

  public async invoke(_: Request, res: Response, next: NextFunction) {
    this.dependencies.commandBus
      .handle(new ResendConfirmationCodeCommand(res.locals.userId))
      .then(() => res.sendStatus(204))
      .catch(next);
  }
}

export default ResendConfirmationCodeHttpAction;
