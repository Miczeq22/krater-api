import { BusinessRule } from '@root/framework/ddd-building-blocks/business-rule';

const MIN_ARTICLE_CONTENT_LENGTH = 10;

export class ArticleContentMustHaveAtLeastTenCharactersRule extends BusinessRule {
  message = 'Article content must have at least ten characters.';

  constructor(private readonly content: string) {
    super();
  }

  public isBroken() {
    return this.content.length < MIN_ARTICLE_CONTENT_LENGTH;
  }
}
