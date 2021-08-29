import { AggregateRoot } from '@root/framework/ddd-building-blocks/aggregate-root';
import {
  CatalogueFilter,
  CatalogueFilterValue,
} from '../catalogue-filter/catalogue-filter.value-object';
import { ArticlesProviderService } from '../services/articles-provider.service';

interface HomeCatalogueProps {
  activeFilter: CatalogueFilter;
  page: number;
  itemsPerPage: number;
}

interface NewHomeCataloguePayload {
  activeFilter?: string;
  page?: number;
  itemsPerPage?: number;
  articlesProviderService: ArticlesProviderService;
}

export class HomeCatalogue extends AggregateRoot<HomeCatalogueProps> {
  private articlesProviderService: ArticlesProviderService;

  private constructor(props: HomeCatalogueProps) {
    super(props);
  }

  public static create({
    activeFilter,
    itemsPerPage,
    page,
    articlesProviderService,
  }: NewHomeCataloguePayload) {
    const catalogue = new HomeCatalogue({
      activeFilter: activeFilter ? CatalogueFilter.fromValue(activeFilter) : CatalogueFilter.Newest,
      itemsPerPage: itemsPerPage ?? 20,
      page: page ?? 1,
    });

    catalogue.articlesProviderService = articlesProviderService;

    return catalogue;
  }

  public async getArticleIDs() {
    const start = (this.props.page - 1) * this.props.itemsPerPage;
    const limit = this.props.page * this.props.itemsPerPage;

    return this.articlesProviderService.getArticleIDs(
      this.props.activeFilter.getValue() as CatalogueFilterValue,
      start,
      limit,
    );
  }
}
