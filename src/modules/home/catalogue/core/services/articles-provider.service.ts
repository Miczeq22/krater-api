import { CatalogueFilterValue } from '../catalogue-filter/catalogue-filter.value-object';

export interface ArticlesProviderService {
  getArticleIDs(filter: CatalogueFilterValue, start: number, limit: number): Promise<string[]>;
}
