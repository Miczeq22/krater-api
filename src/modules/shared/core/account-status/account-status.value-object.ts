import { InvalidAccountStatusError } from '@errors/invalid-account-status.error';
import { ValueObject } from '@root/framework/ddd-building-blocks/value-object';

export enum AccountStatusValue {
  WaitingForEmailConfirmation = 'WaitingForEmailConfirmation',
  EmailConfirmed = 'EmailConfirmed',
  Expired = 'Expired',
}

interface AccountStatusProps {
  value: string;
}

export class AccountStatus extends ValueObject<AccountStatusProps> {
  private constructor(value: string) {
    super({ value });
  }

  public static WaitingForEmailConfirmation = new AccountStatus(
    AccountStatusValue.WaitingForEmailConfirmation,
  );

  public static EmailConfirmed = new AccountStatus(AccountStatusValue.EmailConfirmed);

  public static Expired = new AccountStatus(AccountStatusValue.Expired);

  public static fromValue(value: string) {
    switch (value) {
      case AccountStatusValue.WaitingForEmailConfirmation:
        return this.WaitingForEmailConfirmation;

      case AccountStatusValue.EmailConfirmed:
        return this.EmailConfirmed;

      case AccountStatusValue.Expired:
        return this.Expired;

      default:
        throw new InvalidAccountStatusError();
    }
  }

  public getValue() {
    return this.props.value;
  }
}
