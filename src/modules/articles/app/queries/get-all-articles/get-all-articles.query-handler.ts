import { AvailableDatabaseTable } from '@infrastructure/database/available-tables';
import { QueryBuilder } from '@infrastructure/database/query-builder';
import { QueryHandler } from '@root/framework/processing/query-handler';
import { ArticleStatusValue } from '@root/modules/articles/core/shared-kernel/article-status/article-status.value-object';
import { DEFAULT_LIMIT, PaginatedResponse } from '@tools/pagination';
import { GetAllArticlesQuery, GET_ALL_ARTICLES_QUERY } from './get-all-articles.query';

interface Dependencies {
  queryBuilder: QueryBuilder;
}

export interface GetAllArticlesDTO {
  id: string;
  title: string;
  content: string;
  postedAt: string;
}

export interface GetAllArticlesResult extends PaginatedResponse<GetAllArticlesDTO> {}

export class GetAllArticlesQueryHandler extends QueryHandler<
  GetAllArticlesQuery,
  GetAllArticlesResult
> {
  constructor(private readonly dependencies: Dependencies) {
    super(GET_ALL_ARTICLES_QUERY);
  }

  public async handle({ payload: { limit = DEFAULT_LIMIT, start = 0 } }: GetAllArticlesQuery) {
    const { queryBuilder } = this.dependencies;

    const totalItems = await queryBuilder
      .count('id')
      .where('status', ArticleStatusValue.Active)
      .from(AvailableDatabaseTable.ARTICLE)
      .first();

    const result = await queryBuilder
      .select(['id', 'title', 'content', 'posted_at as postedAt'])
      .where('status', ArticleStatusValue.Active)
      .from(AvailableDatabaseTable.ARTICLE)
      .offset(start)
      .limit(limit);

    return {
      items: result,
      total: Number(totalItems?.count ?? 0),
    };
  }
}
