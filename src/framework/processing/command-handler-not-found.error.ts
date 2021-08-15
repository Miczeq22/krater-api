import { AppError } from '@root/errors/app.error';

export class CommandHandlerNotFoundError extends AppError {
  constructor(commandType: string) {
    super(
      `Command handler of type: "${commandType}" does not exist.`,
      'CommandHandlerNotFoundError',
    );
  }
}
