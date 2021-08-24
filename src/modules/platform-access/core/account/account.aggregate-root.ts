import { AggregateRoot } from '@root/framework/ddd-building-blocks/aggregate-root';
import { UniqueEntityID } from '@root/framework/unique-entity-id';
import { AccountStatus } from '@root/modules/shared/core/account-status/account-status.value-object';
import { VerificationCodeProviderService } from '../services/verification-code-provider.service';
import { EmailVerificationCodeGeneratedEvent } from './events/email-verification-code-generated.event';
import { AccountEmailMustNotBeConfirmedAlreadyRule } from './rules/account-email-must-not-be-confirmed-already.rule';
import { ActivationCodeMustBeValidRule } from './rules/activation-code-must-be-valid.rule';

interface AccountProps {
  status: AccountStatus;
  activationCode: string;
}

export interface PersistedAccount {
  id: string;
  status: string;
  activationCode: string;
  verificationCodeProviderService: VerificationCodeProviderService;
}

export class Account extends AggregateRoot<AccountProps> {
  private verificationCodeProviderService: VerificationCodeProviderService;

  private constructor(props: AccountProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static fromPersistence({
    id,
    status,
    verificationCodeProviderService,
    activationCode,
  }: PersistedAccount) {
    const account = new Account(
      { activationCode, status: AccountStatus.fromValue(status) },
      new UniqueEntityID(id),
    );

    account.verificationCodeProviderService = verificationCodeProviderService;

    return account;
  }

  public generateActivationCode() {
    Account.checkRule(new AccountEmailMustNotBeConfirmedAlreadyRule(this.props.status));

    const code = this.verificationCodeProviderService.generateEmailVerificationCode();

    this.props.activationCode = code;

    this.addDomainEvent(
      new EmailVerificationCodeGeneratedEvent({
        accountId: this.id.getValue(),
        activationCode: code,
        generatedAt: new Date().toISOString(),
      }),
    );

    return code;
  }

  public confirmEmailAddress(activationCode: string) {
    Account.checkRule(new AccountEmailMustNotBeConfirmedAlreadyRule(this.props.status));
    Account.checkRule(new ActivationCodeMustBeValidRule(this.props.activationCode, activationCode));

    this.props.status = AccountStatus.EmailConfirmed;
  }

  public getStatus() {
    return this.props.status.getValue();
  }

  public getActivationCode() {
    return this.props.activationCode;
  }
}
