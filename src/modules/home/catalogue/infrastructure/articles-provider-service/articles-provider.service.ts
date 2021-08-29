import { QueryBuilder } from '@infrastructure/database/query-builder';
import { CatalogueFilterValue } from '../../core/catalogue-filter/catalogue-filter.value-object';
import { ArticlesProviderService } from '../../core/services/articles-provider.service';

interface Dependencies {
  queryBuilder: QueryBuilder;
}

export class ArticlesProviderServiceImpl implements ArticlesProviderService {
  constructor(private readonly dependencies: Dependencies) {}

  public async getArticleIDs(filter: CatalogueFilterValue, start: number, limit: number) {
    const { queryBuilder } = this.dependencies;

    const result = await queryBuilder
      .select('id')
      .modify((query) => {
        if (filter === CatalogueFilterValue.Newest) {
          query.orderBy('posted_at', 'desc');
        }
      })
      .offset(start)
      .limit(limit);

    return result.map(({ id }: { id: string }) => id);
  }
}
