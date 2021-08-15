import { AppError } from './app.error';

export class InvalidAccountStatusError extends AppError {
  constructor(message = 'Provided Account Status is not supported.') {
    super(message, 'InvalidAccountStatusError', 422);
  }
}
