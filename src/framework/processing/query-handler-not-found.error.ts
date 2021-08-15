import { AppError } from '@root/errors/app.error';

export class QueryHandlerNotFoundError extends AppError {
  constructor(queryType: string) {
    super(`Query handler of type: "${queryType}" does not exist.`, 'QueryHandlerNotFoundError');
  }
}
