import { AggregateRoot } from '@root/framework/ddd-building-blocks/aggregate-root';
import { UniqueEntityID } from '@root/framework/unique-entity-id';
import { ArticleStatus } from '../shared-kernel/article-status/article-status.value-object';
import { ArticleContentMustHaveAtLeastTenCharactersRule } from './rules/article-content-must-have-at-least-ten-characters.rule';
import { ArticleTitleMustHaveAtLeastThreeCharactersRule } from './rules/article-title-must-have-at-least-three-characters.rule';

interface ArticleProps {
  authorId: UniqueEntityID;
  title: string;
  content: string;
  postedAt: Date;
  status: ArticleStatus;
}

export interface PersistedArticle {
  id: string;
  author_id: string;
  title: string;
  content: string;
  posted_at: string;
  status: string;
}

interface CreateNewArticlePayload {
  title: string;
  content: string;
  authorId: string;
}

export class Article extends AggregateRoot<ArticleProps> {
  private constructor(props: ArticleProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static createNew({ authorId, content, title }: CreateNewArticlePayload) {
    Article.checkRule(new ArticleTitleMustHaveAtLeastThreeCharactersRule(title));
    Article.checkRule(new ArticleContentMustHaveAtLeastTenCharactersRule(content));

    return new Article({
      title,
      content,
      authorId: new UniqueEntityID(authorId),
      postedAt: new Date(),
      status: ArticleStatus.Active,
    });
  }

  public static fromPersistence({ author_id, posted_at, status, id, ...rest }: PersistedArticle) {
    return new Article(
      {
        ...rest,
        authorId: new UniqueEntityID(author_id),
        postedAt: new Date(posted_at),
        status: ArticleStatus.fromValue(status),
      },
      new UniqueEntityID(id),
    );
  }

  public toPersistence() {
    return {
      id: this.getId().getValue(),
      author_id: this.props.authorId.getValue(),
      title: this.props.title,
      content: this.props.content,
      posted_at: this.props.postedAt.toISOString(),
      status: this.props.status.getValue(),
    };
  }
}
