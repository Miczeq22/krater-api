import { AggregateRoot } from '@root/framework/ddd-building-blocks/aggregate-root';
import { UniqueEntityID } from '@root/framework/unique-entity-id';
import { AccountStatus } from '@root/modules/shared/core/account-status/account-status.value-object';
import { AccountEmailMustNotBeConfirmedAlreadyRule } from './rules/account-email-must-not-be-confirmed-already.rule';

interface AccountProps {
  status: AccountStatus;
}

export interface PersistedAccount {
  id: string;
  status: string;
}

export class Account extends AggregateRoot<AccountProps> {
  private constructor(props: AccountProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static fromPersistence({ id, status }: PersistedAccount) {
    return new Account({ status: AccountStatus.fromValue(status) }, new UniqueEntityID(id));
  }

  public confirmEmailAddress() {
    Account.checkRule(new AccountEmailMustNotBeConfirmedAlreadyRule(this.props.status));

    this.props.status = AccountStatus.EmailConfirmed;
  }

  public getStatus() {
    return this.props.status.getValue();
  }
}
