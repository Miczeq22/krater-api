import { ValueObject } from '@root/framework/ddd-building-blocks/value-object';
import { ActivationCodeStatusNotSupportedError } from '@root/modules/shared/errors/activation-code-status-not-supported.error';

export enum ActivationCodeStatusValue {
  Active = 'Active',
  Archived = 'Archived',
}

interface ActivationCodeStatusProps {
  value: string;
}

export class ActivationCodeStatus extends ValueObject<ActivationCodeStatusProps> {
  private constructor(value: string) {
    super({ value });
  }

  public static Active = new ActivationCodeStatus(ActivationCodeStatusValue.Active);

  public static Archived = new ActivationCodeStatus(ActivationCodeStatusValue.Archived);

  public static fromValue(value: string) {
    switch (value) {
      case ActivationCodeStatusValue.Active:
        return this.Active;

      case ActivationCodeStatusValue.Archived:
        return this.Archived;

      default:
        throw new ActivationCodeStatusNotSupportedError();
    }
  }

  public getValue() {
    return this.props.value;
  }
}
