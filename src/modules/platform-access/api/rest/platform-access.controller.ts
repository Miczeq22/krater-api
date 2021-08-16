import { Controller } from '@root/framework/api/controller';
import { HttpAction } from '@root/framework/api/http-action';
import { Router } from 'express';
import { confirmEmailAddressActionValidation } from './confirm-email-address/confirm-email-address.http-action';
import { registerNewAccountActionValidation } from './register-new-account/register-new-account.http-action';

interface Dependencies {
  registerNewAccountHttpAction: HttpAction;
  confirmEmailAddressHttpAction: HttpAction;
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

    router.get('/confirm-email', [
      confirmEmailAddressActionValidation,
      this.dependencies.confirmEmailAddressHttpAction.invoke.bind(this),
    ]);

    return router;
  }
}
