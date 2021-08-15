import { AppError } from './app.error';

export class InputValidationError extends AppError {
  constructor(message: string) {
    super(message, 'InputValidationError', 422);
  }
}
