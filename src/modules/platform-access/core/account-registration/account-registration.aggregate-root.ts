import { AggregateRoot } from '@root/framework/ddd-building-blocks/aggregate-root';
import { UniqueEntityID } from '@root/framework/unique-entity-id';
import { AccountEmailCheckerService } from '@root/modules/shared/core/account-email/account-email-checker.service';
import { AccountEmail } from '@root/modules/shared/core/account-email/account-email.value-object';
import { AccountPassword } from '@root/modules/shared/core/account-password/account-password.value-object';
import { PasswordHashProviderService } from '@root/modules/shared/core/account-password/password-hash-provider.service';
import { AccountStatus } from '@root/modules/shared/core/account-status/account-status.value-object';
import { NewAccountRegisteredEvent } from './events/new-account-registered.event';

interface AccountRegistrationProps {
  email: AccountEmail;
  password: AccountPassword;
  registrationDate: Date;
  emailConfirmationDate: Date | null;
  status: AccountStatus;
  nickname: string;
}

export interface PersistedAccountRegistration {
  id: string;
  email: string;
  password: string;
  nickname: string;
  registration_date: string;
  email_confirmation_date: string | null;
  status: string;
}

interface RegisterNewAccountData {
  email: string;
  password: string;
  nickname: string;
  accountEmailCheckerService: AccountEmailCheckerService;
  passwordHashProviderService: PasswordHashProviderService;
}

export class AccountRegistration extends AggregateRoot<AccountRegistrationProps> {
  private constructor(props: AccountRegistrationProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static async registerNew({
    email,
    password,
    nickname,
    accountEmailCheckerService,
    passwordHashProviderService,
  }: RegisterNewAccountData) {
    const account = new AccountRegistration({
      nickname,
      email: await AccountEmail.createNew(email, accountEmailCheckerService),
      password: await AccountPassword.createNew(password, passwordHashProviderService),
      emailConfirmationDate: null,
      registrationDate: new Date(),
      status: AccountStatus.WaitingForEmailConfirmation,
    });

    account.addDomainEvent(new NewAccountRegisteredEvent({ email }));

    return account;
  }

  public static fromPersistence(record: PersistedAccountRegistration) {
    return new AccountRegistration(
      {
        email: AccountEmail.fromPersistence(record.email),
        password: AccountPassword.fromPersistence(record.password),
        emailConfirmationDate: record.email_confirmation_date
          ? new Date(record.email_confirmation_date)
          : null,
        registrationDate: new Date(record.registration_date),
        status: AccountStatus.fromValue(record.status),
        nickname: record.nickname,
      },
      new UniqueEntityID(record.id),
    );
  }

  public getEmail() {
    return this.props.email.toString();
  }

  public getPassword() {
    return this.props.password.getValue();
  }

  public getStatus() {
    return this.props.status.getValue();
  }

  public getNickname() {
    return this.props.nickname;
  }

  public getEmailConfirmationDate() {
    return this.props.emailConfirmationDate;
  }

  public getRegistrationDate() {
    return this.props.registrationDate;
  }
}
