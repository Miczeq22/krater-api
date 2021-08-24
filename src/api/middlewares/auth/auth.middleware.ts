/* eslint-disable no-param-reassign */
import { RequestHandler } from 'express';
import { UnauthorizedError } from '@errors/unauthorized.error';
import { TokenProviderService } from '@root/modules/shared/infrastructure/token-provider/token-provider.service';

interface Dependencies {
  tokenProviderService: TokenProviderService;
}

export const authMiddleware =
  ({ tokenProviderService }: Dependencies): RequestHandler =>
  (req, res, next) => {
    const token = req.headers['x-auth-token'] ? req.headers['x-auth-token'].slice(7) : null;

    if (!token) {
      throw new UnauthorizedError();
    }

    const { userId } = tokenProviderService.verifyAndDecodeToken<{ userId: string }>(
      token as string,
    );

    res.locals.userId = userId;

    next();
  };
