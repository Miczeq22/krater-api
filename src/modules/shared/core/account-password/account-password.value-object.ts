import { ValueObject } from '@root/framework/ddd-building-blocks/value-object';
import { PasswordHashProviderService } from './password-hash-provider.service';
import { PasswordMustBeStrongRule } from './rules/password-must-be-strong.rule';

interface AccountPasswordProps {
  value: string;
}

export class AccountPassword extends ValueObject<AccountPasswordProps> {
  private constructor(value: string) {
    super({ value });
  }

  public static async createNew(
    password: string,
    passwordHashProviderService: PasswordHashProviderService,
  ) {
    AccountPassword.checkRule(new PasswordMustBeStrongRule(password));

    const passwordHash = await passwordHashProviderService.hashPassword(password);

    return new AccountPassword(passwordHash);
  }

  public static fromPersistence(passwordHash: string) {
    return new AccountPassword(passwordHash);
  }

  public getValue() {
    return this.props.value;
  }

  public async isValid(password: string, passwordHashProviderService: PasswordHashProviderService) {
    return passwordHashProviderService.isValidPassword(password, this.props.value);
  }
}
