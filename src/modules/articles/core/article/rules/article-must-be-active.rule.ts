import { BusinessRule } from '@root/framework/ddd-building-blocks/business-rule';
import { ArticleStatus } from '../../shared-kernel/article-status/article-status.value-object';

export class ArticleMustBeActiveRule extends BusinessRule {
  message = 'Selected article is not active anymore.';

  constructor(private readonly status: ArticleStatus) {
    super();
  }

  public isBroken() {
    return !this.status.equals(ArticleStatus.Active);
  }
}
