import { AppError } from '@root/errors/app.error';
import { BusinessRuleValidationError } from '@root/errors/business-rule-validation.error';
import { AsyncFunction } from './async-function';
import { BusinessRule } from './business-rule';

export abstract class ValueObject<T extends object> {
  constructor(public readonly props: T) {}

  protected static checkRule(
    rule: BusinessRule,
    ErrorType: typeof AppError = BusinessRuleValidationError,
  ): Promise<void> | void {
    if (rule.isBroken instanceof Promise || rule.isBroken instanceof AsyncFunction) {
      return (rule.isBroken() as Promise<boolean>).then((isBroken) => {
        if (isBroken) {
          throw new ErrorType(rule.message);
        }
      });
    }

    if (rule.isBroken()) {
      throw new ErrorType(rule.message);
    }
  }

  public equals(object: ValueObject<T>): boolean {
    if (!object) {
      return false;
    }

    if (!(object instanceof ValueObject)) {
      return false;
    }

    return JSON.stringify(this.props) === JSON.stringify(object.props);
  }
}
