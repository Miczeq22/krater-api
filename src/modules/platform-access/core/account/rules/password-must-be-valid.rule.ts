import { BusinessRule } from '@root/framework/ddd-building-blocks/business-rule';
import { AccountPassword } from '@root/modules/shared/core/account-password/account-password.value-object';
import { PasswordHashProviderService } from '@root/modules/shared/core/account-password/password-hash-provider.service';

export class PasswordMustBeValidRule extends BusinessRule {
  message = 'Invalid email or password.';

  constructor(
    private readonly accountPassword: AccountPassword,
    private readonly incomingPassword: string,
    private readonly passwordHashProviderService: PasswordHashProviderService,
  ) {
    super();
  }

  public async isBroken() {
    return !(await this.accountPassword.isValid(
      this.incomingPassword,
      this.passwordHashProviderService,
    ));
  }
}
