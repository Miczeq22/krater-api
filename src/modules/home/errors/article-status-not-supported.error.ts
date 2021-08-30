import { AppError } from '@errors/app.error';

export class ArticleStatusNotSupportedError extends AppError {
  constructor(message = 'Provied Article Status is not supported.') {
    super(message, 'ArticleStatusNotSupportedError', 422);
  }
}
