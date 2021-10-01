import { NotFoundError } from '@errors/not-found.error';
import { AvailableDatabaseTable } from '@infrastructure/database/available-tables';
import { QueryBuilder } from '@infrastructure/database/query-builder';
import { QueryHandler } from '@root/framework/processing/query-handler';
import { ArticleStatusValue } from '@root/modules/articles/core/shared-kernel/article-status/article-status.value-object';
import { ArticleDTO } from '@root/modules/articles/dto/article.dto';
import { GetSingleArticleQuery, GET_SINGLE_ARTICLE_QUERY } from './get-single-article.query';

interface Dependencies {
  queryBuilder: QueryBuilder;
}

export class GetSingleArticleQueryHandler extends QueryHandler<GetSingleArticleQuery, ArticleDTO> {
  constructor(private readonly dependencies: Dependencies) {
    super(GET_SINGLE_ARTICLE_QUERY);
  }

  public async handle({ payload: { id } }: GetSingleArticleQuery) {
    const { queryBuilder } = this.dependencies;

    const result = await queryBuilder
      .select([
        'article.id',
        'article.title',
        'article.content',
        'article.posted_at AS postedAt',
        'account.nickname AS author',
      ])
      .where('article.id', id)
      .andWhere('article.status', ArticleStatusValue.Active)
      .from({ article: AvailableDatabaseTable.ARTICLE })
      .join({ account: AvailableDatabaseTable.ACCOUNT }, 'account.id', 'article.author_id')
      .first();

    if (!result) {
      throw new NotFoundError(`Article with id: "${id}" does not exist.`);
    }

    return result;
  }
}
