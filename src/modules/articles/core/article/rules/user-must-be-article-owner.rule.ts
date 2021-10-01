import { BusinessRule } from '@root/framework/ddd-building-blocks/business-rule';
import { UniqueEntityID } from '@root/framework/unique-entity-id';

export class UserMustBeArticleOwnerRule extends BusinessRule {
  message = 'Only article owner can update or delete article.';

  constructor(
    private readonly userId: UniqueEntityID,
    private readonly articleOwnerId: UniqueEntityID,
  ) {
    super();
  }

  public isBroken() {
    return !this.articleOwnerId.equals(this.userId);
  }
}
