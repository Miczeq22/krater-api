import { BusinessRule } from '@root/framework/ddd-building-blocks/business-rule';

export class EmailFormatMustBeValidRule extends BusinessRule {
  message = 'Provided email format is not valid.';

  constructor(private readonly email: string) {
    super();
  }

  public isBroken() {
    return !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(this.email);
  }
}
