import { ValueObject } from '@root/framework/ddd-building-blocks/value-object';
import { EmailDoesNotHaveValidDomainError } from '../../errors/email-does-not-have-valid-domain.error';
import { EmailFormatIsInvalidError } from '../../errors/email-format-is-invalid.error';
import { EmailIsAlreadyTakenError } from '../../errors/email-is-already-taken.error';
import { AccountEmailCheckerService } from './account-email-checker.service';
import { EmailFormatMustBeValidRule } from './rules/email-format-must-be-valid.rule';
import { EmailMustHaveSupportedDomainRule } from './rules/email-must-have-supported-domain.rule';
import { EmailMustBeUniqueRule } from './rules/email-must-unique.rule';

interface AccountEmailProps {
  localPart: string;
  domain: string;
}

export class AccountEmail extends ValueObject<AccountEmailProps> {
  private constructor(props: AccountEmailProps) {
    super(props);
  }

  public static async createNew(
    email: string,
    accountEmailCheckerService: AccountEmailCheckerService,
  ) {
    AccountEmail.checkRule(new EmailFormatMustBeValidRule(email), EmailFormatIsInvalidError);

    AccountEmail.checkRule(
      new EmailMustHaveSupportedDomainRule(email),
      EmailDoesNotHaveValidDomainError,
    );

    await AccountEmail.checkRule(
      new EmailMustBeUniqueRule(email, accountEmailCheckerService),
      EmailIsAlreadyTakenError,
    );

    return this.convertEmailToParts(email);
  }

  public static fromPersistence(email: string) {
    AccountEmail.checkRule(new EmailFormatMustBeValidRule(email));

    return this.convertEmailToParts(email);
  }

  private static convertEmailToParts(email: string) {
    const [localPart, domain] = email.split('@');

    return new AccountEmail({
      localPart,
      domain,
    });
  }

  public getLocalPart() {
    return this.props.localPart;
  }

  public getDomain() {
    return this.props.domain;
  }

  public toString() {
    return `${this.props.localPart}@${this.props.domain}`;
  }
}
