import { UnauthorizedError } from '@errors/unauthorized.error';
import { AggregateRoot } from '@root/framework/ddd-building-blocks/aggregate-root';
import { UniqueEntityID } from '@root/framework/unique-entity-id';
import { AccountPassword } from '@root/modules/shared/core/account-password/account-password.value-object';
import { PasswordHashProviderService } from '@root/modules/shared/core/account-password/password-hash-provider.service';
import { AccountStatus } from '@root/modules/shared/core/account-status/account-status.value-object';
import { VerificationCodeProviderService } from '../services/verification-code-provider.service';
import { EmailVerificationCodeGeneratedEvent } from './events/email-verification-code-generated.event';
import { UserLoggedInEvent } from './events/user-logged-in.event';
import { AccountEmailMustNotBeConfirmedAlreadyRule } from './rules/account-email-must-not-be-confirmed-already.rule';
import { ActivationCodeMustBeValidRule } from './rules/activation-code-must-be-valid.rule';
import { PasswordMustBeValidRule } from './rules/password-must-be-valid.rule';

interface AccountProps {
  status: AccountStatus;
  activationCode: string;
  password: AccountPassword;
}

export interface PersistedAccount {
  id: string;
  status: string;
  password: string;
  activationCode: string;
  verificationCodeProviderService: VerificationCodeProviderService;
  passwordHashProviderService: PasswordHashProviderService;
}

export class Account extends AggregateRoot<AccountProps> {
  private verificationCodeProviderService: VerificationCodeProviderService;

  private passwordHashProviderService: PasswordHashProviderService;

  private constructor(props: AccountProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static fromPersistence({
    id,
    status,
    password,
    verificationCodeProviderService,
    passwordHashProviderService,
    activationCode,
  }: PersistedAccount) {
    const account = new Account(
      {
        activationCode,
        password: AccountPassword.fromPersistence(password),
        status: AccountStatus.fromValue(status),
      },
      new UniqueEntityID(id),
    );

    account.verificationCodeProviderService = verificationCodeProviderService;
    account.passwordHashProviderService = passwordHashProviderService;

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

  public async login(password: string) {
    await Account.checkRule(
      new PasswordMustBeValidRule(this.props.password, password, this.passwordHashProviderService),
      UnauthorizedError,
    );

    this.addDomainEvent(new UserLoggedInEvent({ userId: this.id.getValue() }));
  }

  public getStatus() {
    return this.props.status.getValue();
  }

  public getActivationCode() {
    return this.props.activationCode;
  }
}
