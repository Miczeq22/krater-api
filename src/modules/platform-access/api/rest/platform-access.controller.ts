import { Controller } from '@root/framework/api/controller';
import { HttpAction } from '@root/framework/api/http-action';
import { Router } from 'express';
import { registerNewAccountActionValidation } from './register-new-account/register-new-account.http-action';

interface Dependencies {
  registerNewAccountHttpAction: HttpAction;
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

    return router;
  }
}
