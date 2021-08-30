import { BusinessRule } from '@root/framework/ddd-building-blocks/business-rule';

const MIN_ARTICLE_TITLE_LENGTH = 3;

export class ArticleTitleMustHaveAtLeastThreeCharactersRule extends BusinessRule {
  message = 'Article title must have at least three characters.';

  constructor(private readonly title: string) {
    super();
  }

  public isBroken() {
    return this.title.length < MIN_ARTICLE_TITLE_LENGTH;
  }
}
