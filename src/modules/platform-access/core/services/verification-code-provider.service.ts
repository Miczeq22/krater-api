export interface VerificationCodeProviderService {
  generateEmailVerificationCode(length?: number): string;
}
