import { AppError } from '@errors/app.error';

export class CatalogueFilterNotSupportedError extends AppError {
  constructor(message = 'Provided Catalogue Filter is not supported.') {
    super(message, 'CatalogueFilterNotSupportedError', 422);
  }
}
