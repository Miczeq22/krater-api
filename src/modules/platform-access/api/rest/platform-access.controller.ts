import { Controller } from '@root/framework/api/controller';
import { HttpAction } from '@root/framework/api/http-action';
import { RequestHandler, Router } from 'express';
import { ApiOperationGet, ApiOperationPatch, ApiOperationPost, ApiPath } from 'swagger-express-ts';
import { confirmEmailAddressActionValidation } from './confirm-email-address/confirm-email-address.http-action';
import { loginActionValidation } from './login/login.http-action';
import { registerNewAccountActionValidation } from './register-new-account/register-new-account.http-action';

interface Dependencies {
  registerNewAccountHttpAction: HttpAction;
  confirmEmailAddressHttpAction: HttpAction;
  loginHttpAction: HttpAction;
  authMiddleware: RequestHandler;
  getAccountDataHttpAction: HttpAction;
}

@ApiPath({
  name: 'Platform Access',
  path: '/',
})
export class PlatformAccessController extends Controller {
  private router = Router();

  constructor(private readonly dependencies: Dependencies) {
    super('/');
  }

  @ApiOperationPost({
    path: 'register',
    description: 'Register endpoint',
    summary: 'Allows to register new account by providing correct credentials',
    parameters: {
      body: {
        properties: {
          email: {
            type: 'string',
            required: true,
          },
          password: {
            type: 'string',
            required: true,
          },
          nickname: {
            type: 'string',
            required: true,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'Successufly registered.',
      },
      400: {
        description: 'Email is already taken.',
      },
      422: {
        description: 'Validation error.',
      },
    },
  })
  private register() {
    this.router.post('/register', [
      registerNewAccountActionValidation,
      this.dependencies.registerNewAccountHttpAction.invoke.bind(this),
    ]);
  }

  @ApiOperationPatch({
    path: 'confirm-email',
    description: 'Confirm email endpoint',
    summary: 'Allows to confirm email address.',
    security: {
      bearerAuth: [],
    },
    parameters: {
      body: {
        properties: {
          activationCode: {
            type: 'string',
            required: true,
          },
        },
      },
    },
    responses: {
      204: {
        description: 'Email confirmed successfuly.',
      },
      400: {
        description: 'Email is already confirmed.',
      },
      403: {
        description: 'Unauthenticated.',
      },
      422: {
        description: 'Validation error.',
      },
    },
  })
  private confirmEmail() {
    this.router.patch('/confirm-email', [
      this.dependencies.authMiddleware,
      confirmEmailAddressActionValidation,
      this.dependencies.confirmEmailAddressHttpAction.invoke.bind(this),
    ]);
  }

  @ApiOperationPost({
    path: 'login',
    description: 'Login endpoint',
    summary: 'Allows to login and receive access token in JWT format.',
    parameters: {
      body: {
        properties: {
          email: {
            type: 'string',
            required: true,
          },
          password: {
            type: 'string',
            required: true,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Successufly logged in.',
      },
      401: {
        description: 'Unauthorized. Invalid email or password.',
      },
      422: {
        description: 'Validation error.',
      },
    },
  })
  private login() {
    this.router.post('/login', [
      loginActionValidation,
      this.dependencies.loginHttpAction.invoke.bind(this),
    ]);
  }

  @ApiOperationGet({
    path: 'account-data',
    summary: 'Fetches account data',
    security: {
      bearerAuth: [],
    },
    responses: {
      200: {
        description: 'Account data provided successfuly',
      },
      401: {
        description: 'Unauthorized.',
      },
    },
  })
  private accountData() {
    this.router.get('/account-data', [
      this.dependencies.authMiddleware,
      this.dependencies.getAccountDataHttpAction.invoke.bind(this),
    ]);
  }

  public getRouter() {
    this.register();
    this.confirmEmail();
    this.login();
    this.accountData();

    return this.router;
  }
}
