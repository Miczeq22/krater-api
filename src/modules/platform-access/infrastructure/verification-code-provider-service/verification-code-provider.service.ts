import { VerificationCodeProviderService } from '../../core/services/verification-code-provider.service';

export class VerificationCodeProviderServiceImpl implements VerificationCodeProviderService {
  public generateEmailVerificationCode(length = 4) {
    return Math.random()
      .toString(36)
      .substring(2, 2 + length)
      .toUpperCase();
  }
}
