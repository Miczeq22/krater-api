import { AppError } from '@errors/app.error';
import { BusinessRuleValidationError } from '@errors/business-rule-validation.error';
import { UniqueEntityID } from '../unique-entity-id';
import { AsyncFunction } from './async-function';
import { BusinessRule } from './business-rule';

export abstract class Entity<EntityProps> {
  constructor(
    protected readonly props: EntityProps,
    protected readonly id = new UniqueEntityID(),
  ) {}

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

  public getId() {
    return this.id;
  }

  public equals(object: Entity<EntityProps>): boolean {
    if (!object) {
      return false;
    }

    if (!(object instanceof Entity)) {
      return false;
    }

    return object.id.equals(this.id);
  }
}
