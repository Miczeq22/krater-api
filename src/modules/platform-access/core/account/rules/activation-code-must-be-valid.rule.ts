/* eslint-disable @typescript-eslint/quotes */
import { BusinessRule } from '@root/framework/ddd-building-blocks/business-rule';

export class ActivationCodeMustBeValidRule extends BusinessRule {
  message = "Can't confirm email address. Provided activation code is invalid.";

  constructor(
    private readonly accountActivationCode: string,
    private readonly incomingActivationCode: string,
  ) {
    super();
  }

  public isBroken() {
    return this.accountActivationCode !== this.incomingActivationCode;
  }
}
