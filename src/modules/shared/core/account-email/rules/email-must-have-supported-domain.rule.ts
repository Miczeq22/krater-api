import { BusinessRule } from '@root/framework/ddd-building-blocks/business-rule';

export class EmailMustHaveSupportedDomainRule extends BusinessRule {
  private readonly supportedDomains = ['gmail.com'];

  message = `Provided email domain is not supported. Please use supported domain: ${this.supportedDomains.join(
    ', ',
  )}`;

  constructor(private readonly email: string) {
    super();
  }

  public isBroken() {
    const [, domain] = this.email.split('@');

    return !this.supportedDomains.includes(domain);
  }
}
