import { Controller } from '@root/framework/api/controller';
import { HttpAction } from '@root/framework/api/http-action';
import { RequestHandler, Router } from 'express';
import { confirmEmailAddressActionValidation } from './confirm-email-address/confirm-email-address.http-action';
import { registerNewAccountActionValidation } from './register-new-account/register-new-account.http-action';

interface Dependencies {
  registerNewAccountHttpAction: HttpAction;
  confirmEmailAddressHttpAction: HttpAction;
  authMiddleware: RequestHandler;
}

export class PlatformAccessController extends Controller {
  constructor(private readonly dependencies: Dependencies) {
    super('/');
  }

  public getRouter() {
    const router = Router();

    router.post('/register', [
      registerNewAccountActionValidation,
      this.dependencies.registerNewAccountHttpAction.invoke.bind(this),
    ]);

    router.patch('/confirm-email', [
      this.dependencies.authMiddleware,
      confirmEmailAddressActionValidation,
      this.dependencies.confirmEmailAddressHttpAction.invoke.bind(this),
    ]);

    return router;
  }
}
