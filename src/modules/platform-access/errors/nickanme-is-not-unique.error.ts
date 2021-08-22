import { AppError } from '@errors/app.error';

export class NicknameIsNotUniqueError extends AppError {
  constructor(message = 'Provided nickname is not unique,') {
    super(message, 'NicknameIsNotUniqueError', 400);
  }
}
