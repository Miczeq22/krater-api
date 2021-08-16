import { UnauthenticatedError } from '@errors/unauthenticated.error';
import jwt from 'jsonwebtoken';
import { TokenProviderService } from './token-provider.service';

export class JwtTokenProviderServiceImpl implements TokenProviderService {
  public generateToken<PayloadType extends object>(payload: PayloadType, expiresIn = '1h') {
    return jwt.sign(payload, process.env.JWT_PRIVATE_KEY as string, {
      expiresIn,
    });
  }

  public verifyAndDecodeToken<PayloadType extends object>(token: string): PayloadType {
    try {
      const payload = jwt.verify(token, process.env.JWT_PRIVATE_KEY as string) as PayloadType;

      return payload;
    } catch {
      throw new UnauthenticatedError();
    }
  }
}
