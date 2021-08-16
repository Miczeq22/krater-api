import { BusinessRule } from '@root/framework/ddd-building-blocks/business-rule';

export class PasswordMustBeStrongRule extends BusinessRule {
  message = 'Provided password is not strong enough.';

  constructor(private readonly password: string) {
    super();
  }

  public isBroken() {
    if (this.password.trim().length < 6) {
      this.message = `${this.message} Provide at least 6 characters.`;
      return true;
    }

    if (this.password.trim().length > 50) {
      this.message = `${this.message} Password can contain max of 50 characters.`;
      return true;
    }

    if (!/.*[0-9].*/.test(this.password)) {
      this.message = `${this.message} Provide password with minimum one digit.`;
      return true;
    }

    return false;
  }
}
