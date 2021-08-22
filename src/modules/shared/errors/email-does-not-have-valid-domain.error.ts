import { AppError } from '@errors/app.error';

export class EmailDoesNotHaveValidDomainError extends AppError {
  constructor(message = 'Email does not have valid domain.') {
    super(message, 'EmailDoesNotHaveValidDomainError', 400);
  }
}
