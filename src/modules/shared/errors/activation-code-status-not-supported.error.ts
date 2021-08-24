import { AppError } from '@errors/app.error';

export class ActivationCodeStatusNotSupportedError extends AppError {
  constructor(message = 'Provided activation code status is not supported.') {
    super(message, 'ActivationCodeStatusNotSupportedError', 422);
  }
}
