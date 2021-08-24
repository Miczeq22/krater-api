/* eslint-disable @typescript-eslint/quotes */
import { BusinessRule } from '@root/framework/ddd-building-blocks/business-rule';
import { AccountStatus } from '@root/modules/shared/core/account-status/account-status.value-object';

export class AccountEmailMustNotBeConfirmedAlreadyRule extends BusinessRule {
  message = "Can't generate activation code. Email address is already confirmed.";

  constructor(private readonly status: AccountStatus) {
    super();
  }

  public isBroken() {
    return this.status.equals(AccountStatus.EmailConfirmed);
  }
}
