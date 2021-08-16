import { BusinessRule } from '@root/framework/ddd-building-blocks/business-rule';
import { AccountEmailCheckerService } from '../account-email-checker.service';

export class EmailMustBeUniqueRule extends BusinessRule {
  message = 'Provided email address is already in use.';

  constructor(
    private readonly email: string,
    private readonly accountEmailCheckerService: AccountEmailCheckerService,
  ) {
    super();
  }

  public async isBroken() {
    return !(await this.accountEmailCheckerService.isUnique(this.email));
  }
}
