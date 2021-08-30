import { ValueObject } from '@root/framework/ddd-building-blocks/value-object';
import { ArticleStatusNotSupportedError } from '../../../errors/article-status-not-supported.error';

export enum ArticleStatusValue {
  Active = 'Active',
  Archived = 'Archived',
  Banned = 'Banned',
}

interface ArticleStatusProps {
  value: string;
}

export class ArticleStatus extends ValueObject<ArticleStatusProps> {
  private constructor(value: string) {
    super({ value });
  }

  public static Active = new ArticleStatus(ArticleStatusValue.Active);

  public static Archived = new ArticleStatus(ArticleStatusValue.Archived);

  public static Banned = new ArticleStatus(ArticleStatusValue.Banned);

  public static fromValue(value: string) {
    switch (value) {
      case ArticleStatusValue.Active:
        return this.Active;

      case ArticleStatusValue.Archived:
        return this.Archived;

      case ArticleStatusValue.Banned:
        return this.Banned;

      default:
        throw new ArticleStatusNotSupportedError();
    }
  }

  public getValue() {
    return this.props.value;
  }
}
